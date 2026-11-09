// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import * as path from 'node:path';
import { getWebviewHtml } from './webview';
import { customPeriodEnd, isValidDate, validateEntry, type TimeEntry } from './timeData';
import { renderReportPdf } from './pdfReport';

const STORAGE_KEY = 'time-tracker.data';
const DEFAULT_PERIOD_START = '2026-10-21';

interface TrackerState {
	entries: Record<string, TimeEntry>;
	periodStart: string;
	hourlyRate: number | null;
}

function readState(context: vscode.ExtensionContext): TrackerState {
	const stored = context.globalState.get<Partial<TrackerState>>(STORAGE_KEY, {});
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

export function activate(context: vscode.ExtensionContext): void {
	const disposable = vscode.commands.registerCommand('time-tracker.openTimesheet', () => {
		const panel = vscode.window.createWebviewPanel(
			'timeTracker',
			'Time Tracker',
			vscode.ViewColumn.One,
			{ enableScripts: true, retainContextWhenHidden: true },
		);
		const state = readState(context);
		panel.webview.html = getWebviewHtml(panel.webview);

		const postState = (): void => {
			void panel.webview.postMessage({ type: 'saved', data: state });
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
			await context.globalState.update(STORAGE_KEY, state);
			postState();
		};

		panel.webview.onDidReceiveMessage(async (message: { type: string; entry?: TimeEntry; date?: string; value?: string; view?: 'entries' | 'report' }) => {
			switch (message.type) {
				case 'ready':
					await panel.webview.postMessage({ type: 'state', data: state });
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
							await context.globalState.update(STORAGE_KEY, state);
							postState();
						} else {
							await saveEntry(message.entry, false, message.view ?? 'entries');
						}
					}
					break;
				case 'deleteEntry':
					if (message.date) {
						delete state.entries[message.date];
						await context.globalState.update(STORAGE_KEY, state);
						postState();
					}
					break;
				case 'setPeriodStart':
					if (!message.value || !isValidDate(message.value)) {
						await panel.webview.postMessage({ type: 'error', view: 'report', message: 'Enter a valid period start date.' });
						break;
					}
					state.periodStart = message.value;
					await context.globalState.update(STORAGE_KEY, state);
					postState();
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
					await context.globalState.update(STORAGE_KEY, state);
					postState();
					break;
				case 'requestReportAction': {
					const action = await vscode.window.showQuickPick([
						{ label: 'Print report', detail: 'Open the system print dialog', value: 'print' },
						{ label: 'Save as PDF', detail: 'Choose a location and save a PDF file', value: 'pdf' },
					], { placeHolder: 'Choose how to export this report' });
					if (action?.value === 'print') {
						await panel.webview.postMessage({ type: 'printReport' });
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

	context.subscriptions.push(disposable);
}

export function deactivate(): void {}
