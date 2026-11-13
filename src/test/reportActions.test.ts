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

	async function openTracker(action: string | undefined, openExternal: () => Promise<boolean> = async () => true,
		options: { card?: boolean; cancelSave?: boolean; failSave?: boolean } = {}) {
		const commands = new Map<string, () => Promise<void>>();
		let receiveMessage: ((message: { type: string; format?: string }) => Promise<void>) | undefined;
		let html = '';
		const opened: { fsPath: string }[] = [];
		const errors: string[] = [];
		const information: string[] = [];
		const messages: { type: string }[] = [];
		let saveDialogs = 0;
		const statusBarItems: { text: string; tooltip: string; command: string; show: () => void; dispose: () => void }[] = [];
		const api = {
			commands: {
				registerCommand: (id: string, callback: () => Promise<void>) => { commands.set(id, callback); },
				executeCommand: async (id: string) => commands.get(id)?.(),
			},
			ViewColumn: { One: 1 },
			StatusBarAlignment: { Right: 2 },
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
				state: { focused: true },
				activeTextEditor: { document: { uri: { scheme: 'file', fsPath: 'C:\\work\\first.ts' } } },
				createStatusBarItem: () => {
					const item = { text: '', tooltip: '', command: '', show: () => {}, dispose: () => {} };
					statusBarItems.push(item);
					return item;
				},
				createWebviewPanel: () => {
					return {
						webview: {
							set html(value: string) { html = value; },
							cspSource: 'test',
							postMessage: async (message: { type: string }) => { messages.push(message); return true; },
							onDidReceiveMessage: (callback: typeof receiveMessage) => { receiveMessage = callback; },
						},
						onDidDispose: () => ({ dispose: () => {} }),
						dispose: () => {},
					};
				},
				onDidChangeActiveTextEditor: () => ({ dispose: () => {} }),
				onDidChangeWindowState: () => ({ dispose: () => {} }),
				showQuickPick: async () => action ? { value: action } : undefined,
				showSaveDialog: async () => {
					saveDialogs++;
					return options.cancelSave ? undefined : { fsPath: path.join(directory,
						options.failSave ? 'missing\\saved-report.pdf' : 'saved-report.pdf') };
				},
				showErrorMessage: async (message: string) => { errors.push(message); },
				showInformationMessage: async (message: string) => { information.push(message); },
			},
		};
		const context = {
			globalStorageUri: { fsPath: directory },
			globalState: {
				get: (key: string) => key === 'time-tracker.file-times'
					? { 'C:\\work\\first.ts': 3_600_000, 'C:\\work\\second.ts': 1_800_000 }
					: undefined,
				update: async () => {},
			},
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
		const openCommand = commands.get(options.card ? 'time-tracker.openTimeCard' : 'time-tracker.openTimesheet');
		assert.ok(openCommand);
		await openCommand();
		assert.ok(receiveMessage);
		await receiveMessage({ type: 'requestReportAction' });
		return { opened, errors, information, messages, saveDialogs, receiveMessage, statusBarItems,
			getHtml: () => html, getReceiver: () => receiveMessage! };
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

	test('opens the card from File activity and exports standalone HTML from the preview', async () => {
		const result = await openTracker(undefined);
		await result.receiveMessage({ type: 'openTimeCard' });
		assert.match(result.getHtml(), /Time well spent/);
		assert.match(result.getHtml(), /1h 30m/);
		await result.getReceiver()({ type: 'export', format: 'html' });
		const html = await readFile(path.join(directory, 'saved-report.pdf.html'), 'utf8');
		assert.match(html, /first\.ts/);
		assert.match(html, /second\.ts/);
		assert.ok(!html.includes('C:\\work'));
		assert.ok(!html.includes('<script'));
		assert.deepStrictEqual(result.errors, []);
	});

	test('exports card PDF without changing the existing report action', async () => {
		const result = await openTracker(undefined, undefined, { card: true });
		await result.receiveMessage({ type: 'export', format: 'pdf' });
		const pdf = await readFile(path.join(directory, 'saved-report.pdf'));
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
		await assert.rejects(readFile(path.join(directory, 'saved-report.pdf.html')), { code: 'ENOENT' });
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
