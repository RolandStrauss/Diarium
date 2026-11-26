import { createHash } from 'node:crypto';

export interface WorkspaceIdentity {
	id: string;
	name: string;
}

export interface SettledWorkspaceSession {
	workspaceId: string;
	date: string;
	seconds: number;
	startedAt: string;
	endedAt: string;
}

export interface WorkspaceActivityRecord {
	version: 1;
	workspaces: Record<string, { name: string; totalSeconds: number }>;
	sessions: SettledWorkspaceSession[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

function isLocalDate(value: unknown): value is string {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return false;
	}
	const [year, month, date] = value.split('-').map(Number);
	const parsed = new Date(year, month - 1, date);
	return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === date;
}

function isIsoTimestamp(value: unknown): value is string {
	return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) &&
		Number.isFinite(Date.parse(value));
}

export function parseWorkspaceActivity(value: unknown): WorkspaceActivityRecord {
	if (value === undefined) {
		return { version: 1, workspaces: Object.create(null), sessions: [] };
	}
	if (!isPlainObject(value) || value.version !== 1 ||
		!isPlainObject(value.workspaces) || !Array.isArray(value.sessions)) {
		throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
	}

	const workspaces: Record<string, { name: string; totalSeconds: number }> = Object.create(null);
	for (const [id, workspace] of Object.entries(value.workspaces)) {
		if (!/^[a-f0-9]{32}$/.test(id) || !isPlainObject(workspace) ||
			typeof workspace.name !== 'string' || !workspace.name ||
			typeof workspace.totalSeconds !== 'number' ||
			!Number.isSafeInteger(workspace.totalSeconds) || workspace.totalSeconds < 0) {
			throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
		}
		workspaces[id] = { name: workspace.name, totalSeconds: workspace.totalSeconds };
	}

	const sessions: SettledWorkspaceSession[] = [];
	for (const session of value.sessions) {
		if (!isPlainObject(session) ||
			typeof session.workspaceId !== 'string' || !Object.hasOwn(workspaces, session.workspaceId) ||
			!isLocalDate(session.date) ||
			typeof session.seconds !== 'number' ||
			!Number.isSafeInteger(session.seconds) || session.seconds < 0 ||
			!isIsoTimestamp(session.startedAt) || !isIsoTimestamp(session.endedAt)) {
			throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
		}
		sessions.push({
			workspaceId: session.workspaceId,
			date: session.date,
			seconds: session.seconds,
			startedAt: session.startedAt,
			endedAt: session.endedAt,
		});
	}
	return { version: 1, workspaces, sessions };
}

export function createWorkspaceIdentity(canonicalIdentity: string, name: string): WorkspaceIdentity {
	return {
		id: createHash('sha256').update(canonicalIdentity).digest('hex').slice(0, 32),
		name: name.trim() || 'Workspace',
	};
}

export interface WorkspaceUsageSummary {
	yesterdaySeconds: number;
	sevenDaySeconds: number;
}

