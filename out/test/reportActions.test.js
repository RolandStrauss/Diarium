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
        let receiveMessage;
        let html = '';
        const opened = [];
        const errors = [];
        const information = [];
        const messages = [];
        let saveDialogs = 0;
        const statusBarItems = [];
        const api = {
            commands: {
                registerCommand: (id, callback) => { commands.set(id, callback); },
                executeCommand: async (id) => commands.get(id)?.(),
            },
            ViewColumn: { One: 1 },
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
                    return {
                        webview: {
                            set html(value) { html = value; },
                            cspSource: 'test',
                            postMessage: async (message) => { messages.push(message); return true; },
                            onDidReceiveMessage: (callback) => { receiveMessage = callback; },
                        },
                        onDidDispose: () => ({ dispose: () => { } }),
                        dispose: () => { },
                    };
                },
                onDidChangeActiveTextEditor: () => ({ dispose: () => { } }),
                onDidChangeWindowState: () => ({ dispose: () => { } }),
                showQuickPick: async () => action ? { value: action } : undefined,
                showSaveDialog: async () => {
                    saveDialogs++;
                    return options.cancelSave ? undefined : { fsPath: path.join(directory, options.failSave ? 'missing\\saved-report.pdf' : 'saved-report.pdf') };
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
                update: async () => { },
            },
            subscriptions: [],
        };
        const filename = path.join(__dirname, '..', 'extension.js');
        const realRequire = (0, node_module_1.createRequire)(filename);
        const module = { exports: {} };
        (0, node_vm_1.runInNewContext)(await (0, promises_1.readFile)(filename, 'utf8'), {
            module,
            exports: module.exports,
            require: (id) => id === 'vscode' ? api : realRequire(id),
            process, Buffer, console,
            setInterval: () => 1,
            clearInterval: () => { },
        }, { filename });
        module.exports.activate(context);
        const openCommand = commands.get(options.card ? 'time-tracker.openTimeCard' : 'time-tracker.openTimesheet');
        assert.ok(openCommand);
        await openCommand();
        assert.ok(receiveMessage);
        await receiveMessage({ type: 'requestReportAction' });
        return { opened, errors, information, messages, saveDialogs, receiveMessage, statusBarItems,
            getHtml: () => html, getReceiver: () => receiveMessage };
    }
    test('status bar shows total and active-file time and targets open command', async () => {
        const result = await openTracker(undefined);
        const [statusBarItem] = result.statusBarItems;
        assert.ok(statusBarItem);
        assert.strictEqual(statusBarItem.text, '$(watch) 1h 30m | 1h 00m');
        assert.match(statusBarItem.tooltip, /Total tracked: 1h 30m/);
        assert.match(statusBarItem.tooltip, /Current file \(first\.ts\): 1h 00m/);
        assert.strictEqual(statusBarItem.command, 'time-tracker.openTimesheet');
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
});
//# sourceMappingURL=reportActions.test.js.map