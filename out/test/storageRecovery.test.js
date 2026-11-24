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
const node_fs_1 = require("node:fs");
const node_module_1 = require("node:module");
const node_os_1 = require("node:os");
const path = __importStar(require("node:path"));
const node_vm_1 = require("node:vm");
const storageOwnership_1 = require("../storageOwnership");
suite('Storage recovery', () => {
    test('offers safe reload and crash recovery actions without removing the owner lock', async () => {
        const directory = (0, node_fs_1.mkdtempSync)(path.join((0, node_os_1.tmpdir)(), 'time-tracker-recovery-'));
        const release = (0, storageOwnership_1.acquireStorageOwnership)(directory);
        try {
            const dialogs = [];
            const selections = [undefined];
            const executed = [];
            const copied = [];
            let clipboardFails = false;
            const commands = new Map();
            const api = {
                StatusBarAlignment: { Right: 2 },
                commands: {
                    registerCommand: (id, callback) => { commands.set(id, callback); },
                    executeCommand: async (id) => { executed.push(id); },
                },
                env: { clipboard: { writeText: async (text) => {
                            if (clipboardFails) {
                                throw new Error('Clipboard unavailable');
                            }
                            copied.push(text);
                        } } },
                window: {
                    createStatusBarItem: () => ({ show: () => { }, dispose: () => { } }),
                    showErrorMessage: async (message, options, ...choices) => {
                        dialogs.push({ message, options, choices });
                        return selections.shift();
                    },
                },
            };
            const context = {
                globalStorageUri: { fsPath: directory },
                globalState: { get: () => undefined },
                subscriptions: [],
            };
            const filename = path.join(__dirname, '..', 'extension.js');
            const realRequire = (0, node_module_1.createRequire)(filename);
            const module = { exports: {} };
            (0, node_vm_1.runInNewContext)((0, node_fs_1.readFileSync)(filename, 'utf8'), {
                module, exports: module.exports,
                require: (id) => id === 'vscode' ? api : realRequire(id),
                process, Buffer, console, setInterval, clearInterval,
            }, { filename });
            const flush = () => new Promise(resolve => setImmediate(resolve));
            module.exports.activate(context);
            await flush();
            assert.strictEqual(dialogs[0].options.modal, true);
            assert.ok(dialogs[0].choices.includes('Reload Window'));
            assert.ok(dialogs[0].choices.includes('Recovery Instructions'));
            assert.match(dialogs[0].message, /time tracker/i);
            selections.push('Reload Window');
            commands.get('time-tracker.openTimesheet')();
            await flush();
            assert.deepStrictEqual(executed, ['workbench.action.reloadWindow']);
            selections.push('Recovery Instructions', 'Copy Lock Path');
            commands.get('time-tracker.openTimesheet')();
            await flush();
            assert.strictEqual(dialogs.at(-1)?.options.modal, true);
            assert.match(dialogs.at(-1)?.options.detail ?? '', /close all VS Code windows/i);
            assert.match(dialogs.at(-1)?.options.detail ?? '', /extension hosts/i);
            assert.deepStrictEqual(copied, [path.join(directory, 'time-tracker.owner.lock')]);
            assert.ok((0, node_fs_1.readFileSync)(copied[0], 'utf8'));
            clipboardFails = true;
            selections.push('Recovery Instructions', 'Copy Lock Path');
            commands.get('time-tracker.openTimesheet')();
            await flush();
            assert.match(dialogs.at(-1)?.message ?? '', /Could not complete storage recovery: .*Clipboard unavailable/);
            assert.ok((0, node_fs_1.readFileSync)(copied[0], 'utf8'));
        }
        finally {
            release();
            (0, node_fs_1.rmSync)(directory, { recursive: true, force: true });
        }
    });
});
//# sourceMappingURL=storageRecovery.test.js.map