"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("node:assert"));
const workspaceActivity_1 = require("../workspaceActivity");
suite('Workspace activity', () => {
    test('rejects corrupt stored workspace activity', () => {
        const empty = (0, workspaceActivity_1.parseWorkspaceActivity)(undefined);
        assert.strictEqual(empty.version, 1);
        assert.deepStrictEqual(Object.keys(empty.workspaces), []);
        assert.deepStrictEqual(empty.sessions, []);
        for (const value of [
            null,
            [],
            { version: 2, workspaces: {}, sessions: [] },
            { version: 1, workspaces: { bad: { name: 'A', totalSeconds: -1 } }, sessions: [] },
            { version: 1, workspaces: {}, sessions: [{ workspaceId: 'missing', date: '2026-11-25', seconds: 60 }] },
        ]) {
            assert.throws(() => (0, workspaceActivity_1.parseWorkspaceActivity)(value), /Invalid stored workspace activity data/);
        }
    });
    test('splits an overnight interval at local midnight', () => {
        const start = new Date(2026, 10, 25, 23, 30).getTime();
        const end = new Date(2026, 10, 26, 1, 15).getTime();
        assert.deepStrictEqual((0, workspaceActivity_1.splitWorkspaceInterval)(start, end).map(segment => ({
            date: segment.date,
            seconds: segment.seconds,
        })), [
            { date: '2026-11-25', seconds: 1800 },
            { date: '2026-11-26', seconds: 4500 },
        ]);
    });
    test('summarizes yesterday and the previous seven local dates', () => {
        const record = {
            version: 1,
            workspaces: {
                '1234567890abcdef1234567890abcdef': { name: 'Diarium', totalSeconds: 1000 },
            },
            sessions: [
                { workspaceId: '1234567890abcdef1234567890abcdef', date: '2026-11-19', seconds: 100, startedAt: '2026-11-19T09:00:00.000Z', endedAt: '2026-11-19T09:01:40.000Z' },
                { workspaceId: '1234567890abcdef1234567890abcdef', date: '2026-11-20', seconds: 200, startedAt: '2026-11-20T09:00:00.000Z', endedAt: '2026-11-20T09:03:20.000Z' },
                { workspaceId: '1234567890abcdef1234567890abcdef', date: '2026-11-25', seconds: 815, startedAt: '2026-11-25T09:00:00.000Z', endedAt: '2026-11-25T09:13:35.000Z' },
                { workspaceId: '1234567890abcdef1234567890abcdef', date: '2026-11-26', seconds: 900, startedAt: '2026-11-26T09:00:00.000Z', endedAt: '2026-11-26T09:15:00.000Z' },
                { workspaceId: '1234567890abcdef1234567890abcdef', date: '2026-11-27', seconds: 700, startedAt: '2026-11-27T09:00:00.000Z', endedAt: '2026-11-27T09:11:40.000Z' },
            ],
        };
        const now = new Date(2026, 10, 26, 12, 0).getTime();
        assert.deepStrictEqual((0, workspaceActivity_1.summarizeWorkspaceUsage)(record, now), {
            yesterdaySeconds: 815,
            sevenDaySeconds: 1115,
        });
    });
    test('uses elapsed DST seconds across a local midnight', () => {
        const originalTimezone = process.env.TZ;
        process.env.TZ = 'America/New_York';
        try {
            const springStart = new Date(2026, 2, 8, 1, 30).getTime();
            const springEnd = new Date(2026, 2, 8, 3, 30).getTime();
            const startSegments = (0, workspaceActivity_1.splitWorkspaceInterval)(springStart, springEnd);
            assert.strictEqual(startSegments.reduce((total, segment) => total + segment.seconds, 0), 3600);
            const fallStart = new Date(2026, 10, 1, 0, 30).getTime();
            const fallEnd = new Date(2026, 10, 2, 0, 30).getTime();
            const endSegments = (0, workspaceActivity_1.splitWorkspaceInterval)(fallStart, fallEnd);
            assert.strictEqual(endSegments.reduce((total, segment) => total + segment.seconds, 0), 25 * 60 * 60);
        }
        finally {
            if (originalTimezone === undefined) {
                delete process.env.TZ;
            }
            else {
                process.env.TZ = originalTimezone;
            }
        }
    });
    test('settles checkpoints once and excludes live time', async () => {
        let now = new Date(2026, 10, 25, 9, 0).getTime();
        let saved;
        const tracker = new workspaceActivity_1.WorkspaceActivityTracker(undefined, async (record) => {
            saved = record;
        }, () => now);
        const identity = (0, workspaceActivity_1.createWorkspaceIdentity)('workspace-one', 'Diarium');
        tracker.setEnabled(true);
        tracker.setWorkspace(identity);
        tracker.setFocused(true);
        assert.deepStrictEqual(tracker.snapshot().sessions, []);
        now += 3_661_000;
        await tracker.checkpoint();
        const snapshot = tracker.snapshot();
        assert.strictEqual(snapshot.workspaces[identity.id].totalSeconds, 3661);
        assert.strictEqual(snapshot.sessions.reduce((total, session) => total + session.seconds, 0), 3661);
        await tracker.checkpoint();
        assert.strictEqual(tracker.snapshot().sessions.reduce((total, session) => total + session.seconds, 0), 3661);
        assert.deepStrictEqual(saved, tracker.snapshot());
        tracker.setFocused(false);
        now += 10_000;
        await tracker.checkpoint();
        assert.strictEqual(tracker.snapshot().sessions.reduce((total, session) => total + session.seconds, 0), 3661);
    });
    test('settles workspace switches and disables tracking without double counting', async () => {
        let now = new Date(2026, 10, 25, 9, 0).getTime();
        const tracker = new workspaceActivity_1.WorkspaceActivityTracker(undefined, async () => { }, () => now);
        const first = (0, workspaceActivity_1.createWorkspaceIdentity)('workspace-one', 'First');
        const second = (0, workspaceActivity_1.createWorkspaceIdentity)('workspace-two', 'Second');
        tracker.setEnabled(true);
        tracker.setWorkspace(first);
        tracker.setFocused(true);
        now += 60_000;
        tracker.setWorkspace(second);
        const switched = tracker.snapshot();
        assert.strictEqual(switched.workspaces[first.id].totalSeconds, 60);
        assert.strictEqual(switched.sessions[0].workspaceId, first.id);
        now += 30_000;
        tracker.setEnabled(false);
        assert.strictEqual(tracker.snapshot().sessions.reduce((total, session) => total + session.seconds, 0), 90);
        now += 600_000;
        await tracker.checkpoint();
        assert.strictEqual(tracker.snapshot().sessions.reduce((total, session) => total + session.seconds, 0), 90);
    });
    test('settles branch switches once under the repository identity', async () => {
        let now = new Date(2026, 10, 25, 9, 0).getTime();
        const tracker = new workspaceActivity_1.WorkspaceActivityTracker(undefined, async () => { }, () => now);
        const workspace = (0, workspaceActivity_1.createWorkspaceIdentity)('workspace-one', 'Diarium');
        const repositoryId = (0, workspaceActivity_1.createRepositoryIdentity)('repository-one');
        tracker.setEnabled(true);
        tracker.setWorkspace(workspace);
        tracker.setBranches([{ repositoryId, name: 'main' }]);
        tracker.setFocused(true);
        now += 60_000;
        tracker.setBranches([{ repositoryId, name: 'feature' }]);
        now += 30_000;
        await tracker.checkpoint();
        const branches = Object.values(tracker.snapshot().workspaces[workspace.id].branches ?? {});
        assert.strictEqual(branches.find(branch => branch.name === 'main')?.totalSeconds, 60);
        assert.strictEqual(branches.find(branch => branch.name === 'feature')?.totalSeconds, 30);
        await tracker.checkpoint();
        const afterSecondCheckpoint = Object.values(tracker.snapshot().workspaces[workspace.id].branches ?? {});
        assert.strictEqual(afterSecondCheckpoint.find(branch => branch.name === 'main')?.totalSeconds, 60);
        assert.strictEqual(afterSecondCheckpoint.find(branch => branch.name === 'feature')?.totalSeconds, 30);
    });
    test('labels detached and unavailable Git states without exposing commit hashes', () => {
        assert.strictEqual((0, workspaceActivity_1.getBranchLabel)({ name: '  main ' }), 'main');
        assert.strictEqual((0, workspaceActivity_1.getBranchLabel)({ commit: 'abc123' }), 'Detached HEAD');
        assert.strictEqual((0, workspaceActivity_1.getBranchLabel)(undefined), 'Unknown');
        assert.strictEqual((0, workspaceActivity_1.getBranchLabel)({}), 'Unknown');
    });
    test('aggregates extension edits and saves by workspace and extension', () => {
        let now = new Date(2026, 10, 25, 9, 0).getTime();
        const tracker = new workspaceActivity_1.WorkspaceActivityTracker(undefined, async () => { }, () => now);
        const workspace = (0, workspaceActivity_1.createWorkspaceIdentity)('workspace-one', 'Diarium');
        tracker.setEnabled(true);
        tracker.setWorkspace(workspace);
        tracker.recordExtensionActivity({
            extensionId: 'publisher.editor',
            displayName: 'Editor',
            languageId: 'typescript',
        }, 'edit');
        now += 1_000;
        tracker.recordExtensionActivity({
            extensionId: 'publisher.editor',
            displayName: 'Editor',
            languageId: 'javascript',
        }, 'save');
        assert.deepStrictEqual(tracker.snapshot().workspaces[workspace.id].extensions, {
            'publisher.editor': {
                extensionId: 'publisher.editor',
                displayName: 'Editor',
                languageId: 'javascript',
                editCount: 1,
                saveCount: 1,
                lastSeenAt: new Date(now).toISOString(),
            },
        });
    });
    test('resolves built-in and unknown language extensions safely', () => {
        assert.deepStrictEqual((0, workspaceActivity_1.resolveLanguageExtension)('typescript', [{
                extensionId: 'vscode.typescript-language-features',
                displayName: 'TypeScript',
                languageIds: ['typescript'],
                builtIn: true,
            }]), {
            extensionId: 'vscode.typescript-language-features',
            displayName: 'Built-in',
        });
        assert.deepStrictEqual((0, workspaceActivity_1.resolveLanguageExtension)('unknown', []), {
            extensionId: 'unknown',
            displayName: 'Unknown',
        });
    });
    test('stores repeated task executions without command or output data', () => {
        const start = new Date(2026, 10, 25, 9, 0).getTime();
        const tracker = new workspaceActivity_1.WorkspaceActivityTracker(undefined, async () => { }, () => start);
        const workspace = (0, workspaceActivity_1.createWorkspaceIdentity)('workspace-one', 'Diarium');
        const task = (0, workspaceActivity_1.createTaskIdentity)('Build', 'npm', 'shell');
        tracker.setEnabled(true);
        tracker.setWorkspace(workspace);
        tracker.recordTaskExecution(task, workspace, start, start + 60_000, 'completed');
        tracker.recordTaskExecution(task, workspace, start + 120_000, start + 150_000, 'interrupted');
        const tasks = tracker.snapshot().workspaces[workspace.id].tasks ?? [];
        assert.strictEqual(tasks.length, 2);
        assert.deepStrictEqual(tasks.map(item => ({
            taskKey: item.taskKey,
            name: item.name,
            source: item.source,
            type: item.type,
            seconds: item.seconds,
            result: item.result,
        })), [
            { taskKey: task.taskKey, name: 'Build', source: 'npm', type: 'shell', seconds: 60, result: 'completed' },
            { taskKey: task.taskKey, name: 'Build', source: 'npm', type: 'shell', seconds: 30, result: 'interrupted' },
        ]);
        assert.ok(tasks.every(item => !Object.hasOwn(item, 'command') && !Object.hasOwn(item, 'output')));
    });
    test('stores repeated debug sessions without launch configuration data', () => {
        const start = new Date(2026, 10, 25, 9, 0).getTime();
        const tracker = new workspaceActivity_1.WorkspaceActivityTracker(undefined, async () => { }, () => start);
        const workspace = (0, workspaceActivity_1.createWorkspaceIdentity)('workspace-one', 'Diarium');
        const debug = (0, workspaceActivity_1.createDebugIdentity)('node', 'API debug');
        tracker.setEnabled(true);
        tracker.setWorkspace(workspace);
        tracker.recordDebugSession(debug, workspace, start, start + 90_000, 'completed');
        tracker.recordDebugSession(debug, workspace, start + 120_000, start + 180_000, 'interrupted');
        const sessions = tracker.snapshot().workspaces[workspace.id].debugSessions ?? [];
        assert.strictEqual(sessions.length, 2);
        assert.deepStrictEqual(sessions.map(session => ({
            debugKey: session.debugKey,
            type: session.type,
            name: session.name,
            seconds: session.seconds,
            result: session.result,
        })), [
            { debugKey: debug.debugKey, type: 'node', name: 'API debug', seconds: 90, result: 'completed' },
            { debugKey: debug.debugKey, type: 'node', name: 'API debug', seconds: 60, result: 'interrupted' },
        ]);
        assert.ok(sessions.every(session => !Object.hasOwn(session, 'configuration') && !Object.hasOwn(session, 'arguments')));
    });
});
//# sourceMappingURL=workspaceActivity.test.js.map