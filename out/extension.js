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
exports.createTimesheetTransfer = createTimesheetTransfer;
exports.parseTimesheetTransfer = parseTimesheetTransfer;
exports.mergeTimesheetTransfer = mergeTimesheetTransfer;
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
const path = __importStar(require("node:path"));
const webview_1 = require("./webview");
const timeData_1 = require("./timeData");
const pdfReport_1 = require("./pdfReport");
const fileTimeTracker_1 = require("./fileTimeTracker");
const floatingTimer_1 = require("./floatingTimer");
const node_crypto_1 = require("node:crypto");
const timeCard_1 = require("./timeCard");
const storageOwnership_1 = require("./storageOwnership");
const STORAGE_KEY = 'time-tracker.data';
const STORAGE_FILE = 'timesheet.json';
const FILE_TIMES_STORAGE_KEY = 'time-tracker.file-times';
const FILE_ACTIVITY_STORAGE_KEY = 'time-tracker.file-activity';
const EXCLUDED_FILES_STORAGE_KEY = 'excludedFiles';
const DEFAULT_PERIOD_START = '2026-10-21';
const TIMESHEET_TRANSFER_KIND = 'time-tracker-timesheet';
const TIMESHEET_TRANSFER_VERSION = 1;
const MAX_TIMESHEET_IMPORT_BYTES = 5 * 1024 * 1024;
const MAINTENANCE_COMMANDS = new Set([
    'time-tracker.importTimesheet',
    'time-tracker.exportTimesheet',
    'time-tracker.toggleTracking',
    'time-tracker.manageExclusions',
    'time-tracker.resetFileTimes',
    'time-tracker.showFloatingTimer',
    'time-tracker.openTimeCard',
]);
let fileTimeTracker;
let releaseStorageOwnership;
let pendingTimesheetWrites = Promise.resolve();
let pendingTimesheetLoad;
let stopTracking;
function newEntryId() {
    return (0, node_crypto_1.randomBytes)(16).toString('hex');
}
function calendarEntryId(entry) {
    return (0, node_crypto_1.createHash)('sha256').update(JSON.stringify([entry.date, entry.task, entry.timeIn, entry.timeOut])).digest('hex').slice(0, 32);
}
function isEntryId(value) {
    return typeof value === 'string' && /^[a-f0-9]{32}$/.test(value);
}
function parseState(stored = {}) {
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
        throw new Error('The saved timesheet is invalid. Restore or repair the JSON file before continuing.');
    }
    const entries = {};
    const ids = new Set();
    if (stored.entries !== undefined) {
        if (!stored.entries || typeof stored.entries !== 'object' || Array.isArray(stored.entries)) {
            throw new Error('The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.');
        }
        for (const [date, candidate] of Object.entries(stored.entries)) {
            const legacyEntry = !Array.isArray(candidate);
            const rows = legacyEntry ? [candidate] : candidate;
            entries[date] = rows.map((row) => {
                if (!row || typeof row !== 'object' || typeof row.date !== 'string' || typeof row.task !== 'string' ||
                    typeof row.timeIn !== 'string' || typeof row.timeOut !== 'string' ||
                    row.date !== date || (0, timeData_1.validateEntry)(row)) {
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
    if (typeof periodStart !== 'string' || !(0, timeData_1.isValidDate)(periodStart)) {
        throw new Error('The saved period start is invalid. Restore or repair the JSON file before continuing.');
    }
    let periodEnd = stored.periodEnd;
    if (periodEnd === undefined) {
        try {
            periodEnd = (0, timeData_1.customPeriodEnd)(periodStart);
        }
        catch {
            throw new Error('The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.');
        }
    }
    if (typeof periodEnd !== 'string' || !(0, timeData_1.isValidDate)(periodEnd) || periodEnd < periodStart) {
        throw new Error('The saved period end is invalid. Restore or repair the JSON file before continuing.');
    }
    const hourlyRate = stored.hourlyRate === undefined ? null : stored.hourlyRate;
    if (hourlyRate !== null && (typeof hourlyRate !== 'number' || !Number.isFinite(hourlyRate) || hourlyRate < 0)) {
        throw new Error('The saved hourly rate is invalid. Restore or repair the JSON file before continuing.');
    }
    const holidays = stored.holidays === undefined ? [] : stored.holidays;
    if (!Array.isArray(holidays) || holidays.some(holiday => !holiday || typeof holiday !== 'object' || (0, timeData_1.validateHoliday)(holiday) || holiday.name !== holiday.name.trim()) ||
        new Set(holidays.map(holiday => JSON.stringify([holiday.date, holiday.name]))).size !== holidays.length) {
        throw new Error('The saved public holidays are invalid. Restore or repair the JSON file before continuing.');
    }
    return { entries, periodStart, periodEnd, hourlyRate, holidays };
}
function copyTransferEntries(entries) {
    return Object.fromEntries(Object.entries(entries).map(([date, rows]) => [
        date,
        rows.map(row => ({
            id: row.id,
            date: row.date,
            task: row.task,
            timeIn: row.timeIn,
            timeOut: row.timeOut,
        })),
    ]));
}
function copyTransferHolidays(holidays) {
    return holidays.map(holiday => ({ date: holiday.date, name: holiday.name }));
}
function sameEntry(left, right) {
    return left.id === right.id && left.date === right.date && left.task === right.task &&
        left.timeIn === right.timeIn && left.timeOut === right.timeOut;
}
function createTimesheetTransfer(state, now = new Date()) {
    return {
        kind: TIMESHEET_TRANSFER_KIND,
        schemaVersion: TIMESHEET_TRANSFER_VERSION,
        exportedAt: now.toISOString(),
        entries: copyTransferEntries(state.entries),
        holidays: copyTransferHolidays(state.holidays),
    };
}
function parseTimesheetTransfer(contents) {
    if (Buffer.byteLength(contents, 'utf8') > MAX_TIMESHEET_IMPORT_BYTES) {
        throw new Error(`The timesheet file is too large. The limit is ${MAX_TIMESHEET_IMPORT_BYTES} bytes.`);
    }
    let value;
    try {
        value = JSON.parse(contents);
    }
    catch {
        throw new Error('The selected timesheet file is not valid JSON.');
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('The selected file is not a Time Tracker timesheet export.');
    }
    const candidate = value;
    const allowedFields = new Set(['kind', 'schemaVersion', 'exportedAt', 'entries', 'holidays']);
    if (Object.keys(candidate).some(field => !allowedFields.has(field))) {
        throw new Error('The selected timesheet export contains unsupported fields.');
    }
    if (candidate.kind !== TIMESHEET_TRANSFER_KIND || candidate.schemaVersion !== TIMESHEET_TRANSFER_VERSION) {
        throw new Error('The selected file uses an unsupported Time Tracker timesheet format.');
    }
    const exportedAt = typeof candidate.exportedAt === 'string' ? new Date(candidate.exportedAt) : undefined;
    if (!exportedAt || !Number.isFinite(exportedAt.getTime()) || exportedAt.toISOString() !== candidate.exportedAt) {
        throw new Error('The selected timesheet export has an invalid export timestamp.');
    }
    if (!candidate.entries || typeof candidate.entries !== 'object' || Array.isArray(candidate.entries) ||
        Object.values(candidate.entries).some(rows => !Array.isArray(rows))) {
        throw new Error('The selected timesheet export has invalid entries.');
    }
    if (!Array.isArray(candidate.holidays)) {
        throw new Error('The selected timesheet export has invalid holidays.');
    }
    const parsed = parseState({ entries: candidate.entries, holidays: candidate.holidays });
    return {
        entries: copyTransferEntries(parsed.entries),
        holidays: copyTransferHolidays(parsed.holidays),
    };
}
function mergeTimesheetTransfer(state, imported) {
    const localById = new Map(Object.values(state.entries).flat().map(entry => [entry.id, entry]));
    const entries = copyTransferEntries(state.entries);
    let addedEntries = 0;
    for (const [date, rows] of Object.entries(imported.entries)) {
        for (const entry of rows) {
            const local = localById.get(entry.id);
            if (local) {
                if (!sameEntry(local, entry)) {
                    throw new Error(`Imported entry ${entry.id} conflicts with a local entry. Import was not applied.`);
                }
                continue;
            }
            entries[date] = [...(entries[date] ?? []), { ...entry }];
            localById.set(entry.id, entry);
            addedEntries++;
        }
    }
    const holidayKeys = new Set(state.holidays.map(holiday => JSON.stringify([holiday.date, holiday.name])));
    const holidays = copyTransferHolidays(state.holidays);
    let addedHolidays = 0;
    for (const holiday of imported.holidays) {
        const key = JSON.stringify([holiday.date, holiday.name]);
        if (!holidayKeys.has(key)) {
            holidayKeys.add(key);
            holidays.push({ ...holiday });
            addedHolidays++;
        }
    }
    return {
        state: addedEntries || addedHolidays ? { ...state, entries, holidays } : state,
        addedEntries,
        addedHolidays,
    };
}
function stateFile(context) {
    return path.join(context.globalStorageUri.fsPath, STORAGE_FILE);
}
async function writeState(context, state) {
    const file = stateFile(context);
    await (0, promises_1.mkdir)(path.dirname(file), { recursive: true });
    const temporaryFile = `${file}.${process.pid}.${(0, node_crypto_1.randomBytes)(8).toString('hex')}.tmp`;
    const handle = await (0, promises_1.open)(temporaryFile, 'wx');
    try {
        await handle.writeFile(JSON.stringify(state, null, 2), 'utf8');
        await handle.close();
        await (0, promises_1.rename)(temporaryFile, file);
    }
    catch (error) {
        try {
            await handle.close();
            await (0, promises_1.unlink)(temporaryFile);
        }
        catch (cleanupError) {
            const reason = error instanceof Error ? error.message : String(error);
            const detail = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
            throw new AggregateError([error, cleanupError], `Could not save the timesheet: ${reason}. Temporary file cleanup failed: ${detail}`);
        }
        throw error;
    }
}
async function readState(context) {
    try {
        const contents = await (0, promises_1.readFile)(stateFile(context), 'utf8');
        return parseState(JSON.parse(contents));
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
    const migratedState = parseState(context.globalState.get(STORAGE_KEY));
    await writeState(context, migratedState);
    return migratedState;
}
async function saveDocument(filename, format, render, protectedPath) {
    const baseDirectory = vscode.workspace.workspaceFolders?.[0]?.uri ?? vscode.Uri.file((0, node_os_1.homedir)());
    const destination = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.joinPath(baseDirectory, filename),
        filters: {
            [format === 'html' ? 'HTML documents' : format === 'json' ? 'JSON documents' : 'PDF documents']: [format],
        },
        saveLabel: `Save ${format.toUpperCase()}`,
    });
    if (!destination) {
        return undefined;
    }
    const filePath = path.extname(destination.fsPath).toLowerCase() === `.${format}`
        ? destination.fsPath : `${destination.fsPath}.${format}`;
    if (protectedPath) {
        const selected = path.resolve(filePath);
        const protectedFile = path.resolve(protectedPath);
        const matches = process.platform === 'win32'
            ? selected.toLowerCase() === protectedFile.toLowerCase()
            : selected === protectedFile;
        if (matches) {
            throw new Error('Choose a different file; the active timesheet store cannot be overwritten by an export.');
        }
    }
    await (0, promises_1.writeFile)(filePath, await render());
    return filePath;
}
function activate(context) {
    let excludedFiles = [];
    const showUnavailable = (reason, recoveryAvailable = false, lockFile) => {
        const unavailable = () => {
            void (async () => {
                try {
                    if (lockFile) {
                        const choice = await vscode.window.showErrorMessage('Time Tracker is paused because another VS Code window may be using its storage.', {
                            modal: true,
                            detail: 'Close the other window, then reload this window. If VS Code crashed, see the recovery instructions.',
                        }, 'Reload Window', 'Recovery Instructions');
                        if (choice === 'Reload Window') {
                            await vscode.commands.executeCommand('workbench.action.reloadWindow');
                        }
                        else if (choice === 'Recovery Instructions') {
                            const recovery = await vscode.window.showErrorMessage('Recover Time Tracker after an unexpected shutdown', {
                                modal: true,
                                detail: `Close all VS Code windows and ensure their extension hosts have stopped. ` +
                                    `Then remove only this lock file and reopen VS Code:\n\n${lockFile}`,
                            }, 'Copy Lock Path');
                            if (recovery === 'Copy Lock Path') {
                                await vscode.env.clipboard.writeText(lockFile);
                            }
                        }
                        return;
                    }
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
                        fileActivity: context.globalState.get(FILE_ACTIVITY_STORAGE_KEY),
                        fileTimes: context.globalState.get(FILE_TIMES_STORAGE_KEY),
                        excludedFiles: context.globalState.get(EXCLUDED_FILES_STORAGE_KEY),
                        legacyFileTimers: context.globalState.get('fileTimers'),
                    };
                    await (0, promises_1.writeFile)(destination.fsPath, JSON.stringify(data, null, 2), 'utf8');
                    void vscode.window.showInformationMessage(`Raw file activity data saved to ${destination.fsPath}.`);
                }
                catch (error) {
                    const detail = error instanceof Error ? error.message : String(error);
                    void vscode.window.showErrorMessage(lockFile
                        ? `Could not complete storage recovery: ${detail}`
                        : `Could not export raw file activity data: ${detail}`);
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
            'time-tracker.exportTimesheet',
            'time-tracker.importTimesheet',
        ].map(command => vscode.commands.registerCommand(command, unavailable)));
        unavailable();
    };
    try {
        releaseStorageOwnership = (0, storageOwnership_1.acquireStorageOwnership)(context.globalStorageUri.fsPath);
        const savedActivity = context.globalState.get(FILE_ACTIVITY_STORAGE_KEY);
        let fileTimes = context.globalState.get(FILE_TIMES_STORAGE_KEY);
        let savedExclusions = context.globalState.get(EXCLUDED_FILES_STORAGE_KEY);
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
        fileTimeTracker = new fileTimeTracker_1.FileTimeTracker(fileTimes, async (totals, exclusions) => context.globalState.update(FILE_ACTIVITY_STORAGE_KEY, {
            version: 1, fileTimes: totals, excludedFiles: [...exclusions],
        }), undefined, excludedFiles);
        if (context.globalState.get('fileTimers') !== undefined) {
            void vscode.window.showWarningMessage('Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.');
        }
    }
    catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        const recoveryAvailable = !!releaseStorageOwnership;
        if (releaseStorageOwnership) {
            try {
                releaseStorageOwnership();
            }
            catch (releaseError) {
                const detail = releaseError instanceof Error ? releaseError.message : String(releaseError);
                showUnavailable(`${reason} Could not release storage ownership: ${detail}`);
                return;
            }
            finally {
                releaseStorageOwnership = undefined;
            }
        }
        showUnavailable(reason, recoveryAvailable, error instanceof storageOwnership_1.StorageInUseError ? error.lockFile : undefined);
        return;
    }
    const fileTimePanels = new Set();
    let stopping = false;
    const tracker = fileTimeTracker;
    const currentSnapshot = () => {
        const snapshot = tracker.snapshot();
        return { ...snapshot, excluded: !!snapshot.activeFile && tracker.isExcluded(snapshot.activeFile) };
    };
    let timesheetState;
    let pendingState;
    let timesheetWrites = Promise.resolve();
    const createdEntriesByRequest = new Map();
    const getState = async () => {
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
        }
        finally {
            pendingState = undefined;
            pendingTimesheetLoad = undefined;
        }
    };
    const changeState = (change) => {
        if (stopping) {
            return Promise.reject(new Error('Time Tracker is shutting down; reopen it before editing.'));
        }
        const write = timesheetWrites.then(async () => {
            const current = await getState();
            const next = change(current);
            if (next === current) {
                return;
            }
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
    const exportTimesheet = vscode.commands.registerCommand('time-tracker.exportTimesheet', async () => {
        try {
            await timesheetWrites;
            const state = await getState();
            const transfer = createTimesheetTransfer(state);
            const filePath = await saveDocument(`time-tracker-timesheet-${transfer.exportedAt.slice(0, 10)}.json`, 'json', () => Buffer.from(`${JSON.stringify(transfer, null, 2)}\n`, 'utf8'), stateFile(context));
            if (filePath) {
                void vscode.window.showInformationMessage(`Timesheet data saved to ${filePath}`);
            }
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            void vscode.window.showErrorMessage(`Could not export timesheet data: ${reason}`);
        }
    });
    const importTimesheet = vscode.commands.registerCommand('time-tracker.importTimesheet', async () => {
        try {
            const selection = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                filters: { 'Time Tracker timesheet': ['json'], 'All files': ['*'] },
                openLabel: 'Import timesheet data',
            });
            if (!selection?.length) {
                return;
            }
            const handle = await (0, promises_1.open)(selection[0].fsPath, 'r');
            let contents;
            try {
                const info = await handle.stat();
                if (!info.isFile()) {
                    throw new Error('Select a regular JSON file.');
                }
                if (info.size > MAX_TIMESHEET_IMPORT_BYTES) {
                    throw new Error(`The timesheet file is too large. The limit is ${MAX_TIMESHEET_IMPORT_BYTES} bytes.`);
                }
                contents = await handle.readFile({ encoding: 'utf8' });
            }
            finally {
                await handle.close();
            }
            const imported = parseTimesheetTransfer(contents);
            await timesheetWrites;
            const preview = mergeTimesheetTransfer(await getState(), imported);
            const answer = await vscode.window.showWarningMessage(`Import ${preview.addedEntries} new entries and ${preview.addedHolidays} new holidays? ` +
                'Existing timesheet entries and preferences will be kept.', { modal: true }, 'Import');
            if (answer !== 'Import') {
                return;
            }
            let applied;
            await changeState(state => {
                applied = mergeTimesheetTransfer(state, imported);
                return applied.state;
            });
            void vscode.window.showInformationMessage(`Timesheet import complete: ${applied.addedEntries} entries and ${applied.addedHolidays} holidays added.`);
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            void vscode.window.showErrorMessage(`Could not import timesheet data: ${reason}`);
        }
    });
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'time-tracker.openTimesheet';
    statusBarItem.text = '$(watch) 0h 00m | 0h 00m';
    statusBarItem.tooltip = 'Total tracked: 0h 00m\nCurrent file: 0h 00m\nClick to open Time Tracker';
    statusBarItem.show();
    const showFileTimePersistenceError = (error) => {
        const reason = error instanceof Error ? error.message : String(error);
        void vscode.window.showErrorMessage(`Could not save automatic file time data: ${reason}`);
    };
    const postFileTimes = () => {
        const snapshot = currentSnapshot();
        const totals = (0, fileTimeTracker_1.summarizeFileTime)(snapshot);
        const totalTime = (0, timeData_1.formatDuration)(Math.floor(totals.total / 60_000));
        const currentTime = (0, timeData_1.formatDuration)(Math.floor(totals.current / 60_000));
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
    const updateTracking = async (operation) => {
        postFileTimes();
        try {
            await operation;
        }
        catch (error) {
            showFileTimePersistenceError(error);
        }
        postFileTimes();
    };
    const pauseOrResume = () => stopping ? Promise.resolve() :
        updateTracking(tracker.setPaused(!tracker.snapshot().paused));
    const floatingTimer = new floatingTimer_1.FloatingTimer(currentSnapshot, pauseOrResume);
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
        }
        else {
            next.add(selection.file);
        }
        excludedFiles = [...next];
        const operation = tracker.setExcludedFiles(excludedFiles);
        postFileTimes();
        try {
            await operation;
            void vscode.window.showInformationMessage(`${path.basename(selection.file)} is ${tracker.isExcluded(selection.file) ? 'excluded' : 'included'}.`);
        }
        catch (error) {
            showFileTimePersistenceError(error);
        }
        postFileTimes();
    });
    const resetFileTimes = vscode.commands.registerCommand('time-tracker.resetFileTimes', async () => {
        if (stopping) {
            void vscode.window.showErrorMessage('Time Tracker is shutting down.');
            return;
        }
        const answer = await vscode.window.showWarningMessage('Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.', { modal: true }, 'Reset');
        if (answer !== 'Reset') {
            return;
        }
        try {
            await tracker.reset();
            postFileTimes();
            void vscode.window.showInformationMessage('Automatic file activity was reset.');
        }
        catch (error) {
            showFileTimePersistenceError(error);
            postFileTimes();
        }
    });
    const trackActiveFile = () => {
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
        let card;
        try {
            card = (0, timeCard_1.createTimeCard)(fileTimeTracker?.snapshot().fileTimes ?? {});
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            void vscode.window.showErrorMessage(`Could not generate the time card: ${reason}`);
            return;
        }
        const panel = vscode.window.createWebviewPanel('timeTrackerCard', 'Time Card Preview', vscode.ViewColumn.One, { enableScripts: true, localResourceRoots: [] });
        const renderCard = () => {
            panel.webview.html = (0, timeCard_1.renderTimeCardHtml)(card, { nonce: (0, node_crypto_1.randomBytes)(16).toString('hex') });
        };
        renderCard();
        const listener = panel.webview.onDidReceiveMessage(async (message) => {
            try {
                if (message.type === 'refresh') {
                    card = (0, timeCard_1.createTimeCard)(fileTimeTracker?.snapshot().fileTimes ?? {});
                    renderCard();
                }
                else if (message.type === 'export') {
                    if (message.format !== 'html' && message.format !== 'pdf') {
                        throw new Error('Choose HTML or PDF for the time card export.');
                    }
                    const format = message.format;
                    const snapshot = card;
                    const filename = `time-card-${snapshot.generatedAt.slice(0, 10)}.${format}`;
                    const filePath = await saveDocument(filename, format, () => format === 'html'
                        ? Buffer.from((0, timeCard_1.renderTimeCardHtml)(snapshot), 'utf8') : (0, timeCard_1.renderTimeCardPdf)(snapshot));
                    if (filePath) {
                        void vscode.window.showInformationMessage(`Time card saved to ${filePath}`);
                    }
                }
            }
            catch (error) {
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
        const panel = vscode.window.createWebviewPanel('timeTracker', 'Time Tracker', vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
        let maintenanceActionInFlight = false;
        try {
            await getState();
        }
        catch (error) {
            panel.dispose();
            const reason = error instanceof Error ? error.message : String(error);
            void vscode.window.showErrorMessage(`Could not load ${stateFile(context)}: ${reason}`);
            return;
        }
        fileTimePanels.add(panel);
        panel.onDidDispose(() => fileTimePanels.delete(panel));
        panel.webview.html = (0, webview_1.getWebviewHtml)(panel.webview);
        const postState = async () => {
            await panel.webview.postMessage({ type: 'state', data: { ...await getState(), ...currentSnapshot() } });
        };
        function assertUnchanged(current, expected) {
            if (!current || !expected || current.id !== expected.id || current.date !== expected.date ||
                current.task !== expected.task || current.timeIn !== expected.timeIn || current.timeOut !== expected.timeOut) {
                throw new Error('This entry changed in another view. Reload it before editing again.');
            }
        }
        panel.webview.onDidReceiveMessage(async (message) => {
            if (!message || typeof message !== 'object' || typeof message.type !== 'string') {
                void vscode.window.showErrorMessage('Invalid Time Tracker message.');
                return;
            }
            try {
                switch (message.type) {
                    case 'maintenanceAction':
                        if (typeof message.command !== 'string' || !MAINTENANCE_COMMANDS.has(message.command)) {
                            throw new Error('Choose a valid maintenance action.');
                        }
                        if (stopping) {
                            throw new Error('Time Tracker is shutting down.');
                        }
                        if (maintenanceActionInFlight) {
                            break;
                        }
                        maintenanceActionInFlight = true;
                        try {
                            await vscode.commands.executeCommand(message.command);
                            await panel.webview.postMessage({ type: 'maintenanceActionComplete' });
                        }
                        finally {
                            maintenanceActionInFlight = false;
                        }
                        break;
                    case 'showFloatingTimer':
                        floatingTimer.show();
                        break;
                    case 'openTimeCard':
                        await vscode.commands.executeCommand('time-tracker.openTimeCard');
                        break;
                    case 'importOutlookCalendar': {
                        const selection = await vscode.window.showOpenDialog({
                            canSelectFiles: true,
                            canSelectFolders: false,
                            canSelectMany: false,
                            filters: { 'Outlook Calendar': ['ics'], 'All files': ['*'] },
                            openLabel: 'Import Outlook Calendar',
                        });
                        if (!selection?.length) {
                            await panel.webview.postMessage({ type: 'maintenanceActionComplete' });
                            break;
                        }
                        const handle = await (0, promises_1.open)(selection[0].fsPath, 'r');
                        let contents;
                        try {
                            const info = await handle.stat();
                            if (!info.isFile()) {
                                throw new Error('Select a regular Outlook calendar .ics file.');
                            }
                            if (info.size > MAX_TIMESHEET_IMPORT_BYTES) {
                                throw new Error(`The calendar file is too large. The limit is ${MAX_TIMESHEET_IMPORT_BYTES} bytes.`);
                            }
                            contents = await handle.readFile({ encoding: 'utf8' });
                        }
                        finally {
                            await handle.close();
                        }
                        const imported = (0, timeData_1.parseOutlookCalendarIcs)(contents);
                        if (!imported.length) {
                            throw new Error('No timed or all-day calendar entries found in this Outlook .ics file.');
                        }
                        await timesheetWrites;
                        const current = await getState();
                        const existingKeys = new Set(Object.values(current.entries).flat().map(entry => JSON.stringify([entry.date, entry.task, entry.timeIn, entry.timeOut])));
                        const candidates = imported.filter(entry => !existingKeys.has(JSON.stringify([entry.date, entry.task, entry.timeIn, entry.timeOut])));
                        if (!candidates.length) {
                            void vscode.window.showInformationMessage('Outlook Calendar import complete: 0 entries added.');
                            await panel.webview.postMessage({ type: 'maintenanceActionComplete' });
                            break;
                        }
                        const answer = await vscode.window.showWarningMessage(`Import ${candidates.length} calendar ${candidates.length === 1 ? 'entry' : 'entries'}?`, { modal: true }, 'Import');
                        if (answer !== 'Import') {
                            await panel.webview.postMessage({ type: 'maintenanceActionComplete' });
                            break;
                        }
                        let added = 0;
                        await changeState(state => {
                            const entries = { ...state.entries };
                            for (const candidate of candidates) {
                                const key = JSON.stringify([candidate.date, candidate.task, candidate.timeIn, candidate.timeOut]);
                                if (Object.values(entries).flat().some(entry => JSON.stringify([entry.date, entry.task, entry.timeIn, entry.timeOut]) === key)) {
                                    continue;
                                }
                                const stored = { ...candidate, id: calendarEntryId(candidate) };
                                entries[candidate.date] = [...(entries[candidate.date] ?? []), stored];
                                added++;
                            }
                            return added ? { ...state, entries } : state;
                        });
                        void vscode.window.showInformationMessage(`Outlook Calendar import complete: ${added} entries added.`);
                        await panel.webview.postMessage({ type: 'maintenanceActionComplete' });
                        break;
                    }
                    case 'ready':
                        await postState();
                        break;
                    case 'addHoliday':
                    case 'deleteHoliday': {
                        const holiday = message.holiday;
                        if (!holiday || typeof holiday !== 'object' || (0, timeData_1.validateHoliday)(holiday)) {
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
                            typeof entry.timeIn !== 'string' || typeof entry.timeOut !== 'string' || !(0, timeData_1.isValidDate)(entry.date)) {
                            throw new Error('Enter a valid date, activity, and time values.');
                        }
                        const blank = !entry.task.trim() && !entry.timeIn && !entry.timeOut;
                        const validationError = blank && message.type === 'saveEntry' ? undefined : (0, timeData_1.validateEntry)(entry);
                        if (validationError) {
                            throw new Error(validationError);
                        }
                        if (message.type === 'createEntry') {
                            if (typeof message.requestId !== 'string' || !message.requestId || message.requestId.length > 128) {
                                throw new Error('The new entry request is invalid. Try again.');
                            }
                            const candidate = {
                                ...entry, id: newEntryId(), task: entry.task.trim(),
                            };
                            const existing = createdEntriesByRequest.get(message.requestId);
                            if (existing) {
                                const matches = existing.entry.date === candidate.date &&
                                    existing.entry.task === candidate.task &&
                                    existing.entry.timeIn === candidate.timeIn &&
                                    existing.entry.timeOut === candidate.timeOut;
                                if (!matches) {
                                    throw new Error('The create-entry request is invalid.');
                                }
                                await existing.operation;
                                await panel.webview.postMessage({ type: 'entryCreated', requestId: message.requestId, entry: existing.entry });
                                break;
                            }
                            const operation = changeState(state => ({
                                ...state,
                                entries: { ...state.entries, [entry.date]: [...(state.entries[entry.date] ?? []), candidate] },
                            }));
                            createdEntriesByRequest.set(message.requestId, { entry: candidate, operation });
                            try {
                                await operation;
                            }
                            catch (error) {
                                createdEntriesByRequest.delete(message.requestId);
                                throw error;
                            }
                            await panel.webview.postMessage({ type: 'entryCreated', requestId: message.requestId, entry: candidate });
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
                                }
                                else {
                                    delete entries[entry.date];
                                }
                            }
                            else {
                                const updated = [...rows];
                                updated[index] = { ...entry, id: current.id, task: entry.task.trim() };
                                entries[entry.date] = updated;
                            }
                            return { ...state, entries };
                        });
                        break;
                    }
                    case 'deleteEntry':
                        if (!message.date || !(0, timeData_1.isValidDate)(message.date) || !isEntryId(message.id)) {
                            throw new Error('Select a valid entry to delete.');
                        }
                        await changeState(state => {
                            const date = message.date;
                            const rows = state.entries[date] ?? [];
                            const current = rows.find(row => row.id === message.id);
                            assertUnchanged(current, message.expected);
                            const entries = { ...state.entries };
                            const remaining = rows.filter(row => row.id !== message.id);
                            if (remaining.length) {
                                entries[date] = remaining;
                            }
                            else {
                                delete entries[date];
                            }
                            return { ...state, entries };
                        });
                        break;
                    case 'setPeriod':
                        if (typeof message.periodStart !== 'string' || !(0, timeData_1.isValidDate)(message.periodStart)) {
                            throw new Error('Enter a valid period start date.');
                        }
                        if (typeof message.periodEnd !== 'string' || !(0, timeData_1.isValidDate)(message.periodEnd)) {
                            throw new Error('Enter a valid period end date.');
                        }
                        if (message.periodEnd < message.periodStart) {
                            throw new Error('Period end must be on or after period start.');
                        }
                        await changeState(state => {
                            if (state.periodStart !== message.expectedStart || state.periodEnd !== message.expectedEnd) {
                                throw new Error('The reporting period changed in another view. Reload it before editing again.');
                            }
                            return { ...state, periodStart: message.periodStart, periodEnd: message.periodEnd };
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
                                const pdf = await (0, pdfReport_1.renderReportPdf)(state);
                                const directory = path.join(context.globalStorageUri.fsPath, 'print-reports');
                                await (0, promises_1.mkdir)(directory, { recursive: true });
                                const printDirectory = await (0, promises_1.mkdtemp)(path.join(directory, 'report-'));
                                const filename = `timesheet-${state.periodStart}-to-${state.periodEnd}.pdf`;
                                const filePath = path.join(printDirectory, filename);
                                await (0, promises_1.writeFile)(filePath, pdf);
                                if (!await vscode.env.openExternal(vscode.Uri.file(filePath))) {
                                    throw new Error('No PDF viewer could be opened. Use Save as PDF and open the file manually.');
                                }
                                void vscode.window.showInformationMessage('Report opened in your default PDF viewer. Use its Print command to print.');
                            }
                            catch (error) {
                                const reason = error instanceof Error ? error.message : String(error);
                                void vscode.window.showErrorMessage(`Could not open the report for printing: ${reason}`);
                            }
                            break;
                        }
                        if (action?.value === 'pdf') {
                            const filename = `timesheet-${state.periodStart}-to-${state.periodEnd}.pdf`;
                            try {
                                const filePath = await saveDocument(filename, 'pdf', () => (0, pdfReport_1.renderReportPdf)(state));
                                if (filePath) {
                                    void vscode.window.showInformationMessage(`PDF saved to ${filePath}`);
                                }
                            }
                            catch (error) {
                                const reason = error instanceof Error ? error.message : String(error);
                                void vscode.window.showErrorMessage(`Could not save the PDF: ${reason}`);
                            }
                        }
                        break;
                    }
                }
            }
            catch (error) {
                const reason = error instanceof Error ? error.message : String(error);
                if (message.type === 'maintenanceAction' || message.type === 'importOutlookCalendar') {
                    await panel.webview.postMessage({ type: 'maintenanceActionError', message: reason });
                    return;
                }
                await panel.webview.postMessage({
                    type: 'error',
                    operation: message.type,
                    id: message.id,
                    requestId: message.requestId,
                    view: message.view ?? (message.type === 'setPeriod' || message.type === 'setHourlyRate' ? 'report' : 'entries'),
                    message: reason,
                });
            }
        });
    });
    context.subscriptions.push(disposable, openTimeCard, showFloatingTimer, hideFloatingTimer, toggleTracking, manageExclusions, resetFileTimes, exportTimesheet, importTimesheet, floatingTimer, statusBarItem, activeEditorListener, windowStateListener, { dispose: () => clearInterval(fileTimeInterval) }, { dispose: () => clearInterval(displayInterval) });
}
async function deactivate() {
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
    }
    finally {
        fileTimeTracker = undefined;
        stopTracking = undefined;
        releaseStorageOwnership?.();
        releaseStorageOwnership = undefined;
    }
}
//# sourceMappingURL=extension.js.map