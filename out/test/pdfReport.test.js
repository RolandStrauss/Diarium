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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("node:assert"));
const node_zlib_1 = require("node:zlib");
const pdfkit_1 = __importDefault(require("pdfkit"));
const pdfReport_1 = require("../pdfReport");
const timeData_1 = require("../timeData");
function pdfText(pdf) {
    const source = pdf.toString('latin1');
    const texts = [];
    for (const stream of source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
        let content;
        try {
            content = (0, node_zlib_1.inflateSync)(Buffer.from(stream[1], 'latin1')).toString('latin1');
        }
        catch {
            continue;
        }
        for (const block of content.matchAll(/BT\n([\s\S]*?)\nET/g)) {
            const position = /1 0 0 1 ([\d.]+) ([\d.]+) Tm/.exec(block[1]);
            const size = /\/F\d+ ([\d.]+) Tf/.exec(block[1]);
            assert.ok(position);
            assert.ok(size);
            const text = Array.from(block[1].matchAll(/<([0-9a-f]+)>/gi), match => Buffer.from(match[1], 'hex').toString('latin1')).join('');
            texts.push({ text, x: Number(position[1]), y: Number(position[2]), size: Number(size[1]) });
        }
    }
    return texts;
}
function dateLabel(date) {
    return new Intl.DateTimeFormat('en', {
        day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
}
suite('Timesheet PDF', () => {
    test('fits every date of supported short and long cycles on one landscape A4 page', async () => {
        for (const start of ['0001-01-01', '2024-02-01', '2024-01-31', '2026-10-21', '2026-12-21', '9999-12-01']) {
            const pdf = await (0, pdfReport_1.renderReportPdf)({ entries: {}, periodStart: start, hourlyRate: null });
            const source = pdf.toString('latin1');
            assert.match(source, /\/Count 1\b/);
            assert.match(source, /\/MediaBox \[0 0 841\.89 595\.28\]/);
            const text = pdfText(pdf);
            const measure = new pdfkit_1.default();
            assert.ok(text.every(item => item.size >= 7.5 && item.y >= 28 && item.y < 595.28 - 28
                && item.x >= 28 && item.x + measure.fontSize(item.size).widthOfString(item.text) <= 841.89 - 28));
            measure.end();
            const dateCells = text.filter(item => item.x === 31 && item.text !== 'Date').map(item => item.text);
            const expected = [];
            const end = (0, timeData_1.customPeriodEnd)(start);
            for (let date = start;; date = (0, timeData_1.addDays)(date, 1)) {
                expected.push(dateLabel(date));
                if (date === end) {
                    break;
                }
            }
            assert.deepStrictEqual(dateCells, expected);
            assert.ok(text.some(item => item.text.includes(`Reporting period: ${dateLabel(start)} to ${dateLabel(end)}`)));
            assert.ok(text.some(item => item.text === 'Total hours: 0h 00m     Days logged: 0'));
            assert.ok(!text.some(item => item.text.includes('Hourly rate:')));
        }
    });
    test('shows complete, overnight, zero, incomplete and task-only entries, labels and estimate', async () => {
        const entries = {
            '2026-10-24': { date: '2026-10-24', task: 'Weekend work', timeIn: '22:30', timeOut: '01:15' },
            '2026-10-25': { date: '2026-10-25', task: 'Partial', timeIn: '09:00', timeOut: '' },
            '2026-10-26': { date: '2026-10-26', task: 'Zero', timeIn: '08:00', timeOut: '08:00' },
            '2026-10-27': { date: '2026-10-27', task: 'Task only', timeIn: '', timeOut: '' },
        };
        const text = pdfText(await (0, pdfReport_1.renderReportPdf)({ entries, periodStart: '2026-10-21', hourlyRate: 20 }));
        for (const expected of ['Sat (Weekend)', 'Sun (Weekend)', 'INCOMPLETE', 'Weekend work', 'Partial',
            'Task only', '22:30', '01:15', '2h 45m', '0h 00m',
            'Total hours: 2h 45m     Days logged: 2',
            'Hourly rate: 20     Estimated value (informational): 55.00']) {
            assert.ok(text.some(item => item.text === expected), expected);
        }
        const zeroRate = pdfText(await (0, pdfReport_1.renderReportPdf)({ entries, periodStart: '2026-10-21', hourlyRate: 0 }));
        assert.ok(zeroRate.some(item => item.text === 'Hourly rate: 0     Estimated value (informational): 0.00'));
    });
    test('wraps long tasks without losing spaces or characters', async () => {
        const task = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ '
            + ' Wide words  and spaces '.repeat(24);
        const entries = { '2026-10-21': { date: '2026-10-21', task, timeIn: '', timeOut: '' } };
        const pdf = await (0, pdfReport_1.renderReportPdf)({ entries, periodStart: '2026-10-21', hourlyRate: 1.5 });
        assert.match(pdf.toString('latin1'), /\/Count 1\b/);
        const lines = pdfText(pdf).filter(item => item.x === 181 && item.text !== 'Task');
        assert.ok(lines.length > 1);
        assert.strictEqual(lines.map(item => item.text).join(''), task);
    });
    test('rejects unsupported characters, control characters, and tasks that cannot fit', async () => {
        for (const task of ['caf\u00e9', 'emoji \u{1f600}', 'tab\there', 'new\nline', 'trailing\n']) {
            const entries = { '2026-10-21': { date: '2026-10-21', task, timeIn: '', timeOut: '' } };
            await assert.rejects((0, pdfReport_1.renderReportPdf)({ entries, periodStart: '2026-10-21', hourlyRate: null }), /2026-10-21.*unsupported characters/);
        }
        const entries = { '2026-10-21': { date: '2026-10-21', task: 'W'.repeat(10000), timeIn: '', timeOut: '' } };
        await assert.rejects((0, pdfReport_1.renderReportPdf)({ entries, periodStart: '2026-10-21', hourlyRate: null }), /does not fit on one landscape A4 page/);
    });
    test('rejects invalid input and an unrepresentable estimate instead of producing a misleading PDF', async () => {
        await assert.rejects((0, pdfReport_1.renderReportPdf)({ entries: {}, periodStart: '2026-02-30', hourlyRate: null }), /invalid period/);
        await assert.rejects((0, pdfReport_1.renderReportPdf)({ entries: {}, periodStart: '9999-12-31', hourlyRate: null }), /period end/);
        await assert.rejects((0, pdfReport_1.renderReportPdf)({ entries: {}, periodStart: '2026-10-21', hourlyRate: -1 }), /hourly rate/);
        const entries = { '2026-10-21': { date: '2026-10-21', task: 'Work', timeIn: '09:00', timeOut: '10:00' } };
        await assert.rejects((0, pdfReport_1.renderReportPdf)({ entries, periodStart: '2026-10-21', hourlyRate: 1e21 }), /estimated value/);
        entries['2026-10-21'].timeIn = '25:00';
        await assert.rejects((0, pdfReport_1.renderReportPdf)({ entries, periodStart: '2026-10-21', hourlyRate: null }), /Time In/);
    });
});
//# sourceMappingURL=pdfReport.test.js.map