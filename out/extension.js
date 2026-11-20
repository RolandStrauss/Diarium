"use strict";var We=Object.create;var G=Object.defineProperty;var Je=Object.getOwnPropertyDescriptor;var Ke=Object.getOwnPropertyNames;var _e=Object.getPrototypeOf,Qe=Object.prototype.hasOwnProperty;var Ze=(e,t)=>{for(var o in t)G(e,o,{get:t[o],enumerable:!0})},we=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Ke(t))!Qe.call(e,r)&&r!==o&&G(e,r,{get:()=>t[r],enumerable:!(n=Je(t,r))||n.enumerable});return e};var N=(e,t,o)=>(o=e!=null?We(_e(e)):{},we(t||!e||!e.__esModule?G(o,"default",{value:e,enumerable:!0}):o,e)),Ge=e=>we(G({},"__esModule",{value:!0}),e);var ut={};Ze(ut,{activate:()=>lt,deactivate:()=>ct});module.exports=Ge(ut);var s=N(require("vscode")),S=require("node:fs/promises"),je=require("node:os"),D=N(require("node:path"));function Xe(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function xe(e){let t=Xe();return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${e.cspSource} 'unsafe-inline'; script-src 'nonce-${t}';">
<title>Time Tracker</title>
<style>
:root { color-scheme: light dark; --line: var(--vscode-panel-border); --muted: var(--vscode-descriptionForeground); --accent: var(--vscode-focusBorder); --warning: var(--vscode-editorWarning-foreground); }
* { box-sizing: border-box; }
body { padding: 0 22px 28px; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); font-size: var(--vscode-font-size); }
header { position: sticky; top: 0; z-index: 3; background: var(--vscode-editor-background); border-bottom: 1px solid var(--line); padding: 12px 0 0; }
h1 { display: inline-block; font-size: 19px; margin: 0 22px 12px 0; font-weight: 600; }
.tabs { display: inline-flex; gap: 4px; }
button, input, select { font: inherit; color: inherit; }
button { border: 1px solid var(--line); background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); padding: 5px 10px; cursor: pointer; border-radius: 2px; }
button:hover { background: var(--vscode-button-secondaryHoverBackground); }
button.primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border-color: transparent; }
button[aria-selected="true"] { border-bottom: 2px solid var(--accent); }
input, select { min-height: 28px; padding: 4px 7px; border: 1px solid var(--vscode-input-border, var(--line)); background: var(--vscode-input-background); color: var(--vscode-input-foreground); border-radius: 2px; }
input:focus, select:focus, button:focus-visible { outline: 1px solid var(--accent); outline-offset: 1px; }
main { max-width: 1280px; margin: 0 auto; }
.toolbar, .filters, .period-controls, .totals, .quick-add { display: flex; flex-wrap: wrap; align-items: end; gap: 12px; }
.toolbar { justify-content: space-between; padding: 16px 0 10px; }
.filters, .period-controls { padding: 10px 0; }
label { display: grid; gap: 4px; color: var(--muted); font-size: 12px; }
.quick-add { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 12px 0; margin-bottom: 12px; }
.quick-add h2 { font-size: 13px; margin: 0 10px 0 0; color: var(--vscode-foreground); }
.quick-add label.task { flex: 1 1 220px; }
.holiday-label { display: block; color: var(--vscode-editorInfo-foreground); white-space: normal; overflow-wrap: anywhere; }
.totals { align-items: center; padding: 10px 0 14px; gap: 24px; }
.metric { display: flex; align-items: baseline; gap: 7px; }
.metric strong { font-size: 17px; font-variant-numeric: tabular-nums; }
.metric span { color: var(--muted); }
.table-wrap { overflow: auto; border-top: 1px solid var(--line); max-height: 67vh; }
table { border-collapse: collapse; width: 100%; min-width: 720px; }
th, td { padding: 5px 7px; text-align: left; border-bottom: 1px solid var(--line); }
th { position: sticky; top: 0; z-index: 1; background: var(--vscode-editor-background); color: var(--muted); font-weight: 500; }
td.date, td.duration { white-space: nowrap; font-variant-numeric: tabular-nums; }
td.date { width: 140px; }
td.task { min-width: 220px; }
td.task input { width: 100%; }
td.time { width: 125px; }
td.duration { width: 100px; color: var(--muted); }
tr.weekend { background: color-mix(in srgb, var(--vscode-editorInfo-foreground) 7%, transparent); }
tr.incomplete { box-shadow: inset 3px 0 var(--warning); }
.warning-text { color: var(--warning); }
.print-task, .print-time { display: none; }
.subtle { color: var(--muted); }
.view[hidden] { display: none; }
.report-heading { display: flex; justify-content: space-between; align-items: end; gap: 12px; padding: 15px 0 7px; }
.report-heading h2 { font-size: 16px; margin: 0; }
#tracked-active-file { overflow-wrap: anywhere; }
#file-times-table td.file { overflow-wrap: anywhere; }
#report-table { min-width: 640px; }
#report-table td.task { width: 34%; }
#report-table tr.weekend td:nth-child(2)::after { content: ' (Weekend)'; font-weight: 600; }
#print-warning { margin: 0 0 8px; color: var(--warning); }
.error { min-height: 20px; color: var(--vscode-errorForeground); padding: 5px 0; }
@media (max-width: 700px) { body { padding: 0 10px 20px; } .toolbar { align-items: start; } .tabs { display: flex; flex-wrap: wrap; width: 100%; } .filters > label, .period-controls > label { flex: 1 1 130px; } }
@media print {
	@page { size: A4 landscape; margin: 7mm; }
	body { padding: 0; color: #111; background: #fff; font: 8pt Arial, sans-serif; }
	header { position: static; border: 0; padding: 0; }
	h1 { font-size: 14pt; margin: 0 0 4mm; color: #111; }
	.tabs, .screen-only, #entries-view, #holidays-view, #file-times-view, .error, #print-warning { display: none !important; }
	#report-view { display: block !important; }
	.table-wrap { overflow: visible; max-height: none; }
	.report-heading { padding: 0 0 2mm; }
	.report-heading h2 { font-size: 10pt; }
	#report-table { min-width: 0; width: 100%; font-size: 7pt; }
	#report-table th, #report-table td { padding: 1.1mm 1.5mm; border: 0.3pt solid #777; }
	#report-table th { position: static; background: #e8e8e8; color: #111; }
	#report-table tr.weekend { background: #e6e6e6; }
	#report-table tr.incomplete { box-shadow: inset 2pt 0 #111; }
	#report-table tr.incomplete td:last-child::after { content: ' Incomplete'; font-style: italic; }
	#report-table input { display: none !important; }
	#report-table .print-task, #report-table .print-time { display: inline !important; }
	#print-summary { color: #111; padding-top: 2mm; }
}
</style>
</head>
<body>
<header>
<h1>Time Tracker</h1>
<nav class="tabs" aria-label="Timesheet views">
<button id="entries-tab" role="tab" aria-selected="true" aria-controls="entries-view">Entries</button>
<button id="report-tab" role="tab" aria-selected="false" aria-controls="report-view">Period report</button>
<button id="holidays-tab" role="tab" aria-selected="false" aria-controls="holidays-view">Public holidays</button>
<button id="file-times-tab" role="tab" aria-selected="false" aria-controls="file-times-view">File activity</button>
</nav>
</header>
<main>
<section id="entries-view" class="view" role="tabpanel" aria-labelledby="entries-tab">
<div class="toolbar"><div><label for="year-select">Calendar year</label><select id="year-select"></select></div><p class="subtle">Add multiple entries per date. Overnight shifts are calculated automatically.</p></div>
<div class="period-controls">
<label>Summary period<select id="summary-kind" aria-label="Summary period"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
<label>Summary date<input id="summary-date" type="date" aria-label="Summary date" aria-describedby="entries-error"></label>
<div class="metric"><strong id="period-total">0h 00m</strong><span>period hours</span></div>
<div class="metric"><strong id="period-count">0</strong><span>completed entries</span></div>
<span id="period-range" class="subtle"></span>
</div>
<form id="add-form" class="quick-add" novalidate>
<h2>Add entry</h2>
<label>Date<input id="add-date" type="date" required aria-label="Entry date" aria-describedby="entries-error"></label>
<label class="task">Task<input id="add-task" type="text" maxlength="240" required aria-label="Task description" aria-describedby="entries-error"></label>
<label>Time In<input id="add-in" type="time" step="60" aria-label="Time In" aria-describedby="entries-error"></label>
<label>Time Out<input id="add-out" type="time" step="60" aria-label="Time Out" aria-describedby="entries-error"></label>
<button id="add-submit" class="primary" type="submit">Add entry</button>
</form>
<div class="filters">
<label>Filter by date<input id="filter-date" type="date" aria-label="Filter by date" aria-describedby="entries-error"></label>
<label>Filter by task<input id="filter-task" type="search" placeholder="Search tasks" aria-label="Filter by task description"></label>
<button id="clear-filters" type="button">Clear filters</button>
</div>
<div class="totals" aria-live="polite">
<div class="metric"><strong id="entry-total">0h 00m</strong><span>filtered hours</span></div>
<div class="metric"><strong id="entry-count">0</strong><span>completed entries</span></div>
<span id="row-count" class="subtle"></span>
</div>
<div id="entries-error" class="error" role="alert" aria-live="assertive"></div>
<div class="table-wrap"><table aria-label="Daily time entries">
<thead><tr><th scope="col">Date</th><th scope="col">Task</th><th scope="col">Time In</th><th scope="col">Time Out</th><th scope="col">Entry duration</th><th scope="col">Daily total</th><th scope="col">Action</th></tr></thead>
<tbody id="entries-body"></tbody>
</table></div>
</section>
<section id="holidays-view" class="view" role="tabpanel" aria-labelledby="holidays-tab" hidden>
<div class="toolbar"><div><h2>Public holidays</h2><p class="subtle">Add specific dates. Holidays label reports but do not add hours or affect estimates.</p></div></div>
<form id="holiday-form" class="quick-add" novalidate>
<label>Date<input id="holiday-date" type="date" required aria-describedby="holidays-error"></label>
<label class="task">Holiday name<input id="holiday-name" type="text" maxlength="240" required aria-describedby="holidays-error"></label>
<button class="primary" type="submit">Add holiday</button>
</form>
<div id="holidays-error" class="error" role="alert" aria-live="assertive"></div>
<div class="table-wrap"><table aria-label="Public holidays">
<thead><tr><th scope="col">Date</th><th scope="col">Holiday</th><th scope="col">Action</th></tr></thead>
<tbody id="holidays-body"></tbody>
</table></div>
</section>
<section id="file-times-view" class="view" role="tabpanel" aria-labelledby="file-times-tab" hidden>
<div class="toolbar"><div><h2>Automatic file tracking</h2><p class="subtle">Time accumulates while VS Code is focused and a local file is active, including idle periods. Totals stay separate from timesheet reports.</p></div><div><button id="floating-timer-button" type="button">Show floating timer</button> <button id="time-card-button" class="primary" type="button">Preview time card</button></div></div>
<div class="totals" aria-live="polite">
<div class="metric"><strong id="tracked-total">0h 00m</strong><span>tracked time</span></div>
<div class="metric"><strong id="tracked-file-count">0</strong><span>files tracked</span></div>
<div class="metric"><strong id="tracked-active-file">No file active</strong><span>current file</span></div>
<span id="tracking-status" role="status"></span>
</div>
<div class="table-wrap"><table id="file-times-table" aria-label="Automatic file time totals">
<thead><tr><th scope="col">File path</th><th scope="col">Tracked time</th><th scope="col">Status</th></tr></thead>
<tbody id="file-times-body"></tbody>
</table></div>
</section>
<section id="report-view" class="view" role="tabpanel" aria-labelledby="report-tab" hidden>
<div class="period-controls screen-only">
<label>Period start<input id="period-start" type="date" aria-label="Period start date" aria-describedby="report-error"></label>
<label>Period end<input id="period-end" type="date" readonly aria-label="Calculated period end date"></label>
<label>Hourly rate<input id="hourly-rate" type="number" min="0" step="any" placeholder="Not set" aria-label="Hourly rate" aria-describedby="report-error"></label>
<button id="save-period" type="button" hidden>Save period draft</button>
<button id="discard-period" type="button" hidden>Discard period draft</button>
<button id="save-rate" type="button" hidden>Save rate draft</button>
<button id="discard-rate" type="button" hidden>Discard rate draft</button>
<button id="print-button" class="primary" type="button" title="Choose print or PDF export">Print / Save PDF</button>
</div>
<div class="report-heading"><h2 id="report-title">Reporting period</h2><span id="report-days" class="subtle"></span></div>
<p id="print-warning" role="status">Print opens a landscape A4 PDF in your default viewer; use its Print command. You can also save a PDF directly to disk.</p>
<div id="report-error" class="error" role="alert" aria-live="assertive"></div>
<div class="table-wrap"><table id="report-table" aria-label="Custom reporting cycle">
<thead><tr><th scope="col">Date</th><th scope="col">Day</th><th scope="col">Task</th><th scope="col">Time In</th><th scope="col">Time Out</th><th scope="col">Entry duration</th><th scope="col">Daily total</th></tr></thead>
<tbody id="report-body"></tbody>
</table></div>
<div id="print-summary" class="totals" aria-live="polite"></div>
</section>
</main>
<script nonce="${t}">
const vscode = acquireVsCodeApi();
const byId = (id) => document.getElementById(id);
let data = { entries: {}, holidays: [], periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null, paused: false, excluded: false };
const drafts = {}; const pendingFormEntries = {};
let periodDraft = null; let rateDraft = null; let renderPending = false; let nextRequestId = 0;
const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
function esc(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function dateObj(value) { return new Date(value + 'T00:00:00Z'); }
function dateText(value) { return dateFormat.format(dateObj(value)); }
function localDateValue() { const date = new Date(); return [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-'); }
function validDate(value) {
 if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(value) || value.startsWith('0000-')) return false;
 const date = dateObj(value); return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function dateString(date) {
 if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999) throw new RangeError('Date is outside the supported four-digit calendar range.');
 return date.toISOString().slice(0, 10);
}
function addDays(value, amount) {
 if (!validDate(value) || !Number.isSafeInteger(amount)) throw new RangeError('Enter a valid calendar date.');
 const date = dateObj(value); date.setUTCDate(date.getUTCDate() + amount); return dateString(date);
}
function periodEnd(value) {
 if (!validDate(value)) throw new RangeError('Enter a valid period start date.');
 const [year, month, day] = value.split('-').map(Number); const date = dateObj(value);
 date.setUTCDate(1); date.setUTCFullYear(year, month + 1, 0);
 date.setUTCDate(Math.min(day, date.getUTCDate()) - 1); return dateString(date);
}
function minutes(entry) { if (!entry || !entry.timeIn || !entry.timeOut) return null; const a = entry.timeIn.match(/^([01]\\d|2[0-3]):([0-5]\\d)$/); const b = entry.timeOut.match(/^([01]\\d|2[0-3]):([0-5]\\d)$/); if (!a || !b) return null; const start = Number(a[1]) * 60 + Number(a[2]); let end = Number(b[1]) * 60 + Number(b[2]); if (end < start) end += 1440; return end - start; }
function durationText(value) { return Math.floor(value / 60) + 'h ' + String(value % 60).padStart(2, '0') + 'm'; }
function setError(id, message) { byId(id).textContent = message || ''; }
function entriesFor(date) {
 const value = data.entries[date];
 return Array.isArray(value) ? value : value ? [value] : [];
}
function holidaysFor(date) { return data.holidays.filter((holiday) => holiday.date === date); }
function holidayLabels(date) { return holidaysFor(date).map((holiday) => '<span class="holiday-label">Public holiday: ' + esc(holiday.name) + '</span>').join(''); }
function renderHolidays() {
 const holidays = [...data.holidays].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
 byId('holidays-body').innerHTML = holidays.length ? holidays.map((holiday) =>
  '<tr><td class="date">' + esc(dateText(holiday.date)) + '</td><td>' + esc(holiday.name) + '</td><td><button type="button" data-holiday="' + esc(JSON.stringify(holiday)) + '" aria-label="Remove ' + esc(holiday.name) + ' on ' + esc(dateText(holiday.date)) + '">Remove</button></td></tr>').join('')
  : '<tr><td colspan="3" class="subtle">No public holidays added.</td></tr>';
 byId('holidays-body').querySelectorAll('button').forEach((button) => button.addEventListener('click', () =>
  vscode.postMessage({ type: 'deleteHoliday', holiday: JSON.parse(button.dataset.holiday), view: 'holidays' })));
}
function allEntries() { return Object.values(data.entries).reduce((entries, value) => entries.concat(Array.isArray(value) ? value : value ? [value] : []), []); }
function draftKey(date, id) { return id || 'new:' + date; }
function sameEntry(a, b) { return (!a && !b) || Boolean(a && b && a.id === b.id && a.date === b.date && a.task === b.task && a.timeIn === b.timeIn && a.timeOut === b.timeOut); }
function fieldError(input, errorId, message) {
 input.setAttribute('aria-invalid', String(Boolean(message))); setError(errorId, message);
}
function validateRow(entry, fields, errorId, allowBlank) {
 Object.values(fields).forEach((input) => input.removeAttribute('aria-invalid'));
 let field; let message;
 if (fields.date && (!validDate(entry.date) || fields.date.validity.badInput)) { field = fields.date; message = 'Enter a valid calendar date.'; }
 else if ((!allowBlank || entry.timeIn || entry.timeOut) && !entry.task.trim()) { field = fields.task; message = 'Enter a task description.'; }
 else if (fields.timeIn.validity.badInput || (entry.timeIn && !/^([01]\\d|2[0-3]):[0-5]\\d$/.test(entry.timeIn))) { field = fields.timeIn; message = 'Time In must use 24-hour HH:mm format.'; }
 else if (fields.timeOut.validity.badInput || (entry.timeOut && !/^([01]\\d|2[0-3]):[0-5]\\d$/.test(entry.timeOut))) { field = fields.timeOut; message = 'Time Out must use 24-hour HH:mm format.'; }
 if (field) { fieldError(field, errorId, message); return false; }
 setError(errorId, ''); return true;
}
function renderYearSelect() {
 const select = byId('year-select'); const current = Number(select.value) || new Date().getFullYear();
 const years = new Set(allEntries().map((entry) => Number(entry.date.slice(0, 4))));
 if (byId('filter-date').value) years.add(Number(byId('filter-date').value.slice(0, 4)));
 for (let year = Math.max(1, current - 10); year <= Math.min(9999, current + 10); year++) years.add(year);
 select.innerHTML = ''; Array.from(years).filter((year) => year >= 1 && year <= 9999).sort((a, b) => a - b).forEach((year) => { const option = document.createElement('option'); option.value = String(year); option.textContent = String(year); select.appendChild(option); });
 select.value = String(current);
}
function renderEntries() {
 const year = Number(byId('year-select').value) || new Date().getFullYear();
 const filterDate = byId('filter-date').value; const taskQuery = byId('filter-task').value.trim().toLowerCase();
 if (filterDate && !validDate(filterDate)) {
  fieldError(byId('filter-date'), 'entries-error', 'Enter a valid filter date.'); byId('entries-body').innerHTML = ''; updateEntryTotals([]); byId('row-count').textContent = '0 dates shown'; return;
 }
 const dates = new Set();
 if (filterDate) dates.add(filterDate);
 else { const count = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365; for (let day = 0; day < count; day++) dates.add(addDays(String(year).padStart(4, '0') + '-01-01', day)); }
 if (taskQuery) allEntries().filter((entry) => entry.task.toLowerCase().includes(taskQuery)).forEach((entry) => dates.add(entry.date));
 const visible = Array.from(dates).sort().filter((date) => {
  if (filterDate && date !== filterDate) return false;
  return !taskQuery || entriesFor(date).some((entry) => entry.task.toLowerCase().includes(taskQuery));
 });
 byId('row-count').textContent = visible.length + (visible.length === 1 ? ' date shown' : ' dates shown');
 const visibleEntries = [];
 const rows = [];
 visible.forEach((date) => {
  const saved = taskQuery
   ? entriesFor(date).filter((entry) => entry.task.toLowerCase().includes(taskQuery))
   : entriesFor(date);
  const records = saved.length ? saved : [{ date, task: '', timeIn: '', timeOut: '' }];
  const completed = saved.map(minutes).filter((value) => value !== null);
  const dailyTotal = durationText(completed.reduce((sum, value) => sum + value, 0));
  records.forEach((original, index) => {
   const key = draftKey(date, original.id);
   const entry = drafts[key]?.entry || original;
   const value = minutes(entry); const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut);
   const savedEntry = original.id ? original : null;
   if (savedEntry) visibleEntries.push(savedEntry);
   rows.push('<tr data-date="' + date + '" data-id="' + esc(original.id || '') + '" data-expected="' + esc(JSON.stringify(savedEntry)) + '" class="' + (incomplete ? 'incomplete ' : '') + (dateObj(date).getUTCDay() % 6 === 0 ? 'weekend' : '') + '">' +
    '<td class="date">' + esc(dateText(date)) + (dateObj(date).getUTCDay() % 6 === 0 ? ' (Weekend)' : '') + (index === 0 ? holidayLabels(date) : '') + '</td>' +
    '<td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="entries-error" aria-label="Task for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + (drafts[key]?.pending || drafts[key]?.deleting ? ' disabled' : '') + '></td>' +
    '<td class="time"><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-describedby="entries-error" aria-label="Time In for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + (drafts[key]?.pending || drafts[key]?.deleting ? ' disabled' : '') + '></td>' +
    '<td class="time"><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-describedby="entries-error" aria-label="Time Out for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + (drafts[key]?.pending || drafts[key]?.deleting ? ' disabled' : '') + '></td>' +
    '<td class="duration ' + (incomplete ? 'warning-text' : '') + '" aria-label="Entry duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td>' +
    '<td class="duration">' + (index === 0 ? dailyTotal : '') + '</td>' +
    '<td><button type="button" data-action="delete" aria-label="Delete entry ' + (index + 1) + ' for ' + esc(dateText(date)) + '" ' + (savedEntry && !drafts[key]?.pending && !drafts[key]?.deleting ? '' : 'disabled') + '>Delete</button>' +
    (drafts[key]?.deleting ? ' <span>Deletion pending</span>' : '') +
    ' <button type="button" data-action="save" aria-label="Save draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + (drafts[key]?.pending ? ' disabled' : '') + '>Save</button>' +
    ' <button type="button" data-action="discard" aria-label="Discard draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + (drafts[key]?.pending ? ' disabled' : '') + '>Discard</button></td></tr>');
  });
 });
 byId('entries-body').innerHTML = rows.join('');
 byId('entries-body').querySelectorAll('input').forEach((input) => input.addEventListener('input', rememberRow));
 byId('entries-body').querySelectorAll('[data-action="save"]').forEach((button) => button.addEventListener('click', saveRow));
 byId('entries-body').querySelectorAll('[data-action="discard"]').forEach((button) => button.addEventListener('click', discardDraft));
 byId('entries-body').querySelectorAll('[data-action="delete"]').forEach((button) => button.addEventListener('click', deleteRow));
 updateEntryTotals(visibleEntries);
}
function updateEntryTotals(visibleEntries) {
 const values = visibleEntries.map(minutes).filter((value) => value !== null);
 byId('entry-total').textContent = durationText(values.reduce((sum, value) => sum + value, 0));
 byId('entry-count').textContent = String(values.length);
}
function saveRow(event) {
 saveEntryRow(event, 'entries-error', 'entries');
}
function rememberRow(event) {
 const row = event.target.closest('tr'); const date = row.dataset.date; const id = row.dataset.id; const key = draftKey(date, id);
 const previous = drafts[key];
 drafts[key] = { entry: { date, task: row.querySelector('[data-field="task"]').value, timeIn: row.querySelector('[data-field="timeIn"]').value, timeOut: row.querySelector('[data-field="timeOut"]').value, ...(id ? { id } : {}) }, id, expected: previous ? previous.expected : JSON.parse(row.dataset.expected), requestId: previous?.requestId, pending: false };
 const save = row.querySelector('[data-action="save"]'); if (save) save.hidden = false;
 const discard = row.querySelector('[data-action="discard"]'); if (discard) discard.hidden = false;
}
function deleteRow(event) {
 const row = event.target.closest('tr'); const date = row.dataset.date; const id = row.dataset.id; const key = draftKey(date, id);
 const expected = drafts[key]?.expected || JSON.parse(row.dataset.expected);
 drafts[key] = { entry: drafts[key]?.entry || expected, id, expected, deleting: true, pending: false };
 renderEntries(); renderReport();
}
function discardDraft(event) {
 const row = event.target.closest('tr'); delete drafts[draftKey(row.dataset.date, row.dataset.id)]; setError('entries-error', ''); setError('report-error', ''); renderEntries(); renderReport();
}
function renderSummary() {
 const selected = byId('summary-date').value; const kind = byId('summary-kind').value;
 if (!validDate(selected)) { fieldError(byId('summary-date'), 'entries-error', 'Enter a valid summary date.'); byId('period-total').textContent = '\u2014'; byId('period-count').textContent = '\u2014'; byId('period-range').textContent = ''; return; }
 let start = selected; let end = selected;
 try {
 if (kind === 'weekly') { const weekday = dateObj(selected).getUTCDay(); start = addDays(selected, -((weekday + 6) % 7)); end = addDays(start, 6); }
 if (kind === 'monthly') { start = selected.slice(0, 7) + '-01'; end = periodEnd(start); }
 if (kind === 'yearly') { start = selected.slice(0, 4) + '-01-01'; end = selected.slice(0, 4) + '-12-31'; }
 } catch (error) { fieldError(byId('summary-date'), 'entries-error', error.message); byId('period-total').textContent = '\u2014'; byId('period-count').textContent = '\u2014'; byId('period-range').textContent = ''; return; }
 if (byId('summary-date').getAttribute('aria-invalid') === 'true') { byId('summary-date').removeAttribute('aria-invalid'); setError('entries-error', ''); }
 const completed = allEntries().filter((entry) => entry.date >= start && entry.date <= end).map(minutes).filter((value) => value !== null);
 byId('period-total').textContent = durationText(completed.reduce((sum, value) => sum + value, 0));
 byId('period-count').textContent = String(completed.length);
 byId('period-range').textContent = dateText(start) + ' \u2013 ' + dateText(end);
}
function renderFileTimes() {
 const activeEligible = Boolean(data.activeFile && !data.paused && !data.excluded);
 const files = Object.entries(data.fileTimes || {}).filter(([file, milliseconds]) => Number.isFinite(milliseconds) && milliseconds >= 0 && (milliseconds > 0 || (file === data.activeFile && activeEligible)));
 files.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
 const total = files.reduce((sum, [, milliseconds]) => sum + milliseconds, 0);
 byId('tracked-total').textContent = durationText(Math.floor(total / 60000));
 byId('tracked-file-count').textContent = String(files.length);
 byId('tracked-active-file').textContent = data.activeFile || 'No file active';
 byId('tracking-status').textContent = data.excluded ? 'Current file excluded from automatic tracking' : data.paused ? 'Automatic tracking paused' : '';
 byId('file-times-body').innerHTML = files.length
  ? files.map(([file, milliseconds]) => '<tr><td class="file">' + esc(file) + '</td><td class="duration">' + durationText(Math.floor(milliseconds / 60000)) + '</td><td>' + (file === data.activeFile ? (data.excluded ? 'Excluded' : data.paused ? 'Paused' : 'Active') : '') + '</td></tr>').join('')
  : '<tr><td colspan="3" class="subtle">No files tracked yet.</td></tr>';
}
function renderReport() {
 const start = data.periodStart || '2026-10-21'; let end;
 try { end = periodEnd(start); } catch (error) { fieldError(byId('period-start'), 'report-error', error.message); byId('report-body').innerHTML = ''; byId('period-end').value = ''; return; }
 byId('period-start').value = periodDraft ? periodDraft.value : start; byId('period-end').value = end;
 byId('hourly-rate').value = rateDraft ? rateDraft.value : (data.hourlyRate === null ? '' : String(data.hourlyRate));
 byId('save-period').hidden = byId('discard-period').hidden = !periodDraft;
 byId('save-rate').hidden = byId('discard-rate').hidden = !rateDraft;
 byId('period-start').disabled = byId('save-period').disabled = byId('discard-period').disabled = Boolean(periodDraft?.pending);
 byId('hourly-rate').disabled = byId('save-rate').disabled = byId('discard-rate').disabled = Boolean(rateDraft?.pending);
 byId('report-title').textContent = 'Period report: ' + dateText(start) + ' to ' + dateText(end);
 let total = 0; const loggedDates = new Set(); const rows = [];
 for (let date = start; date <= end;) {
	const entries = entriesFor(date);
	const records = entries.length ? entries : [{ date, task: '', timeIn: '', timeOut: '' }];
	const completed = entries.map(minutes).filter((value) => value !== null);
	const dailyMinutes = completed.reduce((sum, value) => sum + value, 0);
	const dailyTotal = durationText(dailyMinutes);
	if (completed.length) { total += dailyMinutes; loggedDates.add(date); }
	for (const [index, original] of records.entries()) {
		const key = draftKey(date, original.id);
		const entry = drafts[key]?.entry || original;
		const value = minutes(entry);
		const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut);
		const weekday = dateObj(date).getUTCDay();
		const savedEntry = original.id ? original : null;
		const disabled = drafts[key]?.pending || drafts[key]?.deleting ? ' disabled' : '';
		rows.push('<tr data-date="' + date + '" data-id="' + esc(original.id || '') + '" data-expected="' + esc(JSON.stringify(savedEntry)) + '" class="' + (incomplete ? 'incomplete ' : '') + (weekday === 0 || weekday === 6 ? 'weekend' : '') + '"><td class="date">' + esc(date) + '</td><td>' + esc(new Intl.DateTimeFormat(undefined, { weekday: 'long', timeZone: 'UTC' }).format(dateObj(date))) + '</td><td class="task">' + (index === 0 ? holidayLabels(date) : '') + '<input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="report-error" aria-label="Task for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + disabled + '> ' + (drafts[key]?.deleting ? '<span class="screen-only">Deletion pending</span> ' : '') + '<button type="button" class="screen-only" data-action="save" aria-label="Save draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + (drafts[key]?.pending ? ' disabled' : '') + '>Save</button> <button type="button" class="screen-only" data-action="discard" aria-label="Discard draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + (drafts[key]?.pending ? ' disabled' : '') + '>Discard</button><span class="print-task"></span></td><td><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-describedby="report-error" aria-label="Time In for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + disabled + '><span class="print-time">' + esc(entry.timeIn) + '</span></td><td><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-describedby="report-error" aria-label="Time Out for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + disabled + '><span class="print-time">' + esc(entry.timeOut) + '</span></td><td class="duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td><td class="duration">' + (index === 0 ? dailyTotal : '') + '</td></tr>');
	}
  if (date === end) break;
  date = addDays(date, 1);
 }
 byId('report-body').innerHTML = rows.join('');
 byId('report-body').querySelectorAll('input').forEach((input) => input.addEventListener('input', rememberRow));
 byId('report-body').querySelectorAll('[data-action="save"]').forEach((button) => button.addEventListener('click', saveReportRow));
 byId('report-body').querySelectorAll('[data-action="discard"]').forEach((button) => button.addEventListener('click', discardDraft));
 byId('report-body').querySelectorAll('tr').forEach((row) => row.querySelector('.print-task').textContent = row.querySelector('[data-field="task"]').value);
 const days = loggedDates.size;
 byId('report-days').textContent = days + (days === 1 ? ' day logged' : ' days logged') + (Object.values(drafts).some((draft) => draft.entry.date >= start && draft.entry.date <= end) ? ' (saved entries only; drafts excluded)' : '');
 const rate = data.hourlyRate;
 const estimate = total / 60 * rate;
 byId('print-summary').innerHTML = '<div class="metric"><strong>' + durationText(total) + '</strong><span>Total hours</span></div><div class="metric"><strong>' + days + '</strong><span>Days logged</span></div>' + (rate === null ? '' : '<div class="metric screen-only"><strong>' + (Number.isFinite(estimate) ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }).format(estimate) : 'Estimate exceeds supported range') + '</strong><span>Estimated value (informational)</span></div>');
}
function saveReportRow(event) {
 saveEntryRow(event, 'report-error', 'report');
}
function saveEntryRow(event, errorId, view) {
 const row = event.target.closest('tr'); const fields = { task: row.querySelector('[data-field="task"]'), timeIn: row.querySelector('[data-field="timeIn"]'), timeOut: row.querySelector('[data-field="timeOut"]') };
 const entry = { date: row.dataset.date, task: fields.task.value.trim(), timeIn: fields.timeIn.value, timeOut: fields.timeOut.value };
 const id = row.dataset.id; const key = draftKey(entry.date, id); const draft = drafts[key]; const expected = draft ? draft.expected : JSON.parse(row.dataset.expected);
 if (draft?.pending) return;
 if (draft?.deleting) {
  draft.pending = true; renderEntries(); renderReport();
  vscode.postMessage({ type: 'deleteEntry', date: entry.date, id, expected, view }); return;
 }
 const requestId = id ? undefined : 'row-' + (++nextRequestId);
 drafts[key] = { entry, id, expected, requestId, pending: false };
 if (!validateRow(entry, fields, errorId, true)) return;
 if (!id && !entry.task && !entry.timeIn && !entry.timeOut) { delete drafts[key]; renderEntries(); renderReport(); return; }
 drafts[key].pending = true;
 if (id && !entry.task && !entry.timeIn && !entry.timeOut) drafts[key].deleting = true;
 renderEntries(); renderReport();
 vscode.postMessage(id
  ? { type: 'saveEntry', entry, id, expected, view }
  : { type: 'createEntry', entry, requestId, view });
}
function render() { renderEntries(); renderSummary(); renderReport(); renderHolidays(); renderFileTimes(); }
function setView(view) {
 if (view === 'entries' && byId('entries-view').hidden) renderEntries();
 if (view === 'report' && byId('report-view').hidden) renderReport();
 byId('entries-view').hidden = view !== 'entries'; byId('report-view').hidden = view !== 'report'; byId('holidays-view').hidden = view !== 'holidays'; byId('file-times-view').hidden = view !== 'file-times';
 byId('entries-tab').setAttribute('aria-selected', String(view === 'entries')); byId('report-tab').setAttribute('aria-selected', String(view === 'report')); byId('holidays-tab').setAttribute('aria-selected', String(view === 'holidays')); byId('file-times-tab').setAttribute('aria-selected', String(view === 'file-times'));
}
byId('entries-tab').addEventListener('click', () => setView('entries'));
byId('report-tab').addEventListener('click', () => setView('report'));
byId('holidays-tab').addEventListener('click', () => setView('holidays'));
byId('file-times-tab').addEventListener('click', () => setView('file-times'));
byId('holiday-date').value = localDateValue();
byId('holiday-form').addEventListener('submit', (event) => {
 event.preventDefault();
 const date = byId('holiday-date'); const name = byId('holiday-name');
 if (!validDate(date.value) || date.validity.badInput) { fieldError(date, 'holidays-error', 'Enter a valid holiday date.'); return; }
 if (!name.value.trim() || name.value.length > 240 || /[\\x00-\\x1f\\x7f]/.test(name.value)) { fieldError(name, 'holidays-error', 'Enter a holiday name of up to 240 characters without control characters.'); return; }
 date.removeAttribute('aria-invalid'); name.removeAttribute('aria-invalid'); setError('holidays-error', '');
 vscode.postMessage({ type: 'addHoliday', holiday: { date: date.value, name: name.value.trim() }, view: 'holidays' });
});
byId('year-select').addEventListener('change', renderEntries);
byId('summary-kind').addEventListener('change', renderSummary);
byId('summary-date').value = localDateValue();
byId('summary-date').addEventListener('change', renderSummary);
byId('filter-date').addEventListener('change', () => { if (validDate(byId('filter-date').value)) { byId('filter-date').removeAttribute('aria-invalid'); renderYearSelect(); byId('year-select').value = String(Number(byId('filter-date').value.slice(0, 4))); } renderEntries(); });
byId('filter-task').addEventListener('input', renderEntries);
byId('clear-filters').addEventListener('click', () => { byId('filter-date').value = ''; byId('filter-task').value = ''; renderEntries(); });
byId('add-date').value = localDateValue();
byId('add-form').addEventListener('submit', (event) => {
 event.preventDefault();
 const submit = byId('add-submit');
 if (submit.disabled) return;
 const fields = { date: byId('add-date'), task: byId('add-task'), timeIn: byId('add-in'), timeOut: byId('add-out') };
 const entry = { date: fields.date.value, task: fields.task.value.trim(), timeIn: fields.timeIn.value, timeOut: fields.timeOut.value };
 if (!validateRow(entry, fields, 'entries-error', false)) return;
 const requestId = 'form-' + (++nextRequestId);
 pendingFormEntries[requestId] = entry;
 submit.disabled = true;
 vscode.postMessage({ type: 'createEntry', entry, requestId });
});
byId('period-start').addEventListener('input', () => {
 periodDraft = { value: byId('period-start').value, expectedValue: periodDraft ? periodDraft.expectedValue : data.periodStart, pending: false };
 byId('save-period').hidden = byId('discard-period').hidden = false;
});
byId('save-period').addEventListener('click', () => {
 const input = byId('period-start');
 periodDraft = periodDraft || { value: input.value, expectedValue: data.periodStart, pending: false };
 periodDraft.value = input.value;
 try { periodEnd(input.value); } catch (error) { fieldError(input, 'report-error', error.message); return; }
 input.removeAttribute('aria-invalid'); setError('report-error', ''); periodDraft.pending = true; renderReport();
 vscode.postMessage({ type: 'setPeriodStart', value: input.value, expectedValue: periodDraft.expectedValue });
});
byId('hourly-rate').addEventListener('input', () => {
 rateDraft = { value: byId('hourly-rate').value, expectedValue: rateDraft ? rateDraft.expectedValue : data.hourlyRate, pending: false };
 byId('save-rate').hidden = byId('discard-rate').hidden = false;
});
byId('save-rate').addEventListener('click', () => {
 const input = byId('hourly-rate'); const value = input.value;
 rateDraft = rateDraft || { value, expectedValue: data.hourlyRate, pending: false }; rateDraft.value = value;
 if (input.validity.badInput || (value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0))) { fieldError(input, 'report-error', 'Enter a valid hourly rate of zero or more.'); return; }
 input.removeAttribute('aria-invalid'); setError('report-error', ''); rateDraft.pending = true; renderReport();
 vscode.postMessage({ type: 'setHourlyRate', value, expectedValue: rateDraft.expectedValue });
});
byId('discard-period').addEventListener('click', () => { periodDraft = null; setError('report-error', ''); renderReport(); });
byId('discard-rate').addEventListener('click', () => { rateDraft = null; setError('report-error', ''); renderReport(); });
byId('print-button').addEventListener('click', () => {
 if (Object.keys(drafts).length || periodDraft || rateDraft) { setError('report-error', 'Save or discard unsaved changes before exporting the report.'); return; }
 vscode.postMessage({ type: 'requestReportAction' });
});
byId('time-card-button').addEventListener('click', () => vscode.postMessage({ type: 'openTimeCard' }));
byId('floating-timer-button').addEventListener('click', () => vscode.postMessage({ type: 'showFloatingTimer' }));
window.addEventListener('message', (event) => {
 const message = event.data;
 if (message.type === 'holidayAdded') {
  if (byId('holiday-date').value === message.holiday.date && byId('holiday-name').value.trim() === message.holiday.name) byId('holiday-name').value = '';
  setError('holidays-error', '');
  return;
 }
 if (message.type === 'entryCreated') {
  const key = Object.keys(drafts).find((candidate) => drafts[candidate].requestId === message.requestId);
  if (key) {
   const draft = drafts[key];
   if (sameEntry({ ...draft.entry, id: message.entry.id }, message.entry)) delete drafts[key];
   else {
    delete drafts[key];
    draft.id = message.entry.id; draft.expected = message.entry; draft.requestId = undefined; draft.pending = false;
    drafts[draftKey(draft.entry.date, draft.id)] = draft;
   }
  }
  const formEntry = pendingFormEntries[message.requestId];
  if (formEntry) {
   delete pendingFormEntries[message.requestId];
   byId('add-submit').disabled = false;
   if (byId('add-date').value === formEntry.date && byId('add-task').value.trim() === formEntry.task &&
    byId('add-in').value === formEntry.timeIn && byId('add-out').value === formEntry.timeOut) {
    byId('add-task').value = ''; byId('add-in').value = ''; byId('add-out').value = '';
   }
  }
  const active = document.activeElement;
  if (active && active.closest('tr[data-date]') && drafts[draftKey(active.closest('tr[data-date]').dataset.date, active.closest('tr[data-date]').dataset.id)]) {
   renderPending = true; renderFileTimes();
  } else { renderYearSelect(); render(); }
  return;
 }
 if (message.type === 'state' || message.type === 'saved') {
  data = message.data;
  Object.keys(drafts).forEach((key) => {
   const draft = drafts[key];
   const saved = draft.id ? entriesFor(draft.entry.date).find((entry) => entry.id === draft.id) : undefined;
   if ((draft.pending && draft.deleting && !saved) || (draft.pending && saved && sameEntry(saved, { ...draft.entry, id: draft.id }))) delete drafts[key];
  });
  if (Object.keys(drafts).some((key) => drafts[key].id && !sameEntry(drafts[key].expected, entriesFor(drafts[key].entry.date).find((entry) => entry.id === drafts[key].id)))) {
   const text = 'An entry changed elsewhere. Your draft is retained; copy it or discard it before editing the latest entry.';
   setError('entries-error', text); setError('report-error', text);
  }
  if (periodDraft?.pending && periodDraft.value === data.periodStart) periodDraft = null;
  if (rateDraft?.pending && (rateDraft.value === '' ? null : Number(rateDraft.value)) === data.hourlyRate) rateDraft = null;
  if ((periodDraft && periodDraft.expectedValue !== data.periodStart) || (rateDraft && rateDraft.expectedValue !== data.hourlyRate)) setError('report-error', 'A setting changed elsewhere. Your draft is retained; copy it or discard it before editing the latest value.');
  const active = document.activeElement;
  if (active && ((active.closest('tr[data-date]') && drafts[draftKey(active.closest('tr[data-date]').dataset.date, active.closest('tr[data-date]').dataset.id)]) || (active.id === 'period-start' && periodDraft) || (active.id === 'hourly-rate' && rateDraft))) { renderPending = true; renderFileTimes(); }
  else { renderYearSelect(); render(); }
 }
 if (message.type === 'fileTimes') { data.fileTimes = message.data.fileTimes; data.activeFile = message.data.activeFile; data.paused = message.data.paused; data.excluded = message.data.excluded; data.activeEligible = message.data.activeEligible; renderFileTimes(); }
 if (message.type === 'error') {
  if (message.requestId) {
   delete pendingFormEntries[message.requestId];
   byId('add-submit').disabled = false;
  }
  if (message.operation === 'saveEntry' || message.operation === 'deleteEntry' || message.operation === 'createEntry') {
   const draft = Object.values(drafts).find((item) => message.operation === 'createEntry'
    ? item.requestId === message.requestId : item.id === message.id);
   if (draft) draft.pending = false;
  }
  if (message.operation === 'setPeriodStart' && periodDraft) periodDraft.pending = false;
  if (message.operation === 'setHourlyRate' && rateDraft) rateDraft.pending = false;
  setError(message.view === 'report' ? 'report-error' : message.view === 'holidays' ? 'holidays-error' : 'entries-error', message.message);
  if (Object.keys(drafts).length || periodDraft || rateDraft) {
   vscode.postMessage({ type: 'ready' });
   const active = document.activeElement;
   if (active && (active.closest('tr[data-date]') || active.id === 'period-start' || active.id === 'hourly-rate')) renderPending = true;
   else { renderEntries(); renderReport(); }
  }
 }
});
document.addEventListener('focusout', () => {
 if (renderPending) setTimeout(() => { if (renderPending) { renderPending = false; renderYearSelect(); render(); } }, 0);
});
vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`}function ce(e){if(!P(e.date))return"Enter a valid holiday date.";if(typeof e.name!="string"||!e.name.trim()||e.name.length>240||/[\x00-\x1f\x7f]/.test(e.name))return"Enter a holiday name of up to 240 characters without control characters."}function P(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,o,n]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);return r.getUTCFullYear()===t&&r.getUTCMonth()===o-1&&r.getUTCDate()===n}function X(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function ue(e){if(!X(e.timeIn)||!X(e.timeOut))return;let[t,o]=e.timeIn.split(":").map(Number),[n,r]=e.timeOut.split(":").map(Number),c=t*60+o,l=n*60+r;return l<c&&(l+=1440),l-c}function ke(e,t){if(!P(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let o=new Date(`${e}T00:00:00Z`);return o.setUTCDate(o.getUTCDate()+t),Te(o)}function Te(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function U(e){if(!P(e))throw new RangeError("Enter a valid period start date.");let[t,o,n]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);r.setUTCDate(1),r.setUTCFullYear(t,o+1,0);let c=r.getUTCDate();return r.setUTCDate(Math.min(n,c)-1),Te(r)}function Q(e){if(!P(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!X(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!X(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function L(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var Ee=N(require("pdfkit"));function ee(e){let[t,o,n]=e.split("-").map(Number),r=new Date(0);return r.setUTCFullYear(t,o-1,n),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(r)}function et(e){let t=new Date(`${e}T00:00:00Z`),o=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${o} (Weekend)`:o}function tt(e,t){return e[t]??[]}function pe(e){return new Promise((t,o)=>{if(!P(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let n;try{n=U(e.periodStart)}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!P(n)||n<e.periodStart)throw new Error("Cannot generate PDF: period end is outside the supported calendar.");let r=new Ee.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),c=[];r.on("data",v=>c.push(v)),r.on("error",o),r.on("end",()=>t(Buffer.concat(c)));let l=r.page.width-r.page.margins.left-r.page.margins.right,m=[70,70,l-70-70-48-48-60-70,48,48,60,70],b=3;r.font("Helvetica").fontSize(7.5);let w=r.currentLineHeight(!0),x=2,I=[],H=0,R=new Set;for(let v=e.periodStart;;v=ke(v,1)){let E=tt(e.entries,v),O=(e.holidays??[]).filter(i=>i.date===v),M=E.length?E:[{date:v,task:"",timeIn:"",timeOut:""}],d=E.map(ue).filter(i=>i!==void 0),p=d.reduce((i,a)=>i+a,0),y=L(p);d.length&&(R.add(v),H+=p);for(let[i,a]of M.entries()){if(E.length){let k=Q(a);if(a.date!==v||k)throw new Error(`Cannot generate PDF: invalid entry for ${v}. ${k??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(a.task))throw new Error(`Cannot generate PDF: task for ${v} contains unsupported characters; only printable ASCII is supported.`);let u=i===0?O.map(k=>`Public holiday: ${k.name}`):[];if(u.some(k=>/[^\x20-\x7e]/.test(k)))throw new Error(`Cannot generate PDF: holiday for ${v} contains unsupported characters; only printable ASCII is supported.`);let f=[];for(let k of[...u,a.task]){let C="";for(let $ of k){if(r.widthOfString(C+$)>m[2]-b*2){if(!C)throw new Error(`Cannot generate PDF: task for ${v} cannot fit in the task column.`);f.push(C),C=""}C+=$}(C||!f.length)&&f.push(C)}let h=ue(a),g=!!a.timeIn!=!!a.timeOut,F=new Date(`${v}T00:00:00Z`).getUTCDay()%6===0;I.push({values:[ee(v),et(v),a.task,a.timeIn,a.timeOut,h===void 0?g?"INCOMPLETE":"":L(h),i===0?y:""],taskLines:f,fill:g?"#fff2cc":F?"#eeeeee":"#ffffff"})}if(v===n)break}let Y=`Total hours: ${L(H)}     Days logged: ${R.size}`,A=`Generated ${ee(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,z=["Date","Day","Task","Time In","Time Out","Entry duration","Daily total"],K=`Reporting period: ${ee(e.periodStart)} to ${ee(n)}`,W=w+x,de=22+w;if(r.font("Helvetica-Bold").fontSize(7.5),z.some((v,E)=>r.widthOfString(v)>m[E]-b*2))throw new Error("Cannot generate PDF: a column heading does not fit.");r.font("Helvetica").fontSize(7.5);for(let v of I)if(v.values.some((E,O)=>O!==2&&r.widthOfString(E)>m[O]-b*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(r.widthOfString(A)>l)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica-Bold").fontSize(9),r.widthOfString(Y)>l)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica").fontSize(9),r.widthOfString(K)>l)throw new Error("Cannot generate PDF: period does not fit on the page.");let q=r.page.margins.left,T=0,Z=!1,se=(v,E,O,M=!1)=>{let d=w+x,p=q;r.rect(p,T,l,d).fill(O);for(let y=0;y<v.length;y++){let i=m[y];r.rect(p,T,i,d).lineWidth(.35).stroke("#999999"),r.font(M?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),r.text(y===2?E[0]:v[y],p+b,T+x/2,{lineBreak:!1}),p+=i}T+=d},B=()=>{Z?r.addPage():Z=!0,T=r.page.margins.top,r.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",q,T,{lineBreak:!1}),T+=20,r.font("Helvetica").fontSize(9).fillColor("#333333").text(K,q,T,{lineBreak:!1}),T+=16,se(z,[z[2]],"#dddddd",!0)};B();let _=()=>r.page.height-r.page.margins.bottom,le=()=>Math.max(1,Math.floor((_()-T-x)/w));for(let v of I){let E=0,O=!0;for(;E<v.taskLines.length;){let M=Math.min(v.taskLines.length-E,le());if(T+M*w+x>_()){B();continue}let d=v.taskLines.slice(E,E+M),p=O?v.values:[v.values[0],v.values[1],"","","","",""],y=q,i=M*w+x;r.rect(y,T,l,i).fill(v.fill);for(let a=0;a<p.length;a++){let u=m[a];r.rect(y,T,u,i).lineWidth(.35).stroke("#999999"),r.font("Helvetica").fontSize(7.5).fillColor("#222222"),(a===2?d:[p[a]]).forEach((f,h)=>{r.text(f,y+b,T+x/2+h*w,{lineBreak:!1})}),y+=u}T+=i,E+=M,O=!1,E<v.taskLines.length&&B()}}T+de>_()&&B(),T+=8,r.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(Y,q,T,{lineBreak:!1}),T+=14,r.font("Helvetica").fontSize(7.5).fillColor("#555555").text(A,q,T,{lineBreak:!1}),r.end()})}var Se=require("node:perf_hooks");function re(e){return{total:Object.values(e.fileTimes).reduce((t,o)=>t+o,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function rt(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),o=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof o!="function"||Function.prototype.toString.call(o)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let n=Object.create(null);for(let[r,c]of Object.entries(e)){if(!r||typeof c!="number"||!Number.isFinite(c)||c<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(r)}: expected a non-negative finite duration.`);n[r]=c}return{...n}}var te=class{constructor(t,o,n=()=>Se.performance.now(),r=[]){this.persistFileTimes=o;this.now=n;Object.assign(this.fileTimes,rt(t)),this.excludedFiles=new Set(r)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let o=this.now();return this.accrueTime(o),this.activeFile=t||void 0,this.startedAt=this.isTracking()?o:void 0,this.persist()}setPaused(t){let o=this.now();return this.accrueTime(o),this.paused=t,this.startedAt=this.isTracking()?o:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let o=this.now();return this.accrueTime(o),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?o:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},o=[...this.excludedFiles];this.pendingSnapshots.add(t);let n=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},o)}catch(r){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(c){throw new Error(`File time reset failed: ${String(r)}; recovery write failed: ${String(c)}. Retry saving file times.`)}throw r}this.subtractBaseline(this.fileTimes,t);for(let r of this.pendingSnapshots)r!==t&&this.subtractBaseline(r,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=n.then(()=>{},()=>{}),n}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[o,n]of Object.entries(t))n===0&&!(o===this.activeFile&&this.isTracking())&&delete t[o];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,o){for(let[n,r]of Object.entries(o))if(Object.hasOwn(t,n)){let c=t[n]-r;c>0?t[n]=c:delete t[n]}}persist(){let t={...this.fileTimes},o=[...this.excludedFiles];this.pendingSnapshots.add(t);let n=this.writeQueue.then(()=>this.persistFileTimes({...t},o)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=n.then(()=>{},()=>{}),n}};var ie=N(require("vscode")),De=require("node:crypto"),Fe=N(require("node:path"));function Ie(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(o=>String(o).padStart(2,"0")).join(":")}var ae=class{constructor(t,o){this.snapshot=t;this.toggleTracking=o}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=ie.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:ie.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let o=t.webview.onDidReceiveMessage(async r=>{if(!(!r||typeof r!="object"||!("type"in r)))switch(r.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),n=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{o.dispose(),n.dispose(),this.panel=void 0}),t.webview.html=at()}update(){if(!this.panel)return;let t=this.snapshot(),o=re(t);this.panel.webview.postMessage({type:"timer",totalTime:Ie(o.total),currentTime:Ie(o.current),currentFile:t.activeFile?Fe.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function at(){let e=(0,De.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${e}';">
<title>Floating Timer</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 16px; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
main { max-width: 420px; margin: 0 auto; border: 1px solid var(--vscode-panel-border); border-top: 3px solid var(--vscode-focusBorder); padding: 20px; }
h1, dt { font-size: 12px; font-weight: 500; color: var(--vscode-descriptionForeground); }
h1 { margin: 0 0 16px; letter-spacing: .12em; text-transform: uppercase; }
dl { margin: 0; }
dd { margin: 4px 0 18px; font-family: var(--vscode-editor-font-family); font-variant-numeric: tabular-nums; font-size: clamp(22px, 7vw, 40px); }
#current-file { overflow-wrap: anywhere; }
#status { color: var(--vscode-descriptionForeground); }
.controls { display: flex; flex-wrap: wrap; gap: 8px; }
button { padding: 7px 14px; border: 1px solid var(--vscode-button-border, transparent); background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); font: inherit; cursor: pointer; }
button:hover { background: var(--vscode-button-secondaryHoverBackground); }
button:focus-visible { outline: 2px solid var(--vscode-focusBorder); outline-offset: 2px; }
#toggle { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
#toggle:hover { background: var(--vscode-button-hoverBackground); }
button:disabled { cursor: wait; opacity: .6; }
</style>
</head>
<body>
<main aria-label="Automatic file activity timer">
<h1>File activity</h1>
<dl>
<dt>Total tracked time</dt><dd id="total-time">00:00:00</dd>
<dt>Current file time</dt><dd id="current-time">00:00:00</dd>
</dl>
<p id="current-file">Waiting for tracking state</p>
<p id="status" role="status">Connecting</p>
<div class="controls">
<button id="toggle" type="button" disabled>Pause</button>
<button id="hide" type="button">Hide timer</button>
</div>
</main>
<script nonce="${e}">
const vscode = acquireVsCodeApi();
const toggle = document.getElementById('toggle');
toggle.addEventListener('click', () => {
	toggle.disabled = true;
	vscode.postMessage({ type: 'toggleTracking' });
});
document.getElementById('hide').addEventListener('click', () => vscode.postMessage({ type: 'hide' }));
window.addEventListener('message', event => {
	const message = event.data;
	if (message.type !== 'timer') return;
	document.getElementById('total-time').textContent = message.totalTime;
	document.getElementById('current-time').textContent = message.currentTime;
	document.getElementById('current-file').textContent = message.currentFile;
	document.getElementById('status').textContent = message.status;
	toggle.textContent = message.paused ? 'Resume' : 'Pause';
	toggle.disabled = false;
});
vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`}var oe=require("node:crypto");var Ce=N(require("node:path")),Pe=N(require("pdfkit"));var Oe="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function Re(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function fe(e,t=new Date){let o=Object.entries(e).map(([m,b])=>{if(!m||!Number.isFinite(b)||b<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:Ce.basename(m),milliseconds:b,percent:0}}).sort((m,b)=>b.milliseconds-m.milliseconds||m.name.localeCompare(b.name)),n=o.reduce((m,b)=>m+b.milliseconds,0);if(!Number.isFinite(n))throw new Error("The total tracked time is too large to export.");let r=new Map;for(let m of o)r.set(m.name,(r.get(m.name)??0)+1);let c=new Map,l=new Set(o.map(m=>m.name));for(let m of o){m.percent=n>0?m.milliseconds/n*100:0;let b=m.name;if(r.get(b)>1){let w=c.get(b)??0;do m.name=`${b} (${++w})`;while(l.has(m.name));c.set(b,w),l.add(m.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:n,files:o}}function it(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ne(e){return L(Math.floor(e/6e4))}function me(e,t){let o=e.files.map(n=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${it(n.name)}</span>
<span class="file-time">${ne(n.milliseconds)} <small>${n.percent.toFixed(1)}%</small></span></div>
<div class="track" aria-hidden="true"><div class="bar" style="width:${n.percent}%"></div></div></li>`).join("");return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src ${t?`'nonce-${t.nonce}'`:"'none'"}; base-uri 'none'; form-action 'none';">
<title>Time Tracker - File activity card</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 32px 18px; background: #e8ede9; color: #f5fff7; font-family: 'Trebuchet MS', sans-serif; }
.actions { max-width: 780px; margin: 0 auto 18px; display: flex; flex-wrap: wrap; gap: 10px; }
button { font: inherit; background: #163e39; color: #fff; border: 0; border-radius: 6px; padding: 10px 16px; cursor: pointer; }
button:hover { background: #245c50; }
button:focus-visible { outline: 3px solid #a34b00; outline-offset: 3px; }
.card { max-width: 780px; margin: auto; padding: clamp(24px, 5vw, 52px); border-radius: 22px; background: linear-gradient(135deg, #102d32, #1b5246 65%, #346447); box-shadow: 0 20px 60px #102d3233; animation: arrive .6s ease-out; }
.eyebrow { text-transform: uppercase; letter-spacing: .2em; font-size: 11px; color: #c3e0ce; margin: 0 0 14px; }
h1 { font: normal clamp(32px, 6vw, 52px) Georgia, serif; margin: 0 0 12px; }
.date, .note { color: #d0e4d7; font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
.summary { display: flex; flex-wrap: wrap; gap: 32px; padding: 28px 0; margin: 24px 0; border-block: 1px solid #b4d1bc55; }
.summary strong { display: block; font: normal clamp(28px, 5vw, 42px) Georgia, serif; font-variant-numeric: tabular-nums; color: #ffe1a6; }
.summary span { display: block; margin-top: 8px; color: #d0e4d7; font-size: 13px; }
ul { list-style: none; margin: 0; padding: 0; }
.file-row { margin-bottom: 22px; break-inside: avoid; }
.file-detail { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 18px; margin-bottom: 9px; }
.file-name { overflow-wrap: anywhere; min-width: 0; flex: 1 1 220px; }
.file-time { white-space: nowrap; font-variant-numeric: tabular-nums; color: #ffe1a6; }
small { color: #d0e4d7; margin-left: 8px; }
.track { height: 7px; border-radius: 8px; background: #ffffff22; overflow: hidden; }
.bar { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #7edcbb, #ffcc7d); transform-origin: left; animation: grow .8s ease-out; }
footer { border-top: 1px solid #b4d1bc55; margin-top: 30px; padding-top: 18px; }
@keyframes arrive { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) { .card, .bar { animation: none; } }
@media print {
 @page { size: A4; margin: 14mm; }
 body { padding: 0; background: white; }
 .actions { display: none; }
 .card { max-width: none; border-radius: 0; box-shadow: none; padding: 20px; }
 .card, .bar { animation: none; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
 h1, .summary, footer { break-inside: avoid; }
}
</style>
</head>
<body>
${t?'<nav class="actions" aria-label="Time card actions"><button id="save-html">Save HTML</button><button id="save-pdf">Save PDF</button><button id="refresh">Refresh snapshot</button></nav>':""}
<main class="card">
<p class="eyebrow">Time Tracker / File activity</p>
<h1>Time well spent.</h1>
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${Re(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${ne(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${o||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${Oe}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function Ae(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,o)=>{let n=new Pe.default({size:"A4",margin:44,compress:!0}),r=[];n.on("data",w=>r.push(w)),n.on("error",o),n.on("end",()=>t(Buffer.concat(r)));let c=n.page.width-88,l=0,m=()=>{n.rect(0,0,n.page.width,n.page.height).fill(n.linearGradient(0,0,n.page.width,n.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),n.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),n.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),n.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${Re(e)}`,44,110),n.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${ne(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),l=190},b=()=>{n.addPage(),m()};m();for(let w of e.files){n.font("Helvetica").fontSize(11);let x=n.heightOfString(w.name,{width:c}),I=x+44;l+I>n.page.height-130&&b(),n.fillColor("#ffffff").font("Helvetica").fontSize(11).text(w.name,44,l,{width:c}),l+=x+6,n.fillColor("#ffe1a6").fontSize(10).text(`${ne(w.milliseconds)}  /  ${w.percent.toFixed(1)}%`,44,l),l+=18,n.roundedRect(44,l,c,6,3).fill("#45665d"),w.percent>0&&n.rect(44,l,c*w.percent/100,6).fill(n.linearGradient(44,l,44+c,l).stop(0,"#7edcbb").stop(1,"#ffcc7d")),l+=20}e.files.length||(n.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,l),l+=32),l+90>n.page.height-44&&b(),n.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(Oe,44,l+12,{width:c}),n.end()})}var j=require("node:fs"),Me=require("node:crypto"),$e=N(require("node:path"));function He(e){(0,j.mkdirSync)(e,{recursive:!0});let t=$e.join(e,"time-tracker.owner.lock"),o=JSON.stringify({pid:process.pid,token:(0,Me.randomBytes)(16).toString("hex")});try{(0,j.writeFileSync)(t,o,{flag:"wx"})}catch(n){throw n.code==="EEXIST"?new Error(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${t}, then reopen VS Code.`):n}return()=>{if((0,j.readFileSync)(t,"utf8")!==o)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,j.unlinkSync)(t)}}var nt="time-tracker.data",ot="timesheet.json",Le="time-tracker.file-times",ye="time-tracker.file-activity",qe="excludedFiles",dt="2026-10-21",J,V,ze=Promise.resolve(),ve,he;function Ue(){return(0,oe.randomBytes)(16).toString("hex")}function be(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function Be(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},o=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[l,m]of Object.entries(e.entries)){let b=!Array.isArray(m),w=b?[m]:m;t[l]=w.map(x=>{if(!x||typeof x!="object"||typeof x.date!="string"||typeof x.task!="string"||typeof x.timeIn!="string"||typeof x.timeOut!="string"||x.date!==l||Q(x))throw new Error(`The saved entry for ${l} is invalid. Restore or repair the JSON file before continuing.`);let I=x.id===void 0&&b?Ue():x.id;if(!be(I))throw new Error(`The saved entry for ${l} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(o.has(I))throw new Error(`The saved entry for ${l} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return o.add(I),{...x,id:I}}),t[l].length||delete t[l]}}let n=e.periodStart===void 0?dt:e.periodStart;if(typeof n!="string"||!P(n))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");try{U(n)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}let r=e.hourlyRate===void 0?null:e.hourlyRate;if(r!==null&&(typeof r!="number"||!Number.isFinite(r)||r<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");let c=e.holidays===void 0?[]:e.holidays;if(!Array.isArray(c)||c.some(l=>!l||typeof l!="object"||ce(l)||l.name!==l.name.trim())||new Set(c.map(l=>JSON.stringify([l.date,l.name]))).size!==c.length)throw new Error("The saved public holidays are invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:n,hourlyRate:r,holidays:c}}function ge(e){return D.join(e.globalStorageUri.fsPath,ot)}async function Ve(e,t){let o=ge(e);await(0,S.mkdir)(D.dirname(o),{recursive:!0});let n=`${o}.${process.pid}.${(0,oe.randomBytes)(8).toString("hex")}.tmp`,r=await(0,S.open)(n,"wx");try{await r.writeFile(JSON.stringify(t,null,2),"utf8"),await r.close(),await(0,S.rename)(n,o)}catch(c){try{await r.close(),await(0,S.unlink)(n)}catch(l){let m=c instanceof Error?c.message:String(c),b=l instanceof Error?l.message:String(l);throw new AggregateError([c,l],`Could not save the timesheet: ${m}. Temporary file cleanup failed: ${b}`)}throw c}}async function st(e){try{let o=await(0,S.readFile)(ge(e),"utf8");return Be(JSON.parse(o))}catch(o){if(o.code!=="ENOENT")throw o}let t=Be(e.globalState.get(nt));return await Ve(e,t),t}async function Ne(e,t,o){let n=s.workspace.workspaceFolders?.[0]?.uri??s.Uri.file((0,je.homedir)()),r=await s.window.showSaveDialog({defaultUri:s.Uri.joinPath(n,e),filters:{[t==="html"?"HTML documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!r)return;let c=D.extname(r.fsPath).toLowerCase()===`.${t}`?r.fsPath:`${r.fsPath}.${t}`;return await(0,S.writeFile)(c,await o()),c}function lt(e){let t=[],o=(d,p=!1)=>{let y=()=>{(async()=>{try{if(await s.window.showErrorMessage(d,...p?["Export raw data"]:[])!=="Export raw data")return;let u=await s.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!u)return;let f={fileActivity:e.globalState.get(ye),fileTimes:e.globalState.get(Le),excludedFiles:e.globalState.get(qe),legacyFileTimers:e.globalState.get("fileTimers")};await(0,S.writeFile)(u.fsPath,JSON.stringify(f,null,2),"utf8"),s.window.showInformationMessage(`Raw file activity data saved to ${u.fsPath}.`)}catch(a){let u=a instanceof Error?a.message:String(a);s.window.showErrorMessage(`Could not export raw file activity data: ${u}`)}})()},i=s.window.createStatusBarItem(s.StatusBarAlignment.Right,100);i.text="$(debug-pause) Time Tracker unavailable",i.tooltip=d,i.command="time-tracker.openTimesheet",i.show(),e.subscriptions.push(i,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes"].map(a=>s.commands.registerCommand(a,y))),y()};try{V=He(e.globalStorageUri.fsPath);let d=e.globalState.get(ye),p=e.globalState.get(Le),y=e.globalState.get(qe);if(d!==void 0){if(!d||typeof d!="object"||Array.isArray(d)||!("version"in d)||d.version!==1||!("fileTimes"in d)||d.fileTimes===void 0||!("excludedFiles"in d)||d.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");p=d.fileTimes,y=d.excludedFiles}if(y!==void 0){if(!Array.isArray(y)||y.some(i=>typeof i!="string"||!i))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(y)]}J=new te(p,async(i,a)=>e.globalState.update(ye,{version:1,fileTimes:i,excludedFiles:[...a]}),void 0,t),e.globalState.get("fileTimers")!==void 0&&s.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(d){let p=d instanceof Error?d.message:String(d),y=!!V;if(V)try{V()}catch(i){let a=i instanceof Error?i.message:String(i);o(`${p} Could not release storage ownership: ${a}`);return}finally{V=void 0}o(p,y);return}let n=new Set,r=!1,c=J,l=()=>{let d=c.snapshot();return{...d,excluded:!!d.activeFile&&c.isExcluded(d.activeFile)}},m,b,w=Promise.resolve(),x=new Map,I=async()=>{if(m)return m;b||(b=st(e),ve=b);try{return m=await b,m}finally{b=void 0,ve=void 0}},H=d=>{if(r)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let p=w.then(async()=>{let y=d(await I());await Ve(e,y),m=y;for(let i of n)await i.webview.postMessage({type:"saved",data:{...y,...l()}})});return w=p.then(()=>{},()=>{}),ze=w,p},R=s.window.createStatusBarItem(s.StatusBarAlignment.Right,100);R.command="time-tracker.openTimesheet",R.text="$(watch) 0h 00m | 0h 00m",R.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,R.show();let Y=d=>{let p=d instanceof Error?d.message:String(d);s.window.showErrorMessage(`Could not save automatic file time data: ${p}`)},A=()=>{let d=l(),p=re(d),y=L(Math.floor(p.total/6e4)),i=L(Math.floor(p.current/6e4)),a=d.activeFile?`Current file (${D.basename(d.activeFile)})`:"Current file";R.text=`${d.paused?"$(debug-pause)":"$(watch)"} ${y} | ${i}`+(d.excluded?" Excluded":d.activeFile?"":" Waiting"),R.tooltip=`Total tracked: ${y}
${a}: ${i}
${d.paused?`Automatic tracking paused
`:d.excluded?`Current file excluded
`:""}Click to open Time Tracker`,W.update();for(let u of n)u.webview.postMessage({type:"fileTimes",data:d})},z=async d=>{A();try{await d}catch(p){Y(p)}A()},K=()=>r?Promise.resolve():z(c.setPaused(!c.snapshot().paused)),W=new ae(l,K),de=s.commands.registerCommand("time-tracker.showFloatingTimer",()=>W.show()),q=s.commands.registerCommand("time-tracker.hideFloatingTimer",()=>W.hide()),T=s.commands.registerCommand("time-tracker.toggleTracking",K),Z=s.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(r){s.window.showErrorMessage("Time Tracker is shutting down.");return}let d=s.window.activeTextEditor,p=d?.document.uri.scheme==="file"?d.document.uri.fsPath:void 0,y=p?[p,...t.filter(f=>f!==p)]:t;if(!y.length){s.window.showInformationMessage("No local file is active and no files are excluded.");return}let i=await s.window.showQuickPick(y.map(f=>({label:`${c.isExcluded(f)?"Include":"Exclude"} ${D.basename(f)}`,description:f,file:f})),{placeHolder:"Choose a local file to exclude or include"});if(!i)return;let a=new Set(t);a.has(i.file)?a.delete(i.file):a.add(i.file),t=[...a];let u=c.setExcludedFiles(t);A();try{await u,s.window.showInformationMessage(`${D.basename(i.file)} is ${c.isExcluded(i.file)?"excluded":"included"}.`)}catch(f){Y(f)}A()}),se=s.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(r){s.window.showErrorMessage("Time Tracker is shutting down.");return}if(await s.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await c.reset(),A(),s.window.showInformationMessage("Automatic file activity was reset.")}catch(p){Y(p),A()}}),B=()=>{if(r)return;let d=s.window.activeTextEditor,p=s.window.state.focused&&d?.document.uri.scheme==="file"?d.document.uri.fsPath:void 0;z(c.setActiveFile(p))};B();let _=s.window.onDidChangeActiveTextEditor(B),le=s.window.onDidChangeWindowState(B),v=setInterval(()=>{r||z(c.checkpoint())},6e4),E=setInterval(A,1e3);he=()=>{r=!0,clearInterval(v),clearInterval(E)};let O=s.commands.registerCommand("time-tracker.openTimeCard",()=>{let d;try{d=fe(J?.snapshot().fileTimes??{})}catch(a){let u=a instanceof Error?a.message:String(a);s.window.showErrorMessage(`Could not generate the time card: ${u}`);return}let p=s.window.createWebviewPanel("timeTrackerCard","Time Card Preview",s.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),y=()=>{p.webview.html=me(d,{nonce:(0,oe.randomBytes)(16).toString("hex")})};y();let i=p.webview.onDidReceiveMessage(async a=>{try{if(a.type==="refresh")d=fe(J?.snapshot().fileTimes??{}),y();else if(a.type==="export"){if(a.format!=="html"&&a.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let u=a.format,f=d,h=`time-card-${f.generatedAt.slice(0,10)}.${u}`,g=await Ne(h,u,()=>u==="html"?Buffer.from(me(f),"utf8"):Ae(f));g&&s.window.showInformationMessage(`Time card saved to ${g}`)}}catch(u){let f=u instanceof Error?u.message:String(u);s.window.showErrorMessage(`Could not generate or export the time card: ${f}`)}});p.onDidDispose(()=>i.dispose())}),M=s.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(r){s.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let d=s.window.createWebviewPanel("timeTracker","Time Tracker",s.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});try{await I()}catch(i){d.dispose();let a=i instanceof Error?i.message:String(i);s.window.showErrorMessage(`Could not load ${ge(e)}: ${a}`);return}n.add(d),d.onDidDispose(()=>n.delete(d)),d.webview.html=xe(d.webview);let p=async()=>{await d.webview.postMessage({type:"state",data:{...await I(),...l()}})};function y(i,a){if(!i||!a||i.id!==a.id||i.date!==a.date||i.task!==a.task||i.timeIn!==a.timeIn||i.timeOut!==a.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}d.webview.onDidReceiveMessage(async i=>{if(!i||typeof i!="object"||typeof i.type!="string"){s.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(i.type){case"showFloatingTimer":W.show();break;case"openTimeCard":await s.commands.executeCommand("time-tracker.openTimeCard");break;case"ready":await p();break;case"addHoliday":case"deleteHoliday":{let a=i.holiday;if(!a||typeof a!="object"||ce(a))throw new Error("Enter a valid holiday date and name.");let u={date:a.date,name:a.name.trim()};await H(f=>{let h=f.holidays.some(g=>g.date===u.date&&g.name===u.name);if(i.type==="addHoliday"&&h)throw new Error("This holiday already exists on that date.");if(i.type==="deleteHoliday"&&!h)throw new Error("This holiday was removed in another view.");return{...f,holidays:i.type==="addHoliday"?[...f.holidays,u]:f.holidays.filter(g=>g.date!==u.date||g.name!==u.name)}}),i.type==="addHoliday"&&await d.webview.postMessage({type:"holidayAdded",holiday:u});break}case"createEntry":case"saveEntry":{let a=i.entry;if(!a||typeof a.date!="string"||typeof a.task!="string"||typeof a.timeIn!="string"||typeof a.timeOut!="string"||!P(a.date))throw new Error("Enter a valid date, task, and time values.");let u=!a.task.trim()&&!a.timeIn&&!a.timeOut,f=u&&i.type==="saveEntry"?void 0:Q(a);if(f)throw new Error(f);if(i.type==="createEntry"){if(typeof i.requestId!="string"||!i.requestId||i.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let h={...a,id:Ue(),task:a.task.trim()},g=x.get(i.requestId);if(g){if(!(g.entry.date===h.date&&g.entry.task===h.task&&g.entry.timeIn===h.timeIn&&g.entry.timeOut===h.timeOut))throw new Error("The create-entry request is invalid.");await g.operation,await d.webview.postMessage({type:"entryCreated",requestId:i.requestId,entry:g.entry});break}let F=H(k=>({...k,entries:{...k.entries,[a.date]:[...k.entries[a.date]??[],h]}}));x.set(i.requestId,{entry:h,operation:F});try{await F,await d.webview.postMessage({type:"entryCreated",requestId:i.requestId,entry:h})}catch(k){throw x.delete(i.requestId),k}break}if(!be(i.id))throw new Error("Select a saved entry before editing it.");await H(h=>{let g=h.entries[a.date]??[],F=g.findIndex($=>$.id===i.id),k=g[F];y(k,i.expected);let C={...h.entries};if(u){let $=g.filter(Ye=>Ye.id!==i.id);$.length?C[a.date]=$:delete C[a.date]}else{let $=[...g];$[F]={...a,id:k.id,task:a.task.trim()},C[a.date]=$}return{...h,entries:C}});break}case"deleteEntry":if(!i.date||!P(i.date)||!be(i.id))throw new Error("Select a valid entry to delete.");await H(a=>{let u=i.date,f=a.entries[u]??[],h=f.find(k=>k.id===i.id);y(h,i.expected);let g={...a.entries},F=f.filter(k=>k.id!==i.id);return F.length?g[u]=F:delete g[u],{...a,entries:g}});break;case"setPeriodStart":if(typeof i.value!="string"||!P(i.value))throw new Error("Enter a valid period start date.");U(i.value),await H(a=>{if(a.periodStart!==i.expectedValue)throw new Error("The period start changed in another view. Reload it before editing again.");return{...a,periodStart:i.value}});break;case"setHourlyRate":{if(typeof i.value!="string"||i.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(i.value))throw new Error("Enter a valid hourly rate of zero or more.");let a=i.value===""?null:Number(i.value);if(a!==null&&(!Number.isFinite(a)||a<0))throw new Error("Enter a valid hourly rate of zero or more.");await H(u=>{if(u.hourlyRate!==i.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...u,hourlyRate:a}});break}case"requestReportAction":{await w;let a=await I(),u=await s.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(u?.value==="print"){try{let f=await pe(a),h=D.join(e.globalStorageUri.fsPath,"print-reports");await(0,S.mkdir)(h,{recursive:!0});let g=await(0,S.mkdtemp)(D.join(h,"report-")),F=`timesheet-${a.periodStart}-to-${U(a.periodStart)}.pdf`,k=D.join(g,F);if(await(0,S.writeFile)(k,f),!await s.env.openExternal(s.Uri.file(k)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");s.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(f){let h=f instanceof Error?f.message:String(f);s.window.showErrorMessage(`Could not open the report for printing: ${h}`)}break}if(u?.value==="pdf"){let f=`timesheet-${a.periodStart}-to-${U(a.periodStart)}.pdf`;try{let h=await Ne(f,"pdf",()=>pe(a));h&&s.window.showInformationMessage(`PDF saved to ${h}`)}catch(h){let g=h instanceof Error?h.message:String(h);s.window.showErrorMessage(`Could not save the PDF: ${g}`)}}break}}}catch(a){let u=a instanceof Error?a.message:String(a);await d.webview.postMessage({type:"error",operation:i.type,id:i.id,requestId:i.requestId,view:i.view??(i.type==="setPeriodStart"||i.type==="setHourlyRate"?"report":"entries"),message:u})}})});e.subscriptions.push(M,O,de,q,T,Z,se,W,R,_,le,{dispose:()=>clearInterval(v)},{dispose:()=>clearInterval(E)})}async function ct(){he?.();try{let t=(await Promise.allSettled([J?.setActiveFile(void 0),ze,ve])).find(o=>o.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{J=void 0,he=void 0,V?.(),V=void 0}}0&&(module.exports={activate,deactivate});
