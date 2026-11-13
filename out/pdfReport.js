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
    return new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
}
function displayDay(value) {
    const date = new Date(`${value}T00:00:00Z`);
    const day = new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'UTC' }).format(date);
    return date.getUTCDay() === 0 || date.getUTCDay() === 6 ? `${day} (Weekend)` : day;
}
function renderReportPdf(data) {
    return new Promise((resolve, reject) => {
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
        const start = data.periodStart;
        const end = (0, timeData_1.customPeriodEnd)(start);
        const pageWidth = document.page.width - document.page.margins.left - document.page.margins.right;
        const columnWidths = [70, 94, pageWidth - 70 - 94 - 58 - 58 - 82, 58, 58, 82];
        const rowHeight = 14;
        let y = document.page.margins.top;
        document.font('Helvetica-Bold').fontSize(14).fillColor('#202020')
            .text('Time Tracker', document.page.margins.left, y);
        y += 20;
        document.font('Helvetica').fontSize(9).fillColor('#333333')
            .text(`Reporting period: ${displayDate(start)} to ${displayDate(end)}`, document.page.margins.left, y);
        y += 16;
        const headers = ['Date', 'Day', 'Task', 'Time In', 'Time Out', 'Duration'];
        const drawRow = (values, fill, bold = false) => {
            let x = document.page.margins.left;
            document.rect(x, y, pageWidth, rowHeight).fill(fill);
            for (let index = 0; index < values.length; index++) {
                const width = columnWidths[index];
                document.rect(x, y, width, rowHeight).lineWidth(0.35).stroke('#999999');
                document.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(7.5).fillColor('#222222')
                    .text(values[index], x + 4, y + 3, { width: width - 8, height: rowHeight - 4, ellipsis: true, lineBreak: false });
                x += width;
            }
            y += rowHeight;
        };
        drawRow(headers, '#dddddd', true);
        let totalMinutes = 0;
        let daysLogged = 0;
        for (let date = start; date <= end; date = (0, timeData_1.addDays)(date, 1)) {
            const entry = data.entries[date] ?? { date, task: '', timeIn: '', timeOut: '' };
            const minutes = (0, timeData_1.durationMinutes)(entry);
            const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut);
            if (minutes !== undefined) {
                totalMinutes += minutes;
                daysLogged++;
            }
            const weekend = new Date(`${date}T00:00:00Z`).getUTCDay() % 6 === 0;
            drawRow([
                displayDate(date),
                displayDay(date),
                entry.task,
                entry.timeIn,
                entry.timeOut,
                minutes === undefined ? (incomplete ? 'INCOMPLETE' : '') : (0, timeData_1.formatDuration)(minutes),
            ], incomplete ? '#fff2cc' : weekend ? '#eeeeee' : '#ffffff');
        }
        y += 8;
        document.font('Helvetica-Bold').fontSize(9).fillColor('#202020')
            .text(`Total hours: ${(0, timeData_1.formatDuration)(totalMinutes)}     Days logged: ${daysLogged}`, document.page.margins.left, y);
        if (data.hourlyRate !== null) {
            y += 14;
            document.font('Helvetica').fontSize(8)
                .text(`Estimated value (informational): ${(totalMinutes / 60 * data.hourlyRate).toFixed(2)}`, document.page.margins.left, y);
        }
        y += 15;
        document.font('Helvetica').fontSize(7).fillColor('#555555')
            .text(`Generated ${displayDate(new Date().toISOString().slice(0, 10))}. Weekend and incomplete entries are labeled.`, document.page.margins.left, y);
        document.end();
    });
}
//# sourceMappingURL=pdfReport.js.map