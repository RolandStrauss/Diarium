"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderReportPdf = renderReportPdf;
const pdfkit_1 = __importDefault(require("pdfkit"));
const timeData_1 = require("./timeData");
function displayDate(value) {
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
function displayDay(value) {
    const date = new Date(`${value}T00:00:00Z`);
    const day = new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'UTC' }).format(date);
    return date.getUTCDay() === 0 || date.getUTCDay() === 6 ? `${day} (Weekend)` : day;
}
function entriesForDate(entries, date) {
    return entries[date] ?? [];
}
function renderReportPdf(data) {
    return new Promise((resolve, reject) => {
        if (!(0, timeData_1.isValidDate)(data.periodStart)) {
            throw new Error('Cannot generate PDF: invalid period start date.');
        }
        if (data.hourlyRate !== null && (!Number.isFinite(data.hourlyRate) || data.hourlyRate < 0)) {
            throw new Error('Cannot generate PDF: hourly rate must be finite and non-negative.');
        }
        let end;
        try {
            end = (0, timeData_1.customPeriodEnd)(data.periodStart);
        }
        catch {
            throw new Error('Cannot generate PDF: period end is outside the supported calendar.');
        }
        if (!(0, timeData_1.isValidDate)(end) || end < data.periodStart) {
            throw new Error('Cannot generate PDF: period end is outside the supported calendar.');
        }
        const document = new pdfkit_1.default({
            layout: 'landscape',
            size: 'A4',
            margins: { top: 28, bottom: 28, left: 28, right: 28 },
            compress: true,
        });
        const chunks = [];
        document.on('data', (chunk) => chunks.push(chunk));
        document.on('error', reject);
        document.on('end', () => resolve(Buffer.concat(chunks)));
        const pageWidth = document.page.width - document.page.margins.left - document.page.margins.right;
        const columnWidths = [70, 70, pageWidth - 70 - 70 - 48 - 48 - 60 - 70, 48, 48, 60, 70];
        const padding = 3;
        document.font('Helvetica').fontSize(7.5);
        const lineHeight = document.currentLineHeight(true);
        const rowPadding = 2;
        const rows = [];
        let totalMinutes = 0;
        const loggedDates = new Set();
        for (let date = data.periodStart;; date = (0, timeData_1.addDays)(date, 1)) {
            const entries = entriesForDate(data.entries, date);
            const holidays = (data.holidays ?? []).filter(holiday => holiday.date === date);
            const rowsForDate = entries.length ? entries : [{ date, task: '', timeIn: '', timeOut: '' }];
            const completed = entries.map(timeData_1.durationMinutes).filter((minutes) => minutes !== undefined);
            const dailyMinutes = completed.reduce((sum, minutes) => sum + minutes, 0);
            const dailyTotal = (0, timeData_1.formatDuration)(dailyMinutes);
            if (completed.length) {
                loggedDates.add(date);
                totalMinutes += dailyMinutes;
            }
            for (const [index, entry] of rowsForDate.entries()) {
                if (entries.length) {
                    const error = (0, timeData_1.validateEntry)(entry);
                    if (entry.date !== date || error) {
                        throw new Error(`Cannot generate PDF: invalid entry for ${date}. ${error ?? 'Entry date does not match.'}`);
                    }
                }
                if (/[^\x20-\x7e]/.test(entry.task)) {
                    throw new Error(`Cannot generate PDF: task for ${date} contains unsupported characters; only printable ASCII is supported.`);
                }
                const labels = index === 0 ? holidays.map(holiday => `Public holiday: ${holiday.name}`) : [];
                if (labels.some(label => /[^\x20-\x7e]/.test(label))) {
                    throw new Error(`Cannot generate PDF: holiday for ${date} contains unsupported characters; only printable ASCII is supported.`);
                }
                const taskLines = [];
                for (const text of [...labels, entry.task]) {
                    let line = '';
                    for (const character of text) {
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
                }
                const minutes = (0, timeData_1.durationMinutes)(entry);
                const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut);
                const weekend = new Date(`${date}T00:00:00Z`).getUTCDay() % 6 === 0;
                rows.push({
                    values: [displayDate(date), displayDay(date), entry.task, entry.timeIn, entry.timeOut,
                        minutes === undefined ? (incomplete ? 'INCOMPLETE' : '') : (0, timeData_1.formatDuration)(minutes),
                        index === 0 ? dailyTotal : ''],
                    taskLines,
                    fill: incomplete ? '#fff2cc' : weekend ? '#eeeeee' : '#ffffff',
                });
            }
            if (date === end) {
                break;
            }
        }
        const estimate = data.hourlyRate === null ? null : totalMinutes / 60 * data.hourlyRate;
        if (estimate !== null && (!Number.isFinite(estimate) || estimate >= 1e21)) {
            throw new Error('Cannot generate PDF: estimated value is too large to display to two decimal places.');
        }
        const summary = `Total hours: ${(0, timeData_1.formatDuration)(totalMinutes)}     Days logged: ${loggedDates.size}`;
        const rate = estimate === null ? null : `Hourly rate: ${data.hourlyRate}     Estimated value (informational): ${estimate.toFixed(2)}`;
        const footer = `Generated ${displayDate(new Date().toISOString().slice(0, 10))}. Weekend and incomplete entries are labeled.`;
        const headers = ['Date', 'Day', 'Task', 'Time In', 'Time Out', 'Entry duration', 'Daily total'];
        const period = `Reporting period: ${displayDate(data.periodStart)} to ${displayDate(end)}`;
        const headerHeight = lineHeight + rowPadding;
        const summaryHeight = 8 + 14 + (rate === null ? 0 : 14) + lineHeight;
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
            throw new Error('Cannot generate PDF: report summary does not fit on the page.');
        }
        document.font('Helvetica-Bold').fontSize(9);
        if (document.widthOfString(summary) > pageWidth) {
            throw new Error('Cannot generate PDF: report summary does not fit on the page.');
        }
        document.font('Helvetica').fontSize(9);
        if (document.widthOfString(period) > pageWidth) {
            throw new Error('Cannot generate PDF: period does not fit on the page.');
        }
        const left = document.page.margins.left;
        let y = 0;
        let hasPage = false;
        const drawRow = (values, taskLines, fill, bold = false) => {
            const height = lineHeight + rowPadding;
            let x = left;
            document.rect(x, y, pageWidth, height).fill(fill);
            for (let index = 0; index < values.length; index++) {
                const width = columnWidths[index];
                document.rect(x, y, width, height).lineWidth(0.35).stroke('#999999');
                document.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(7.5).fillColor('#222222');
                document.text(index === 2 ? taskLines[0] : values[index], x + padding, y + rowPadding / 2, { lineBreak: false });
                x += width;
            }
            y += height;
        };
        const startPage = () => {
            if (hasPage) {
                document.addPage();
            }
            else {
                hasPage = true;
            }
            y = document.page.margins.top;
            document.font('Helvetica-Bold').fontSize(14).fillColor('#202020')
                .text('Time Tracker', left, y, { lineBreak: false });
            y += 20;
            document.font('Helvetica').fontSize(9).fillColor('#333333')
                .text(period, left, y, { lineBreak: false });
            y += 16;
            drawRow(headers, [headers[2]], '#dddddd', true);
        };
        startPage();
        const pageBottom = () => document.page.height - document.page.margins.bottom;
        const maxTaskLines = () => Math.max(1, Math.floor((pageBottom() - y - rowPadding) / lineHeight));
        for (const row of rows) {
            let offset = 0;
            let first = true;
            while (offset < row.taskLines.length) {
                const count = Math.min(row.taskLines.length - offset, maxTaskLines());
                if (y + count * lineHeight + rowPadding > pageBottom()) {
                    startPage();
                    continue;
                }
                const lines = row.taskLines.slice(offset, offset + count);
                const values = first ? row.values : [row.values[0], row.values[1], '', '', '', '', ''];
                let x = left;
                const height = count * lineHeight + rowPadding;
                document.rect(x, y, pageWidth, height).fill(row.fill);
                for (let index = 0; index < values.length; index++) {
                    const width = columnWidths[index];
                    document.rect(x, y, width, height).lineWidth(0.35).stroke('#999999');
                    document.font('Helvetica').fontSize(7.5).fillColor('#222222');
                    (index === 2 ? lines : [values[index]]).forEach((text, lineIndex) => {
                        document.text(text, x + padding, y + rowPadding / 2 + lineIndex * lineHeight, { lineBreak: false });
                    });
                    x += width;
                }
                y += height;
                offset += count;
                first = false;
                if (offset < row.taskLines.length) {
                    startPage();
                }
            }
        }
        if (y + summaryHeight > pageBottom()) {
            startPage();
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
//# sourceMappingURL=pdfReport.js.map