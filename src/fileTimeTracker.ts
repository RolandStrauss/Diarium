import { performance } from 'node:perf_hooks';

export type FileTimeTotals = Record<string, number>;

export interface FileTimeSnapshot {
	fileTimes: FileTimeTotals;
	activeFile: string | null;
	paused: boolean;
}

type PersistFileTimes = (fileTimes: FileTimeTotals, excludedFiles: readonly string[]) => Promise<void>;

export function summarizeFileTime(snapshot: FileTimeSnapshot): { total: number; current: number } {
	return {
		total: Object.values(snapshot.fileTimes).reduce((total, milliseconds) => total + milliseconds, 0),
		current: snapshot.activeFile && Object.hasOwn(snapshot.fileTimes, snapshot.activeFile)
			? snapshot.fileTimes[snapshot.activeFile] : 0,
	};
}

export function parseFileTimeTotals(value: unknown): FileTimeTotals {
	if (value === undefined) {
		return {};
	}
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('Invalid stored file time data: expected an object of file paths and durations.');
	}
	const prototype = Object.getPrototypeOf(value);
	const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value;
	if (prototype !== null && (Object.getPrototypeOf(prototype) !== null ||
		typeof constructor !== 'function' ||
		Function.prototype.toString.call(constructor) !== Function.prototype.toString.call(Object))) {
		throw new Error('Invalid stored file time data: expected an object of file paths and durations.');
	}

	const totals: FileTimeTotals = Object.create(null);
	for (const [filePath, total] of Object.entries(value)) {
		if (!filePath || typeof total !== 'number' || !Number.isFinite(total) || total < 0) {
			throw new Error(`Invalid stored file time data for ${JSON.stringify(filePath)}: expected a non-negative finite duration.`);
		}
		totals[filePath] = total;
	}
	return { ...totals };
}

export class FileTimeTracker {
	private readonly fileTimes: FileTimeTotals = Object.create(null);
	private activeFile: string | undefined;
	private startedAt: number | undefined;
	private paused = false;
	private writeQueue = Promise.resolve();
	private readonly pendingSnapshots = new Set<FileTimeTotals>();
	private excludedFiles: Set<string>;

	constructor(
		initialFileTimes: unknown,
		private readonly persistFileTimes: PersistFileTimes,
		private readonly now: () => number = () => performance.now(),
		initialExcludedFiles: readonly string[] = [],
	) {
		Object.assign(this.fileTimes, parseFileTimeTotals(initialFileTimes));
		this.excludedFiles = new Set(initialExcludedFiles);
	}

	setActiveFile(filePath: string | undefined): Promise<void> {
		const timestamp = this.now();
		this.accrueTime(timestamp);
		this.activeFile = filePath || undefined;
		this.startedAt = this.isTracking() ? timestamp : undefined;
		return this.persist();
	}

	setPaused(paused: boolean): Promise<void> {
		const timestamp = this.now();
		this.accrueTime(timestamp);
		this.paused = paused;
		this.startedAt = this.isTracking() ? timestamp : undefined;
		return this.persist();
	}

	isExcluded(filePath: string): boolean {
		return this.excludedFiles.has(filePath);
	}

	setExcludedFiles(filePaths: readonly string[]): Promise<void> {
		const timestamp = this.now();
		this.accrueTime(timestamp);
		this.excludedFiles = new Set(filePaths);
		this.startedAt = this.isTracking() ? timestamp : undefined;
		return this.persist();
	}

	reset(): Promise<void> {
		this.accrueTime(this.now());
		const baseline = { ...this.fileTimes };
		const excludedFiles = [...this.excludedFiles];
		this.pendingSnapshots.add(baseline);
		const write = this.writeQueue.then(async () => {
			try {
				await this.persistFileTimes({}, excludedFiles);
			} catch (error) {
				try {
					await this.persistFileTimes({ ...this.fileTimes }, [...this.excludedFiles]);
				} catch (recoveryError) {
					throw new Error(`File time reset failed: ${String(error)}; recovery write failed: ${String(recoveryError)}. Retry saving file times.`);
				}
				throw error;
			}
			this.subtractBaseline(this.fileTimes, baseline);
			for (const pending of this.pendingSnapshots) {
				if (pending !== baseline) {
					this.subtractBaseline(pending, baseline);
				}
			}
		}).finally(() => this.pendingSnapshots.delete(baseline));
		this.writeQueue = write.then(() => undefined, () => undefined);
		return write;
	}

	checkpoint(): Promise<void> {
		this.accrueTime(this.now());
		return this.persist();
	}

	snapshot(): FileTimeSnapshot {
		const fileTimes = { ...this.fileTimes };
		if (this.activeFile && this.startedAt !== undefined) {
			Object.defineProperty(fileTimes, this.activeFile, {
				value: (this.fileTimes[this.activeFile] ?? 0) + Math.max(0, this.now() - this.startedAt),
				enumerable: true, configurable: true, writable: true,
			});
		}
		for (const [filePath, total] of Object.entries(fileTimes)) {
			if (total === 0 && !(filePath === this.activeFile && this.isTracking())) {
				delete fileTimes[filePath];
			}
		}
		return { fileTimes, activeFile: this.activeFile ?? null, paused: this.paused };
	}

	private isTracking(): boolean {
		return !!this.activeFile && !this.paused && !this.excludedFiles.has(this.activeFile);
	}

	private accrueTime(timestamp: number): void {
		if (this.activeFile && this.startedAt !== undefined) {
			this.fileTimes[this.activeFile] = (this.fileTimes[this.activeFile] ?? 0) +
				Math.max(0, timestamp - this.startedAt);
		}
		this.startedAt = this.isTracking() ? timestamp : undefined;
	}

	private subtractBaseline(totals: FileTimeTotals, baseline: FileTimeTotals): void {
		for (const [filePath, total] of Object.entries(baseline)) {
			if (Object.hasOwn(totals, filePath)) {
				const remaining = totals[filePath] - total;
				if (remaining > 0) {
					totals[filePath] = remaining;
				} else {
					delete totals[filePath];
				}
			}
		}
	}

	private persist(): Promise<void> {
		const snapshot = { ...this.fileTimes };
		const excludedFiles = [...this.excludedFiles];
		this.pendingSnapshots.add(snapshot);
		const write = this.writeQueue.then(() => this.persistFileTimes({ ...snapshot }, excludedFiles))
			.finally(() => this.pendingSnapshots.delete(snapshot));
		this.writeQueue = write.then(() => undefined, () => undefined);
		return write;
	}
}
