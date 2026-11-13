import * as assert from 'node:assert';
import * as vm from 'node:vm';
import { addDays, customPeriodEnd, durationMinutes, isValidDate, periodRange, validateEntry } from '../timeData';
import { getWebviewHtml } from '../webview';

suite('Manual timesheet', () => {
	test('validates four-digit calendar dates and clamps month boundaries', () => {
		for (const date of ['0001-01-01', '0099-02-28', '2000-02-29', '9999-12-31']) {
			assert.ok(isValidDate(date), date);
		}
		for (const date of ['0000-01-01', '1900-02-29', '2026-02-30', '10000-01-01', '2026-2-01']) {
			assert.ok(!isValidDate(date), date);
		}
		assert.strictEqual(customPeriodEnd('2026-01-31'), '2026-02-27');
		assert.strictEqual(customPeriodEnd('2024-01-31'), '2024-02-28');
		assert.strictEqual(customPeriodEnd('2026-12-21'), '2027-01-20');
		assert.strictEqual(customPeriodEnd('0099-12-31'), '0100-01-30');
		assert.strictEqual(customPeriodEnd('9999-12-01'), '9999-12-31');
		assert.throws(() => customPeriodEnd('9999-12-02'), RangeError);
		assert.throws(() => addDays('0001-01-01', -1), RangeError);
		assert.throws(() => addDays('9999-12-31', 1), RangeError);
		assert.throws(() => addDays('2026-02-30', 1), RangeError);
	});

	test('handles inclusive summaries, incomplete entries and wall-clock durations', () => {
		assert.deepStrictEqual(periodRange('weekly', '2027-01-01'), { start: '2026-12-28', end: '2027-01-03' });
		assert.deepStrictEqual(periodRange('monthly', '2000-02-29'), { start: '2000-02-01', end: '2000-02-29' });
		assert.deepStrictEqual(periodRange('yearly', '0001-04-03'), { start: '0001-01-01', end: '0001-12-31' });
		assert.throws(() => periodRange('weekly', '9999-12-31'), RangeError);
		const entry = { date: '2026-11-01', task: 'Work', timeIn: '22:30', timeOut: '02:15' };
		assert.strictEqual(durationMinutes(entry), 225);
		assert.strictEqual(durationMinutes({ ...entry, timeOut: '22:30' }), 0);
		assert.strictEqual(durationMinutes({ ...entry, timeOut: '' }), undefined);
		assert.strictEqual(validateEntry({ ...entry, task: '   ' }), 'Enter a task description.');
		assert.strictEqual(validateEntry({ ...entry, timeOut: '24:00' }), 'Time Out must use 24-hour HH:mm format.');
		assert.strictEqual(validateEntry({ ...entry, timeIn: '', timeOut: '' }), undefined);
	});

	class Element {
		value = '';
		textContent = '';
		innerHTML = '';
		hidden = false;
		dataset: Record<string, string> = {};
		validity = { badInput: false };
		listeners: Record<string, (event: any) => void> = {};
		attributes: Record<string, string> = {};
		constructor(public id = '') {}
		addEventListener(type: string, handler: (event: any) => void): void { this.listeners[type] = handler; }
		setAttribute(name: string, value: string): void { this.attributes[name] = value; }
		getAttribute(name: string): string | null { return this.attributes[name] ?? null; }
		removeAttribute(name: string): void { delete this.attributes[name]; }
		appendChild(): void {}
		querySelectorAll(): Element[] { return []; }
		closest(): Element | null { return null; }
		dispatch(type: string): void { this.listeners[type]?.({ target: this, preventDefault() {} }); }
	}

	function frontend() {
		const elements = new Map<string, Element>();
		const messages: any[] = [];
		let receive: (event: any) => void = () => {};
		const document = {
			activeElement: null as Element | null,
			getElementById(id: string) {
				if (!elements.has(id)) { elements.set(id, new Element(id)); }
				return elements.get(id)!;
			},
			createElement: () => new Element(),
			addEventListener() {},
		};
		const html = getWebviewHtml({ cspSource: 'test' } as Parameters<typeof getWebviewHtml>[0]);
		const script = html.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)?.[1];
		assert.ok(script);
		const context = vm.createContext({
			document, Intl, Date, Number, Object, String, Set, JSON, RangeError, Math,
			setTimeout, acquireVsCodeApi: () => ({ postMessage: (message: any) => messages.push(message) }),
			window: { addEventListener: (_type: string, handler: (event: any) => void) => { receive = handler; } },
		});
		vm.runInContext(script, context);
		const element = (id: string) => document.getElementById(id);
		const send = (type: string, data: object) => receive({ data: { type, data: structuredClone(data) } });
		return { context, document, element, messages, send, deliver: (message: object) => receive({ data: message }) };
	}

	test('filters across years, combines filters and counts completed visible entries', () => {
		const ui = frontend();
		const entries = {
			'2024-02-29': [
				{ id: 'design-1', date: '2024-02-29', task: 'Design', timeIn: '23:00', timeOut: '01:00' },
				{ id: 'design-2', date: '2024-02-29', task: 'Design review', timeIn: '23:30', timeOut: '01:30' },
			],
			'2026-01-01': [{ id: 'incomplete', date: '2026-01-01', task: 'design review', timeIn: '09:00', timeOut: '' }],
			'2026-02-01': [{ id: 'other', date: '2026-02-01', task: 'Other', timeIn: '10:00', timeOut: '10:00' }],
		};
		ui.send('state', { entries, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
		ui.element('filter-task').value = 'DESIGN'; ui.element('filter-task').dispatch('input');
		assert.strictEqual(ui.element('row-count').textContent, '2 dates shown');
		assert.strictEqual(ui.element('entry-count').textContent, '2');
		assert.strictEqual(ui.element('entry-total').textContent, '4h 00m');
		assert.match(ui.element('entries-body').innerHTML, /4h 00m/);
		ui.element('filter-date').value = '2026-01-01'; ui.element('filter-date').dispatch('change');
		assert.strictEqual(ui.element('row-count').textContent, '1 date shown');
		assert.strictEqual(ui.element('entry-count').textContent, '0');
		ui.element('filter-date').value = '2026-02-01'; ui.element('filter-date').dispatch('change');
		assert.strictEqual(ui.element('row-count').textContent, '0 dates shown');
		ui.element('summary-date').value = '2024-02-29'; ui.element('summary-date').dispatch('change');
		assert.strictEqual(ui.element('period-total').textContent, '4h 00m');
		assert.strictEqual(ui.element('period-count').textContent, '2');
		ui.element('clear-filters').dispatch('click');
		ui.element('year-select').value = '2024'; ui.element('year-select').dispatch('change');
		assert.strictEqual(ui.element('row-count').textContent, '366 dates shown');
		assert.match(ui.element('entries-body').innerHTML, /2024-02-29/);
	});

	test('sends expected preferences and retains draft through concurrent state updates', () => {
		const ui = frontend();
		const state = { entries: {}, periodStart: '2026-10-21', hourlyRate: 10, fileTimes: {}, activeFile: null };
		ui.send('state', state);
		ui.element('period-start').value = '2026-01-31'; ui.element('period-start').dispatch('input');
		ui.send('saved', { ...state, periodStart: '2026-11-21' });
		assert.strictEqual(ui.element('period-start').value, '2026-01-31');
		ui.element('period-start').dispatch('change');
		assert.deepStrictEqual({ ...ui.messages.at(-1) }, { type: 'setPeriodStart', value: '2026-01-31', expectedValue: '2026-10-21' });
		ui.element('hourly-rate').value = '12.5'; ui.element('hourly-rate').dispatch('input');
		ui.send('saved', { ...state, periodStart: '2026-11-21', hourlyRate: 15 });
		assert.strictEqual(ui.element('hourly-rate').value, '12.5');
		ui.element('hourly-rate').dispatch('change');
		assert.deepStrictEqual({ ...ui.messages.at(-1) }, { type: 'setHourlyRate', value: '12.5', expectedValue: 10 });
		ui.element('period-start').value = '9999-12-02'; ui.element('period-start').dispatch('change');
		assert.match(ui.element('report-error').textContent, /four-digit/);
	});

	test('matches browser period calculations at calendar boundaries', () => {
		const ui = frontend();
		for (const date of ['0001-01-31', '0099-12-31', '1900-01-31', '2000-01-31', '2026-12-21', '9999-12-01']) {
			ui.context.testDate = date;
			assert.strictEqual(vm.runInContext('periodEnd(testDate)', ui.context), customPeriodEnd(date));
		}
		ui.send('state', { entries: {}, periodStart: '9999-12-01', hourlyRate: null, fileTimes: {}, activeFile: null });
		assert.strictEqual(ui.element('period-end').value, '9999-12-31');
		assert.match(ui.element('report-body').innerHTML, /9999-12-31/);
		ui.element('summary-date').value = '9999-12-31';
		ui.element('summary-kind').value = 'weekly'; ui.element('summary-kind').dispatch('change');
		assert.match(ui.element('entries-error').textContent, /four-digit/);
	});

	test('keeps unsaved row edits and the original expected entry across broadcasts', () => {
		const ui = frontend();
		const original = { id: 'entry-1', date: '2026-10-21', task: 'Original', timeIn: '09:00', timeOut: '17:00' };
		const state = { entries: { [original.date]: [original] }, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null };
		ui.send('state', state);
		const task = new Element(); task.value = 'My unsaved draft';
		const timeIn = new Element(); timeIn.value = '09:00';
		const timeOut = new Element(); timeOut.value = '17:00';
		const row = {
			dataset: { date: original.date, id: original.id, expected: JSON.stringify(original) },
			querySelector: (selector: string) => selector.includes('"task"') ? task : selector.includes('"timeIn"') ? timeIn : timeOut,
		};
		const target = { closest: () => row };
		ui.context.rowEvent = { target };
		vm.runInContext('rememberRow(rowEvent)', ui.context);
		const changed = { ...original, task: 'Another panel' };
		ui.send('saved', { ...state, entries: { [original.date]: [changed] } });
		assert.match(ui.element('report-body').innerHTML, /My unsaved draft/);
		assert.match(ui.element('report-error').textContent, /draft is retained/);
		vm.runInContext('saveRow(rowEvent)', ui.context);
		assert.deepStrictEqual(JSON.parse(JSON.stringify(ui.messages.at(-1))), {
			type: 'saveEntry',
			entry: { date: original.date, task: 'My unsaved draft', timeIn: original.timeIn, timeOut: original.timeOut },
			id: original.id,
			expected: original,
		});
		vm.runInContext('deleteRow(rowEvent)', ui.context);
		assert.deepStrictEqual(JSON.parse(JSON.stringify(ui.messages.at(-1))), {
			type: 'deleteEntry', date: original.date, id: original.id, expected: original,
		});
		ui.send('saved', { ...state, entries: { [original.date]: [changed] } });
		assert.match(ui.element('report-body').innerHTML, /My unsaved draft/);
	});

	test('allows multiple entries per date and rejects invalid dates', () => {
		const ui = frontend();
		const entry = { id: 'existing', date: '2026-10-21', task: 'Existing', timeIn: '', timeOut: '' };
		ui.send('state', { entries: { [entry.date]: [entry] }, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
		assert.match(ui.element('entries-body').innerHTML, /0h 00m/);
		assert.match(ui.element('report-body').innerHTML, /0h 00m/);
		const count = ui.messages.length;
		ui.element('add-date').value = entry.date;
		ui.element('add-task').value = 'New';
		ui.element('add-form').dispatch('submit');
		assert.strictEqual(ui.messages.length, count + 1);
		assert.strictEqual(ui.messages.at(-1).type, 'createEntry');
		assert.strictEqual(ui.messages.at(-1).entry.date, entry.date);
		ui.element('add-date').value = '2026-02-30';
		ui.element('add-form').dispatch('submit');
		assert.match(ui.element('entries-error').textContent, /valid calendar date/);
	});

	test('keeps edits made while a new row is being saved', () => {
		const ui = frontend();
		ui.send('state', { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
		const task = new Element(); task.value = 'First version';
		const timeIn = new Element(); timeIn.value = '09:00';
		const timeOut = new Element(); timeOut.value = '10:00';
		const discard = new Element();
		const row = {
			dataset: { date: '2026-10-21', id: '', expected: 'null' },
			querySelector: (selector: string) => selector.includes('"task"') ? task
				: selector.includes('"timeIn"') ? timeIn : selector.includes('"timeOut"') ? timeOut : discard,
		};
		ui.context.rowEvent = { target: { closest: () => row } };
		vm.runInContext('saveRow(rowEvent)', ui.context);
		const request = ui.messages.at(-1);
		assert.strictEqual(request.type, 'createEntry');
		task.value = 'Edited before acknowledgement';
		vm.runInContext('rememberRow(rowEvent)', ui.context);
		const created = {
			id: 'a'.repeat(32), date: row.dataset.date, task: 'First version', timeIn: '09:00', timeOut: '10:00',
		};
		ui.send('saved', {
			entries: { [created.date]: [created] }, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null,
		});
		ui.deliver({ type: 'entryCreated', requestId: request.requestId, entry: created });
		assert.match(ui.element('entries-body').innerHTML, /Edited before acknowledgement/);
	});

	test('retains a time without a task as an unsaved draft', () => {
		const ui = frontend();
		const state = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null };
		ui.send('state', state);
		const task = new Element(); const timeIn = new Element(); const timeOut = new Element();
		timeIn.value = '08:30';
		const row = {
			dataset: { date: '2026-10-21', expected: 'null' },
			querySelector: (selector: string) => selector.includes('"task"') ? task : selector.includes('"timeIn"') ? timeIn : timeOut,
		};
		ui.context.rowEvent = { target: { closest: () => row } };
		const count = ui.messages.length;
		vm.runInContext('saveRow(rowEvent)', ui.context);
		assert.strictEqual(ui.messages.length, count);
		assert.strictEqual(task.attributes['aria-invalid'], 'true');
		ui.send('saved', state);
		assert.match(ui.element('report-body').innerHTML, /value="08:30"/);
		assert.match(ui.element('report-body').innerHTML, /Incomplete/);
	});

	test('excludes unsaved drafts from report totals', () => {
		const ui = frontend();
		const state = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null };
		ui.send('state', state);
		const task = new Element(); const timeIn = new Element(); const timeOut = new Element();
		timeIn.value = '08:30'; timeOut.value = '09:30';
		const row = {
			dataset: { date: '2026-10-21', expected: 'null' },
			querySelector: (selector: string) => selector.includes('"task"') ? task : selector.includes('"timeIn"') ? timeIn : timeOut,
		};
		ui.context.rowEvent = { target: { closest: () => row } };
		vm.runInContext('saveRow(rowEvent)', ui.context);
		ui.send('saved', state);
		assert.match(ui.element('print-summary').innerHTML, /0h 00m/);
		assert.match(ui.element('report-days').textContent, /drafts excluded/);
		const count = ui.messages.length;
		ui.element('print-button').dispatch('click');
		assert.strictEqual(ui.messages.length, count);
		assert.match(ui.element('report-error').textContent, /Save or discard unsaved changes/);
	});

	test('counts only positive or currently eligible file rows', () => {
		const ui = frontend();
		const state = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: { a: 0, b: 60000 }, activeFile: 'a', paused: false, excluded: false };
		ui.send('state', state);
		assert.strictEqual(ui.element('tracked-file-count').textContent, '2');
		ui.send('fileTimes', { ...state, excluded: true });
		assert.strictEqual(ui.element('tracked-file-count').textContent, '1');
		assert.match(ui.element('tracking-status').textContent, /excluded/);
		ui.send('fileTimes', { ...state, paused: true });
		assert.strictEqual(ui.element('tracked-file-count').textContent, '1');
		assert.match(ui.element('tracking-status').textContent, /paused/);
	});
});
