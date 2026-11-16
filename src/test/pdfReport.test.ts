import * as assert from 'node:assert';
import { inflateSync } from 'node:zlib';
import PDFDocument from 'pdfkit';
import { renderReportPdf } from '../pdfReport';
import { addDays, customPeriodEnd, type TimeEntry } from '../timeData';

function pdfText(pdf: Buffer): { text: string; x: number; y: number; size: number }[] {
	const source = pdf.toString('latin1');
	const texts: { text: string; x: number; y: number; size: number }[] = [];
	for (const stream of source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
		let content: string;
		try {
			content = inflateSync(Buffer.from(stream[1], 'latin1')).toString('latin1');
		} catch {
			continue;
		}
		for (const block of content.matchAll(/BT\n([\s\S]*?)\nET/g)) {
			const position = /1 0 0 1 ([\d.]+) ([\d.]+) Tm/.exec(block[1]);
			const size = /\/F\d+ ([\d.]+) Tf/.exec(block[1]);
			assert.ok(position);
			assert.ok(size);
			const text = Array.from(block[1].matchAll(/<([0-9a-f]+)>/gi),
				match => Buffer.from(match[1], 'hex').toString('latin1')).join('');
			texts.push({ text, x: Number(position[1]), y: Number(position[2]), size: Number(size[1]) });
		}
	}
	return texts;
}

function dateLabel(date: string): string {
	return new Intl.DateTimeFormat('en', {
		day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
	}).format(new Date(`${date}T00:00:00Z`));
}

