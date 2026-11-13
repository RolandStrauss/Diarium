import PDFDocument from 'pdfkit';
import { addDays, customPeriodEnd, durationMinutes, formatDuration, isValidDate, validateEntry, type TimeEntry } from './timeData';

export interface ReportData {
	entries: Record<string, TimeEntry>;
	periodStart: string;
	hourlyRate: number | null;
}

function displayDate(value: string): string {
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(0);
	date.setUTCFullYear(year, month - 1, day);
	return new Intl.DateTimeFormat('en', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(date);
}

function displayDay(value: string): string {
	const date = new Date(`${value}T00:00:00Z`);
	const day = new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'UTC' }).format(date);
	return date.getUTCDay() === 0 || date.getUTCDay() === 6 ? `${day} (Weekend)` : day;
}

export function renderReportPdf(data: ReportData): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		if (!isValidDate(data.periodStart)) {
			throw new Error('Cannot generate PDF: invalid period start date.');
		}
		if (data.hourlyRate !== null && (!Number.isFinite(data.hourlyRate) || data.hourlyRate < 0)) {
			throw new Error('Cannot generate PDF: hourly rate must be finite and non-negative.');
		}
		let end: string;
		try {
			end = customPeriodEnd(data.periodStart);
		} catch {
			throw new Error('Cannot generate PDF: period end is outside the supported calendar.');
		}
		if (!isValidDate(end) || end < data.periodStart) {
			throw new Error('Cannot generate PDF: period end is outside the supported calendar.');
		}

		const document = new PDFDocument({
			layout: 'landscape',
			size: 'A4',
			margins: { top: 28, bottom: 28, left: 28, right: 28 },
			compress: true,
		});
		const chunks: Buffer[] = [];
		document.on('data', (chunk: Buffer) => chunks.push(chunk));
		document.on('error', reject);
		document.on('end', () => resolve(Buffer.concat(chunks)));

		const pageWidth = document.page.width - document.page.margins.left - document.page.margins.right;
		const columnWidths = [70, 80, pageWidth - 70 - 80 - 48 - 48 - 70, 48, 48, 70];
		const padding = 3;
		document.font('Helvetica').fontSize(7.5);
		const lineHeight = document.currentLineHeight(true);
		const rowPadding = 2;
		const rows: { values: string[]; taskLines: string[]; height: number; fill: string }[] = [];
		let totalMinutes = 0;
		let daysLogged = 0;
		for (let date = data.periodStart; ; date = addDays(date, 1)) {
			const entry = data.entries[date] ?? { date, task: '', timeIn: '', timeOut: '' };
			if (data.entries[date]) {
				const error = validateEntry(entry);
				if (entry.date !== date || error) {
					throw new Error(`Cannot generate PDF: invalid entry for ${date}. ${error ?? 'Entry date does not match.'}`);
				}
			}
			// PDFKit's built-in Helvetica substitutes non-ASCII characters, so reject them instead.
			if (/[^\x20-\x7e]/.test(entry.task)) {
				throw new Error(`Cannot generate PDF: task for ${date} contains unsupported characters; only printable ASCII is supported.`);
			}
			const taskLines: string[] = [];
			let line = '';
			for (const character of entry.task) {
				if (document.widthOfString(line + character) > columnWidths[2] - padding * 2) {
					if (!line) {
						throw new Error(`Cannot generate PDF: task for ${date} cannot fit in the task column.`);
					}
					taskLines.push(line);
					line = '';
				}
				line += character;
			}
			if (line || !taskLines.length) {
				taskLines.push(line);
			}
			const minutes = durationMinutes(entry);
			const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut);
			if (minutes !== undefined) {
				totalMinutes += minutes;
				daysLogged++;
			}
			const weekend = new Date(`${date}T00:00:00Z`).getUTCDay() % 6 === 0;
			rows.push({
				values: [displayDate(date), displayDay(date), entry.task, entry.timeIn, entry.timeOut,
					minutes === undefined ? (incomplete ? 'INCOMPLETE' : '') : formatDuration(minutes)],
				taskLines,
				height: taskLines.length * lineHeight + rowPadding,
				fill: incomplete ? '#fff2cc' : weekend ? '#eeeeee' : '#ffffff',
			});
			if (date === end) {
				break;
			}
		}

		const estimate = data.hourlyRate === null ? null : totalMinutes / 60 * data.hourlyRate;
		if (estimate !== null && (!Number.isFinite(estimate) || estimate >= 1e21)) {
			throw new Error('Cannot generate PDF: estimated value is too large to display to two decimal places.');
		}
		const summary = `Total hours: ${formatDuration(totalMinutes)}     Days logged: ${daysLogged}`;
		const rate = estimate === null ? null : `Hourly rate: ${data.hourlyRate}     Estimated value (informational): ${estimate.toFixed(2)}`;
		const footer = `Generated ${displayDate(new Date().toISOString().slice(0, 10))}. Weekend and incomplete entries are labeled.`;
		const headers = ['Date', 'Day', 'Task', 'Time In', 'Time Out', 'Duration'];
		const period = `Reporting period: ${displayDate(data.periodStart)} to ${displayDate(end)}`;
		const headerHeight = lineHeight + rowPadding;
		const requiredHeight = 20 + 16 + headerHeight + rows.reduce((sum, row) => sum + row.height, 0)
			+ 8 + 14 + (rate === null ? 0 : 14) + lineHeight;
		if (requiredHeight > document.page.height - document.page.margins.top - document.page.margins.bottom) {
			throw new Error('Cannot generate PDF: all task content does not fit on one landscape A4 page at 7.5-point type.');
		}
		document.font('Helvetica-Bold').fontSize(7.5);
		if (headers.some((value, index) => document.widthOfString(value) > columnWidths[index] - padding * 2)) {
			throw new Error('Cannot generate PDF: a column heading does not fit.');
		}
		document.font('Helvetica').fontSize(7.5);
		for (const row of rows) {
			if (row.values.some((value, index) => index !== 2 && document.widthOfString(value) > columnWidths[index] - padding * 2)) {
				throw new Error('Cannot generate PDF: a report value does not fit in its column.');
			}
		}
		if ((rate !== null && document.widthOfString(rate) > pageWidth) || document.widthOfString(footer) > pageWidth) {
			throw new Error('Cannot generate PDF: report summary does not fit on one page.');
		}
		document.font('Helvetica-Bold').fontSize(9);
		if (document.widthOfString(summary) > pageWidth) {
			throw new Error('Cannot generate PDF: report summary does not fit on one page.');
		}
		document.font('Helvetica').fontSize(9);
		if (document.widthOfString(period) > pageWidth) {
			throw new Error('Cannot generate PDF: period does not fit on one page.');
		}

		let y = document.page.margins.top;
		const left = document.page.margins.left;
		document.font('Helvetica-Bold').fontSize(14).fillColor('#202020')
			.text('Time Tracker', left, y, { lineBreak: false });
		y += 20;
		document.font('Helvetica').fontSize(9).fillColor('#333333')
			.text(period, left, y, { lineBreak: false });
		y += 16;
		const drawRow = (values: string[], taskLines: string[], height: number, fill: string, bold = false): void => {
			let x = left;
			document.rect(x, y, pageWidth, height).fill(fill);
			for (let index = 0; index < values.length; index++) {
				const width = columnWidths[index];
				document.rect(x, y, width, height).lineWidth(0.35).stroke('#999999');
				document.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(7.5).fillColor('#222222');
				const lines = index === 2 ? taskLines : [values[index]];
				lines.forEach((text, lineIndex) => {
					document.text(text, x + padding, y + rowPadding / 2 + lineIndex * lineHeight, { lineBreak: false });
				});
				x += width;
			}
			y += height;
		};
		drawRow(headers, [headers[2]], headerHeight, '#dddddd', true);
		for (const row of rows) {
			drawRow(row.values, row.taskLines, row.height, row.fill);
		}
		y += 8;
		document.font('Helvetica-Bold').fontSize(9).fillColor('#202020')
			.text(summary, left, y, { lineBreak: false });
		y += 14;
		if (rate !== null) {
			document.font('Helvetica').fontSize(7.5)
				.text(rate, left, y, { lineBreak: false });
			y += 14;
		}
		document.font('Helvetica').fontSize(7.5).fillColor('#555555')
			.text(footer, left, y, { lineBreak: false });
		document.end();
	});
}
