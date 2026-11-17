// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { mkdir, mkdtemp, open, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import * as path from 'node:path';
import { getWebviewHtml } from './webview';
import {
	customPeriodEnd, formatDuration, isValidDate, validateEntry, validateHoliday,
	type PublicHoliday, type StoredTimeEntry, type TimeEntry, type TimeEntriesByDate,
} from './timeData';
import { renderReportPdf } from './pdfReport';
import { FileTimeTracker, summarizeFileTime } from './fileTimeTracker';
import { FloatingTimer } from './floatingTimer';
import { randomBytes } from 'node:crypto';
import { createTimeCard, renderTimeCardHtml, renderTimeCardPdf, type TimeCard } from './timeCard';
import { acquireStorageOwnership } from './storageOwnership';

const STORAGE_KEY = 'time-tracker.data';
const STORAGE_FILE = 'timesheet.json';
const FILE_TIMES_STORAGE_KEY = 'time-tracker.file-times';
const FILE_ACTIVITY_STORAGE_KEY = 'time-tracker.file-activity';
const EXCLUDED_FILES_STORAGE_KEY = 'excludedFiles';
const DEFAULT_PERIOD_START = '2026-10-21';

interface TrackerState {
	entries: TimeEntriesByDate;
	periodStart: string;
	hourlyRate: number | null;
	holidays: PublicHoliday[];
}

let fileTimeTracker: FileTimeTracker | undefined;
let releaseStorageOwnership: (() => void) | undefined;
let pendingTimesheetWrites = Promise.resolve();
let pendingTimesheetLoad: Promise<TrackerState> | undefined;
let stopTracking: (() => void) | undefined;

function newEntryId(): string {
	return randomBytes(16).toString('hex');
}

function isEntryId(value: unknown): value is string {
	return typeof value === 'string' && /^[a-f0-9]{32}$/.test(value);
}

function parseState(stored: Partial<TrackerState> = {}): TrackerState {
	if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
		throw new Error('The saved timesheet is invalid. Restore or repair the JSON file before continuing.');
	}
	const entries: TimeEntriesByDate = {};
	const ids = new Set<string>();
	if (stored.entries !== undefined) {
		if (!stored.entries || typeof stored.entries !== 'object' || Array.isArray(stored.entries)) {
			throw new Error('The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.');
		}
		for (const [date, candidate] of Object.entries(stored.entries)) {
			const legacyEntry = !Array.isArray(candidate);
			const rows = legacyEntry ? [candidate] : candidate;
			entries[date] = rows.map((row): StoredTimeEntry => {
				if (!row || typeof row !== 'object' || typeof row.date !== 'string' || typeof row.task !== 'string' ||
					typeof row.timeIn !== 'string' || typeof row.timeOut !== 'string' ||
					row.date !== date || validateEntry(row)) {
					throw new Error(`The saved entry for ${date} is invalid. Restore or repair the JSON file before continuing.`);
				}
				const id = row.id === undefined && legacyEntry ? newEntryId() : row.id;
				if (!isEntryId(id)) {
					throw new Error(`The saved entry for ${date} has an invalid identifier. Restore or repair the JSON file before continuing.`);
				}
				if (ids.has(id)) {
					throw new Error(`The saved entry for ${date} has a duplicate identifier. Restore or repair the JSON file before continuing.`);
				}
				ids.add(id);
				return { ...row, id };
			});
			if (!entries[date].length) {
				delete entries[date];
			}
		}
	}
	const periodStart = stored.periodStart === undefined ? DEFAULT_PERIOD_START : stored.periodStart;
	if (typeof periodStart !== 'string' || !isValidDate(periodStart)) {
		throw new Error('The saved period start is invalid. Restore or repair the JSON file before continuing.');
	}
	try {
		customPeriodEnd(periodStart);
	} catch {
		throw new Error('The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.');
	}
	const hourlyRate = stored.hourlyRate === undefined ? null : stored.hourlyRate;
	if (hourlyRate !== null && (typeof hourlyRate !== 'number' || !Number.isFinite(hourlyRate) || hourlyRate < 0)) {
		throw new Error('The saved hourly rate is invalid. Restore or repair the JSON file before continuing.');
	}
	const holidays = stored.holidays === undefined ? [] : stored.holidays;
	if (!Array.isArray(holidays) || holidays.some(holiday =>
		!holiday || typeof holiday !== 'object' || validateHoliday(holiday) || holiday.name !== holiday.name.trim()) ||
		new Set(holidays.map(holiday => JSON.stringify([holiday.date, holiday.name]))).size !== holidays.length) {
		throw new Error('The saved public holidays are invalid. Restore or repair the JSON file before continuing.');
	}
	return { entries, periodStart, hourlyRate, holidays };
}