suite('Timesheet PDF', () => {
	test('fits every date of supported short and long empty cycles on one landscape A4 page', async () => {
		for (const start of ['0001-01-01', '2024-02-01', '2024-01-31', '2026-10-21', '2026-12-21', '9999-12-01']) {
			const pdf = await renderReportPdf({ entries: {}, periodStart: start, hourlyRate: null });
			const source = pdf.toString('latin1');
			assert.match(source, /\/Count 1\b/);
			assert.match(source, /\/MediaBox \[0 0 841\.89 595\.28\]/);
			const text = pdfText(pdf);
			const measure = new PDFDocument();
			assert.ok(text.every(item => item.size >= 7.5 && item.y >= 28 && item.y < 595.28 - 28
				&& item.x >= 28 && item.x + measure.fontSize(item.size).widthOfString(item.text) <= 841.89 - 28));
			measure.end();
			const dateCells = text.filter(item => item.x === 31 && item.text !== 'Date').map(item => item.text);
			const expected: string[] = [];
			const end = customPeriodEnd(start);
			for (let date = start; ; date = addDays(date, 1)) {
				expected.push(dateLabel(date));
				if (date === end) {
					break;
				}
			}
			assert.deepStrictEqual(dateCells, expected);
			assert.ok(text.some(item => item.text === '0h 00m'));
			assert.ok(text.some(item => item.text.includes(`Reporting period: ${dateLabel(start)} to ${dateLabel(end)}`)));
			assert.ok(text.some(item => item.text === 'Total hours: 0h 00m     Days logged: 0'));
			assert.ok(!text.some(item => item.text.includes('Hourly rate:')));
		}
	});

	test('shows complete, overnight, zero, incomplete and task-only entries, labels and estimate', async () => {
		const entries: Record<string, TimeEntry[]> = {
			'2026-10-24': [
				{ date: '2026-10-24', task: 'Weekend work', timeIn: '22:30', timeOut: '01:15' },
				{ date: '2026-10-24', task: 'Overlapping task', timeIn: '22:00', timeOut: '23:00' },
			],
			'2026-10-25': [{ date: '2026-10-25', task: 'Partial', timeIn: '09:00', timeOut: '' }],
			'2026-10-26': [{ date: '2026-10-26', task: 'Zero', timeIn: '08:00', timeOut: '08:00' }],
			'2026-10-27': [{ date: '2026-10-27', task: 'Task only', timeIn: '', timeOut: '' }],
		};
		const text = pdfText(await renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: 20 }));
		for (const expected of ['Sat (Weekend)', 'Sun (Weekend)', 'INCOMPLETE', 'Weekend work', 'Partial',
			'Overlapping task', 'Task only', 'Entry duration', 'Daily total', '22:30', '01:15', '1h 00m', '3h 45m', '0h 00m',
			'Total hours: 3h 45m     Days logged: 2',
			'Hourly rate: 20     Estimated value (informational): 75.00']) {
			assert.ok(text.some(item => item.text === expected), expected);
		}
		assert.strictEqual(text.filter(item => item.text === '3h 45m').length, 1);
		const zeroRate = pdfText(await renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: 0 }));
		assert.ok(zeroRate.some(item => item.text === 'Hourly rate: 0     Estimated value (informational): 0.00'));
	});

	test('paginates multiple entries per date without dropping entries', async () => {
		const entries: Record<string, TimeEntry[]> = {
			'2026-10-21': Array.from({ length: 60 }, (_, index) => ({
				date: '2026-10-21', task: `Task ${index + 1}`, timeIn: '09:00', timeOut: '09:01',
			})),
		};
		const pdf = await renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: null });
		const pageCount = Number(/\/Count (\d+)/.exec(pdf.toString('latin1'))?.[1]);
		assert.ok(pageCount > 1);
		const text = pdfText(pdf).map(item => item.text);
		assert.strictEqual(text.filter(value => value === 'Entry duration').length, pageCount);
		for (let index = 1; index <= 60; index++) {
			assert.ok(text.includes(`Task ${index}`), `Task ${index}`);
		}
		assert.ok(text.includes('Total hours: 1h 00m     Days logged: 1'));
	});

	test('prints holiday names once per date without changing worked hours or estimates', async () => {
		const entries = { '2026-10-24': [
			{ date: '2026-10-24', task: 'Work', timeIn: '09:00', timeOut: '10:00' },
			{ date: '2026-10-24', task: 'More work', timeIn: '10:00', timeOut: '11:00' },
		] };
		const holidays = [
			{ date: '2026-10-24', name: 'Founders Day' },
			{ date: '2026-10-24', name: 'Festival' },
			{ date: '2026-10-25', name: 'Rest Day' },
			{ date: '2027-10-24', name: 'Next year' },
		];
		const text = pdfText(await renderReportPdf({ entries, holidays, periodStart: '2026-10-21', hourlyRate: 20 })).map(item => item.text);
		for (const name of ['Founders Day', 'Festival', 'Rest Day']) {
			assert.strictEqual(text.filter(value => value === `Public holiday: ${name}`).length, 1);
		}
		assert.ok(!text.some(value => value.includes('Next year')));
		assert.ok(text.includes('Sat (Weekend)'));
		assert.ok(text.includes('Total hours: 2h 00m     Days logged: 1'));
		assert.ok(text.includes('Hourly rate: 20     Estimated value (informational): 40.00'));
		await assert.rejects(renderReportPdf({ entries, holidays: [{ date: '2026-10-24', name: 'F\u00eate' }], periodStart: '2026-10-21', hourlyRate: null }), /holiday.*unsupported characters/);
	});

	test('wraps long tasks without losing spaces or characters', async () => {
		const task = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ '
			+ ' Wide words  and spaces '.repeat(24);
		const entries = { '2026-10-21': [{ date: '2026-10-21', task, timeIn: '', timeOut: '' }] };
		const pdf = await renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: 1.5 });
		assert.ok(Number(/\/Count (\d+)/.exec(pdf.toString('latin1'))?.[1]) >= 1);
		const lines = pdfText(pdf).filter(item => item.x === 171 && item.text !== 'Task');
		assert.ok(lines.length > 1);
		assert.strictEqual(lines.map(item => item.text).join(''), task);
	});

	test('rejects unsupported characters and paginates very long tasks without truncation', async () => {
		for (const task of ['caf\u00e9', 'emoji \u{1f600}', 'tab\there', 'new\nline', 'trailing\n']) {
			const entries = { '2026-10-21': [{ date: '2026-10-21', task, timeIn: '', timeOut: '' }] };
			await assert.rejects(renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: null }),
				/2026-10-21.*unsupported characters/);
		}
		const task = 'W'.repeat(10000);
		const entries = { '2026-10-21': [{ date: '2026-10-21', task, timeIn: '', timeOut: '' }] };
		const pdf = await renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: null });
		assert.ok(Number(/\/Count (\d+)/.exec(pdf.toString('latin1'))?.[1]) > 1);
		const lines = pdfText(pdf).filter(item => item.x === 171 && item.text !== 'Task');
		assert.ok(lines.length > 1);
		assert.strictEqual(lines.map(item => item.text).join(''), task);
	});

	test('rejects invalid input and an unrepresentable estimate instead of producing a misleading PDF', async () => {
		await assert.rejects(renderReportPdf({ entries: {}, periodStart: '2026-02-30', hourlyRate: null }), /invalid period/);
		await assert.rejects(renderReportPdf({ entries: {}, periodStart: '9999-12-31', hourlyRate: null }), /period end/);
		await assert.rejects(renderReportPdf({ entries: {}, periodStart: '2026-10-21', hourlyRate: -1 }), /hourly rate/);
		const entries = { '2026-10-21': [{ date: '2026-10-21', task: 'Work', timeIn: '09:00', timeOut: '10:00' }] };
		await assert.rejects(renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: 1e21 }), /estimated value/);
		entries['2026-10-21'][0].timeIn = '25:00';
		await assert.rejects(renderReportPdf({ entries, periodStart: '2026-10-21', hourlyRate: null }), /Time In/);
	});
});
