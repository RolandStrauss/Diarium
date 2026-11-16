"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHoliday = validateHoliday;
exports.isValidDate = isValidDate;
exports.isValidTime = isValidTime;
exports.durationMinutes = durationMinutes;
exports.addDays = addDays;
exports.customPeriodEnd = customPeriodEnd;
exports.customPeriodRange = customPeriodRange;
exports.periodRange = periodRange;
exports.validateEntry = validateEntry;
exports.isIncomplete = isIncomplete;
exports.formatDuration = formatDuration;
exports.localDateString = localDateString;
function validateHoliday(holiday) {
    if (!isValidDate(holiday.date)) {
        return 'Enter a valid holiday date.';
    }
    if (typeof holiday.name !== 'string' || !holiday.name.trim() || holiday.name.length > 240 ||
        /[\x00-\x1f\x7f]/.test(holiday.name)) {
        return 'Enter a holiday name of up to 240 characters without control characters.';
    }
    return undefined;
}
function isValidDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) {
        return false;
    }
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(`${value}T00:00:00Z`);
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function isValidTime(value) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
        return false;
    }
    return true;
}
function durationMinutes(entry) {
    if (!isValidTime(entry.timeIn) || !isValidTime(entry.timeOut)) {
        return undefined;
    }
    const [inHour, inMinute] = entry.timeIn.split(':').map(Number);
    const [outHour, outMinute] = entry.timeOut.split(':').map(Number);
    const start = inHour * 60 + inMinute;
    let end = outHour * 60 + outMinute;
    if (end < start) {
        end += 24 * 60;
    }
    return end - start;
}
function addDays(value, days) {
    if (!isValidDate(value) || !Number.isSafeInteger(days)) {
        throw new RangeError('Enter a valid calendar date and day offset.');
    }
    const date = new Date(`${value}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return dateString(date);
}
function dateString(date) {
    if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999) {
        throw new RangeError('Date is outside the supported four-digit calendar range.');
    }
    return date.toISOString().slice(0, 10);
}
function customPeriodEnd(start) {
    if (!isValidDate(start)) {
        throw new RangeError('Enter a valid period start date.');
    }
    const [year, month, day] = start.split('-').map(Number);
    const date = new Date(`${start}T00:00:00Z`);
    date.setUTCDate(1);
    date.setUTCFullYear(year, month + 1, 0);
    const lastDay = date.getUTCDate();
    date.setUTCDate(Math.min(day, lastDay) - 1);
    return dateString(date);
}
function customPeriodRange(start) {
    return { start, end: customPeriodEnd(start) };
}
function periodRange(kind, selectedDate) {
    if (!isValidDate(selectedDate)) {
        throw new RangeError('Enter a valid summary date.');
    }
    if (kind === 'daily') {
        return { start: selectedDate, end: selectedDate };
    }
    if (kind === 'weekly') {
        const weekday = new Date(`${selectedDate}T00:00:00Z`).getUTCDay();
        const mondayOffset = (weekday + 6) % 7;
        const start = addDays(selectedDate, -mondayOffset);
        return { start, end: addDays(start, 6) };
    }
    if (kind === 'monthly') {
        const start = selectedDate.slice(0, 7) + '-01';
        return { start, end: customPeriodEnd(start) };
    }
    if (kind === 'yearly') {
        return { start: selectedDate.slice(0, 4) + '-01-01', end: selectedDate.slice(0, 4) + '-12-31' };
    }
    throw new RangeError('Enter a valid summary period.');
}
function validateEntry(entry) {
    if (!isValidDate(entry.date)) {
        return 'Enter a valid calendar date.';
    }
    if (typeof entry.task !== 'string' || !entry.task.trim()) {
        return 'Enter a task description.';
    }
    if (typeof entry.timeIn !== 'string' || (entry.timeIn && !isValidTime(entry.timeIn))) {
        return 'Time In must use 24-hour HH:mm format.';
    }
    if (typeof entry.timeOut !== 'string' || (entry.timeOut && !isValidTime(entry.timeOut))) {
        return 'Time Out must use 24-hour HH:mm format.';
    }
    return undefined;
}
function isIncomplete(entry) {
    return Boolean(entry.timeIn) !== Boolean(entry.timeOut);
}
function formatDuration(minutes) {
    return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}
function localDateString(date = new Date()) {
    return [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}
//# sourceMappingURL=timeData.js.map