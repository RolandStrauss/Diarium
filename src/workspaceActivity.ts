import { createHash } from 'node:crypto';

export interface WorkspaceIdentity {
	id: string;
	name: string;
}

export interface WorkspaceBranchIdentity {
	repositoryId: string;
	name: string;
}

export interface WorkspaceBranchActivity extends WorkspaceBranchIdentity {
	totalSeconds: number;
}

export interface WorkspaceExtensionActivity {
	extensionId: string;
	displayName: string;
	languageId: string;
	editCount: number;
	saveCount: number;
	lastSeenAt: string;
}

export type WorkspaceTaskResult = 'completed' | 'failed' | 'terminated' | 'interrupted';

export interface WorkspaceTaskIdentity {
	taskKey: string;
	name: string;
	source: string;
	type: string;
}

export interface WorkspaceTaskActivity extends WorkspaceTaskIdentity {
	startedAt: string;
	endedAt: string;
	seconds: number;
	result: WorkspaceTaskResult;
}

export type WorkspaceDebugResult = 'completed' | 'interrupted';

export interface WorkspaceDebugIdentity {
	debugKey: string;
	type: string;
	name: string;
}

export interface WorkspaceDebugActivity extends WorkspaceDebugIdentity {
	startedAt: string;
	endedAt: string;
	seconds: number;
	result: WorkspaceDebugResult;
}

