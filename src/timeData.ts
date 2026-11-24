export interface TimeEntry {
	date: string;
	task: string;
	timeIn: string;
	timeOut: string;
}

export interface StoredTimeEntry extends TimeEntry {
	id: string;
}

export type TimeEntriesByDate = Record<string, StoredTimeEntry[]>;
export type ReportEntriesByDate = Record<string, TimeEntry[]>;

export interface PublicHoliday {
	date: string;
	name: string;
}

export function validateHoliday(holiday: PublicHoliday): string | undefined {
	if (!isValidDate(holiday.date)) {
		return 'Enter a valid holiday date.';
	}
	if (typeof holiday.name !== 'string' || !holiday.name.trim() || holiday.name.length > 240 ||
		/[\x00-\x1f\x7f]/.test(holiday.name)) {
		return 'Enter a holiday name of up to 240 characters without control characters.';
	}
	return undefined;
}

export type PeriodKind = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DateRange {
	start: string;
	end: string;
}

export function isValidDate(value: string): boolean {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) {
		return false;
	}
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(`${value}T00:00:00Z`);
	return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function isValidTime(value: string): boolean {
	if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
		return false;
	}
	return true;
}

export function durationMinutes(entry: TimeEntry): number | undefined {
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

export function sortEntriesByTimeIn<T extends TimeEntry>(entries: T[]): T[] {
	return [...entries].sort((a, b) => {
		if (!a.timeIn) {
			return b.timeIn ? 1 : 0;
		}
		if (!b.timeIn) {
			return -1;
		}
		return a.timeIn.localeCompare(b.timeIn);
	});
}

export function addDays(value: string, days: number): string {
	if (!isValidDate(value) || !Number.isSafeInteger(days)) {
		throw new RangeError('Enter a valid calendar date and day offset.');
	}
	const date = new Date(`${value}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + days);
	return dateString(date);
}

function dateString(date: Date): string {
	if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999) {
		throw new RangeError('Date is outside the supported four-digit calendar range.');
	}
	return date.toISOString().slice(0, 10);
}

export function customPeriodEnd(start: string): string {
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

export function customPeriodRange(start: string): DateRange {
	return { start, end: customPeriodEnd(start) };
}

export function periodRange(kind: PeriodKind, selectedDate: string): DateRange {
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

export function validateEntry(entry: TimeEntry): string | undefined {
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

export function isIncomplete(entry: TimeEntry): boolean {
	return Boolean(entry.timeIn) !== Boolean(entry.timeOut);
}

export function formatDuration(minutes: number): string {
	return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}

export function localDateString(date = new Date()): string {
	return [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}