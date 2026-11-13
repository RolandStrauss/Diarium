export type FileTimeTotals = Record<string, number>;

export interface FileTimeSnapshot {
	fileTimes: FileTimeTotals;
	activeFile: string | null;
}

type PersistFileTimes = (fileTimes: FileTimeTotals) => Promise<void>;

export function parseFileTimeTotals(value: unknown): FileTimeTotals {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return {};
	}

	const totals: FileTimeTotals = {};
	for (const [filePath, total] of Object.entries(value)) {
		if (filePath && typeof total === 'number' && Number.isFinite(total) && total >= 0) {
			totals[filePath] = total;
		}
	}
	return totals;
}

export class FileTimeTracker {
	private readonly fileTimes: FileTimeTotals;
	private activeFile: string | undefined;
	private startedAt: number | undefined;
	private writeQueue = Promise.resolve();

	constructor(
		initialFileTimes: unknown,
		private readonly persistFileTimes: PersistFileTimes,
		private readonly now: () => number = Date.now,
	) {
		this.fileTimes = parseFileTimeTotals(initialFileTimes);
	}

	setActiveFile(filePath: string | undefined): Promise<void> {
		const timestamp = this.now();
		this.accrueTime(timestamp);
		this.activeFile = filePath || undefined;
		this.startedAt = this.activeFile ? timestamp : undefined;
		return this.persist();
	}

	checkpoint(): Promise<void> {
		this.accrueTime(this.now());
		return this.persist();
	}

	snapshot(): FileTimeSnapshot {
		const fileTimes = { ...this.fileTimes };
		if (this.activeFile && this.startedAt !== undefined) {
			fileTimes[this.activeFile] = (fileTimes[this.activeFile] ?? 0) +
				Math.max(0, this.now() - this.startedAt);
		}
		return { fileTimes, activeFile: this.activeFile ?? null };
	}

	private accrueTime(timestamp: number): void {
		if (this.activeFile && this.startedAt !== undefined) {
			this.fileTimes[this.activeFile] = (this.fileTimes[this.activeFile] ?? 0) +
				Math.max(0, timestamp - this.startedAt);
		}
		this.startedAt = this.activeFile ? timestamp : undefined;
	}

	private persist(): Promise<void> {
		const snapshot = { ...this.fileTimes };
		const write = this.writeQueue.then(() => this.persistFileTimes(snapshot));
		this.writeQueue = write.then(() => undefined, () => undefined);
		return write;
	}
}