export interface WorkspaceActivityWorkspace {
	name: string;
	totalSeconds: number;
	branches?: Record<string, WorkspaceBranchActivity>;
	extensions?: Record<string, WorkspaceExtensionActivity>;
	tasks?: WorkspaceTaskActivity[];
	debugSessions?: WorkspaceDebugActivity[];
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
	workspaces: Record<string, WorkspaceActivityWorkspace>;
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

function branchKey(identity: WorkspaceBranchIdentity): string {
	return createHash('sha256').update(`${identity.repositoryId}\0${identity.name}`).digest('hex').slice(0, 32);
}

export function createTaskIdentity(name: string, source: string, type: string): WorkspaceTaskIdentity {
	const taskName = name.trim() || 'Unnamed task';
	const taskSource = source.trim() || 'Unknown';
	const taskType = type.trim() || 'Unknown';
	return {
		taskKey: createHash('sha256').update(JSON.stringify([taskName, taskSource, taskType])).digest('hex').slice(0, 32),
		name: taskName,
		source: taskSource,
		type: taskType,
	};
}

export function createDebugIdentity(type: string, name: string): WorkspaceDebugIdentity {
	const debugType = type.trim() || 'Unknown';
	const debugName = name.trim() || 'Unnamed session';
	return {
		debugKey: createHash('sha256').update(JSON.stringify([debugType, debugName])).digest('hex').slice(0, 32),
		type: debugType,
		name: debugName,
	};
}

export interface LanguageExtensionCandidate {
	extensionId: string;
	displayName: string;
	languageIds: readonly string[];
	builtIn?: boolean;
}

export interface ResolvedLanguageExtension {
	extensionId: string;
	displayName: string;
}

export function resolveLanguageExtension(
	languageId: string,
	candidates: readonly LanguageExtensionCandidate[],
): ResolvedLanguageExtension {
	const match = candidates.find(candidate => candidate.languageIds.includes(languageId));
	if (!match) {
		return { extensionId: 'unknown', displayName: 'Unknown' };
	}
	return {
		extensionId: match.extensionId,
		displayName: match.builtIn ? 'Built-in' : match.displayName,
	};
}

export function parseWorkspaceActivity(value: unknown): WorkspaceActivityRecord {
	if (value === undefined) {
		return { version: 1, workspaces: Object.create(null), sessions: [] };
	}
	if (!isPlainObject(value) || value.version !== 1 ||
		!isPlainObject(value.workspaces) || !Array.isArray(value.sessions)) {
		throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
	}

	const workspaces: Record<string, WorkspaceActivityWorkspace> = Object.create(null);
	for (const [id, workspace] of Object.entries(value.workspaces)) {
		if (!/^[a-f0-9]{32}$/.test(id) || !isPlainObject(workspace) ||
			typeof workspace.name !== 'string' || !workspace.name ||
			typeof workspace.totalSeconds !== 'number' ||
			!Number.isSafeInteger(workspace.totalSeconds) || workspace.totalSeconds < 0 ||
			(workspace.branches !== undefined && !isPlainObject(workspace.branches)) ||
			(workspace.extensions !== undefined && !isPlainObject(workspace.extensions)) ||
			(workspace.tasks !== undefined && !Array.isArray(workspace.tasks)) ||
			(workspace.debugSessions !== undefined && !Array.isArray(workspace.debugSessions))) {
			throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
		}
		const branches: Record<string, WorkspaceBranchActivity> = Object.create(null);
		for (const [key, branch] of Object.entries(workspace.branches ?? {})) {
			if (!isPlainObject(branch) ||
				typeof branch.repositoryId !== 'string' ||
				typeof branch.name !== 'string' || !branch.name ||
				typeof branch.totalSeconds !== 'number' ||
				!Number.isSafeInteger(branch.totalSeconds) || branch.totalSeconds < 0) {
				throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
			}
			branches[key] = {
				repositoryId: branch.repositoryId,
				name: branch.name,
				totalSeconds: branch.totalSeconds,
			};
		}
		const extensions: Record<string, WorkspaceExtensionActivity> = Object.create(null);
		for (const [key, extension] of Object.entries(workspace.extensions ?? {})) {
			if (!isPlainObject(extension) ||
				typeof extension.extensionId !== 'string' || !extension.extensionId ||
				typeof extension.displayName !== 'string' || !extension.displayName ||
				typeof extension.languageId !== 'string' || !extension.languageId ||
				typeof extension.editCount !== 'number' ||
				!Number.isSafeInteger(extension.editCount) || extension.editCount < 0 ||
				typeof extension.saveCount !== 'number' ||
				!Number.isSafeInteger(extension.saveCount) || extension.saveCount < 0 ||
				!isIsoTimestamp(extension.lastSeenAt)) {
				throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
			}
			extensions[key] = {
				extensionId: extension.extensionId,
				displayName: extension.displayName,
				languageId: extension.languageId,
				editCount: extension.editCount,
				saveCount: extension.saveCount,
				lastSeenAt: extension.lastSeenAt,
			};
		}
		const tasks: WorkspaceTaskActivity[] = [];
		for (const task of workspace.tasks ?? []) {
			if (!isPlainObject(task) ||
				typeof task.taskKey !== 'string' || !/^[a-f0-9]{32}$/.test(task.taskKey) ||
				typeof task.name !== 'string' || !task.name ||
				typeof task.source !== 'string' || !task.source ||
				typeof task.type !== 'string' || !task.type ||
				typeof task.startedAt !== 'string' || !isIsoTimestamp(task.startedAt) ||
				typeof task.endedAt !== 'string' || !isIsoTimestamp(task.endedAt) ||
				typeof task.seconds !== 'number' ||
				!Number.isSafeInteger(task.seconds) || task.seconds < 0 ||
				(task.result !== 'completed' && task.result !== 'failed' &&
					task.result !== 'terminated' && task.result !== 'interrupted')) {
				throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
			}
			tasks.push({
				taskKey: task.taskKey,
				name: task.name,
				source: task.source,
				type: task.type,
				startedAt: task.startedAt,
				endedAt: task.endedAt,
				seconds: task.seconds,
				result: task.result,
			});
		}
		const debugSessions: WorkspaceDebugActivity[] = [];
		for (const session of workspace.debugSessions ?? []) {
			if (!isPlainObject(session) ||
				typeof session.debugKey !== 'string' || !/^[a-f0-9]{32}$/.test(session.debugKey) ||
				typeof session.type !== 'string' || !session.type ||
				typeof session.name !== 'string' || !session.name ||
				typeof session.startedAt !== 'string' || !isIsoTimestamp(session.startedAt) ||
				typeof session.endedAt !== 'string' || !isIsoTimestamp(session.endedAt) ||
				typeof session.seconds !== 'number' ||
				!Number.isSafeInteger(session.seconds) || session.seconds < 0 ||
				(session.result !== 'completed' && session.result !== 'interrupted')) {
				throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
			}
			debugSessions.push({
				debugKey: session.debugKey,
				type: session.type,
				name: session.name,
				startedAt: session.startedAt,
				endedAt: session.endedAt,
				seconds: session.seconds,
				result: session.result,
			});
		}
		workspaces[id] = { name: workspace.name, totalSeconds: workspace.totalSeconds, branches, extensions, tasks, debugSessions };
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

export function createRepositoryIdentity(canonicalIdentity: string): string {
	return createHash('sha256').update(canonicalIdentity).digest('hex').slice(0, 32);
}

export interface GitHeadState {
	name?: string;
	commit?: string;
}

export function getBranchLabel(head: GitHeadState | undefined): string {
	const name = head?.name?.trim();
	return name || (head?.commit ? 'Detached HEAD' : 'Unknown');
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
	private branchIdentities = new Map<string, WorkspaceBranchIdentity>();
	private liveBranches = new Map<string, { identity: WorkspaceBranchIdentity; startedAtMs: number }>();
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
				{
					name: workspace.name,
					totalSeconds: workspace.totalSeconds,
					branches: Object.fromEntries(Object.entries(workspace.branches ?? {}).map(([key, branch]) => [
						key,
						{ ...branch },
					])),
					extensions: Object.fromEntries(Object.entries(workspace.extensions ?? {}).map(([key, extension]) => [
						key,
						{ ...extension },
					])),
					tasks: (workspace.tasks ?? []).map(task => ({ ...task })),
					debugSessions: (workspace.debugSessions ?? []).map(session => ({ ...session })),
				},
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
		const now = this.now();
		this.settleAt(now);
		this.settleBranchesAt(now);
		this.live = undefined;
		this.liveBranches.clear();
		this.workspaceIdentity = identity;
		this.startLive(now);
		void this.persistRecord();
	}

	checkpoint(): Promise<void> {
		if (!this.live) {
			return Promise.resolve();
		}
		const now = this.now();
		this.settleAt(now);
		this.settleBranchesAt(now);
		this.live = this.enabled && this.focused && this.workspaceIdentity
			? { identity: this.workspaceIdentity, startedAtMs: now }
			: undefined;
		this.liveBranches.clear();
		this.startLiveBranches(now);
		return this.persistRecord();
	}

	setBranches(identities: WorkspaceBranchIdentity[]): void {
		const next = new Map<string, WorkspaceBranchIdentity>();
		for (const identity of identities) {
			const name = identity.name.trim();
			if (identity.repositoryId && name) {
				next.set(identity.repositoryId, { repositoryId: identity.repositoryId, name });
			}
		}
		const changed = next.size !== this.branchIdentities.size ||
			[...next].some(([repositoryId, identity]) =>
				this.branchIdentities.get(repositoryId)?.name !== identity.name);
		if (!changed) {
			return;
		}
		const now = this.now();
		for (const [repositoryId, live] of this.liveBranches) {
			if (next.get(repositoryId)?.name !== live.identity.name) {
				this.settleBranchAt(live, now);
				this.liveBranches.delete(repositoryId);
			}
		}
		this.branchIdentities = next;
		this.startLiveBranches(now);
		void this.persistRecord();
	}

	recordExtensionActivity(
		identity: ResolvedLanguageExtension & { languageId: string },
		kind: 'edit' | 'save',
		seenAtMs: number = this.now(),
	): void {
		if (!this.enabled || !this.workspaceIdentity) {
			return;
		}
		if (!identity.extensionId || !identity.displayName || !identity.languageId ||
			!Number.isFinite(seenAtMs) || !Number.isFinite(new Date(seenAtMs).getTime())) {
			throw new Error('Invalid workspace extension activity.');
		}
		const workspace = Object.hasOwn(this.record.workspaces, this.workspaceIdentity.id)
			? this.record.workspaces[this.workspaceIdentity.id]
			: { name: this.workspaceIdentity.name, totalSeconds: 0, extensions: Object.create(null) };
		workspace.name = this.workspaceIdentity.name;
		workspace.extensions ??= Object.create(null);
		const existing = workspace.extensions[identity.extensionId] ?? {
			extensionId: identity.extensionId,
			displayName: identity.displayName,
			languageId: identity.languageId,
			editCount: 0,
			saveCount: 0,
			lastSeenAt: new Date(seenAtMs).toISOString(),
		};
		existing.displayName = identity.displayName;
		existing.languageId = identity.languageId;
		existing.lastSeenAt = new Date(seenAtMs).toISOString();
		if (kind === 'edit') {
			existing.editCount++;
		} else {
			existing.saveCount++;
		}
		workspace.extensions[identity.extensionId] = existing;
		this.record.workspaces[this.workspaceIdentity.id] = workspace;
		void this.persistRecord();
	}

	recordTaskExecution(
		identity: WorkspaceTaskIdentity,
		workspaceIdentity: WorkspaceIdentity,
		startedAtMs: number,
		endedAtMs: number,
		result: WorkspaceTaskResult,
	): void {
		if (!this.enabled) {
			return;
		}
		const startedAt = new Date(startedAtMs);
		const endedAt = new Date(endedAtMs);
		if (!Number.isSafeInteger(startedAtMs) || !Number.isSafeInteger(endedAtMs) ||
			endedAtMs < startedAtMs || !Number.isFinite(startedAt.getTime()) ||
			!Number.isFinite(endedAt.getTime())) {
			throw new Error('Invalid workspace task activity.');
		}
		const workspace = Object.hasOwn(this.record.workspaces, workspaceIdentity.id)
			? this.record.workspaces[workspaceIdentity.id]
			: { name: workspaceIdentity.name, totalSeconds: 0, tasks: [] };
		workspace.name = workspaceIdentity.name;
		workspace.tasks ??= [];
		workspace.tasks.push({
			...identity,
			startedAt: startedAt.toISOString(),
			endedAt: endedAt.toISOString(),
			seconds: Math.floor((endedAtMs - startedAtMs) / 1000),
			result,
		});
		this.record.workspaces[workspaceIdentity.id] = workspace;
		void this.persistRecord();
	}

	recordDebugSession(
		identity: WorkspaceDebugIdentity,
		workspaceIdentity: WorkspaceIdentity,
		startedAtMs: number,
		endedAtMs: number,
		result: WorkspaceDebugResult,
	): void {
		if (!this.enabled) {
			return;
		}
		const startedAt = new Date(startedAtMs);
		const endedAt = new Date(endedAtMs);
		if (!Number.isSafeInteger(startedAtMs) || !Number.isSafeInteger(endedAtMs) ||
			endedAtMs < startedAtMs || !Number.isFinite(startedAt.getTime()) ||
			!Number.isFinite(endedAt.getTime())) {
			throw new Error('Invalid workspace debug activity.');
		}
		const workspace = Object.hasOwn(this.record.workspaces, workspaceIdentity.id)
			? this.record.workspaces[workspaceIdentity.id]
			: { name: workspaceIdentity.name, totalSeconds: 0, debugSessions: [] };
		workspace.name = workspaceIdentity.name;
		workspace.debugSessions ??= [];
		workspace.debugSessions.push({
			...identity,
			startedAt: startedAt.toISOString(),
			endedAt: endedAt.toISOString(),
			seconds: Math.floor((endedAtMs - startedAtMs) / 1000),
			result,
		});
		this.record.workspaces[workspaceIdentity.id] = workspace;
		void this.persistRecord();
	}

	shutdown(): Promise<void> {
		const now = this.now();
		this.settleAt(now);
		this.settleBranchesAt(now);
		this.live = undefined;
		this.liveBranches.clear();
		this.enabled = false;
		this.focused = false;
		return this.persistRecord();
	}

	private startLive(startedAtMs: number = this.now()): void {
		if (!this.live && this.enabled && this.focused && this.workspaceIdentity) {
			this.live = { identity: this.workspaceIdentity, startedAtMs };
		}
		this.startLiveBranches(startedAtMs);
	}

	private settleAndPersist(): Promise<void> {
		const now = this.now();
		this.settleAt(now);
		this.settleBranchesAt(now);
		this.live = undefined;
		this.liveBranches.clear();
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
				: { name: identity.name, totalSeconds: 0, branches: Object.create(null) };
			workspace.name = identity.name;
			workspace.branches ??= Object.create(null);
			workspace.totalSeconds += segment.seconds;
			this.record.workspaces[identity.id] = workspace;
		}
	}

	private startLiveBranches(startedAtMs: number): void {
		if (!this.live || !this.enabled || !this.focused) {
			return;
		}
		for (const [repositoryId, identity] of this.branchIdentities) {
			if (!this.liveBranches.has(repositoryId)) {
				this.liveBranches.set(repositoryId, { identity, startedAtMs });
			}
		}
	}

	private settleBranchesAt(endMs: number): void {
		for (const live of this.liveBranches.values()) {
			this.settleBranchAt(live, endMs);
		}
	}

	private settleBranchAt(
		live: { identity: WorkspaceBranchIdentity; startedAtMs: number },
		endMs: number,
	): void {
		if (!this.workspaceIdentity) {
			return;
		}
		const seconds = Math.floor(Math.max(0, endMs - live.startedAtMs) / 1000);
		if (!seconds) {
			return;
		}
		const workspace = Object.hasOwn(this.record.workspaces, this.workspaceIdentity.id)
			? this.record.workspaces[this.workspaceIdentity.id]
			: { name: this.workspaceIdentity.name, totalSeconds: 0, branches: Object.create(null) };
		workspace.name = this.workspaceIdentity.name;
		workspace.branches ??= Object.create(null);
		const key = branchKey(live.identity);
		const branch = workspace.branches[key] ?? {
			repositoryId: live.identity.repositoryId,
			name: live.identity.name,
			totalSeconds: 0,
		};
		branch.totalSeconds += seconds;
		workspace.branches[key] = branch;
		this.record.workspaces[this.workspaceIdentity.id] = workspace;
	}

	private persistRecord(): Promise<void> {
		const write = this.pendingWrites.then(async () => {
			await this.persist(this.snapshot());
		});
		this.pendingWrites = write.then(() => undefined, () => undefined);
		return write;
	}
}
