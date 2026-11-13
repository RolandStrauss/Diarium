// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { mkdir, mkdtemp, readFile, rename, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import * as path from 'node:path';
import { getWebviewHtml } from './webview';
import { customPeriodEnd, isValidDate, validateEntry, type TimeEntry } from './timeData';
import { renderReportPdf } from './pdfReport';
import { FileTimeTracker } from './fileTimeTracker';

const STORAGE_KEY = 'time-tracker.data';
const STORAGE_FILE = 'timesheet.json';
const FILE_TIMES_STORAGE_KEY = 'time-tracker.file-times';
const DEFAULT_PERIOD_START = '2026-10-21';

interface TrackerState {
	entries: Record<string, TimeEntry>;
	periodStart: string;
	hourlyRate: number | null;
}

let fileTimeTracker: FileTimeTracker | undefined;

function parseState(stored: Partial<TrackerState> = {}): TrackerState {
	const entries: Record<string, TimeEntry> = {};
	if (stored.entries && typeof stored.entries === 'object') {
		for (const [date, candidate] of Object.entries(stored.entries)) {
			if (!candidate || typeof candidate.date !== 'string' || typeof candidate.task !== 'string' ||
				typeof candidate.timeIn !== 'string' || typeof candidate.timeOut !== 'string' ||
				candidate.date !== date || validateEntry(candidate)) {
				continue;
			}
			entries[date] = candidate;
		}
	}
	const periodStart = typeof stored.periodStart === 'string' && isValidDate(stored.periodStart)
		? stored.periodStart
		: DEFAULT_PERIOD_START;
	const hourlyRate = typeof stored.hourlyRate === 'number' && Number.isFinite(stored.hourlyRate) && stored.hourlyRate >= 0
		? stored.hourlyRate
		: null;
	return { entries, periodStart, hourlyRate };
}

function stateFile(context: vscode.ExtensionContext): string {
	return path.join(context.globalStorageUri.fsPath, STORAGE_FILE);
}

async function writeState(context: vscode.ExtensionContext, state: TrackerState): Promise<void> {
	const file = stateFile(context);
	await mkdir(path.dirname(file), { recursive: true });
	const temporaryFile = `${file}.${process.pid}.${Date.now()}.tmp`;
	await writeFile(temporaryFile, JSON.stringify(state, null, 2), 'utf8');
	await rename(temporaryFile, file);
}

async function readState(context: vscode.ExtensionContext): Promise<TrackerState> {
	try {
		const contents = await readFile(stateFile(context), 'utf8');
		return parseState(JSON.parse(contents) as Partial<TrackerState>);
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
			throw error;
		}
	}

	const migratedState = parseState(context.globalState.get<Partial<TrackerState>>(STORAGE_KEY));
	await writeState(context, migratedState);
	return migratedState;
}

