"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceActivityTracker = void 0;
exports.resolveLanguageExtension = resolveLanguageExtension;
exports.parseWorkspaceActivity = parseWorkspaceActivity;
exports.createWorkspaceIdentity = createWorkspaceIdentity;
exports.createRepositoryIdentity = createRepositoryIdentity;
exports.getBranchLabel = getBranchLabel;
exports.summarizeWorkspaceUsage = summarizeWorkspaceUsage;
exports.splitWorkspaceInterval = splitWorkspaceInterval;
const node_crypto_1 = require("node:crypto");
function isPlainObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}
function isLocalDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const [year, month, date] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, date);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === date;
}
function isIsoTimestamp(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) &&
        Number.isFinite(Date.parse(value));
}
function branchKey(identity) {
    return (0, node_crypto_1.createHash)('sha256').update(`${identity.repositoryId}\0${identity.name}`).digest('hex').slice(0, 32);
}
function resolveLanguageExtension(languageId, candidates) {
    const match = candidates.find(candidate => candidate.languageIds.includes(languageId));
    if (!match) {
        return { extensionId: 'unknown', displayName: 'Unknown' };
    }
    return {
        extensionId: match.extensionId,
        displayName: match.builtIn ? 'Built-in' : match.displayName,
    };
}
function parseWorkspaceActivity(value) {
    if (value === undefined) {
        return { version: 1, workspaces: Object.create(null), sessions: [] };
    }
    if (!isPlainObject(value) || value.version !== 1 ||
        !isPlainObject(value.workspaces) || !Array.isArray(value.sessions)) {
        throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
    }
    const workspaces = Object.create(null);
    for (const [id, workspace] of Object.entries(value.workspaces)) {
        if (!/^[a-f0-9]{32}$/.test(id) || !isPlainObject(workspace) ||
            typeof workspace.name !== 'string' || !workspace.name ||
            typeof workspace.totalSeconds !== 'number' ||
            !Number.isSafeInteger(workspace.totalSeconds) || workspace.totalSeconds < 0 ||
            (workspace.branches !== undefined && !isPlainObject(workspace.branches)) ||
            (workspace.extensions !== undefined && !isPlainObject(workspace.extensions))) {
            throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
        }
        const branches = Object.create(null);
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
        const extensions = Object.create(null);
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
        workspaces[id] = { name: workspace.name, totalSeconds: workspace.totalSeconds, branches, extensions };
    }
    const sessions = [];
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
function createWorkspaceIdentity(canonicalIdentity, name) {
    return {
        id: (0, node_crypto_1.createHash)('sha256').update(canonicalIdentity).digest('hex').slice(0, 32),
        name: name.trim() || 'Workspace',
    };
}
function createRepositoryIdentity(canonicalIdentity) {
    return (0, node_crypto_1.createHash)('sha256').update(canonicalIdentity).digest('hex').slice(0, 32);
}
function getBranchLabel(head) {
    const name = head?.name?.trim();
    return name || (head?.commit ? 'Detached HEAD' : 'Unknown');
}
function summarizeWorkspaceUsage(record, nowMs = Date.now()) {
    const now = new Date(nowMs);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const sevenDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const yesterdayKey = dateKey(yesterday);
    const sevenDayStartKey = dateKey(sevenDayStart);
    const todayKey = dateKey(now);
    const utcDateValue = (date) => {
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
function splitWorkspaceInterval(startMs, endMs) {
    if (!Number.isSafeInteger(startMs) || !Number.isSafeInteger(endMs) || endMs < startMs) {
        throw new Error('Invalid workspace interval.');
    }
    const segments = [];
    let cursor = startMs;
    while (cursor < endMs) {
        const cursorDate = new Date(cursor);
        const midnight = new Date(cursorDate.getFullYear(), cursorDate.getMonth(), cursorDate.getDate() + 1).getTime();
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
class WorkspaceActivityTracker {
    persist;
    now;
    record;
    enabled = false;
    focused = false;
    live;
    workspaceIdentity;
    branchIdentities = new Map();
    liveBranches = new Map();
    pendingWrites = Promise.resolve();
    constructor(stored, persist, now = Date.now) {
        this.persist = persist;
        this.now = now;
        this.record = parseWorkspaceActivity(stored);
    }
    snapshot() {
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
                },
            ])),
            sessions: this.record.sessions.map(session => ({ ...session })),
        };
    }
    isEnabled() {
        return this.enabled;
    }
    setEnabled(enabled) {
        if (this.enabled === enabled) {
            return;
        }
        this.enabled = enabled;
        if (!enabled) {
            void this.settleAndPersist();
        }
        else {
            this.startLive();
        }
    }
    setFocused(focused) {
        if (this.focused === focused) {
            return;
        }
        this.focused = focused;
        if (!focused) {
            void this.settleAndPersist();
        }
        else {
            this.startLive();
        }
    }
    setWorkspace(identity) {
        const now = this.now();
        this.settleAt(now);
        this.settleBranchesAt(now);
        this.live = undefined;
        this.liveBranches.clear();
        this.workspaceIdentity = identity;
        this.startLive(now);
        void this.persistRecord();
    }
    checkpoint() {
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
    setBranches(identities) {
        const next = new Map();
        for (const identity of identities) {
            const name = identity.name.trim();
            if (identity.repositoryId && name) {
                next.set(identity.repositoryId, { repositoryId: identity.repositoryId, name });
            }
        }
        const changed = next.size !== this.branchIdentities.size ||
            [...next].some(([repositoryId, identity]) => this.branchIdentities.get(repositoryId)?.name !== identity.name);
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
    recordExtensionActivity(identity, kind, seenAtMs = this.now()) {
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
        }
        else {
            existing.saveCount++;
        }
        workspace.extensions[identity.extensionId] = existing;
        this.record.workspaces[this.workspaceIdentity.id] = workspace;
        void this.persistRecord();
    }
    shutdown() {
        const now = this.now();
        this.settleAt(now);
        this.settleBranchesAt(now);
        this.live = undefined;
        this.liveBranches.clear();
        this.enabled = false;
        this.focused = false;
        return this.persistRecord();
    }
    startLive(startedAtMs = this.now()) {
        if (!this.live && this.enabled && this.focused && this.workspaceIdentity) {
            this.live = { identity: this.workspaceIdentity, startedAtMs };
        }
        this.startLiveBranches(startedAtMs);
    }
    settleAndPersist() {
        const now = this.now();
        this.settleAt(now);
        this.settleBranchesAt(now);
        this.live = undefined;
        this.liveBranches.clear();
        return this.persistRecord();
    }
    settleAt(endMs) {
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
    startLiveBranches(startedAtMs) {
        if (!this.live || !this.enabled || !this.focused) {
            return;
        }
        for (const [repositoryId, identity] of this.branchIdentities) {
            if (!this.liveBranches.has(repositoryId)) {
                this.liveBranches.set(repositoryId, { identity, startedAtMs });
            }
        }
    }
    settleBranchesAt(endMs) {
        for (const live of this.liveBranches.values()) {
            this.settleBranchAt(live, endMs);
        }
    }
    settleBranchAt(live, endMs) {
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
    persistRecord() {
        const write = this.pendingWrites.then(async () => {
            await this.persist(this.snapshot());
        });
        this.pendingWrites = write.then(() => undefined, () => undefined);
        return write;
    }
}
exports.WorkspaceActivityTracker = WorkspaceActivityTracker;
//# sourceMappingURL=workspaceActivity.js.map