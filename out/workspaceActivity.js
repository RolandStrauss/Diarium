"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceActivityTracker = void 0;
exports.parseWorkspaceActivity = parseWorkspaceActivity;
exports.createWorkspaceIdentity = createWorkspaceIdentity;
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
            !Number.isSafeInteger(workspace.totalSeconds) || workspace.totalSeconds < 0) {
            throw new Error('Invalid stored workspace activity data. Restore a backup before using workspace tracking.');
        }
        workspaces[id] = { name: workspace.name, totalSeconds: workspace.totalSeconds };
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
                { name: workspace.name, totalSeconds: workspace.totalSeconds },
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
        this.workspaceIdentity = identity;
        const now = this.now();
        if (this.live) {
            this.settleAt(now);
            this.live = undefined;
        }
        this.startLive();
        void this.persistRecord();
    }
    checkpoint() {
        if (!this.live) {
            return Promise.resolve();
        }
        this.settleAt(this.now());
        this.live = this.enabled && this.focused
            ? { identity: this.liveIdentity(), startedAtMs: this.now() }
            : undefined;
        return this.persistRecord();
    }
    shutdown() {
        this.settleAt(this.now());
        this.live = undefined;
        this.enabled = false;
        this.focused = false;
        return this.persistRecord();
    }
    liveIdentity() {
        if (!this.live) {
            throw new Error('Workspace tracking interval is unavailable.');
        }
        return this.live.identity;
    }
    startLive() {
        if (!this.live && this.enabled && this.focused && this.workspaceIdentity) {
            this.live = { identity: this.workspaceIdentity, startedAtMs: this.now() };
        }
    }
    settleAndPersist() {
        this.settleAt(this.now());
        this.live = undefined;
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
                : { name: identity.name, totalSeconds: 0 };
            workspace.name = identity.name;
            workspace.totalSeconds += segment.seconds;
            this.record.workspaces[identity.id] = workspace;
        }
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