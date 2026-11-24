import * as assert from 'node:assert';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { runInNewContext } from 'node:vm';
import { acquireStorageOwnership } from '../storageOwnership';

suite('Storage recovery', () => {
	test('offers safe reload and crash recovery actions without removing the owner lock', async () => {
		const directory = mkdtempSync(path.join(tmpdir(), 'time-tracker-recovery-'));
		const release = acquireStorageOwnership(directory);
		try {
			const dialogs: { message: string; options: { modal?: boolean; detail?: string }; choices: string[] }[] = [];
			const selections: (string | undefined)[] = [undefined];
			const executed: string[] = [];
			const copied: string[] = [];
			let clipboardFails = false;
			const commands = new Map<string, () => void>();
			const api = {
				StatusBarAlignment: { Right: 2 },
				commands: {
					registerCommand: (id: string, callback: () => void) => { commands.set(id, callback); },
					executeCommand: async (id: string) => { executed.push(id); },
				},
				env: { clipboard: { writeText: async (text: string) => {
					if (clipboardFails) { throw new Error('Clipboard unavailable'); }
					copied.push(text);
				} } },
				window: {
					createStatusBarItem: () => ({ show: () => {}, dispose: () => {} }),
					showErrorMessage: async (message: string, options: { modal?: boolean; detail?: string }, ...choices: string[]) => {
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
			const realRequire = createRequire(filename);
			const module = { exports: {} as { activate(extensionContext: typeof context): void } };
			runInNewContext(readFileSync(filename, 'utf8'), {
				module, exports: module.exports,
				require: (id: string) => id === 'vscode' ? api : realRequire(id),
				process, Buffer, console, setInterval, clearInterval,
			}, { filename });
			const flush = () => new Promise<void>(resolve => setImmediate(resolve));
			module.exports.activate(context);
			await flush();

			assert.strictEqual(dialogs[0].options.modal, true);
			assert.ok(dialogs[0].choices.includes('Reload Window'));
			assert.ok(dialogs[0].choices.includes('Recovery Instructions'));
			assert.match(dialogs[0].message, /time tracker/i);

			selections.push('Reload Window');
			commands.get('time-tracker.openTimesheet')!();
			await flush();
			assert.deepStrictEqual(executed, ['workbench.action.reloadWindow']);

			selections.push('Recovery Instructions', 'Copy Lock Path');
			commands.get('time-tracker.openTimesheet')!();
			await flush();
			assert.strictEqual(dialogs.at(-1)?.options.modal, true);
			assert.match(dialogs.at(-1)?.options.detail ?? '', /close all VS Code windows/i);
			assert.match(dialogs.at(-1)?.options.detail ?? '', /extension hosts/i);
			assert.deepStrictEqual(copied, [path.join(directory, 'time-tracker.owner.lock')]);
			assert.ok(readFileSync(copied[0], 'utf8'));

			clipboardFails = true;
			selections.push('Recovery Instructions', 'Copy Lock Path');
			commands.get('time-tracker.openTimesheet')!();
			await flush();
			assert.match(dialogs.at(-1)?.message ?? '', /Could not complete storage recovery: .*Clipboard unavailable/);
			assert.ok(readFileSync(copied[0], 'utf8'));
		} finally {
			release();
			rmSync(directory, { recursive: true, force: true });
		}
	});
});