export function summarizeWorkspaceUsage(
	record: WorkspaceActivityRecord,
	nowMs: number = Date.now(),
): WorkspaceUsageSummary {
	const now = new Date(nowMs);
	const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
	const sevenDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
	const dateKey = (date: Date): string =>
		`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
	const yesterdayKey = dateKey(yesterday);
	const sevenDayStartKey = dateKey(sevenDayStart);
	const todayKey = dateKey(now);
	const utcDateValue = (date: string): number => {
		const [year, month, day] = date.split('-').map(Number);
		return Date.UTC(year, month - 1, day);
	};
	const sevenDayStartValue = utcDateValue(sevenDayStartKey);
	const todayValue = utcDateValue(todayKey);
	let yesterdaySeconds = 0;
	let sevenDaySeconds = 0;
	for (const session of record.sessions) {
		if (session.date === yesterdayKey) {
			yesterdaySeconds += session.seconds;
		}
		const sessionDateValue = utcDateValue(session.date);
		if (sessionDateValue >= sevenDayStartValue && sessionDateValue < todayValue) {
			sevenDaySeconds += session.seconds;
		}
	}
	return { yesterdaySeconds, sevenDaySeconds };
}

export function splitWorkspaceInterval(startMs: number, endMs: number): Array<{
	date: string;
	seconds: number;
	startedAt: string;
	endedAt: string;
}> {
	if (!Number.isSafeInteger(startMs) || !Number.isSafeInteger(endMs) || endMs < startMs) {
		throw new Error('Invalid workspace interval.');
	}

	const segments: Array<{ date: string; seconds: number; startedAt: string; endedAt: string }> = [];
	let cursor = startMs;
	while (cursor < endMs) {
		const cursorDate = new Date(cursor);
		const midnight = new Date(
			cursorDate.getFullYear(),
			cursorDate.getMonth(),
			cursorDate.getDate() + 1,
		).getTime();
		const segmentEnd = Math.min(endMs, midnight);
		const seconds = Math.floor((segmentEnd - cursor) / 1000);
		if (seconds > 0) {
			const date = `${cursorDate.getFullYear()}-${String(cursorDate.getMonth() + 1).padStart(2, '0')}-${String(cursorDate.getDate()).padStart(2, '0')}`;
			segments.push({
				date,
				seconds,
				startedAt: new Date(cursor).toISOString(),
				endedAt: new Date(segmentEnd).toISOString(),
			});
		}
		cursor = segmentEnd;
	}
	return segments;
}

export class WorkspaceActivityTracker {
	private record: WorkspaceActivityRecord;
	private enabled = false;
	private focused = false;
	private live: { identity: WorkspaceIdentity; startedAtMs: number } | undefined;
	private workspaceIdentity: WorkspaceIdentity | undefined;
	private pendingWrites: Promise<void> = Promise.resolve();

	constructor(
		stored: unknown,
		private readonly persist: (record: WorkspaceActivityRecord) => Promise<void>,
		private readonly now: () => number = Date.now,
	) {
		this.record = parseWorkspaceActivity(stored);
	}

	snapshot(): WorkspaceActivityRecord {
		return {
			version: 1,
			workspaces: Object.fromEntries(Object.entries(this.record.workspaces).map(([id, workspace]) => [
				id,
				{ name: workspace.name, totalSeconds: workspace.totalSeconds },
			])),
			sessions: this.record.sessions.map(session => ({ ...session })),
		};
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	setEnabled(enabled: boolean): void {
		if (this.enabled === enabled) {
			return;
		}
		this.enabled = enabled;
		if (!enabled) {
			void this.settleAndPersist();
		} else {
			this.startLive();
		}
	}

	setFocused(focused: boolean): void {
		if (this.focused === focused) {
			return;
		}
		this.focused = focused;
		if (!focused) {
			void this.settleAndPersist();
		} else {
			this.startLive();
		}
	}

	setWorkspace(identity: WorkspaceIdentity | undefined): void {
		this.workspaceIdentity = identity;
		const now = this.now();
		if (this.live) {
			this.settleAt(now);
			this.live = undefined;
		}
		this.startLive();
		void this.persistRecord();
	}

	checkpoint(): Promise<void> {
		if (!this.live) {
			return Promise.resolve();
		}
		this.settleAt(this.now());
		this.live = this.enabled && this.focused
			? { identity: this.liveIdentity(), startedAtMs: this.now() }
			: undefined;
		return this.persistRecord();
	}

	shutdown(): Promise<void> {
		this.settleAt(this.now());
		this.live = undefined;
		this.enabled = false;
		this.focused = false;
		return this.persistRecord();
	}

	private liveIdentity(): WorkspaceIdentity {
		if (!this.live) {
			throw new Error('Workspace tracking interval is unavailable.');
		}
		return this.live.identity;
	}

	private startLive(): void {
		if (!this.live && this.enabled && this.focused && this.workspaceIdentity) {
			this.live = { identity: this.workspaceIdentity, startedAtMs: this.now() };
		}
	}

	private settleAndPersist(): Promise<void> {
		this.settleAt(this.now());
		this.live = undefined;
		return this.persistRecord();
	}

	private settleAt(endMs: number): void {
		if (!this.live) {
			return;
		}
		const identity = this.live.identity;
		for (const segment of splitWorkspaceInterval(this.live.startedAtMs, endMs)) {
			this.record.sessions.push({
				workspaceId: identity.id,
				date: segment.date,
				seconds: segment.seconds,
				startedAt: segment.startedAt,
				endedAt: segment.endedAt,
			});
			const workspace = Object.hasOwn(this.record.workspaces, identity.id)
				? this.record.workspaces[identity.id]
				: { name: identity.name, totalSeconds: 0 };
			workspace.name = identity.name;
			workspace.totalSeconds += segment.seconds;
			this.record.workspaces[identity.id] = workspace;
		}
	}

	private persistRecord(): Promise<void> {
		const write = this.pendingWrites.then(async () => {
			await this.persist(this.snapshot());
		});
		this.pendingWrites = write.then(() => undefined, () => undefined);
		return write;
	}
}
