import * as assert from 'node:assert';
import { inflateSync } from 'node:zlib';
import { getFloatingTimerHtml } from '../floatingTimer';
import { createTimeCard, renderTimeCardHtml, renderTimeCardPdf } from '../timeCard';

suite('Time cards', () => {
	const now = new Date('2026-11-13T08:00:00Z');

	test('uses exact time for totals and shares, sorts files, and numbers repeated basenames', () => {
		const times = { 'C:\\private\\same.ts': 90_000, 'C:\\other\\same.ts': 30_000, 'C:\\private\\zero.ts': 0 };
		const card = createTimeCard(times, now);
		assert.strictEqual(card.totalMilliseconds, 120_000);
		assert.deepStrictEqual(card.files, [
			{ name: 'same.ts (1)', milliseconds: 90_000, percent: 75 },
			{ name: 'same.ts (2)', milliseconds: 30_000, percent: 25 },
			{ name: 'zero.ts', milliseconds: 0, percent: 0 },
		]);
		assert.strictEqual(times['C:\\private\\same.ts'], 90_000);
		assert.ok(!JSON.stringify(card).includes('private'));
		const collision = createTimeCard({ ...times, 'C:\\private\\same.ts (1)': 60_000 }, now);
		assert.strictEqual(new Set(collision.files.map(file => file.name)).size, collision.files.length);
	});

	test('handles empty and zero-duration data without invalid bar widths', () => {
		const empty = createTimeCard({}, now);
		assert.match(renderTimeCardHtml(empty), /No files tracked yet/);
		const zero = createTimeCard({ 'C:\\zero.ts': 0 }, now);
		assert.strictEqual(zero.files[0].percent, 0);
		assert.ok(!/NaN|Infinity/.test(renderTimeCardHtml(zero)));
	});

	test('rejects invalid durations rather than exporting misleading totals', () => {
		for (const value of [-1, NaN, Infinity]) {
			assert.throws(() => createTimeCard({ file: value }, now), /finite/);
		}
		assert.throws(() => createTimeCard({ a: Number.MAX_VALUE, b: Number.MAX_VALUE }, now), /too large/);
	});

	test('escapes file names and exports standalone HTML without host scripts or private paths', () => {
		const card = createTimeCard({ 'C:\\private\\<img onerror="bad">&.ts': 60_000 }, now);
		const html = renderTimeCardHtml(card);
		assert.match(html, /&lt;img onerror=&quot;bad&quot;&gt;&amp;\.ts/);
		assert.ok(!html.includes('<img'));
		assert.ok(!html.includes('private'));
		assert.ok(!html.includes('acquireVsCodeApi'));
		assert.ok(!html.includes('<script'));
		assert.match(html, /prefers-reduced-motion: reduce/);
		assert.match(html, /@media \(forced-colors: active\)/);
		assert.match(html, /@media print/);
		assert.match(html, /background: white; color: #111/);
		assert.match(html, /script-src 'none'/);
		const preview = renderTimeCardHtml(card, { nonce: 'test-nonce' });
		assert.match(preview, /script-src 'nonce-test-nonce'/);
		assert.match(preview, /id="save-html"/);
		assert.match(preview, /id="save-pdf"/);
	});

	test('renders timer and card controls for keyboard and high-contrast use', () => {
		const timer = getFloatingTimerHtml();
		assert.match(timer, /id="toggle" type="button" aria-pressed="false"/);
		assert.match(timer, /setAttribute\('aria-pressed', String\(message\.paused\)\)/);
		assert.match(timer, /button:focus-visible/);
		assert.match(timer, /@media \(forced-colors: active\)/);
		const preview = renderTimeCardHtml(createTimeCard({ file: 1 }, now), { nonce: 'test-nonce' });
		assert.match(preview, /<nav class="actions" aria-label="Time card actions">/);
		assert.match(preview, /button:focus-visible/);
	});

	function pdfStreams(pdf: Buffer): string {
		const contents = pdf.toString('latin1');
		return Array.from(contents.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g),
			match => inflateSync(Buffer.from(match[1], 'latin1')).toString('latin1')).join('\n');
	}

	test('exports every file across PDF pages without clipping the last row', async () => {
		const files = Object.fromEntries(Array.from({ length: 45 }, (_, index) =>
			[`C:\\private\\file-${String(index).padStart(2, '0')}.ts`, (45 - index) * 60_000]));
		const pdf = await renderTimeCardPdf(createTimeCard(files, now));
		assert.strictEqual(pdf.subarray(0, 5).toString(), '%PDF-');
		assert.ok(pdf.includes(Buffer.from('%%EOF')));
		assert.ok((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length > 1);
		const streams = pdfStreams(pdf);
		const text = Array.from(streams.matchAll(/<([0-9a-f]+)>/gi),
			match => Buffer.from(match[1], 'hex').toString('latin1')).join('');
		for (let index = 0; index < 45; index++) {
			const name = `file-${String(index).padStart(2, '0')}.ts`;
			assert.ok(text.includes(name), `Missing PDF file: ${name}`);
		}
		assert.ok(!text.includes('private'));
		for (const block of streams.matchAll(/BT([\s\S]*?)ET/g)) {
			const content = Array.from(block[1].matchAll(/<([0-9a-f]+)>/gi),
				match => Buffer.from(match[1], 'hex').toString('latin1')).join('');
			if (content.startsWith('file-')) {
				assert.match(block[1], /\/F\d+ 11 Tf/, 'File typography must stay consistent after page breaks');
			}
		}
	});

	test('renders empty PDFs and handles long file names without adding blank pages', async () => {
		const empty = await renderTimeCardPdf(createTimeCard({}, now));
		assert.strictEqual((empty.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length, 1);
		const pdf = await renderTimeCardPdf(createTimeCard({ [`C:\\private\\${'long-name-'.repeat(24)}.ts`]: 60_000 }, now));
		assert.strictEqual((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length, 1);
	});

	test('does not silently corrupt names unsupported by the built-in PDF fonts', async () => {
		const card = createTimeCard({ 'C:\\private\\時間.ts': 60_000 }, now);
		assert.match(renderTimeCardHtml(card), /時間\.ts/);
		await assert.rejects(renderTimeCardPdf(card), /Save HTML and print it from your browser/);
	});
});
