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
const extension_1 = require("../extension");
const first = {
    entries: {
        '2026-11-01': [{
                id: 'a'.repeat(32),
                date: '2026-11-01',
                task: 'Existing',
                timeIn: '09:00',
                timeOut: '10:00',
            }],
    },
    periodStart: '2026-10-21',
    periodEnd: '2026-11-20',
    hourlyRate: 42.5,
    holidays: [{ date: '2026-11-01', name: 'Local holiday' }],
};
suite('Timesheet transfer', () => {
    test('exports only portable manual data and round-trips it', () => {
        const transfer = (0, extension_1.createTimesheetTransfer)(first, new Date('2026-11-20T20:00:00.000Z'));
        assert.deepStrictEqual(JSON.parse(JSON.stringify(transfer)), {
            kind: 'time-tracker-timesheet',
            schemaVersion: 1,
            exportedAt: '2026-11-20T20:00:00.000Z',
            entries: first.entries,
            holidays: first.holidays,
        });
        assert.deepStrictEqual(JSON.parse(JSON.stringify((0, extension_1.parseTimesheetTransfer)(JSON.stringify(transfer)))), { entries: first.entries, holidays: first.holidays });
        assert.ok(!Object.hasOwn(transfer, 'periodStart'));
        assert.ok(!Object.hasOwn(transfer, 'periodEnd'));
        assert.ok(!Object.hasOwn(transfer, 'hourlyRate'));
        assert.ok(!Object.hasOwn(transfer, 'fileTimes'));
    });
    test('rejects malformed, unsupported, oversized, and invalid imports', () => {
        const valid = JSON.parse(JSON.stringify((0, extension_1.createTimesheetTransfer)(first)));
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)('{'), /not valid JSON/);
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)(JSON.stringify({ ...valid, kind: 'other' })), /unsupported.*format/);
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)(JSON.stringify({ ...valid, schemaVersion: 2 })), /unsupported.*format/);
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)(JSON.stringify({ ...valid, exportedAt: 'yesterday' })), /timestamp/);
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)(JSON.stringify({ ...valid, unexpected: true })), /unsupported fields/);
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)(JSON.stringify({
            ...valid,
            entries: { '2026-02-30': [{ id: 'b'.repeat(32), date: '2026-02-30', task: 'Bad', timeIn: '', timeOut: '' }] },
        })), /invalid/);
        const duplicateId = 'b'.repeat(32);
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)(JSON.stringify({
            ...valid,
            entries: {
                '2026-11-01': [{ id: duplicateId, date: '2026-11-01', task: 'First', timeIn: '', timeOut: '' }],
                '2026-11-02': [{ id: duplicateId, date: '2026-11-02', task: 'Second', timeIn: '', timeOut: '' }],
            },
        })), /duplicate identifier/);
        assert.throws(() => (0, extension_1.parseTimesheetTransfer)('x'.repeat(5 * 1024 * 1024 + 1)), /too large/);
    });
    test('merges new records idempotently while retaining local preferences', () => {
        const entry = first.entries['2026-11-01'][0];
        const added = {
            id: 'b'.repeat(32),
            date: '2026-11-02',
            task: 'Imported',
            timeIn: '10:00',
            timeOut: '11:30',
        };
        const imported = (0, extension_1.parseTimesheetTransfer)(JSON.stringify((0, extension_1.createTimesheetTransfer)({
            ...first,
            entries: {
                '2026-11-01': [entry],
                '2026-11-02': [added],
            },
            holidays: [
                ...first.holidays,
                { date: '2026-11-02', name: 'Imported holiday' },
            ],
        })));
        const merged = (0, extension_1.mergeTimesheetTransfer)(first, imported);
        assert.strictEqual(merged.addedEntries, 1);
        assert.strictEqual(merged.addedHolidays, 1);
        assert.strictEqual(merged.state.periodStart, first.periodStart);
        assert.strictEqual(merged.state.periodEnd, first.periodEnd);
        assert.strictEqual(merged.state.hourlyRate, first.hourlyRate);
        assert.deepStrictEqual(merged.state.entries['2026-11-02'], [added]);
        assert.strictEqual((0, extension_1.mergeTimesheetTransfer)(merged.state, imported).addedEntries, 0);
        assert.strictEqual((0, extension_1.mergeTimesheetTransfer)(merged.state, imported).addedHolidays, 0);
        assert.deepStrictEqual(first.entries['2026-11-01'], [entry], 'The local input must not be mutated');
    });
    test('rejects a conflicting entry ID without mutating local state', () => {
        const before = JSON.stringify(first);
        const conflict = {
            entries: {
                '2026-11-01': [{
                        ...first.entries['2026-11-01'][0],
                        task: 'Changed elsewhere',
                    }],
            },
            holidays: [],
        };
        assert.throws(() => (0, extension_1.mergeTimesheetTransfer)(first, conflict), /conflicts with a local entry/);
        assert.strictEqual(JSON.stringify(first), before);
    });
});
//# sourceMappingURL=timesheetTransfer.test.js.map