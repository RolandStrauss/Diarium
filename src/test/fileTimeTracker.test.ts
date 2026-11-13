import * as assert from 'node:assert';
import { performance } from 'node:perf_hooks';
import { runInNewContext } from 'node:vm';
import { FileTimeTracker, parseFileTimeTotals, summarizeFileTime } from '../fileTimeTracker';

suite('File time tracker', () => {
	test('default clock measures elapsed time independently of wall-clock changes', async () => {
		const originalDateNow = Date.now;
		const originalPerformanceNow = Object.getOwnPropertyDescriptor(performance, 'now');
		let elapsed = 0;
		try {
			Object.defineProperty(performance, 'now', { configurable: true, value: () => elapsed });
			Date.now = () => 1_000_000;
			const tracker = new FileTimeTracker({}, async () => {});
			await tracker.setActiveFile('file');
			Date.now = () => 100;
			elapsed = 10;
			await tracker.checkpoint();
			Date.now = () => 100_000_000;
			elapsed = 25;
			assert.strictEqual(tracker.snapshot().fileTimes.file, 25);
			await tracker.setActiveFile(undefined);
			assert.strictEqual(tracker.snapshot().fileTimes.file, 25);
		} finally {
			Date.now = originalDateNow;
			if (originalPerformanceNow) {
				Object.defineProperty(performance, 'now', originalPerformanceNow);
			} else {
				Reflect.deleteProperty(performance, 'now');
			}
		}
	});

	test('rejects corrupt stored totals without writing or discarding valid records', () => {
		assert.deepStrictEqual(parseFileTimeTotals(undefined), {});
		assert.deepStrictEqual(parseFileTimeTotals({ file: 12 }), { file: 12 });
		for (const value of [null, [], 'invalid', new Date(), { file: -1 }, { file: '12' },
			{ file: NaN }, { file: Infinity }, { '': 1 }, { valid: 12, invalid: -1 }]) {
			let writes = 0;
			assert.throws(() => new FileTimeTracker(value, async () => { writes++; }), /Invalid stored file time data/);
			assert.strictEqual(writes, 0);
		}
		assert.throws(() => parseFileTimeTotals({ valid: 12, invalid: -1 }), /"invalid"/);
	});

	test('accepts ordinary and null-prototype objects from another realm while validating entries', () => {
		assert.deepStrictEqual(parseFileTimeTotals(runInNewContext('({ file: 12 })')), { file: 12 });
		assert.deepStrictEqual(parseFileTimeTotals(runInNewContext("Object.assign(Object.create(null), { file: 12 })")), { file: 12 });
		for (const source of ['new Date()', '[]', 'null', '({ valid: 12, invalid: -1 })',
			'Object.create(Object.assign(Object.create(null), { hidden: 12 }))']) {
			assert.throws(() => parseFileTimeTotals(runInNewContext(source)), /Invalid stored file time data/);
		}
	});

	test('excludes exact paths while preserving totals through pause, focus and switches', async () => {
		let now = 0;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({ 'C:\\a\\same.ts': 20 }, async times => { saved = times; }, () => now,
			['C:\\b\\same.ts']);
		await tracker.setActiveFile('C:\\a\\same.ts');
		now = 10;
		await tracker.setExcludedFiles(['C:\\a\\same.ts', 'C:\\b\\same.ts']);
		assert.strictEqual(saved['C:\\a\\same.ts'], 30);
		assert.strictEqual(tracker.isExcluded('C:\\a\\same.ts'), true);
		now = 50;
		assert.strictEqual(tracker.snapshot().fileTimes['C:\\a\\same.ts'], 30);
		await tracker.setPaused(true);
		await tracker.setActiveFile('C:\\b\\same.ts');
		await tracker.setExcludedFiles(['C:\\a\\same.ts']);
		now = 60;
		assert.strictEqual(tracker.snapshot().fileTimes['C:\\b\\same.ts'], undefined);
		await tracker.setPaused(false);
		now = 70;
		await tracker.setActiveFile(undefined);
		now = 90;
		await tracker.setActiveFile('C:\\a\\same.ts');
		now = 100;
		await tracker.setExcludedFiles([]);
		now = 105;
		await tracker.checkpoint();
		assert.deepStrictEqual(tracker.snapshot(), {
			fileTimes: { 'C:\\a\\same.ts': 35, 'C:\\b\\same.ts': 10 },
			activeFile: 'C:\\a\\same.ts', paused: false,
		});
		assert.deepStrictEqual(summarizeFileTime(tracker.snapshot()), { total: 45, current: 35 });
		assert.deepStrictEqual(saved, tracker.snapshot().fileTimes);
	});

	test('counts only positive totals or a currently eligible file', async () => {
		const tracker = new FileTimeTracker({ old: 0 }, async () => {}, () => 0, ['excluded']);
		await tracker.setActiveFile('excluded');
		assert.deepStrictEqual(tracker.snapshot().fileTimes, {});
		await tracker.setActiveFile('active');
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { active: 0 });
		await tracker.setPaused(true);
		assert.deepStrictEqual(tracker.snapshot().fileTimes, {});
	});

	test('reset rebases pending writes and the active interval only after durable success', async () => {
		let now = 0;
		let release!: () => void;
		let writing!: () => void;
		const writingReset = new Promise<void>(resolve => { writing = resolve; });
		const gate = new Promise<void>(resolve => { release = resolve; });
		const writes: Record<string, number>[] = [];
		const tracker = new FileTimeTracker({ prior: 50 }, async times => {
			if (Object.keys(times).length === 0) {
				writing();
				await gate;
			}
			writes.push(times);
		}, () => now);
		await tracker.setActiveFile('first');
		now = 10;
		const reset = tracker.reset();
		await writingReset;
		now = 15;
		const switchFile = tracker.setActiveFile('second');
		now = 20;
		const checkpoint = tracker.checkpoint();
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { prior: 50, first: 15, second: 5 });
		release();
		await Promise.all([reset, switchFile, checkpoint]);
		assert.deepStrictEqual(writes.slice(-3), [{}, { first: 5 }, { first: 5, second: 5 }]);
		now = 25;
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { first: 5, second: 10 });
	});

	test('failed reset restores durable totals and allows a later checkpoint to retry', async () => {
		let now = 0;
		let saved: Record<string, number> = {};
		let failReset = true;
		const tracker = new FileTimeTracker({ old: 50 }, async times => {
			saved = times;
			if (failReset && Object.keys(times).length === 0) {
				failReset = false;
				throw new Error('write failed after mutation');
			}
		}, () => now);
		await tracker.setActiveFile('file');
		now = 10;
		await assert.rejects(tracker.reset(), /write failed after mutation/);
		assert.deepStrictEqual(saved, { old: 50, file: 10 });
		now = 20;
		await tracker.checkpoint();
		assert.deepStrictEqual(saved, { old: 50, file: 20 });
		await tracker.reset();
		assert.deepStrictEqual(saved, {});
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { file: 0 });
	});

	test('failed reset and recovery preserve in-memory totals for later retry', async () => {
		let fail = false;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({ old: 10 }, async times => {
			if (fail) { throw new Error('offline'); }
			saved = times;
		}, () => 0);
		fail = true;
		await assert.rejects(tracker.reset(), /reset failed:.*offline.*recovery write failed:.*offline/i);
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { old: 10 });
		fail = false;
		await tracker.checkpoint();
		assert.deepStrictEqual(saved, { old: 10 });
	});

	test('reset while paused or excluded does not restart tracking', async () => {
		let now = 0;
		const tracker = new FileTimeTracker({}, async () => {}, () => now);
		await tracker.setActiveFile('file');
		now = 10;
		await tracker.setPaused(true);
		await tracker.reset();
		now = 20;
		assert.deepStrictEqual(tracker.snapshot().fileTimes, {});
		await tracker.setPaused(false);
		now = 25;
		await tracker.setExcludedFiles(['file']);
		await tracker.reset();
		now = 50;
		assert.deepStrictEqual(tracker.snapshot().fileTimes, {});
		await tracker.setExcludedFiles([]);
		now = 55;
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { file: 5 });
	});

	test('failed exclusion write keeps the transition and permits a later save', async () => {
		let now = 0;
		let fail = false;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({}, async times => {
			if (fail) { throw new Error('offline'); }
			saved = times;
		}, () => now);
		await tracker.setActiveFile('file');
		now = 10;
		fail = true;
		await assert.rejects(tracker.setExcludedFiles(['file']), /offline/);
		now = 30;
		assert.strictEqual(tracker.isExcluded('file'), true);
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { file: 10 });
		fail = false;
		await tracker.checkpoint();
		assert.deepStrictEqual(saved, { file: 10 });
	});

	test('queues each time snapshot with its matching exclusions', async () => {
		let now = 0;
		let release!: () => void;
		let started!: () => void;
		const writing = new Promise<void>(resolve => { started = resolve; });
		const gate = new Promise<void>(resolve => { release = resolve; });
		const writes: { times: Record<string, number>; exclusions: string[] }[] = [];
		const tracker = new FileTimeTracker({}, async (times, exclusions) => {
			if (!writes.length) {
				started();
				await gate;
			}
			writes.push({ times, exclusions: [...exclusions] });
		}, () => now);
		const start = tracker.setActiveFile('file');
		await writing;
		now = 10;
		const exclude = tracker.setExcludedFiles(['file']);
		now = 20;
		const include = tracker.setExcludedFiles([]);
		release();
		await Promise.all([start, exclude, include]);
		assert.deepStrictEqual(writes, [
			{ times: {}, exclusions: [] },
			{ times: { file: 10 }, exclusions: ['file'] },
			{ times: { file: 10 }, exclusions: [] },
		]);
	});

	test('overlapping resets remove only time before each successful boundary', async () => {
		let now = 0;
		let release!: () => void;
		let started!: () => void;
		const writingReset = new Promise<void>(resolve => { started = resolve; });
		const gate = new Promise<void>(resolve => { release = resolve; });
		let resetWrites = 0;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({ old: 10 }, async times => {
			if (Object.keys(times).length === 0 && resetWrites++ === 0) {
				started();
				await gate;
			}
			saved = times;
		}, () => now);
		await tracker.setActiveFile('file');
		now = 10;
		const first = tracker.reset();
		await writingReset;
		now = 20;
		const second = tracker.reset();
		now = 30;
		const checkpoint = tracker.checkpoint();
		release();
		await Promise.all([first, second, checkpoint]);
		assert.deepStrictEqual(saved, { file: 10 });
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { file: 10 });
	});

	test('a later reset still clears old totals if an earlier reset fails', async () => {
		let now = 0;
		let release!: () => void;
		let started!: () => void;
		const writingReset = new Promise<void>(resolve => { started = resolve; });
		const gate = new Promise<void>(resolve => { release = resolve; });
		let firstReset = true;
		let saved: Record<string, number> = {};
		const tracker = new FileTimeTracker({ old: 10 }, async times => {
			if (firstReset && Object.keys(times).length === 0) {
				firstReset = false;
				started();
				await gate;
				throw new Error('first reset failed');
			}
			saved = times;
		}, () => now);
		await tracker.setActiveFile('file');
		now = 10;
		const first = tracker.reset();
		const firstFailure = assert.rejects(first, /first reset failed/);
		await writingReset;
		now = 20;
		const second = tracker.reset();
		now = 30;
		const checkpoint = tracker.checkpoint();
		release();
		await Promise.all([firstFailure, second, checkpoint]);
		assert.deepStrictEqual(saved, { file: 10 });
		assert.deepStrictEqual(tracker.snapshot().fileTimes, { file: 10 });
	});
});