export function activate(context: vscode.ExtensionContext): void {
	fileTimeTracker = new FileTimeTracker(
		context.globalState.get<unknown>(FILE_TIMES_STORAGE_KEY),
		async fileTimes => context.globalState.update(FILE_TIMES_STORAGE_KEY, fileTimes),
	);
	const fileTimePanels = new Set<vscode.WebviewPanel>();
	const showFileTimePersistenceError = (error: unknown): void => {
		const reason = error instanceof Error ? error.message : String(error);
		void vscode.window.showErrorMessage(`Could not save automatic file time data: ${reason}`);
	};
	const postFileTimes = (): void => {
		const snapshot = fileTimeTracker?.snapshot();
		if (!snapshot) {
			return;
		}
		for (const panel of fileTimePanels) {
			void panel.webview.postMessage({ type: 'fileTimes', data: snapshot });
		}
	};
	const trackActiveFile = (): void => {
		const editor = vscode.window.activeTextEditor;
		const filePath = vscode.window.state.focused && editor?.document.uri.scheme === 'file'
			? editor.document.uri.fsPath
			: undefined;
		void fileTimeTracker?.setActiveFile(filePath).then(postFileTimes, error => {
			showFileTimePersistenceError(error);
			postFileTimes();
		});
	};
	trackActiveFile();

	const activeEditorListener = vscode.window.onDidChangeActiveTextEditor(trackActiveFile);
	const windowStateListener = vscode.window.onDidChangeWindowState(trackActiveFile);
	const fileTimeInterval = setInterval(() => {
		void fileTimeTracker?.checkpoint().then(postFileTimes, error => {
			showFileTimePersistenceError(error);
			postFileTimes();
		});
	}, 60_000);

	const disposable = vscode.commands.registerCommand('time-tracker.openTimesheet', async () => {
		const panel = vscode.window.createWebviewPanel(
			'timeTracker',
			'Time Tracker',
			vscode.ViewColumn.One,
			{ enableScripts: true, retainContextWhenHidden: true },
		);
		let state: TrackerState;
		try {
			state = await readState(context);
		} catch (error) {
			panel.dispose();
			const reason = error instanceof Error ? error.message : String(error);
			void vscode.window.showErrorMessage(`Could not load the Time Tracker JSON data: ${reason}`);
			return;
		}
		let writeQueue = Promise.resolve();
		const persistState = (): Promise<void> => {
			writeQueue = writeQueue.then(() => writeState(context, state));
			return writeQueue;
		};
		fileTimePanels.add(panel);
		panel.onDidDispose(() => fileTimePanels.delete(panel));
		panel.webview.html = getWebviewHtml(panel.webview);

		const postState = (type: 'saved' | 'state'): void => {
			void panel.webview.postMessage({ type, data: { ...state, ...fileTimeTracker?.snapshot() } });
		};
		const saveEntry = async (entry: TimeEntry, create: boolean, view: 'entries' | 'report'): Promise<void> => {
			if (create && state.entries[entry.date]) {
				await panel.webview.postMessage({
					type: 'error',
					view,
					message: 'There is already an entry for this date. Time Tracker allows one entry per date; edit the existing row instead.',
				});
				return;
			}
			const error = validateEntry(entry);
			if (error) {
				await panel.webview.postMessage({ type: 'error', view, message: error });
				return;
			}
			state.entries[entry.date] = {
				date: entry.date,
				task: entry.task.trim(),
				timeIn: entry.timeIn,
				timeOut: entry.timeOut,
			};
			await persistState();
			postState('saved');
		};

		panel.webview.onDidReceiveMessage(async (message: { type: string; entry?: TimeEntry; date?: string; value?: string; view?: 'entries' | 'report' }) => {
			switch (message.type) {
				case 'ready':
					postState('state');
					break;
				case 'createEntry':
					if (message.entry) {
						await saveEntry(message.entry, true, 'entries');
					}
					break;
				case 'saveEntry':
					if (message.entry) {
						if (!message.entry.task.trim() && !message.entry.timeIn && !message.entry.timeOut) {
							delete state.entries[message.entry.date];
							await persistState();
							postState('saved');
						} else {
							await saveEntry(message.entry, false, message.view ?? 'entries');
						}
					}
					break;
				case 'deleteEntry':
					if (message.date) {
						delete state.entries[message.date];
						await persistState();
						postState('saved');
					}
					break;
				case 'setPeriodStart':
					if (!message.value || !isValidDate(message.value)) {
						await panel.webview.postMessage({ type: 'error', view: 'report', message: 'Enter a valid period start date.' });
						break;
					}
					state.periodStart = message.value;
					await persistState();
					postState('saved');
					break;
				case 'setHourlyRate':
					if (message.value === '') {
						state.hourlyRate = null;
					} else {
						const rate = Number(message.value);
						if (!Number.isFinite(rate) || rate < 0) {
							await panel.webview.postMessage({ type: 'error', view: 'report', message: 'Enter a valid hourly rate of zero or more.' });
							break;
						}
						state.hourlyRate = rate;
					}
					await persistState();
					postState('saved');
					break;
				case 'requestReportAction': {
					const action = await vscode.window.showQuickPick([
						{ label: 'Print report', detail: 'Open a PDF in your default viewer, then choose Print', value: 'print' },
						{ label: 'Save as PDF', detail: 'Choose a location and save a PDF file', value: 'pdf' },
					], { placeHolder: 'Choose how to export this report' });
					if (action?.value === 'print') {
						try {
							const pdf = await renderReportPdf(state);
							const directory = path.join(context.globalStorageUri.fsPath, 'print-reports');
							await mkdir(directory, { recursive: true });
							const printDirectory = await mkdtemp(path.join(directory, 'report-'));
							const filename = `timesheet-${state.periodStart}-to-${customPeriodEnd(state.periodStart)}.pdf`;
							const filePath = path.join(printDirectory, filename);
							await writeFile(filePath, pdf);
							if (!await vscode.env.openExternal(vscode.Uri.file(filePath))) {
								throw new Error('No PDF viewer could be opened. Use Save as PDF and open the file manually.');
							}
							void vscode.window.showInformationMessage('Report opened in your default PDF viewer. Use its Print command to print.');
						} catch (error) {
							const reason = error instanceof Error ? error.message : String(error);
							void vscode.window.showErrorMessage(`Could not open the report for printing: ${reason}`);
						}
						break;
					}
					if (action?.value === 'pdf') {
						const filename = `timesheet-${state.periodStart}-to-${customPeriodEnd(state.periodStart)}.pdf`;
						const baseDirectory = vscode.workspace.workspaceFolders?.[0]?.uri ?? vscode.Uri.file(homedir());
						const destination = await vscode.window.showSaveDialog({
							defaultUri: vscode.Uri.joinPath(baseDirectory, filename),
							filters: { 'PDF documents': ['pdf'] },
							saveLabel: 'Save PDF',
						});
						if (!destination) {
							break;
						}
						try {
							const pdf = await renderReportPdf(state);
							const filePath = path.extname(destination.fsPath).toLowerCase() === '.pdf'
								? destination.fsPath
								: `${destination.fsPath}.pdf`;
							await writeFile(filePath, pdf);
							void vscode.window.showInformationMessage(`PDF saved to ${filePath}`);
						} catch (error) {
							const reason = error instanceof Error ? error.message : String(error);
							void vscode.window.showErrorMessage(`Could not save the PDF: ${reason}`);
						}
					}
					break;
				}
			}
		});
	});

	context.subscriptions.push(
		disposable,
		activeEditorListener,
		windowStateListener,
		{ dispose: () => clearInterval(fileTimeInterval) },
	);
}

export async function deactivate(): Promise<void> {
	await fileTimeTracker?.setActiveFile(undefined);
	fileTimeTracker = undefined;
}