function stateFile(context: vscode.ExtensionContext): string {
	return path.join(context.globalStorageUri.fsPath, STORAGE_FILE);
}

async function writeState(context: vscode.ExtensionContext, state: TrackerState): Promise<void> {
	const file = stateFile(context);
	await mkdir(path.dirname(file), { recursive: true });
	const temporaryFile = `${file}.${process.pid}.${randomBytes(8).toString('hex')}.tmp`;
	const handle = await open(temporaryFile, 'wx');
	try {
		await handle.writeFile(JSON.stringify(state, null, 2), 'utf8');
		await handle.close();
		await rename(temporaryFile, file);
	} catch (error) {
		try {
			await handle.close();
			await unlink(temporaryFile);
		} catch (cleanupError) {
			const reason = error instanceof Error ? error.message : String(error);
			const detail = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
			throw new AggregateError([error, cleanupError], `Could not save the timesheet: ${reason}. Temporary file cleanup failed: ${detail}`);
		}
		throw error;
	}
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

async function saveDocument(filename: string, format: 'html' | 'pdf', render: () => Promise<Buffer> | Buffer): Promise<string | undefined> {
	const baseDirectory = vscode.workspace.workspaceFolders?.[0]?.uri ?? vscode.Uri.file(homedir());
	const destination = await vscode.window.showSaveDialog({
		defaultUri: vscode.Uri.joinPath(baseDirectory, filename),
		filters: { [format === 'html' ? 'HTML documents' : 'PDF documents']: [format] },
		saveLabel: `Save ${format.toUpperCase()}`,
	});
	if (!destination) {
		return undefined;
	}
	const filePath = path.extname(destination.fsPath).toLowerCase() === `.${format}`
		? destination.fsPath : `${destination.fsPath}.${format}`;
	await writeFile(filePath, await render());
	return filePath;
}

export function activate(context: vscode.ExtensionContext): void {
	let excludedFiles: string[] = [];
	const showUnavailable = (reason: string, recoveryAvailable = false): void => {
		const unavailable = (): void => {
			void (async () => {
				try {
					const choice = await vscode.window.showErrorMessage(reason, ...(recoveryAvailable ? ['Export raw data'] : []));
					if (choice !== 'Export raw data') {
						return;
					}
					const destination = await vscode.window.showSaveDialog({
						filters: { 'JSON documents': ['json'] },
						saveLabel: 'Export raw data containing file paths',
					});
					if (!destination) {
						return;
					}
					const data = {
						fileActivity: context.globalState.get<unknown>(FILE_ACTIVITY_STORAGE_KEY),
						fileTimes: context.globalState.get<unknown>(FILE_TIMES_STORAGE_KEY),
						excludedFiles: context.globalState.get<unknown>(EXCLUDED_FILES_STORAGE_KEY),
						legacyFileTimers: context.globalState.get<unknown>('fileTimers'),
					};
					await writeFile(destination.fsPath, JSON.stringify(data, null, 2), 'utf8');
					void vscode.window.showInformationMessage(`Raw file activity data saved to ${destination.fsPath}.`);
				} catch (error) {
					const detail = error instanceof Error ? error.message : String(error);
					void vscode.window.showErrorMessage(`Could not export raw file activity data: ${detail}`);
				}
			})();
		};
		const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		status.text = '$(debug-pause) Time Tracker unavailable';
		status.tooltip = reason;
		status.command = 'time-tracker.openTimesheet';
		status.show();
		context.subscriptions.push(status, ...[
			'time-tracker.openTimesheet',
			'time-tracker.openTimeCard',
			'time-tracker.showFloatingTimer',
			'time-tracker.hideFloatingTimer',
			'time-tracker.toggleTracking',
			'time-tracker.manageExclusions',
			'time-tracker.resetFileTimes',
		].map(command => vscode.commands.registerCommand(command, unavailable)));
		unavailable();
	};
	try {
		releaseStorageOwnership = acquireStorageOwnership(context.globalStorageUri.fsPath);
		const savedActivity = context.globalState.get<unknown>(FILE_ACTIVITY_STORAGE_KEY);
		let fileTimes: unknown = context.globalState.get<unknown>(FILE_TIMES_STORAGE_KEY);
		let savedExclusions: unknown = context.globalState.get<unknown>(EXCLUDED_FILES_STORAGE_KEY);
		if (savedActivity !== undefined) {
			if (!savedActivity || typeof savedActivity !== 'object' || Array.isArray(savedActivity) ||
				!('version' in savedActivity) || savedActivity.version !== 1 ||
				!('fileTimes' in savedActivity) || savedActivity.fileTimes === undefined ||
				!('excludedFiles' in savedActivity) || savedActivity.excludedFiles === undefined) {
				throw new Error('Invalid stored file activity data. Restore a backup before using Time Tracker.');
			}
			fileTimes = savedActivity.fileTimes;
			savedExclusions = savedActivity.excludedFiles;
		}
		if (savedExclusions !== undefined) {
			if (!Array.isArray(savedExclusions) ||
				savedExclusions.some(file => typeof file !== 'string' || !file)) {
				throw new Error('Invalid stored file exclusions. Restore a backup before using Time Tracker.');
			}
			excludedFiles = [...new Set(savedExclusions)];
		}
		fileTimeTracker = new FileTimeTracker(
			fileTimes,
			async (totals, exclusions) => context.globalState.update(FILE_ACTIVITY_STORAGE_KEY, {
				version: 1, fileTimes: totals, excludedFiles: [...exclusions],
			}),
			undefined,
			excludedFiles,
		);
		if (context.globalState.get<unknown>('fileTimers') !== undefined) {
			void vscode.window.showWarningMessage(
				'Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.',
			);
		}
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		const recoveryAvailable = !!releaseStorageOwnership;
		if (releaseStorageOwnership) {
			try {
				releaseStorageOwnership();
			} catch (releaseError) {
				const detail = releaseError instanceof Error ? releaseError.message : String(releaseError);
				showUnavailable(`${reason} Could not release storage ownership: ${detail}`);
				return;
			} finally {
				releaseStorageOwnership = undefined;
			}
		}
		showUnavailable(reason, recoveryAvailable);
		return;
	}
	const fileTimePanels = new Set<vscode.WebviewPanel>();
	let stopping = false;
	const tracker = fileTimeTracker;
	const currentSnapshot = () => {
		const snapshot = tracker.snapshot();
		return { ...snapshot, excluded: !!snapshot.activeFile && tracker.isExcluded(snapshot.activeFile) };
	};
	let timesheetState: TrackerState | undefined;
	let pendingState: Promise<TrackerState> | undefined;
	let timesheetWrites = Promise.resolve();
	const getState = async (): Promise<TrackerState> => {
		if (timesheetState) {
			return timesheetState;
		}
		if (!pendingState) {
			pendingState = readState(context);
			pendingTimesheetLoad = pendingState;
		}
		try {
			timesheetState = await pendingState;
			return timesheetState;
		} finally {
			pendingState = undefined;
			pendingTimesheetLoad = undefined;
		}
	};
	const changeState = (change: (state: TrackerState) => TrackerState): Promise<void> => {
		if (stopping) {
			return Promise.reject(new Error('Time Tracker is shutting down; reopen it before editing.'));
		}
		const write = timesheetWrites.then(async () => {
			const next = change(await getState());
			await writeState(context, next);
			timesheetState = next;
			for (const panel of fileTimePanels) {
				await panel.webview.postMessage({ type: 'saved', data: { ...next, ...currentSnapshot() } });
			}
		});
		timesheetWrites = write.then(() => undefined, () => undefined);
		pendingTimesheetWrites = timesheetWrites;
		return write;
	};
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'time-tracker.openTimesheet';
	statusBarItem.text = '$(watch) 0h 00m | 0h 00m';
	statusBarItem.tooltip = 'Total tracked: 0h 00m\nCurrent file: 0h 00m\nClick to open Time Tracker';
	statusBarItem.show();
	const showFileTimePersistenceError = (error: unknown): void => {
		const reason = error instanceof Error ? error.message : String(error);
		void vscode.window.showErrorMessage(`Could not save automatic file time data: ${reason}`);
	};
	const postFileTimes = (): void => {
		const snapshot = currentSnapshot();
		const totals = summarizeFileTime(snapshot);
		const totalTime = formatDuration(Math.floor(totals.total / 60_000));
		const currentTime = formatDuration(Math.floor(totals.current / 60_000));
		const currentFileLabel = snapshot.activeFile
			? `Current file (${path.basename(snapshot.activeFile)})`
			: 'Current file';
		statusBarItem.text = `${snapshot.paused ? '$(debug-pause)' : '$(watch)'} ${totalTime} | ${currentTime}` +
			(snapshot.excluded ? ' Excluded' : !snapshot.activeFile ? ' Waiting' : '');
		statusBarItem.tooltip = `Total tracked: ${totalTime}\n${currentFileLabel}: ${currentTime}\n${snapshot.paused ? 'Automatic tracking paused\n' : snapshot.excluded ? 'Current file excluded\n' : ''}Click to open Time Tracker`;
		floatingTimer.update();
		for (const panel of fileTimePanels) {
			void panel.webview.postMessage({ type: 'fileTimes', data: snapshot });
		}
	};
	const updateTracking = async (operation: Promise<void>): Promise<void> => {
		postFileTimes();
		try {
			await operation;
		} catch (error) {
			showFileTimePersistenceError(error);
		}
		postFileTimes();
	};
	const pauseOrResume = (): Promise<void> => stopping ? Promise.resolve() :
		updateTracking(tracker.setPaused(!tracker.snapshot().paused));
	const floatingTimer = new FloatingTimer(currentSnapshot, pauseOrResume);
	const showFloatingTimer = vscode.commands.registerCommand('time-tracker.showFloatingTimer', () => floatingTimer.show());
	const hideFloatingTimer = vscode.commands.registerCommand('time-tracker.hideFloatingTimer', () => floatingTimer.hide());
	const toggleTracking = vscode.commands.registerCommand('time-tracker.toggleTracking', pauseOrResume);
	const manageExclusions = vscode.commands.registerCommand('time-tracker.manageExclusions', async () => {
		if (stopping) {
			void vscode.window.showErrorMessage('Time Tracker is shutting down.');
			return;
		}
		const editor = vscode.window.activeTextEditor;
		const active = editor?.document.uri.scheme === 'file' ? editor.document.uri.fsPath : undefined;
		const files = active ? [active, ...excludedFiles.filter(file => file !== active)] : excludedFiles;
		if (!files.length) {
			void vscode.window.showInformationMessage('No local file is active and no files are excluded.');
			return;
		}
		const selection = await vscode.window.showQuickPick(files.map(file => ({
			label: `${tracker.isExcluded(file) ? 'Include' : 'Exclude'} ${path.basename(file)}`,
			description: file,
			file,
		})), { placeHolder: 'Choose a local file to exclude or include' });
		if (!selection) {
			return;
		}
		const next = new Set(excludedFiles);
		if (next.has(selection.file)) {
			next.delete(selection.file);
		} else {
			next.add(selection.file);
		}
		excludedFiles = [...next];
		const operation = tracker.setExcludedFiles(excludedFiles);
		postFileTimes();
		try {
			await operation;
			void vscode.window.showInformationMessage(
				`${path.basename(selection.file)} is ${tracker.isExcluded(selection.file) ? 'excluded' : 'included'}.`,
			);
		} catch (error) {
			showFileTimePersistenceError(error);
		}
		postFileTimes();
	});
	const resetFileTimes = vscode.commands.registerCommand('time-tracker.resetFileTimes', async () => {
		if (stopping) {
			void vscode.window.showErrorMessage('Time Tracker is shutting down.');
			return;
		}
		const answer = await vscode.window.showWarningMessage(
			'Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.',
			{ modal: true },
			'Reset',
		);
		if (answer !== 'Reset') {
			return;
		}
		try {
			await tracker.reset();
			postFileTimes();
			void vscode.window.showInformationMessage('Automatic file activity was reset.');
		} catch (error) {
			showFileTimePersistenceError(error);
			postFileTimes();
		}
	});
	const trackActiveFile = (): void => {
		if (stopping) {
			return;
		}
		const editor = vscode.window.activeTextEditor;
		const filePath = vscode.window.state.focused && editor?.document.uri.scheme === 'file'
			? editor.document.uri.fsPath
			: undefined;
		void updateTracking(tracker.setActiveFile(filePath));
	};
	trackActiveFile();

	const activeEditorListener = vscode.window.onDidChangeActiveTextEditor(trackActiveFile);
	const windowStateListener = vscode.window.onDidChangeWindowState(trackActiveFile);
	const fileTimeInterval = setInterval(() => {
		if (!stopping) {
			void updateTracking(tracker.checkpoint());
		}
	}, 60_000);
	const displayInterval = setInterval(postFileTimes, 1000);
	stopTracking = () => {
		stopping = true;
		clearInterval(fileTimeInterval);
		clearInterval(displayInterval);
	};

	const openTimeCard = vscode.commands.registerCommand('time-tracker.openTimeCard', () => {
		let card: TimeCard;
		try {
			card = createTimeCard(fileTimeTracker?.snapshot().fileTimes ?? {});
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			void vscode.window.showErrorMessage(`Could not generate the time card: ${reason}`);
			return;
		}
		const panel = vscode.window.createWebviewPanel(
			'timeTrackerCard',
			'Time Card Preview',
			vscode.ViewColumn.One,
			{ enableScripts: true, localResourceRoots: [] },
		);
		const renderCard = (): void => {
			panel.webview.html = renderTimeCardHtml(card, { nonce: randomBytes(16).toString('hex') });
		};
		renderCard();
		const listener = panel.webview.onDidReceiveMessage(async (message: { type?: string; format?: string }) => {
			try {
				if (message.type === 'refresh') {
					card = createTimeCard(fileTimeTracker?.snapshot().fileTimes ?? {});
					renderCard();
				} else if (message.type === 'export') {
					if (message.format !== 'html' && message.format !== 'pdf') {
						throw new Error('Choose HTML or PDF for the time card export.');
					}
					const format = message.format;
					const snapshot = card;
					const filename = `time-card-${snapshot.generatedAt.slice(0, 10)}.${format}`;
					const filePath = await saveDocument(filename, format, () => format === 'html'
						? Buffer.from(renderTimeCardHtml(snapshot), 'utf8') : renderTimeCardPdf(snapshot));
					if (filePath) {
						void vscode.window.showInformationMessage(`Time card saved to ${filePath}`);
					}
				}
			} catch (error) {
				const reason = error instanceof Error ? error.message : String(error);
				void vscode.window.showErrorMessage(`Could not generate or export the time card: ${reason}`);
			}
		});
		panel.onDidDispose(() => listener.dispose());
	});

	const disposable = vscode.commands.registerCommand('time-tracker.openTimesheet', async () => {
		if (stopping) {
			void vscode.window.showErrorMessage('Time Tracker is shutting down; reopen it before editing.');
			return;
		}
		const panel = vscode.window.createWebviewPanel(
			'timeTracker',
			'Time Tracker',
			vscode.ViewColumn.One,
			{ enableScripts: true, retainContextWhenHidden: true },
		);
		try {
			await getState();
		} catch (error) {
			panel.dispose();
			const reason = error instanceof Error ? error.message : String(error);
			void vscode.window.showErrorMessage(`Could not load ${stateFile(context)}: ${reason}`);
			return;
		}
		fileTimePanels.add(panel);
		panel.onDidDispose(() => fileTimePanels.delete(panel));
		panel.webview.html = getWebviewHtml(panel.webview);

		const postState = async (): Promise<void> => {
			await panel.webview.postMessage({ type: 'state', data: { ...await getState(), ...currentSnapshot() } });
		};
		function assertUnchanged(
			current: StoredTimeEntry | undefined,
			expected: StoredTimeEntry | null | undefined,
		): asserts current is StoredTimeEntry {
			if (!current || !expected || current.id !== expected.id || current.date !== expected.date ||
				current.task !== expected.task || current.timeIn !== expected.timeIn || current.timeOut !== expected.timeOut) {
				throw new Error('This entry changed in another view. Reload it before editing again.');
			}
		}

		panel.webview.onDidReceiveMessage(async (message: {
			type: string; entry?: TimeEntry; id?: string; expected?: StoredTimeEntry | null; date?: string;
			requestId?: string;
			value?: string; expectedValue?: string | number | null; view?: 'entries' | 'report' | 'holidays';
			holiday?: PublicHoliday;
		}) => {
			if (!message || typeof message !== 'object' || typeof message.type !== 'string') {
				void vscode.window.showErrorMessage('Invalid Time Tracker message.');
				return;
			}
			try {
			switch (message.type) {
				case 'showFloatingTimer':
					floatingTimer.show();
					break;
				case 'openTimeCard':
					await vscode.commands.executeCommand('time-tracker.openTimeCard');
					break;
				case 'ready':
					await postState();
					break;
				case 'addHoliday':
				case 'deleteHoliday': {
					const holiday = message.holiday;
					if (!holiday || typeof holiday !== 'object' || validateHoliday(holiday)) {
						throw new Error('Enter a valid holiday date and name.');
					}
					const normalized = { date: holiday.date, name: holiday.name.trim() };
					await changeState(state => {
						const exists = state.holidays.some(item => item.date === normalized.date && item.name === normalized.name);
						if (message.type === 'addHoliday' && exists) {
							throw new Error('This holiday already exists on that date.');
						}
						if (message.type === 'deleteHoliday' && !exists) {
							throw new Error('This holiday was removed in another view.');
						}
						return {
							...state,
							holidays: message.type === 'addHoliday'
								? [...state.holidays, normalized]
								: state.holidays.filter(item => item.date !== normalized.date || item.name !== normalized.name),
						};
					});
					if (message.type === 'addHoliday') {
						await panel.webview.postMessage({ type: 'holidayAdded', holiday: normalized });
					}
					break;
				}
				case 'createEntry':
				case 'saveEntry': {
					const entry = message.entry;
					if (!entry || typeof entry.date !== 'string' || typeof entry.task !== 'string' ||
						typeof entry.timeIn !== 'string' || typeof entry.timeOut !== 'string' || !isValidDate(entry.date)) {
						throw new Error('Enter a valid date, task, and time values.');
					}
					const blank = !entry.task.trim() && !entry.timeIn && !entry.timeOut;
					const validationError = blank && message.type === 'saveEntry' ? undefined : validateEntry(entry);
					if (validationError) {
						throw new Error(validationError);
					}
					if (message.type === 'createEntry') {
						if (typeof message.requestId !== 'string' || !message.requestId || message.requestId.length > 128) {
							throw new Error('The new entry request is invalid. Try again.');
						}
						const created: StoredTimeEntry = {
							...entry, id: newEntryId(), task: entry.task.trim(),
						};
						await changeState(state => ({
							...state,
							entries: { ...state.entries, [entry.date]: [...(state.entries[entry.date] ?? []), created] },
						}));
						await panel.webview.postMessage({ type: 'entryCreated', requestId: message.requestId, entry: created });
						break;
					}
					if (!isEntryId(message.id)) {
						throw new Error('Select a saved entry before editing it.');
					}
					await changeState(state => {
						const rows = state.entries[entry.date] ?? [];
						const index = rows.findIndex(row => row.id === message.id);
						const current = rows[index];
						assertUnchanged(current, message.expected);
						const entries = { ...state.entries };
						if (blank) {
							const remaining = rows.filter(row => row.id !== message.id);
							if (remaining.length) {
								entries[entry.date] = remaining;
							} else {
								delete entries[entry.date];
							}
						} else {
							const updated = [...rows];
							updated[index] = { ...entry, id: current.id, task: entry.task.trim() };
							entries[entry.date] = updated;
						}
						return { ...state, entries };
					});
					break;
				}
				case 'deleteEntry':
					if (!message.date || !isValidDate(message.date) || !isEntryId(message.id)) {
						throw new Error('Select a valid entry to delete.');
					}
					await changeState(state => {
						const date = message.date!;
						const rows = state.entries[date] ?? [];
						const current = rows.find(row => row.id === message.id);
						assertUnchanged(current, message.expected);
						const entries = { ...state.entries };
						const remaining = rows.filter(row => row.id !== message.id);
						if (remaining.length) {
							entries[date] = remaining;
						} else {
							delete entries[date];
						}
						return { ...state, entries };
					});
					break;
				case 'setPeriodStart':
					if (typeof message.value !== 'string' || !isValidDate(message.value)) {
						throw new Error('Enter a valid period start date.');
					}
					customPeriodEnd(message.value);
					await changeState(state => {
						if (state.periodStart !== message.expectedValue) {
							throw new Error('The period start changed in another view. Reload it before editing again.');
						}
						return { ...state, periodStart: message.value! };
					});
					break;
				case 'setHourlyRate': {
					if (typeof message.value !== 'string' ||
						(message.value !== '' && !/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(message.value))) {
						throw new Error('Enter a valid hourly rate of zero or more.');
					}
					const rate = message.value === '' ? null : Number(message.value);
					if (rate !== null && (!Number.isFinite(rate) || rate < 0)) {
						throw new Error('Enter a valid hourly rate of zero or more.');
					}
					await changeState(state => {
						if (state.hourlyRate !== message.expectedValue) {
							throw new Error('The hourly rate changed in another view. Reload it before editing again.');
						}
						return { ...state, hourlyRate: rate };
					});
					break;
				}
				case 'requestReportAction': {
					await timesheetWrites;
					const state = await getState();
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
						try {
							const filePath = await saveDocument(filename, 'pdf', () => renderReportPdf(state));
							if (filePath) {
								void vscode.window.showInformationMessage(`PDF saved to ${filePath}`);
							}
						} catch (error) {
							const reason = error instanceof Error ? error.message : String(error);
							void vscode.window.showErrorMessage(`Could not save the PDF: ${reason}`);
						}
					}
					break;
				}
			}
			} catch (error) {
				const reason = error instanceof Error ? error.message : String(error);
				await panel.webview.postMessage({
					type: 'error',
					operation: message.type,
					id: message.id,
					requestId: message.requestId,
					view: message.view ?? (message.type === 'setPeriodStart' || message.type === 'setHourlyRate' ? 'report' : 'entries'),
					message: reason,
				});
			}
		});
	});

	context.subscriptions.push(
		disposable,
		openTimeCard,
		showFloatingTimer,
		hideFloatingTimer,
		toggleTracking,
		manageExclusions,
		resetFileTimes,
		floatingTimer,
		statusBarItem,
		activeEditorListener,
		windowStateListener,
		{ dispose: () => clearInterval(fileTimeInterval) },
		{ dispose: () => clearInterval(displayInterval) },
	);
}

export async function deactivate(): Promise<void> {
	stopTracking?.();
	try {
		const results = await Promise.allSettled([
			fileTimeTracker?.setActiveFile(undefined),
			pendingTimesheetWrites,
			pendingTimesheetLoad,
		]);
		const failed = results.find(result => result.status === 'rejected');
		if (failed && failed.status === 'rejected') {
			throw failed.reason;
		}
	} finally {
		fileTimeTracker = undefined;
		stopTracking = undefined;
		releaseStorageOwnership?.();
		releaseStorageOwnership = undefined;
	}
}
