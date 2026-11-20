import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { customPeriodEnd, durationMinutes, isIncomplete, isValidDate, isValidTime, periodRange, validateEntry } from '../timeData';
import { renderReportPdf } from '../pdfReport';
import { FileTimeTracker, parseFileTimeTotals } from '../fileTimeTracker';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('opens the timesheet command', async () => {
		await vscode.commands.executeCommand('time-tracker.openTimesheet');
	});

	test('opens, reuses, and hides the floating timer through VS Code commands', async () => {
		await vscode.commands.executeCommand('time-tracker.showFloatingTimer');
		await vscode.commands.executeCommand('time-tracker.showFloatingTimer');
		await vscode.commands.executeCommand('time-tracker.hideFloatingTimer');
	});

	test('activates in the extension host and registers every manifest command', async () => {
		const extension = vscode.extensions.all.find(candidate =>
			candidate.packageJSON.name === 'Diarium'
			&& candidate.packageJSON.publisher === 'ferraria');
		assert.ok(extension);

		const commandIds = await vscode.commands.getCommands(true);
		for (const commandId of [
			'time-tracker.openTimesheet',
			'time-tracker.openTimeCard',
			'time-tracker.showFloatingTimer',
			'time-tracker.hideFloatingTimer',
			'time-tracker.toggleTracking',
			'time-tracker.manageExclusions',
			'time-tracker.resetFileTimes',
			'time-tracker.exportTimesheet',
			'time-tracker.importTimesheet',
		]) {
			assert.ok(commandIds.includes(commandId), `Missing command: ${commandId}`);
		}
	});

	test('validates calendar dates and 24-hour times', () => {
		assert.strictEqual(isValidDate('2024-02-29'), true);
		assert.strictEqual(isValidDate('2025-02-29'), false);
		assert.strictEqual(isValidTime('00:00'), true);
		assert.strictEqual(isValidTime('23:59'), true);
		assert.strictEqual(isValidTime('24:00'), false);
		assert.strictEqual(isValidTime('9:00'), false);
	});

	test('calculates elapsed durations including overnight and equal times', () => {
		assert.strictEqual(durationMinutes({ date: '2026-10-01', task: 'Work', timeIn: '09:00', timeOut: '17:30' }), 510);
		assert.strictEqual(durationMinutes({ date: '2026-10-01', task: 'Work', timeIn: '22:00', timeOut: '06:00' }), 480);
		assert.strictEqual(durationMinutes({ date: '2026-10-01', task: 'Work', timeIn: '08:00', timeOut: '08:00' }), 0);
		assert.strictEqual(durationMinutes({ date: '2026-10-01', task: 'Work', timeIn: '08:00', timeOut: '' }), undefined);
	});

	test('calculates configured and standard reporting periods', () => {
		assert.strictEqual(customPeriodEnd('2026-10-21'), '2026-11-20');
		assert.strictEqual(customPeriodEnd('2026-12-21'), '2027-01-20');
		assert.deepStrictEqual(periodRange('weekly', '2026-11-08'), { start: '2026-11-02', end: '2026-11-08' });
		assert.deepStrictEqual(periodRange('monthly', '2026-11-09'), { start: '2026-11-01', end: '2026-11-30' });
	});

	test('preserves valid partial entries but marks them incomplete', () => {
		const entry = { date: '2026-10-21', task: 'Planning', timeIn: '09:00', timeOut: '' };
		assert.strictEqual(validateEntry(entry), undefined);
		assert.strictEqual(isIncomplete(entry), true);
		assert.strictEqual(validateEntry({ ...entry, date: '2026-02-30' }), 'Enter a valid calendar date.');
		assert.strictEqual(validateEntry({ ...entry, timeIn: '25:00' }), 'Time In must use 24-hour HH:mm format.');
	});

	test('tracks each file separately, pauses without an active file, and restores saved totals', async () => {
		let now = 1000;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({}, async totals => { saved = totals; }, () => now);

		await tracker.setActiveFile('C:\\work\\first.ts');
		now += 90_000;
		await tracker.setActiveFile(undefined);
		now += 30_000;
		await tracker.setActiveFile('C:\\work\\second.ts');
		now += 60_000;
		await tracker.checkpoint();

		assert.deepStrictEqual(tracker.snapshot(), {
			fileTimes: { 'C:\\work\\first.ts': 90_000, 'C:\\work\\second.ts': 60_000 },
			activeFile: 'C:\\work\\second.ts',
			paused: false,
		});
		assert.deepStrictEqual(saved, tracker.snapshot().fileTimes);

		const restored = new FileTimeTracker(saved, async () => {}, () => now);
		assert.deepStrictEqual(restored.snapshot(), {
			fileTimes: saved,
			activeFile: null,
			paused: false,
		});
	});

	test('pause saves elapsed time, excludes paused time, and resumes the latest active file', async () => {
		let now = 1000;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({}, async totals => { saved = totals; }, () => now);
		await tracker.setActiveFile('first.ts');
		now += 1500;
		await tracker.setPaused(true);
		assert.strictEqual(saved['first.ts'], 1500);
		now += 5000;
		await tracker.checkpoint();
		await tracker.setActiveFile('second.ts');
		now += 5000;
		await tracker.setPaused(true);
		assert.strictEqual(tracker.snapshot().fileTimes['first.ts'], 1500);
		assert.strictEqual(tracker.snapshot().activeFile, 'second.ts');
		await tracker.setPaused(false);
		now += 2500;
		assert.strictEqual(tracker.snapshot().fileTimes['second.ts'], 2500);
		await tracker.setPaused(false);
		now += 500;
		assert.strictEqual(tracker.snapshot().fileTimes['second.ts'], 3000);
		await tracker.setActiveFile(undefined);
		now += 5000;
		await tracker.setPaused(true);
		await tracker.setPaused(false);
		now += 5000;
		assert.strictEqual(tracker.snapshot().fileTimes['second.ts'], 3000);
		assert.strictEqual(tracker.snapshot().activeFile, null);
	});

	test('failed pause persistence surfaces the error and the next write can recover without losing time', async () => {
		let now = 0;
		let fail = false;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({}, async totals => {
			if (fail) { throw new Error('Storage unavailable'); }
			saved = totals;
		}, () => now);
		await tracker.setActiveFile('first.ts');
		now = 1500;
		fail = true;
		await assert.rejects(tracker.setPaused(true), /Storage unavailable/);
		assert.strictEqual(tracker.snapshot().paused, true);
		fail = false;
		now = 5000;
		await tracker.checkpoint();
		assert.strictEqual(saved['first.ts'], 1500);
	});

	test('rejects malformed persisted file totals without discarding valid records', () => {
		assert.throws(() => parseFileTimeTotals({
			'C:\\work\\valid.ts': 1200,
			'C:\\work\\negative.ts': -1,
		}), /Invalid stored file time data/);
		assert.throws(() => parseFileTimeTotals([]), /Invalid stored file time data/);
	});

	test('renders the custom period as a PDF document', async () => {
		const pdf = await renderReportPdf({
			entries: {
				'2026-10-24': [{ date: '2026-10-24', task: 'Weekend work', timeIn: '09:00', timeOut: '10:00' }],
				'2026-10-25': [{ date: '2026-10-25', task: 'Partial work', timeIn: '11:00', timeOut: '' }],
			},
			periodStart: '2026-10-21',
			hourlyRate: 20,
		});
		assert.strictEqual(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
		assert.strictEqual(pdf.includes(Buffer.from('%%EOF')), true);
	});
});
