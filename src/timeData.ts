export interface TimeEntry {
	date: string;
	task: string;
	timeIn: string;
	timeOut: string;
}

export type PeriodKind = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DateRange {
	start: string;
	end: string;
}

export function isValidDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return false;
	}
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
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

export function addDays(value: string, days: number): string {
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day + days));
	return date.toISOString().slice(0, 10);
}

function addCalendarMonth(value: string): string {
	const [year, month, day] = value.split('-').map(Number);
	const targetMonth = month;
	const targetYear = year + Math.floor(targetMonth / 12);
	const normalizedMonth = targetMonth % 12;
	const lastDay = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
	return [targetYear, String(normalizedMonth + 1).padStart(2, '0'), String(Math.min(day, lastDay)).padStart(2, '0')].join('-');
}

export function customPeriodEnd(start: string): string {
	return addDays(addCalendarMonth(start), -1);
}

export function customPeriodRange(start: string): DateRange {
	return { start, end: customPeriodEnd(start) };
}

export function periodRange(kind: PeriodKind, selectedDate: string): DateRange {
	if (kind === 'daily') {
		return { start: selectedDate, end: selectedDate };
	}
	if (kind === 'weekly') {
		const [year, month, day] = selectedDate.split('-').map(Number);
		const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
		const mondayOffset = (weekday + 6) % 7;
		const start = addDays(selectedDate, -mondayOffset);
		return { start, end: addDays(start, 6) };
	}
	if (kind === 'monthly') {
		return { start: selectedDate.slice(0, 7) + '-01', end: addDays(addCalendarMonth(selectedDate.slice(0, 7) + '-01'), -1) };
	}
	return { start: selectedDate.slice(0, 4) + '-01-01', end: selectedDate.slice(0, 4) + '-12-31' };
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
	return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}