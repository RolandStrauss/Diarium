import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { customPeriodEnd, durationMinutes, isIncomplete, isValidDate, isValidTime, periodRange, validateEntry } from '../timeData';
import { renderReportPdf } from '../pdfReport';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('opens the timesheet command', async () => {
		await vscode.commands.executeCommand('time-tracker.openTimesheet');
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

	test('renders the custom period as a PDF document', async () => {
		const pdf = await renderReportPdf({
			entries: {
				'2026-10-24': { date: '2026-10-24', task: 'Weekend work', timeIn: '09:00', timeOut: '10:00' },
				'2026-10-25': { date: '2026-10-25', task: 'Partial work', timeIn: '11:00', timeOut: '' },
			},
			periodStart: '2026-10-21',
			hourlyRate: 20,
		});
		assert.strictEqual(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
		assert.strictEqual(pdf.includes(Buffer.from('%%EOF')), true);
	});
});
