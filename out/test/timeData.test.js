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
const vm = __importStar(require("node:vm"));
const timeData_1 = require("../timeData");
const webview_1 = require("../webview");
suite('Manual timesheet', () => {
    test('validates four-digit calendar dates and clamps month boundaries', () => {
        for (const date of ['0001-01-01', '0099-02-28', '2000-02-29', '9999-12-31']) {
            assert.ok((0, timeData_1.isValidDate)(date), date);
        }
        for (const date of ['0000-01-01', '1900-02-29', '2026-02-30', '10000-01-01', '2026-2-01']) {
            assert.ok(!(0, timeData_1.isValidDate)(date), date);
        }
        assert.strictEqual((0, timeData_1.customPeriodEnd)('2026-01-31'), '2026-02-27');
        assert.strictEqual((0, timeData_1.customPeriodEnd)('2024-01-31'), '2024-02-28');
        assert.strictEqual((0, timeData_1.customPeriodEnd)('2026-12-21'), '2027-01-20');
        assert.strictEqual((0, timeData_1.customPeriodEnd)('0099-12-31'), '0100-01-30');
        assert.strictEqual((0, timeData_1.customPeriodEnd)('9999-12-01'), '9999-12-31');
        assert.throws(() => (0, timeData_1.customPeriodEnd)('9999-12-02'), RangeError);
        assert.throws(() => (0, timeData_1.addDays)('0001-01-01', -1), RangeError);
        assert.throws(() => (0, timeData_1.addDays)('9999-12-31', 1), RangeError);
        assert.throws(() => (0, timeData_1.addDays)('2026-02-30', 1), RangeError);
    });
    test('handles inclusive summaries, incomplete entries and wall-clock durations', () => {
        assert.deepStrictEqual((0, timeData_1.periodRange)('weekly', '2027-01-01'), { start: '2026-12-28', end: '2027-01-03' });
        assert.deepStrictEqual((0, timeData_1.periodRange)('monthly', '2000-02-29'), { start: '2000-02-01', end: '2000-02-29' });
        assert.deepStrictEqual((0, timeData_1.periodRange)('yearly', '0001-04-03'), { start: '0001-01-01', end: '0001-12-31' });
        assert.throws(() => (0, timeData_1.periodRange)('weekly', '9999-12-31'), RangeError);
        const entry = { date: '2026-11-01', task: 'Work', timeIn: '22:30', timeOut: '02:15' };
        assert.strictEqual((0, timeData_1.durationMinutes)(entry), 225);
        assert.strictEqual((0, timeData_1.durationMinutes)({ ...entry, timeOut: '22:30' }), 0);
        assert.strictEqual((0, timeData_1.durationMinutes)({ ...entry, timeOut: '' }), undefined);
        assert.strictEqual((0, timeData_1.validateEntry)({ ...entry, task: '   ' }), 'Enter a task description.');
        assert.strictEqual((0, timeData_1.validateEntry)({ ...entry, timeOut: '24:00' }), 'Time Out must use 24-hour HH:mm format.');
        assert.strictEqual((0, timeData_1.validateEntry)({ ...entry, timeIn: '', timeOut: '' }), undefined);
    });
    class Element {
        id;
        value = '';
        textContent = '';
        innerHTML = '';
        hidden = false;
        disabled = false;
        tabIndex = 0;
        focused = false;
        dataset = {};
        validity = { badInput: false };
        listeners = {};
        attributes = {};
        constructor(id = '') {
            this.id = id;
        }
        addEventListener(type, handler) { this.listeners[type] = handler; }
        setAttribute(name, value) { this.attributes[name] = value; }
        getAttribute(name) { return this.attributes[name] ?? null; }
        removeAttribute(name) { delete this.attributes[name]; }
        appendChild() { }
        querySelectorAll() { return []; }
        closest() { return null; }
        focus() { this.focused = true; }
        dispatch(type, event = {}) {
            this.listeners[type]?.({ target: this, preventDefault() { }, ...event });
        }
    }
    function frontend() {
        const elements = new Map();
        const messages = [];
        let receive = () => { };
        const document = {
            activeElement: null,
            getElementById(id) {
                if (!elements.has(id)) {
                    elements.set(id, new Element(id));
                }
                return elements.get(id);
            },
            createElement: () => new Element(),
            addEventListener() { },
        };
        const html = (0, webview_1.getWebviewHtml)({ cspSource: 'test' });
        const script = html.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)?.[1];
        assert.ok(script);
        const context = vm.createContext({
            document, Intl, Date, Number, Object, String, Set, JSON, RangeError, Math,
            setTimeout, acquireVsCodeApi: () => ({ postMessage: (message) => messages.push(message) }),
            window: { addEventListener: (_type, handler) => { receive = handler; } },
        });
        vm.runInContext(script, context);
        const element = (id) => document.getElementById(id);
        const send = (type, data) => receive({
            data: { type, data: structuredClone(type === 'state' || type === 'saved' ? { holidays: [], ...data } : data) },
        });
        return { context, document, element, messages, send, deliver: (message) => receive({ data: message }) };
    }
    test('shows escaped holiday labels and submits validated holiday dates', () => {
        const ui = frontend();
        const holiday = { date: '2026-10-24', name: '<Festival>' };
        ui.send('state', { entries: {}, holidays: [holiday], periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
        ui.element('filter-date').value = holiday.date;
        ui.element('filter-date').dispatch('change');
        assert.match(ui.element('entries-body').innerHTML, /Public holiday: &lt;Festival&gt;/);
        assert.match(ui.element('report-body').innerHTML, /Public holiday: &lt;Festival&gt;/);
        assert.match(ui.element('holidays-body').innerHTML, /&lt;Festival&gt;/);
        ui.element('holiday-date').value = '2026-02-30';
        ui.element('holiday-name').value = 'Holiday';
        ui.element('holiday-form').dispatch('submit');
        assert.match(ui.element('holidays-error').textContent, /valid holiday date/);
        ui.element('holiday-date').value = '2026-10-25';
        ui.element('holiday-form').dispatch('submit');
        assert.deepStrictEqual(JSON.parse(JSON.stringify(ui.messages.at(-1))), {
            type: 'addHoliday', holiday: { date: '2026-10-25', name: 'Holiday' }, view: 'holidays',
        });
        ui.deliver({ type: 'holidayAdded', holiday: { date: '2026-10-25', name: 'Holiday' } });
        assert.strictEqual(ui.element('holiday-name').value, '');
    });
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
        ui.element('filter-task').value = 'DESIGN';
        ui.element('filter-task').dispatch('input');
        assert.strictEqual(ui.element('row-count').textContent, '2 dates shown');
        assert.strictEqual(ui.element('entry-count').textContent, '2');
        assert.strictEqual(ui.element('entry-total').textContent, '4h 00m');
        assert.match(ui.element('entries-body').innerHTML, /4h 00m/);
        ui.element('filter-date').value = '2026-01-01';
        ui.element('filter-date').dispatch('change');
        assert.strictEqual(ui.element('row-count').textContent, '1 date shown');
        assert.strictEqual(ui.element('entry-count').textContent, '0');
        ui.element('filter-date').value = '2026-02-01';
        ui.element('filter-date').dispatch('change');
        assert.strictEqual(ui.element('row-count').textContent, '0 dates shown');
        ui.element('summary-date').value = '2024-02-29';
        ui.element('summary-date').dispatch('change');
        assert.strictEqual(ui.element('period-total').textContent, '4h 00m');
        assert.strictEqual(ui.element('period-count').textContent, '2');
        ui.element('clear-filters').dispatch('click');
        ui.element('year-select').value = '2024';
        ui.element('year-select').dispatch('change');
        assert.strictEqual(ui.element('row-count').textContent, '366 dates shown');
        assert.match(ui.element('entries-body').innerHTML, /2024-02-29/);
    });
    test('sends expected preferences and retains draft through concurrent state updates', () => {
        const ui = frontend();
        const state = { entries: {}, periodStart: '2026-10-21', hourlyRate: 10, fileTimes: {}, activeFile: null };
        ui.send('state', state);
        ui.element('period-start').value = '2026-01-31';
        ui.element('period-start').dispatch('input');
        ui.send('saved', { ...state, periodStart: '2026-11-21' });
        assert.strictEqual(ui.element('period-start').value, '2026-01-31');
        const count = ui.messages.length;
        ui.element('period-start').dispatch('change');
        assert.strictEqual(ui.messages.length, count);
        ui.element('save-period').dispatch('click');
        assert.deepStrictEqual({ ...ui.messages.at(-1) }, { type: 'setPeriodStart', value: '2026-01-31', expectedValue: '2026-10-21' });
        ui.element('hourly-rate').value = '12.5';
        ui.element('hourly-rate').dispatch('input');
        ui.send('saved', { ...state, periodStart: '2026-11-21', hourlyRate: 15 });
        assert.strictEqual(ui.element('hourly-rate').value, '12.5');
        ui.element('save-rate').dispatch('click');
        assert.deepStrictEqual({ ...ui.messages.at(-1) }, { type: 'setHourlyRate', value: '12.5', expectedValue: 10 });
        ui.deliver({ type: 'error', operation: 'setPeriodStart', view: 'report', message: 'Conflict' });
        ui.element('period-start').value = '9999-12-02';
        ui.element('period-start').dispatch('input');
        ui.element('save-period').dispatch('click');
        assert.match(ui.element('report-error').textContent, /four-digit/);
    });
    test('matches browser period calculations at calendar boundaries', () => {
        const ui = frontend();
        for (const date of ['0001-01-31', '0099-12-31', '1900-01-31', '2000-01-31', '2026-12-21', '9999-12-01']) {
            ui.context.testDate = date;
            assert.strictEqual(vm.runInContext('periodEnd(testDate)', ui.context), (0, timeData_1.customPeriodEnd)(date));
        }
        ui.send('state', { entries: {}, periodStart: '9999-12-01', hourlyRate: null, fileTimes: {}, activeFile: null });
        assert.strictEqual(ui.element('period-end').value, '9999-12-31');
        assert.match(ui.element('report-body').innerHTML, /9999-12-31/);
        ui.element('summary-date').value = '9999-12-31';
        ui.element('summary-kind').value = 'weekly';
        ui.element('summary-kind').dispatch('change');
        assert.match(ui.element('entries-error').textContent, /four-digit/);
    });
    test('keeps unsaved row edits and the original expected entry across broadcasts', () => {
        const ui = frontend();
        const original = { id: 'entry-1', date: '2026-10-21', task: 'Original', timeIn: '09:00', timeOut: '17:00' };
        const state = { entries: { [original.date]: [original] }, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null };
        ui.send('state', state);
        const task = new Element();
        task.value = 'My unsaved draft';
        const timeIn = new Element();
        timeIn.value = '09:00';
        const timeOut = new Element();
        timeOut.value = '17:00';
        const row = {
            dataset: { date: original.date, id: original.id, expected: JSON.stringify(original) },
            querySelector: (selector) => selector.includes('"task"') ? task : selector.includes('"timeIn"') ? timeIn : timeOut,
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
            view: 'entries',
        });
        ui.deliver({ type: 'error', operation: 'saveEntry', id: original.id, view: 'entries', message: 'Conflict' });
        vm.runInContext('deleteRow(rowEvent)', ui.context);
        vm.runInContext('saveRow(rowEvent)', ui.context);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(ui.messages.at(-1))), {
            type: 'deleteEntry', date: original.date, id: original.id, expected: original, view: 'entries',
        });
        ui.send('saved', { ...state, entries: { [original.date]: [changed] } });
        assert.match(ui.element('report-body').innerHTML, /My unsaved draft/);
    });
    test('discards only the selected entry or report setting without saving other drafts', () => {
        const ui = frontend();
        const first = { id: 'first', date: '2026-10-21', task: 'First', timeIn: '09:00', timeOut: '10:00' };
        const second = { id: 'second', date: '2026-10-22', task: 'Second', timeIn: '10:00', timeOut: '11:00' };
        ui.send('state', { entries: { [first.date]: [first], [second.date]: [second] }, periodStart: '2026-10-21', hourlyRate: 10, fileTimes: {}, activeFile: null });
        const makeRow = (entry, value) => {
            const task = new Element();
            task.value = value;
            const timeIn = new Element();
            timeIn.value = entry.timeIn;
            const timeOut = new Element();
            timeOut.value = entry.timeOut;
            const button = new Element();
            return {
                dataset: { date: entry.date, id: entry.id, expected: JSON.stringify(entry) },
                querySelector: (selector) => selector.includes('"task"') ? task
                    : selector.includes('"timeIn"') ? timeIn : selector.includes('"timeOut"') ? timeOut : button,
            };
        };
        ui.context.firstEvent = { target: { closest: () => makeRow(first, 'First draft') } };
        ui.context.secondEvent = { target: { closest: () => makeRow(second, 'Second draft') } };
        const count = ui.messages.length;
        vm.runInContext('rememberRow(firstEvent); rememberRow(secondEvent)', ui.context);
        ui.element('period-start').value = '2026-11-21';
        ui.element('period-start').dispatch('input');
        ui.element('hourly-rate').value = '20';
        ui.element('hourly-rate').dispatch('input');
        assert.strictEqual(ui.messages.length, count);
        vm.runInContext('discardDraft(firstEvent)', ui.context);
        assert.doesNotMatch(ui.element('report-body').innerHTML, /First draft/);
        assert.match(ui.element('report-body').innerHTML, /Second draft/);
        ui.element('discard-period').dispatch('click');
        assert.strictEqual(ui.element('period-start').value, '2026-10-21');
        assert.strictEqual(ui.element('hourly-rate').value, '20');
        assert.match(ui.element('report-body').innerHTML, /Second draft/);
        ui.element('discard-rate').dispatch('click');
        assert.strictEqual(ui.element('hourly-rate').value, '10');
        assert.match(ui.element('report-body').innerHTML, /Second draft/);
        vm.runInContext('saveReportRow(secondEvent)', ui.context);
        assert.strictEqual(ui.messages.at(-1).type, 'saveEntry');
        assert.strictEqual(ui.messages.at(-1).view, 'report');
        assert.strictEqual(ui.messages.at(-1).entry.task, 'Second draft');
    });
    test('keeps entry drafts in sync when switching between entries and report', () => {
        const ui = frontend();
        const entry = { id: 'entry-1', date: '2026-10-21', task: 'Original', timeIn: '09:00', timeOut: '17:00' };
        ui.send('state', { entries: { [entry.date]: [entry] }, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
        ui.element('filter-date').value = entry.date;
        ui.element('filter-date').dispatch('change');
        const task = new Element();
        task.value = 'Draft task';
        const timeIn = new Element();
        timeIn.value = entry.timeIn;
        const timeOut = new Element();
        timeOut.value = entry.timeOut;
        const button = new Element();
        const row = {
            dataset: { date: entry.date, id: entry.id, expected: JSON.stringify(entry) },
            querySelector: (selector) => selector.includes('"task"') ? task
                : selector.includes('"timeIn"') ? timeIn : selector.includes('"timeOut"') ? timeOut : button,
        };
        ui.context.rowEvent = { target: { closest: () => row } };
        vm.runInContext('rememberRow(rowEvent)', ui.context);
        ui.element('report-view').hidden = true;
        ui.element('report-tab').dispatch('click');
        assert.match(ui.element('report-body').innerHTML, /value="Draft task"/);
        timeOut.value = '18:00';
        vm.runInContext('rememberRow(rowEvent)', ui.context);
        ui.element('entries-tab').dispatch('click');
        assert.match(ui.element('entries-body').innerHTML, /value="Draft task"/);
        assert.match(ui.element('entries-body').innerHTML, /value="18:00"/);
        vm.runInContext('saveRow(rowEvent)', ui.context);
        assert.strictEqual(ui.messages.at(-1).entry.task, 'Draft task');
        assert.strictEqual(ui.messages.at(-1).entry.timeOut, '18:00');
    });
    test('a failed save unlocks only its own draft', () => {
        const ui = frontend();
        ui.send('state', { entries: {}, periodStart: '2026-10-21', hourlyRate: 10, fileTimes: {}, activeFile: null });
        ui.element('period-start').value = '2026-11-21';
        ui.element('period-start').dispatch('input');
        ui.element('hourly-rate').value = '20';
        ui.element('hourly-rate').dispatch('input');
        ui.element('save-period').dispatch('click');
        ui.element('save-rate').dispatch('click');
        ui.deliver({ type: 'error', operation: 'setPeriodStart', view: 'report', message: 'Save failed' });
        assert.strictEqual(ui.element('save-period').disabled, false);
        assert.strictEqual(ui.element('save-rate').disabled, true);
        assert.strictEqual(ui.element('period-start').value, '2026-11-21');
        assert.strictEqual(ui.element('hourly-rate').value, '20');
    });
    test('stages deletion until saved and discards it without sending a write', () => {
        const ui = frontend();
        const entry = { id: 'entry-1', date: '2026-10-21', task: 'Work', timeIn: '09:00', timeOut: '10:00' };
        ui.send('state', { entries: { [entry.date]: [entry] }, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
        const task = new Element();
        task.value = entry.task;
        const timeIn = new Element();
        timeIn.value = entry.timeIn;
        const timeOut = new Element();
        timeOut.value = entry.timeOut;
        const row = {
            dataset: { date: entry.date, id: entry.id, expected: JSON.stringify(entry) },
            querySelector: (selector) => selector.includes('"task"') ? task : selector.includes('"timeIn"') ? timeIn : timeOut,
        };
        ui.context.rowEvent = { target: { closest: () => row } };
        const count = ui.messages.length;
        vm.runInContext('deleteRow(rowEvent)', ui.context);
        assert.strictEqual(ui.messages.length, count);
        assert.match(ui.element('report-body').innerHTML, /Deletion pending/);
        vm.runInContext('discardDraft(rowEvent)', ui.context);
        assert.strictEqual(ui.messages.length, count);
        assert.doesNotMatch(ui.element('report-body').innerHTML, /Deletion pending/);
        vm.runInContext('deleteRow(rowEvent); saveRow(rowEvent)', ui.context);
        assert.strictEqual(ui.messages.at(-1).type, 'deleteEntry');
        ui.send('saved', { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
        assert.doesNotMatch(ui.element('report-body').innerHTML, /Deletion pending/);
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
        ui.deliver({
            type: 'entryCreated',
            requestId: ui.messages.at(-1).requestId,
            entry: { ...ui.messages.at(-1).entry, id: 'created' },
        });
        ui.element('add-date').value = '2026-02-30';
        ui.element('add-form').dispatch('submit');
        assert.match(ui.element('entries-error').textContent, /valid calendar date/);
    });
    test('supports tablist keyboard navigation and roving focus', () => {
        const ui = frontend();
        const report = ui.element('report-tab');
        ui.element('entries-tab').dispatch('keydown', { key: 'ArrowRight' });
        assert.strictEqual(ui.element('report-view').hidden, false);
        assert.strictEqual(report.getAttribute('aria-selected'), 'true');
        assert.strictEqual(report.tabIndex, 0);
        assert.strictEqual(report.focused, true);
        assert.strictEqual(ui.element('entries-tab').tabIndex, -1);
        report.dispatch('keydown', { key: 'End' });
        assert.strictEqual(ui.element('file-times-tab').getAttribute('aria-selected'), 'true');
        assert.strictEqual(ui.element('file-times-tab').focused, true);
        const prevented = { value: false };
        ui.element('file-times-tab').listeners.keydown({
            key: 'ArrowRight',
            preventDefault: () => { prevented.value = true; },
        });
        assert.strictEqual(prevented.value, true);
        assert.strictEqual(ui.element('entries-tab').getAttribute('aria-selected'), 'true');
    });
    test('keeps edits made while a new row is being saved', () => {
        const ui = frontend();
        ui.send('state', { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null });
        const task = new Element();
        task.value = 'First version';
        const timeIn = new Element();
        timeIn.value = '09:00';
        const timeOut = new Element();
        timeOut.value = '10:00';
        const discard = new Element();
        const row = {
            dataset: { date: '2026-10-21', id: '', expected: 'null' },
            querySelector: (selector) => selector.includes('"task"') ? task
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
        const task = new Element();
        const timeIn = new Element();
        const timeOut = new Element();
        timeIn.value = '08:30';
        const row = {
            dataset: { date: '2026-10-21', expected: 'null' },
            querySelector: (selector) => selector.includes('"task"') ? task : selector.includes('"timeIn"') ? timeIn : timeOut,
        };
        ui.context.rowEvent = { target: { closest: () => row } };
        const count = ui.messages.length;
        vm.runInContext('saveRow(rowEvent)', ui.context);
        assert.strictEqual(ui.messages.length, count);
        assert.strictEqual(task.attributes['aria-invalid'], 'true');
        assert.strictEqual(task.focused, true);
        ui.send('saved', state);
        assert.match(ui.element('report-body').innerHTML, /value="08:30"/);
        assert.match(ui.element('report-body').innerHTML, /Incomplete/);
    });
    test('excludes unsaved drafts from report totals', () => {
        const ui = frontend();
        const state = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null };
        ui.send('state', state);
        const task = new Element();
        const timeIn = new Element();
        const timeOut = new Element();
        timeIn.value = '08:30';
        timeOut.value = '09:30';
        const row = {
            dataset: { date: '2026-10-21', expected: 'null' },
            querySelector: (selector) => selector.includes('"task"') ? task : selector.includes('"timeIn"') ? timeIn : timeOut,
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
    test('shows the estimate on screen but hides it in print media', () => {
        const ui = frontend();
        const entry = { id: 'entry-1', date: '2026-10-21', task: 'Work', timeIn: '09:00', timeOut: '10:00' };
        ui.send('state', { entries: { [entry.date]: [entry] }, periodStart: entry.date, hourlyRate: 25, fileTimes: {}, activeFile: null });
        assert.match(ui.element('print-summary').innerHTML, /<div class="metric screen-only"><strong>25[.,]00<\/strong><span>Estimated value \(informational\)<\/span><\/div>/);
        assert.match((0, webview_1.getWebviewHtml)({ cspSource: 'test' }), /@media print\s*\{[\s\S]*?\.screen-only[^{]*\{[^}]*display:\s*none\s*!important/);
    });
    test('includes tab semantics and forced-colors fallbacks in timesheet markup', () => {
        const html = (0, webview_1.getWebviewHtml)({ cspSource: 'test' });
        assert.match(html, /role="tablist" aria-label="Timesheet views"/);
        assert.match(html, /id="entries-tab" role="tab" aria-selected="true"[^>]*tabindex="0"/);
        assert.match(html, /id="report-tab" role="tab" aria-selected="false"[^>]*tabindex="-1"/);
        assert.match(html, /@media \(forced-colors: active\)/);
        assert.match(html, /outline: 2px solid Highlight/);
        assert.match(html, /tr\.incomplete[\s\S]*?border-inline-start: 3px solid Highlight/);
    });
    test('counts only positive or currently eligible file rows', () => {
        const ui = frontend();
        const state = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: { a: 0, b: 60000 }, activeFile: 'a', paused: false, excluded: false };
        ui.send('state', state);
        assert.strictEqual(ui.element('tracked-file-count').textContent, '2');
        assert.match(ui.element('tracking-status').textContent, /running/);
        ui.send('fileTimes', { ...state, excluded: true });
        assert.strictEqual(ui.element('tracked-file-count').textContent, '1');
        assert.match(ui.element('tracking-status').textContent, /excluded/);
        ui.send('fileTimes', { ...state, paused: true });
        assert.strictEqual(ui.element('tracked-file-count').textContent, '1');
        assert.match(ui.element('tracking-status').textContent, /paused/);
        ui.send('fileTimes', { ...state, activeFile: null, paused: false, excluded: false });
        assert.match(ui.element('tracking-status').textContent, /Waiting for a focused local file/);
    });
});
//# sourceMappingURL=timeData.test.js.map