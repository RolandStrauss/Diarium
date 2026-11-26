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
const promises_1 = require("node:fs/promises");
const node_module_1 = require("node:module");
const node_os_1 = require("node:os");
const path = __importStar(require("node:path"));
const node_vm_1 = require("node:vm");
suite('Report actions', () => {
    let directory;
    setup(async () => {
        directory = await (0, promises_1.mkdtemp)(path.join((0, node_os_1.tmpdir)(), 'time-tracker-test-'));
    });
    teardown(async () => {
        await (0, promises_1.rm)(directory, { recursive: true, force: true });
    });
    async function openTracker(action, openExternal = async () => true, options = {}) {
        const commands = new Map();
        const executedCommands = [];
        let receiveMessage;
        let html = '';
        const opened = [];
        const errors = [];
        const information = [];
        const messages = [];
        const intervals = new Map();
        let nextInterval = 0;
        let now = Date.now();
        let panelsCreated = 0;
        let reveals = 0;
        let writes = 0;
        const activityWrites = [];
        let failPersistence = false;
        let editorChanged;
        let focusChanged;
        let saveDialogs = 0;
        let suggestedSavePath = '';
        const statusBarItems = [];
        const api = {
            commands: {
                registerCommand: (id, callback) => { commands.set(id, callback); },
                executeCommand: async (id) => {
                    executedCommands.push(id);
                    return commands.get(id)?.();
                },
            },
            ViewColumn: { One: 1, Beside: 2 },
            StatusBarAlignment: { Right: 2 },
            Uri: {
                file: (fsPath) => ({ fsPath }),
                joinPath: (base, name) => ({ fsPath: path.join(base.fsPath, name) }),
            },
            workspace: { workspaceFolders: undefined },
            env: {
                openExternal: async (uri) => {
                    opened.push(uri);
                    return openExternal();
                },
            },
            window: {
                state: { focused: true },
                activeTextEditor: { document: { uri: { scheme: 'file', fsPath: 'C:\\work\\first.ts' } } },
                createStatusBarItem: () => {
                    const item = { text: '', tooltip: '', command: '', show: () => { }, dispose: () => { } };
                    statusBarItems.push(item);
                    return item;
                },
                createWebviewPanel: () => {
                    panelsCreated++;
                    let disposed = false;
                    const disposalListeners = [];
                    return {
                        viewColumn: 2,
                        reveal: () => { reveals++; },
                        webview: {
                            set html(value) { html = value; },
                            cspSource: 'test',
                            postMessage: async (message) => { messages.push(message); return true; },
                            onDidReceiveMessage: (callback) => {
                                receiveMessage = callback;
                                return { dispose: () => { } };
                            },
                        },
                        onDidChangeViewState: () => ({ dispose: () => { } }),
                        onDidDispose: (callback) => { disposalListeners.push(callback); return { dispose: () => { } }; },
                        dispose: () => {
                            if (!disposed) {
                                disposed = true;
                                disposalListeners.forEach(callback => callback());
                            }
                        },
                    };
                },
                onDidChangeActiveTextEditor: (callback) => { editorChanged = callback; return { dispose: () => { } }; },
                onDidChangeWindowState: (callback) => { focusChanged = callback; return { dispose: () => { } }; },
                showQuickPick: async (items) => options.chooseExclusion
                    ? items[0] : action ? { value: action } : undefined,
                showWarningMessage: async (message) => /Import .* (?:new entries|calendar (?:entry|entries))/.test(message)
                    ? (() => {
                        return options.confirmImport ? 'Import' : undefined;
                    })()
                    : options.confirmReset ? 'Reset' : undefined,
                showOpenDialog: async (dialogOptions) => {
                    if (options.calendarImportPath) {
                        return [{ fsPath: options.calendarImportPath }];
                    }
                    if (dialogOptions?.filters?.['Outlook Calendar'] && options.calendarImportPath) {
                        return [{ fsPath: options.calendarImportPath }];
                    }
                    return options.importPath ? [{ fsPath: options.importPath }] : undefined;
                },
                showSaveDialog: async (dialog) => {
                    saveDialogs++;
                    suggestedSavePath = dialog.defaultUri.fsPath;
                    return options.cancelSave ? undefined : {
                        fsPath: options.savePath ?? path.join(directory, options.failSave ? 'missing\\saved-report.pdf' : 'saved-report.pdf'),
                    };
                },
                showErrorMessage: async (message) => { errors.push(message); },
                showInformationMessage: async (message) => { information.push(message); },
            },
        };
        const context = {
            globalStorageUri: { fsPath: directory },
            globalState: {
                get: (key) => key === 'time-tracker.file-times'
                    ? { 'C:\\work\\first.ts': 3_600_000, 'C:\\work\\second.ts': 1_800_000 }
                    : undefined,
                update: async (key, value) => {
                    writes++;
                    if (failPersistence) {
                        throw new Error('Storage unavailable');
                    }
                    if (key === 'time-tracker.file-activity') {
                        activityWrites.push(value);
                    }
                },
            },
            subscriptions: [],
        };
        const filename = path.join(__dirname, '..', 'extension.js');
        const realRequire = (0, node_module_1.createRequire)(filename);
        const module = { exports: {} };
        (0, node_vm_1.runInNewContext)(await (0, promises_1.readFile)(filename, 'utf8'), {
            module,
            exports: module.exports,
            require: (id) => id === 'vscode' ? api
                : id === 'node:perf_hooks' ? { performance: { now: () => now } } : realRequire(id),
            process, Buffer, console,
            Date: class extends Date {
                static now() { return now; }
            },
            setInterval: (callback, milliseconds) => {
                const id = ++nextInterval;
                intervals.set(id, { callback, milliseconds });
                return id;
            },
            clearInterval: (id) => intervals.delete(id),
        }, { filename });
        module.exports.activate(context);
        if (!options.skipOpen) {
            const openCommand = commands.get(options.timer ? 'time-tracker.showFloatingTimer'
                : options.card ? 'time-tracker.openTimeCard' : 'time-tracker.openTimesheet');
            assert.ok(openCommand);
            await openCommand();
            if (!options.expectLoadFailure) {
                assert.ok(receiveMessage);
                await receiveMessage({ type: 'requestReportAction' });
            }
        }
        const receiver = receiveMessage ?? (async () => { throw new Error('No webview receiver registered'); });
        return { opened, errors, information, messages, saveDialogs, receiveMessage: receiver, statusBarItems,
            getHtml: () => html, getReceiver: () => receiveMessage,
            getSaveDialogs: () => saveDialogs,
            getSuggestedSavePath: () => suggestedSavePath,
            commands, intervals, api, context, activityWrites, deactivate: module.exports.deactivate,
            executedCommands,
            getPanelCount: () => panelsCreated, getReveals: () => reveals, getWrites: () => writes,
            failPersistence: () => { failPersistence = true; },
            advance: (milliseconds) => { now += milliseconds; },
            tick: () => { for (const interval of intervals.values()) {
                if (interval.milliseconds === 1000) {
                    interval.callback();
                }
            } },
            editorChanged: () => editorChanged(), focusChanged: () => focusChanged(),
        };
    }
    test('floating timer updates live seconds without extra writes and reuses, hides, and recreates its panel', async () => {
        const result = await openTracker(undefined, undefined, { timer: true });
        await result.receiveMessage({ type: 'ready' });
        assert.strictEqual(result.messages.at(-1)?.totalTime, '01:30:00');
        assert.strictEqual(result.messages.at(-1)?.currentTime, '01:00:00');
        const writes = result.getWrites();
        result.advance(1500);
        result.tick();
        assert.strictEqual(result.messages.at(-1)?.totalTime, '01:30:01');
        assert.strictEqual(result.messages.at(-1)?.currentTime, '01:00:01');
        assert.strictEqual(result.messages.at(-1)?.currentFile, 'first.ts');
        assert.strictEqual(result.getWrites(), writes);
        await result.commands.get('time-tracker.showFloatingTimer')();
        assert.strictEqual(result.getPanelCount(), 1);
        assert.strictEqual(result.getReveals(), 1);
        await result.receiveMessage({ type: 'hide' });
        assert.strictEqual(result.intervals.size, 2, 'The display refresh and minute checkpoint remain after hiding');
        result.advance(2000);
        await result.commands.get('time-tracker.showFloatingTimer')();
        await result.getReceiver()({ type: 'ready' });
        assert.strictEqual(result.getPanelCount(), 2);
        assert.strictEqual(result.messages.at(-1)?.currentTime, '01:00:03', 'Hiding must not pause tracking');
        await result.commands.get('time-tracker.hideFloatingTimer')();
        await result.commands.get('time-tracker.hideFloatingTimer')();
        assert.strictEqual(result.intervals.size, 2);
    });
    test('routes only allowlisted maintenance actions and suppresses duplicate requests', async () => {
        const result = await openTracker(undefined, undefined, { cancelSave: true });
        const commands = [
            'time-tracker.toggleTracking',
            'time-tracker.importTimesheet',
            'time-tracker.exportTimesheet',
            'time-tracker.manageExclusions',
            'time-tracker.resetFileTimes',
            'time-tracker.showFloatingTimer',
            'time-tracker.openTimeCard',
        ];
        const toggle = { type: 'maintenanceAction', command: 'time-tracker.toggleTracking' };
        await Promise.all([result.receiveMessage(toggle), result.receiveMessage(toggle)]);
        for (const command of commands.filter(value => value !== 'time-tracker.toggleTracking')) {
            await result.receiveMessage({ type: 'maintenanceAction', command });
        }
        assert.deepStrictEqual(result.executedCommands, commands);
        assert.ok(result.messages.some(item => item.type === 'maintenanceActionComplete'));
        await result.receiveMessage({ type: 'maintenanceAction', command: 'time-tracker.unknown' });
        assert.deepStrictEqual(result.executedCommands, commands);
        assert.ok(result.messages.some(item => item.type === 'maintenanceActionError' &&
            item.message === 'Choose a valid maintenance action.'));
    });
    test('timer pause preserves partial seconds, survives file and focus changes, and resumes the latest file', async () => {
        const result = await openTracker(undefined, undefined, { timer: true });
        result.advance(1500);
        await result.receiveMessage({ type: 'toggleTracking' });
        assert.strictEqual(result.messages.at(-1)?.paused, true);
        assert.match(result.statusBarItems[0].text, /\$\(debug-pause\)/);
        result.advance(10_000);
        result.api.window.activeTextEditor.document.uri.fsPath = 'C:\\work\\second.ts';
        result.editorChanged();
        result.tick();
        assert.strictEqual(result.messages.at(-1)?.currentTime, '00:30:00');
        assert.strictEqual(result.messages.at(-1)?.paused, true);
        result.api.window.state.focused = false;
        result.focusChanged();
        await result.commands.get('time-tracker.toggleTracking')();
        result.advance(5000);
        result.tick();
        assert.strictEqual(result.messages.at(-1)?.totalTime, '01:30:01');
        assert.strictEqual(result.messages.at(-1)?.status, 'Waiting for a focused local file');
        result.api.window.state.focused = true;
        result.focusChanged();
        result.advance(1500);
        result.tick();
        assert.strictEqual(result.messages.at(-1)?.currentTime, '00:30:01');
        assert.strictEqual(result.messages.at(-1)?.totalTime, '01:30:03');
        for (const disposable of result.context.subscriptions) {
            disposable?.dispose?.();
        }
        assert.strictEqual(result.intervals.size, 0, 'Extension disposal clears both intervals');
    });
    test('pause write failures notify the user while keeping the timer paused', async () => {
        const result = await openTracker(undefined, undefined, { timer: true });
        result.failPersistence();
        await result.receiveMessage({ type: 'toggleTracking' });
        assert.match(result.errors[0], /Could not save automatic file time data: .*Storage unavailable/);
        assert.strictEqual(result.messages.at(-1)?.paused, true);
        result.advance(5000);
        result.tick();
        assert.strictEqual(result.messages.at(-1)?.currentTime, '01:00:00');
    });
    test('exclusion settles time, persists its exact path, and reinclusion starts a fresh interval', async () => {
        const result = await openTracker(undefined, undefined, { timer: true, chooseExclusion: true });
        result.advance(1500);
        await result.commands.get('time-tracker.manageExclusions')();
        assert.match(result.statusBarItems[0].text, /Excluded/);
        const excluded = result.activityWrites.at(-1);
        assert.strictEqual(excluded.excludedFiles[0], 'C:\\work\\first.ts');
        assert.strictEqual(excluded.fileTimes['C:\\work\\first.ts'], 3_601_500);
        result.advance(5000);
        result.tick();
        assert.strictEqual(result.messages.at(-1)?.status, 'Excluded');
        await result.commands.get('time-tracker.manageExclusions')();
        result.advance(2000);
        result.tick();
        assert.strictEqual(result.messages.at(-1)?.currentTime, '01:00:03');
    });
    test('reset requires confirmation and leaves exclusions separate from file totals', async () => {
        const options = { timer: true, chooseExclusion: true, confirmReset: false };
        const result = await openTracker(undefined, undefined, options);
        await result.commands.get('time-tracker.manageExclusions')();
        const writes = result.activityWrites.length;
        await result.commands.get('time-tracker.resetFileTimes')();
        assert.strictEqual(result.activityWrites.length, writes);
        options.confirmReset = true;
        await result.commands.get('time-tracker.resetFileTimes')();
        const reset = result.activityWrites.at(-1);
        assert.strictEqual(reset.excludedFiles[0], 'C:\\work\\first.ts');
        assert.strictEqual(Object.keys(reset.fileTimes).length, 0);
        assert.ok(result.information.some(message => /activity was reset/i.test(message)));
    });
    test('status bar shows total and active-file time and targets open command', async () => {
        const result = await openTracker(undefined);
        const [statusBarItem] = result.statusBarItems;
        assert.ok(statusBarItem);
        assert.strictEqual(statusBarItem.text, '$(watch) 1h 30m | 1h 00m');
        assert.match(statusBarItem.tooltip, /Total tracked: 1h 30m/);
        assert.match(statusBarItem.tooltip, /Current file \(first\.ts\): 1h 00m/);
        assert.strictEqual(statusBarItem.command, 'time-tracker.openTimesheet');
    });
    test('concurrent panels reject stale edits without overwriting the saved entry', async () => {
        const result = await openTracker(undefined);
        const first = result.receiveMessage;
        await result.commands.get('time-tracker.openTimesheet')();
        const second = result.getReceiver();
        const entry = { date: '2026-11-01', task: 'Original', timeIn: '09:00', timeOut: '10:00' };
        await first({ type: 'createEntry', entry, requestId: 'first-create' });
        const state = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        const saved = state.entries[entry.date][0];
        await second({ type: 'saveEntry', entry: { ...entry, task: 'Changed elsewhere' }, id: saved.id, expected: saved });
        await first({ type: 'saveEntry', entry: { ...entry, task: 'Stale edit' }, id: saved.id, expected: saved });
        assert.match(result.messages.at(-1)?.message ?? '', /changed in another view/);
        const current = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.strictEqual(current.entries[entry.date][0].task, 'Changed elsewhere');
    });
    test('deduplicates repeated createEntry requests with the same request ID', async () => {
        const result = await openTracker(undefined);
        const entry = { date: '2026-11-01', task: 'Original', timeIn: '09:00', timeOut: '10:00' };
        await result.receiveMessage({ type: 'createEntry', entry, requestId: 'repeat-create' });
        await result.receiveMessage({ type: 'createEntry', entry, requestId: 'repeat-create' });
        const saved = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.strictEqual(saved.entries[entry.date].length, 1);
        const created = result.messages.filter(message => message.type === 'entryCreated');
        assert.strictEqual(created.length, 2);
        assert.strictEqual(created[0].entry?.id, created[1].entry?.id);
        await result.receiveMessage({
            type: 'createEntry',
            entry: { ...entry, task: 'Changed' },
            requestId: 'repeat-create',
        });
        const unchanged = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.strictEqual(unchanged.entries[entry.date].length, 1);
        assert.strictEqual(unchanged.entries[entry.date][0].task, 'Original');
        assert.match(result.messages.at(-1)?.message ?? '', /create-entry request is invalid/i);
    });
    test('restores saved entries and report settings after extension restart', async () => {
        const first = await openTracker(undefined);
        const entry = { date: '2026-11-01', task: 'Work', timeIn: '09:00', timeOut: '' };
        const secondEntry = { date: entry.date, task: 'Review', timeIn: '10:00', timeOut: '11:00' };
        const holiday = { date: entry.date, name: 'Holiday' };
        await first.receiveMessage({ type: 'createEntry', entry, requestId: 'entry' });
        await first.receiveMessage({ type: 'createEntry', entry: secondEntry, requestId: 'second-entry' });
        await first.receiveMessage({ type: 'setPeriod', periodStart: '2026-11-21', periodEnd: '2026-12-05', expectedStart: '2026-10-21', expectedEnd: '2026-11-20' });
        await first.receiveMessage({ type: 'setHourlyRate', value: '42.5', expectedValue: null });
        await first.receiveMessage({ type: 'addHoliday', holiday });
        const saved = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        await first.deactivate();
        const second = await openTracker(undefined);
        await second.receiveMessage({ type: 'ready' });
        const restored = second.messages.at(-1)?.data;
        assert.deepStrictEqual(JSON.parse(JSON.stringify({
            entries: restored.entries,
            periodStart: restored.periodStart,
            periodEnd: restored.periodEnd,
            hourlyRate: restored.hourlyRate,
            holidays: restored.holidays,
        })), saved);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(restored.entries[entry.date].map(({ date, task, timeIn, timeOut }) => ({ date, task, timeIn, timeOut })))), [entry, secondEntry]);
        assert.strictEqual(restored.periodStart, '2026-11-21');
        assert.strictEqual(restored.periodEnd, '2026-12-05');
        assert.strictEqual(restored.hourlyRate, 42.5);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(restored.holidays)), [holiday]);
        await second.deactivate();
    });
    test('migrates old periods and rejects invalid or stale range updates', async () => {
        const file = path.join(directory, 'timesheet.json');
        await (0, promises_1.writeFile)(file, JSON.stringify({ entries: {}, periodStart: '2024-01-31', hourlyRate: null }));
        const result = await openTracker(undefined);
        await result.receiveMessage({ type: 'ready' });
        assert.strictEqual((result.messages.at(-1)?.data).periodEnd, '2024-02-28');
        const expectedStart = '2024-01-31';
        const expectedEnd = '2024-02-28';
        await result.receiveMessage({ type: 'setPeriod', periodStart: '2024-03-01', periodEnd: '2024-02-29', expectedStart, expectedEnd });
        assert.match(result.messages.at(-1)?.message ?? '', /on or after/);
        await result.receiveMessage({ type: 'setPeriod', periodStart: '2024-02-29', periodEnd: '2024-02-29', expectedStart, expectedEnd });
        await result.receiveMessage({ type: 'setPeriod', periodStart: '2024-02-01', periodEnd: '2024-02-10', expectedStart, expectedEnd });
        assert.match(result.messages.at(-1)?.message ?? '', /changed in another view/);
        const saved = JSON.parse(await (0, promises_1.readFile)(file, 'utf8'));
        assert.strictEqual(saved.periodStart, '2024-02-29');
        assert.strictEqual(saved.periodEnd, '2024-02-29');
    });
    test('rejects invalid stored period ends without rewriting the timesheet', async () => {
        const file = path.join(directory, 'timesheet.json');
        const contents = JSON.stringify({ periodStart: '2026-11-21', periodEnd: '2026-11-20' });
        await (0, promises_1.writeFile)(file, contents);
        const result = await openTracker(undefined, undefined, { expectLoadFailure: true });
        assert.match(result.errors[0], /saved period end is invalid/i);
        assert.strictEqual(await (0, promises_1.readFile)(file, 'utf8'), contents);
    });
    test('uses saved custom dates for print and PDF filenames', async () => {
        await (0, promises_1.writeFile)(path.join(directory, 'timesheet.json'), JSON.stringify({
            entries: {}, periodStart: '2026-12-31', periodEnd: '2027-01-02', hourlyRate: null,
        }));
        const print = await openTracker('print');
        assert.strictEqual(path.basename(print.opened[0].fsPath), 'timesheet-2026-12-31-to-2027-01-02.pdf');
        await print.deactivate();
        const pdf = await openTracker('pdf');
        assert.strictEqual(path.basename(pdf.getSuggestedSavePath()), 'timesheet-2026-12-31-to-2027-01-02.pdf');
        assert.deepStrictEqual(pdf.errors, []);
        await pdf.deactivate();
    });
    test('a failed timesheet write leaves prior data intact and allows retry', async () => {
        const result = await openTracker(undefined);
        const stateFile = path.join(directory, 'timesheet.json');
        const backup = path.join(directory, 'timesheet.backup.json');
        await (0, promises_1.rename)(stateFile, backup);
        await (0, promises_1.mkdir)(stateFile);
        const entry = { date: '2026-11-01', task: 'Work', timeIn: '09:00', timeOut: '10:00' };
        await result.receiveMessage({ type: 'createEntry', entry, requestId: 'retry-create' });
        assert.strictEqual(result.messages.at(-1)?.type, 'error');
        assert.deepStrictEqual(JSON.parse(await (0, promises_1.readFile)(backup, 'utf8')).entries, {});
        await (0, promises_1.rm)(stateFile, { recursive: true });
        await (0, promises_1.rename)(backup, stateFile);
        await result.receiveMessage({ type: 'createEntry', entry, requestId: 'retry-create-again' });
        assert.strictEqual(JSON.parse(await (0, promises_1.readFile)(stateFile, 'utf8')).entries[entry.date][0].task, 'Work');
    });
    test('migrates a legacy one-entry-per-date store and preserves existing entries', async () => {
        const date = '2026-11-01';
        await (0, promises_1.writeFile)(path.join(directory, 'timesheet.json'), JSON.stringify({
            entries: { [date]: { date, task: 'Legacy', timeIn: '09:00', timeOut: '10:00' } },
            periodStart: '2026-10-21',
            hourlyRate: null,
        }));
        const result = await openTracker(undefined);
        await result.receiveMessage({
            type: 'createEntry',
            entry: { date, task: 'New task', timeIn: '10:00', timeOut: '11:00' },
            requestId: 'same-date-entry',
        });
        const saved = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.deepStrictEqual(saved.entries[date].map((entry) => entry.task), ['Legacy', 'New task']);
        assert.strictEqual(new Set(saved.entries[date].map((entry) => entry.id)).size, 2);
    });
    test('adds and removes specific holidays without overwriting entries or other holidays', async () => {
        const result = await openTracker(undefined);
        const date = '2026-11-01';
        const first = { date, name: 'Founders Day' };
        const second = { date, name: 'Festival' };
        await result.receiveMessage({ type: 'createEntry', entry: { date, task: 'Work', timeIn: '09:00', timeOut: '10:00' }, requestId: 'entry' });
        await result.receiveMessage({ type: 'addHoliday', holiday: first, view: 'holidays' });
        await result.receiveMessage({ type: 'addHoliday', holiday: second, view: 'holidays' });
        await result.receiveMessage({ type: 'addHoliday', holiday: first, view: 'holidays' });
        assert.match(result.messages.at(-1)?.message ?? '', /already exists/);
        await result.receiveMessage({ type: 'addHoliday', holiday: { date: '2026-02-30', name: 'Bad date' }, view: 'holidays' });
        assert.match(result.messages.at(-1)?.message ?? '', /valid holiday/);
        await result.receiveMessage({ type: 'deleteHoliday', holiday: first, view: 'holidays' });
        await result.receiveMessage({ type: 'deleteHoliday', holiday: first, view: 'holidays' });
        assert.match(result.messages.at(-1)?.message ?? '', /removed in another view/);
        const saved = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.deepStrictEqual(saved.holidays, [second]);
        assert.strictEqual(saved.entries[date][0].task, 'Work');
    });
    test('rejects invalid saved holidays without rewriting the timesheet', async () => {
        const file = path.join(directory, 'timesheet.json');
        const contents = JSON.stringify({ holidays: [{ date: '2026-02-30', name: 'Holiday' }] });
        await (0, promises_1.writeFile)(file, contents);
        const result = await openTracker(undefined, undefined, { expectLoadFailure: true });
        assert.match(result.errors[0], /saved public holidays are invalid/i);
        assert.strictEqual(await (0, promises_1.readFile)(file, 'utf8'), contents);
    });
    test('loads saved holidays when opening an existing timesheet', async () => {
        const holiday = { date: '2026-10-24', name: 'Festival' };
        await (0, promises_1.writeFile)(path.join(directory, 'timesheet.json'), JSON.stringify({ holidays: [holiday] }));
        const result = await openTracker(undefined);
        await result.receiveMessage({ type: 'addHoliday', holiday: { date: '2026-10-25', name: 'Second day' }, view: 'holidays' });
        const saved = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.deepStrictEqual(saved.holidays, [holiday, { date: '2026-10-25', name: 'Second day' }]);
    });
    test('edits and deletes one entry without changing other entries on the same date', async () => {
        const result = await openTracker(undefined);
        const date = '2026-11-01';
        const first = { date, task: 'First task', timeIn: '09:00', timeOut: '10:00' };
        const second = { date, task: 'Second task', timeIn: '10:00', timeOut: '11:00' };
        await result.receiveMessage({ type: 'createEntry', entry: first, requestId: 'first' });
        await result.receiveMessage({ type: 'createEntry', entry: second, requestId: 'second' });
        let stored = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        const [savedFirst, savedSecond] = stored.entries[date];
        await result.receiveMessage({
            type: 'saveEntry', entry: { ...first, task: 'Updated first task' },
            id: savedFirst.id, expected: savedFirst,
        });
        await result.receiveMessage({ type: 'deleteEntry', date, id: savedSecond.id, expected: savedSecond });
        stored = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.deepStrictEqual(stored.entries[date].map((entry) => entry.task), ['Updated first task']);
    });
    test('invalid stored entries are reported without rewriting the timesheet', async () => {
        const file = path.join(directory, 'timesheet.json');
        const contents = JSON.stringify({ entries: { '2026-02-30': {
                    date: '2026-02-30', task: 'Work', timeIn: '09:00', timeOut: '10:00',
                } }, periodStart: '2026-10-21', hourlyRate: null });
        await (0, promises_1.writeFile)(file, contents);
        const result = await openTracker(undefined, undefined, { expectLoadFailure: true });
        assert.match(result.errors[0], /saved entry.*invalid/i);
        assert.strictEqual(await (0, promises_1.readFile)(file, 'utf8'), contents);
    });
    test('Print opens a generated PDF outside the webview without a Save dialog', async () => {
        const result = await openTracker('print');
        assert.strictEqual(result.opened.length, 1, 'Print must open an external printable report');
        const pdf = await (0, promises_1.readFile)(result.opened[0].fsPath);
        assert.strictEqual(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
        assert.strictEqual(pdf.includes(Buffer.from('%%EOF')), true);
        assert.strictEqual(result.saveDialogs, 0);
        assert.deepStrictEqual(result.errors, []);
        assert.ok(result.information.some(message => /print/i.test(message)));
        assert.ok(!result.messages.some(message => message.type === 'printReport'));
    });
    test('Print reports when no external PDF viewer opens', async () => {
        const result = await openTracker('print', async () => false);
        assert.strictEqual(result.errors.length, 1);
        assert.match(result.errors[0], /could not.*print/i);
        assert.deepStrictEqual(result.information, []);
    });
    test('repeated Print actions open separate copies to avoid viewer caching or file locks', async () => {
        const result = await openTracker('print');
        await result.receiveMessage({ type: 'requestReportAction' });
        assert.strictEqual(result.opened.length, 2);
        assert.notStrictEqual(result.opened[0].fsPath, result.opened[1].fsPath);
        assert.deepStrictEqual(result.errors, []);
    });
    test('Print reports external viewer errors', async () => {
        const result = await openTracker('print', async () => { throw new Error('Viewer unavailable'); });
        assert.strictEqual(result.errors.length, 1);
        assert.match(result.errors[0], /Viewer unavailable/);
        assert.deepStrictEqual(result.information, []);
    });
    test('Save PDF still writes the selected file without opening a viewer', async () => {
        const result = await openTracker('pdf');
        const pdf = await (0, promises_1.readFile)(path.join(directory, 'saved-report.pdf'));
        assert.strictEqual(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
        assert.strictEqual(result.saveDialogs, 1);
        assert.deepStrictEqual(result.opened, []);
        assert.deepStrictEqual(result.errors, []);
    });
    test('cancelling the action picker does not export or print', async () => {
        const result = await openTracker(undefined);
        assert.deepStrictEqual(result.opened, []);
        assert.strictEqual(result.saveDialogs, 0);
        assert.deepStrictEqual(result.errors, []);
        assert.deepStrictEqual(result.information, []);
    });
    test('opens the card from File activity and exports standalone HTML from the preview', async () => {
        const result = await openTracker(undefined);
        await result.receiveMessage({ type: 'openTimeCard' });
        assert.match(result.getHtml(), /Time well spent/);
        assert.match(result.getHtml(), /1h 30m/);
        await result.getReceiver()({ type: 'export', format: 'html' });
        const html = await (0, promises_1.readFile)(path.join(directory, 'saved-report.pdf.html'), 'utf8');
        assert.match(html, /first\.ts/);
        assert.match(html, /second\.ts/);
        assert.ok(!html.includes('C:\\work'));
        assert.ok(!html.includes('<script'));
        assert.deepStrictEqual(result.errors, []);
    });
    test('exports card PDF without changing the existing report action', async () => {
        const result = await openTracker(undefined, undefined, { card: true });
        await result.receiveMessage({ type: 'export', format: 'pdf' });
        const pdf = await (0, promises_1.readFile)(path.join(directory, 'saved-report.pdf'));
        assert.strictEqual(pdf.subarray(0, 5).toString(), '%PDF-');
        assert.deepStrictEqual(result.errors, []);
        assert.ok(result.information.some(message => /Time card saved/.test(message)));
    });
    test('refreshes snapshots and reports invalid export formats', async () => {
        const result = await openTracker(undefined, undefined, { card: true });
        await result.receiveMessage({ type: 'refresh' });
        assert.match(result.getHtml(), /first\.ts/);
        await result.receiveMessage({ type: 'export', format: 'exe' });
        assert.match(result.errors[0], /Choose HTML or PDF/);
        assert.deepStrictEqual(result.information, []);
    });
    test('cancelling card save does not write a file or claim success', async () => {
        const result = await openTracker(undefined, undefined, { card: true, cancelSave: true });
        await result.receiveMessage({ type: 'export', format: 'html' });
        await assert.rejects((0, promises_1.readFile)(path.join(directory, 'saved-report.pdf.html')), { code: 'ENOENT' });
        assert.deepStrictEqual(result.errors, []);
        assert.deepStrictEqual(result.information, []);
    });
    test('card write failures show an error without claiming success', async () => {
        const result = await openTracker(undefined, undefined, { card: true, failSave: true });
        await result.receiveMessage({ type: 'export', format: 'html' });
        assert.match(result.errors[0], /Could not generate or export the time card/);
        assert.deepStrictEqual(result.information, []);
    });
    test('exports portable manual timesheet data from the command palette', async () => {
        const output = path.join(directory, 'timesheet-transfer.json');
        const result = await openTracker(undefined, undefined, { savePath: output });
        const activityWrites = result.activityWrites.length;
        const entry = { date: '2026-11-01', task: 'Portable work', timeIn: '09:00', timeOut: '10:00' };
        await result.receiveMessage({ type: 'createEntry', entry, requestId: 'portable-entry' });
        await result.receiveMessage({ type: 'addHoliday', holiday: { date: entry.date, name: 'Portable holiday' } });
        await result.commands.get('time-tracker.exportTimesheet')();
        const transfer = JSON.parse(await (0, promises_1.readFile)(output, 'utf8'));
        assert.strictEqual(transfer.kind, 'time-tracker-timesheet');
        assert.strictEqual(transfer.schemaVersion, 1);
        assert.strictEqual(transfer.entries[entry.date][0].task, entry.task);
        assert.deepStrictEqual(transfer.holidays, [{ date: entry.date, name: 'Portable holiday' }]);
        assert.ok(!Object.hasOwn(transfer, 'periodStart'));
        assert.ok(!Object.hasOwn(transfer, 'hourlyRate'));
        assert.ok(!Object.hasOwn(transfer, 'fileTimes'));
        assert.ok(!Object.hasOwn(transfer, 'excludedFiles'));
        assert.ok(result.information.some(message => /Timesheet data saved/.test(message)));
        assert.strictEqual(result.activityWrites.length, activityWrites);
    });
    test('cancels timesheet export without writing or claiming success', async () => {
        const result = await openTracker(undefined, undefined, { cancelSave: true, skipOpen: true });
        await result.commands.get('time-tracker.exportTimesheet')();
        assert.deepStrictEqual(result.errors, []);
        assert.deepStrictEqual(result.information, []);
        assert.strictEqual(result.getSaveDialogs(), 1);
        assert.deepStrictEqual(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'), JSON.stringify({ entries: {}, periodStart: '2026-10-21', periodEnd: '2026-11-20', hourlyRate: null, holidays: [] }, null, 2));
    });
    test('reports export write failures without claiming success', async () => {
        const output = path.join(directory, 'missing', 'timesheet-transfer.json');
        const result = await openTracker(undefined, undefined, { skipOpen: true, savePath: output });
        await result.commands.get('time-tracker.exportTimesheet')();
        assert.ok(result.errors.some(message => /Could not export timesheet data/.test(message)));
        assert.deepStrictEqual(result.information, []);
        await assert.rejects((0, promises_1.readFile)(output), { code: 'ENOENT' });
    });
    test('refuses to export over the active timesheet store', async () => {
        const result = await openTracker(undefined, undefined, {
            skipOpen: true,
            savePath: path.join(directory, 'timesheet.json'),
        });
        await result.commands.get('time-tracker.exportTimesheet')();
        assert.ok(result.errors.some(message => /active timesheet store/.test(message)));
        const contents = await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8');
        assert.deepStrictEqual(JSON.parse(contents), {
            entries: {}, periodStart: '2026-10-21', periodEnd: '2026-11-20', hourlyRate: null, holidays: [],
        });
    });
    test('imports Outlook calendar .ics entries without duplicate imports', async () => {
        const importPath = path.join(directory, 'outlook.ics');
        await (0, promises_1.writeFile)(importPath, [
            'BEGIN:VCALENDAR',
            'BEGIN:VEVENT',
            'UID:meeting-1',
            'DTSTART:20261124T090000',
            'DTEND:20261124T103000',
            'SUMMARY:Planning review',
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n'));
        const result = await openTracker(undefined, undefined, { calendarImportPath: importPath, confirmImport: true });
        await result.receiveMessage({ type: 'importOutlookCalendar', view: 'maintenance' });
        const once = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.ok(result.information.some(message => /Outlook Calendar import complete/.test(message)), JSON.stringify({ information: result.information, errors: result.errors }));
        assert.deepStrictEqual(once.entries['2026-11-24'][0], {
            id: once.entries['2026-11-24'][0].id,
            date: '2026-11-24',
            task: 'Planning review',
            timeIn: '09:00',
            timeOut: '10:30',
        });
        assert.match(once.entries['2026-11-24'][0].id, /^[a-f0-9]{32}$/);
        await result.receiveMessage({ type: 'importOutlookCalendar', view: 'maintenance' });
        const twice = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.strictEqual(twice.entries['2026-11-24'].length, 1);
        assert.ok(result.information.some(message => /1 entries added/.test(message)));
        assert.ok(result.information.some(message => /0 entries added/.test(message)));
    });
    test('imports transfer data atomically, preserves preferences, and is idempotent', async () => {
        const existingId = 'a'.repeat(32);
        const importedId = 'b'.repeat(32);
        const local = {
            entries: {
                '2026-11-01': [{
                        id: existingId, date: '2026-11-01', task: 'Local', timeIn: '09:00', timeOut: '10:00',
                    }],
            },
            periodStart: '2026-12-21',
            hourlyRate: 25,
            holidays: [{ date: '2026-11-01', name: 'Local holiday' }],
        };
        const input = {
            kind: 'time-tracker-timesheet',
            schemaVersion: 1,
            exportedAt: '2026-11-20T20:00:00.000Z',
            entries: {
                '2026-11-01': [local.entries['2026-11-01'][0]],
                '2026-11-02': [{
                        id: importedId, date: '2026-11-02', task: 'Imported', timeIn: '10:00', timeOut: '11:00',
                    }],
            },
            holidays: [...local.holidays, { date: '2026-11-02', name: 'Imported holiday' }],
        };
        await (0, promises_1.writeFile)(path.join(directory, 'timesheet.json'), JSON.stringify(local, null, 2));
        const importPath = path.join(directory, 'import.json');
        await (0, promises_1.writeFile)(importPath, JSON.stringify(input));
        const result = await openTracker(undefined, undefined, { skipOpen: true, importPath, confirmImport: true });
        const activityWrites = result.activityWrites.length;
        await result.commands.get('time-tracker.importTimesheet')();
        const imported = JSON.parse(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'));
        assert.strictEqual(imported.periodStart, local.periodStart);
        assert.strictEqual(imported.hourlyRate, local.hourlyRate);
        assert.deepStrictEqual(imported.entries['2026-11-02'][0].id, importedId);
        assert.deepStrictEqual(imported.holidays, input.holidays);
        assert.strictEqual(result.activityWrites.length, activityWrites);
        const once = await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8');
        await result.commands.get('time-tracker.importTimesheet')();
        assert.strictEqual(await (0, promises_1.readFile)(path.join(directory, 'timesheet.json'), 'utf8'), once);
        assert.ok(result.information.some(message => /1 entries and 1 holidays added/.test(message)));
        assert.ok(result.information.some(message => /0 entries and 0 holidays added/.test(message)));
    });
    test('cancels import and rejects conflicting IDs without changing durable data', async () => {
        const existingId = 'a'.repeat(32);
        const local = {
            entries: {
                '2026-11-01': [{
                        id: existingId, date: '2026-11-01', task: 'Local', timeIn: '09:00', timeOut: '10:00',
                    }],
            },
            periodStart: '2026-10-21',
            hourlyRate: null,
            holidays: [],
        };
        const statePath = path.join(directory, 'timesheet.json');
        await (0, promises_1.writeFile)(statePath, JSON.stringify(local, null, 2));
        const importPath = path.join(directory, 'import.json');
        const conflict = {
            kind: 'time-tracker-timesheet',
            schemaVersion: 1,
            exportedAt: '2026-11-20T20:00:00.000Z',
            entries: {
                '2026-11-01': [{ ...local.entries['2026-11-01'][0], task: 'Conflict' }],
            },
            holidays: [],
        };
        await (0, promises_1.writeFile)(importPath, JSON.stringify(conflict));
        const cancelled = await openTracker(undefined, undefined, { skipOpen: true, importPath, confirmImport: false });
        await cancelled.commands.get('time-tracker.importTimesheet')();
        assert.strictEqual(await (0, promises_1.readFile)(statePath, 'utf8'), JSON.stringify(local, null, 2));
        await cancelled.deactivate();
        const rejected = await openTracker(undefined, undefined, { skipOpen: true, importPath, confirmImport: true });
        await rejected.commands.get('time-tracker.importTimesheet')();
        assert.strictEqual(await (0, promises_1.readFile)(statePath, 'utf8'), JSON.stringify(local, null, 2));
        assert.ok(rejected.errors.some(message => /conflicts with a local entry/.test(message)));
        await rejected.deactivate();
    });
});
//# sourceMappingURL=reportActions.test.js.map