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
const assert = __importStar(require("node:assert"));
const node_zlib_1 = require("node:zlib");
const timeCard_1 = require("../timeCard");
suite('Time cards', () => {
    const now = new Date('2026-11-13T08:00:00Z');
    test('uses exact time for totals and shares, sorts files, and numbers repeated basenames', () => {
        const times = { 'C:\\private\\same.ts': 90_000, 'C:\\other\\same.ts': 30_000, 'C:\\private\\zero.ts': 0 };
        const card = (0, timeCard_1.createTimeCard)(times, now);
        assert.strictEqual(card.totalMilliseconds, 120_000);
        assert.deepStrictEqual(card.files, [
            { name: 'same.ts (1)', milliseconds: 90_000, percent: 75 },
            { name: 'same.ts (2)', milliseconds: 30_000, percent: 25 },
            { name: 'zero.ts', milliseconds: 0, percent: 0 },
        ]);
        assert.strictEqual(times['C:\\private\\same.ts'], 90_000);
        assert.ok(!JSON.stringify(card).includes('private'));
    });
    test('handles empty and zero-duration data without invalid bar widths', () => {
        const empty = (0, timeCard_1.createTimeCard)({}, now);
        assert.match((0, timeCard_1.renderTimeCardHtml)(empty), /No files tracked yet/);
        const zero = (0, timeCard_1.createTimeCard)({ 'C:\\zero.ts': 0 }, now);
        assert.strictEqual(zero.files[0].percent, 0);
        assert.ok(!/NaN|Infinity/.test((0, timeCard_1.renderTimeCardHtml)(zero)));
    });
    test('rejects invalid durations rather than exporting misleading totals', () => {
        for (const value of [-1, NaN, Infinity]) {
            assert.throws(() => (0, timeCard_1.createTimeCard)({ file: value }, now), /finite/);
        }
        assert.throws(() => (0, timeCard_1.createTimeCard)({ a: Number.MAX_VALUE, b: Number.MAX_VALUE }, now), /too large/);
    });
    test('escapes file names and exports standalone HTML without host scripts or private paths', () => {
        const card = (0, timeCard_1.createTimeCard)({ 'C:\\private\\<img onerror="bad">&.ts': 60_000 }, now);
        const html = (0, timeCard_1.renderTimeCardHtml)(card);
        assert.match(html, /&lt;img onerror=&quot;bad&quot;&gt;&amp;\.ts/);
        assert.ok(!html.includes('<img'));
        assert.ok(!html.includes('private'));
        assert.ok(!html.includes('acquireVsCodeApi'));
        assert.ok(!html.includes('<script'));
        assert.match(html, /prefers-reduced-motion: reduce/);
        assert.match(html, /@media print/);
        assert.match(html, /script-src 'none'/);
        const preview = (0, timeCard_1.renderTimeCardHtml)(card, { nonce: 'test-nonce' });
        assert.match(preview, /script-src 'nonce-test-nonce'/);
        assert.match(preview, /id="save-html"/);
        assert.match(preview, /id="save-pdf"/);
    });
    function pdfStreams(pdf) {
        const contents = pdf.toString('latin1');
        return Array.from(contents.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g), match => (0, node_zlib_1.inflateSync)(Buffer.from(match[1], 'latin1')).toString('latin1')).join('\n');
    }
    test('exports every file across PDF pages without clipping the last row', async () => {
        const files = Object.fromEntries(Array.from({ length: 45 }, (_, index) => [`C:\\private\\file-${String(index).padStart(2, '0')}.ts`, (45 - index) * 60_000]));
        const pdf = await (0, timeCard_1.renderTimeCardPdf)((0, timeCard_1.createTimeCard)(files, now));
        assert.strictEqual(pdf.subarray(0, 5).toString(), '%PDF-');
        assert.ok(pdf.includes(Buffer.from('%%EOF')));
        assert.ok((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length > 1);
        const streams = pdfStreams(pdf);
        const text = Array.from(streams.matchAll(/<([0-9a-f]+)>/gi), match => Buffer.from(match[1], 'hex').toString('latin1')).join('');
        for (let index = 0; index < 45; index++) {
            const name = `file-${String(index).padStart(2, '0')}.ts`;
            assert.ok(text.includes(name), `Missing PDF file: ${name}`);
        }
        assert.ok(!text.includes('private'));
        for (const block of streams.matchAll(/BT([\s\S]*?)ET/g)) {
            const content = Array.from(block[1].matchAll(/<([0-9a-f]+)>/gi), match => Buffer.from(match[1], 'hex').toString('latin1')).join('');
            if (content.startsWith('file-')) {
                assert.match(block[1], /\/F\d+ 11 Tf/, 'File typography must stay consistent after page breaks');
            }
        }
    });
    test('renders empty PDFs and handles long file names without adding blank pages', async () => {
        const empty = await (0, timeCard_1.renderTimeCardPdf)((0, timeCard_1.createTimeCard)({}, now));
        assert.strictEqual((empty.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length, 1);
        const pdf = await (0, timeCard_1.renderTimeCardPdf)((0, timeCard_1.createTimeCard)({ [`C:\\private\\${'long-name-'.repeat(24)}.ts`]: 60_000 }, now));
        assert.strictEqual((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length, 1);
    });
    test('does not silently corrupt names unsupported by the built-in PDF fonts', async () => {
        const card = (0, timeCard_1.createTimeCard)({ 'C:\\private\\時間.ts': 60_000 }, now);
        assert.match((0, timeCard_1.renderTimeCardHtml)(card), /時間\.ts/);
        await assert.rejects((0, timeCard_1.renderTimeCardPdf)(card), /Save HTML and print it from your browser/);
    });
});
//# sourceMappingURL=timeCard.test.js.map