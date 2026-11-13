import * as assert from 'node:assert';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { runInNewContext } from 'node:vm';

suite('Report actions', () => {
	let directory: string;

	setup(async () => {
		directory = await mkdtemp(path.join(tmpdir(), 'time-tracker-test-'));
	});

	teardown(async () => {
		await rm(directory, { recursive: true, force: true });
	});

	async function openTracker(action: string | undefined, openExternal: () => Promise<boolean> = async () => true) {
		let openTimesheet: (() => Promise<void>) | undefined;
		let receiveMessage: ((message: { type: string }) => Promise<void>) | undefined;
		const opened: { fsPath: string }[] = [];
		const errors: string[] = [];
		const information: string[] = [];
		const messages: { type: string }[] = [];
		let saveDialogs = 0;
		const api = {
			commands: {
				registerCommand: (_id: string, callback: () => Promise<void>) => { openTimesheet = callback; },
			},
			ViewColumn: { One: 1 },
			Uri: {
				file: (fsPath: string) => ({ fsPath }),
				joinPath: (base: { fsPath: string }, name: string) => ({ fsPath: path.join(base.fsPath, name) }),
			},
			workspace: { workspaceFolders: undefined },
			env: {
				openExternal: async (uri: { fsPath: string }) => {
					opened.push(uri);
					return openExternal();
				},
			},
			window: {
				state: { focused: false },
				activeTextEditor: undefined,
				createWebviewPanel: () => ({
					webview: {
						cspSource: 'test',
						postMessage: async (message: { type: string }) => { messages.push(message); return true; },
						onDidReceiveMessage: (callback: typeof receiveMessage) => { receiveMessage = callback; },
					},
					onDidDispose: () => ({ dispose: () => {} }),
					dispose: () => {},
				}),
				onDidChangeActiveTextEditor: () => ({ dispose: () => {} }),
				onDidChangeWindowState: () => ({ dispose: () => {} }),
				showQuickPick: async () => action ? { value: action } : undefined,
				showSaveDialog: async () => {
					saveDialogs++;
					return { fsPath: path.join(directory, 'saved-report.pdf') };
				},
				showErrorMessage: async (message: string) => { errors.push(message); },
				showInformationMessage: async (message: string) => { information.push(message); },
			},
		};
		const context = {
			globalStorageUri: { fsPath: directory },
			globalState: { get: () => undefined, update: async () => {} },
			subscriptions: [],
		};
		const filename = path.join(__dirname, '..', 'extension.js');
		const realRequire = createRequire(filename);
		const module = { exports: {} as { activate(extensionContext: typeof context): void } };
		runInNewContext(await readFile(filename, 'utf8'), {
			module,
			exports: module.exports,
			require: (id: string) => id === 'vscode' ? api : realRequire(id),
			process, Buffer, console,
			setInterval: () => 1,
			clearInterval: () => {},
		}, { filename });
		module.exports.activate(context);
		assert.ok(openTimesheet);
		await openTimesheet();
		assert.ok(receiveMessage);
		await receiveMessage({ type: 'requestReportAction' });
		return { opened, errors, information, messages, saveDialogs, receiveMessage };
	}

	test('Print opens a generated PDF outside the webview without a Save dialog', async () => {
		const result = await openTracker('print');
		assert.strictEqual(result.opened.length, 1, 'Print must open an external printable report');
		const pdf = await readFile(result.opened[0].fsPath);
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
		const pdf = await readFile(path.join(directory, 'saved-report.pdf'));
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
});
