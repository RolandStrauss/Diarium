"use strict";var Ye=Object.create;var X=Object.defineProperty;var We=Object.getOwnPropertyDescriptor;var Je=Object.getOwnPropertyNames;var Ke=Object.getPrototypeOf,_e=Object.prototype.hasOwnProperty;var Qe=(e,t)=>{for(var o in t)X(e,o,{get:t[o],enumerable:!0})},we=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Je(t))!_e.call(e,r)&&r!==o&&X(e,r,{get:()=>t[r],enumerable:!(n=We(t,r))||n.enumerable});return e};var B=(e,t,o)=>(o=e!=null?Ye(Ke(e)):{},we(t||!e||!e.__esModule?X(o,"default",{value:e,enumerable:!0}):o,e)),Ze=e=>we(X({},"__esModule",{value:!0}),e);var ct={};Qe(ct,{activate:()=>st,deactivate:()=>lt});module.exports=Ze(ct);var l=B(require("vscode")),S=require("node:fs/promises"),qe=require("node:os"),F=B(require("node:path"));function Ge(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function xe(e){let t=Ge();return`<!DOCTYPE html>
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
<button class="primary" type="submit">Add entry</button>
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
 const fields = { date: byId('add-date'), task: byId('add-task'), timeIn: byId('add-in'), timeOut: byId('add-out') };
 const entry = { date: fields.date.value, task: fields.task.value.trim(), timeIn: fields.timeIn.value, timeOut: fields.timeOut.value };
 if (!validateRow(entry, fields, 'entries-error', false)) return;
 const requestId = 'form-' + (++nextRequestId);
 pendingFormEntries[requestId] = entry;
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
  if (message.requestId) delete pendingFormEntries[message.requestId];
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
</html>`}function le(e){if(!C(e.date))return"Enter a valid holiday date.";if(typeof e.name!="string"||!e.name.trim()||e.name.length>240||/[\x00-\x1f\x7f]/.test(e.name))return"Enter a holiday name of up to 240 characters without control characters."}function C(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,o,n]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);return r.getUTCFullYear()===t&&r.getUTCMonth()===o-1&&r.getUTCDate()===n}function ee(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function ce(e){if(!ee(e.timeIn)||!ee(e.timeOut))return;let[t,o]=e.timeIn.split(":").map(Number),[n,r]=e.timeOut.split(":").map(Number),u=t*60+o,c=n*60+r;return c<u&&(c+=1440),c-u}function ke(e,t){if(!C(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let o=new Date(`${e}T00:00:00Z`);return o.setUTCDate(o.getUTCDate()+t),Te(o)}function Te(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function j(e){if(!C(e))throw new RangeError("Enter a valid period start date.");let[t,o,n]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);r.setUTCDate(1),r.setUTCFullYear(t,o+1,0);let u=r.getUTCDate();return r.setUTCDate(Math.min(n,u)-1),Te(r)}function _(e){if(!C(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!ee(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!ee(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function M(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var Ee=B(require("pdfkit"));function te(e){let[t,o,n]=e.split("-").map(Number),r=new Date(0);return r.setUTCFullYear(t,o-1,n),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(r)}function Xe(e){let t=new Date(`${e}T00:00:00Z`),o=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${o} (Weekend)`:o}function et(e,t){return e[t]??[]}function ue(e){return new Promise((t,o)=>{if(!C(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let n;try{n=j(e.periodStart)}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!C(n)||n<e.periodStart)throw new Error("Cannot generate PDF: period end is outside the supported calendar.");let r=new Ee.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),u=[];r.on("data",v=>u.push(v)),r.on("error",o),r.on("end",()=>t(Buffer.concat(u)));let c=r.page.width-r.page.margins.left-r.page.margins.right,f=[70,70,c-70-70-48-48-60-70,48,48,60,70],h=3;r.font("Helvetica").fontSize(7.5);let x=r.currentLineHeight(!0),w=2,E=[],R=0,z=new Set;for(let v=e.periodStart;;v=ke(v,1)){let T=et(e.entries,v),P=(e.holidays??[]).filter(a=>a.date===v),d=T.length?T:[{date:v,task:"",timeIn:"",timeOut:""}],m=T.map(ce).filter(a=>a!==void 0),y=m.reduce((a,s)=>a+s,0),i=M(y);m.length&&(z.add(v),R+=y);for(let[a,s]of d.entries()){if(T.length){let D=_(s);if(s.date!==v||D)throw new Error(`Cannot generate PDF: invalid entry for ${v}. ${D??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(s.task))throw new Error(`Cannot generate PDF: task for ${v} contains unsupported characters; only printable ASCII is supported.`);let p=a===0?P.map(D=>`Public holiday: ${D.name}`):[];if(p.some(D=>/[^\x20-\x7e]/.test(D)))throw new Error(`Cannot generate PDF: holiday for ${v} contains unsupported characters; only printable ASCII is supported.`);let g=[];for(let D of[...p,s.task]){let I="";for(let G of D){if(r.widthOfString(I+G)>f[2]-h*2){if(!I)throw new Error(`Cannot generate PDF: task for ${v} cannot fit in the task column.`);g.push(I),I=""}I+=G}(I||!g.length)&&g.push(I)}let b=ce(s),$=!!s.timeIn!=!!s.timeOut,O=new Date(`${v}T00:00:00Z`).getUTCDay()%6===0;E.push({values:[te(v),Xe(v),s.task,s.timeIn,s.timeOut,b===void 0?$?"INCOMPLETE":"":M(b),a===0?i:""],taskLines:g,fill:$?"#fff2cc":O?"#eeeeee":"#ffffff"})}if(v===n)break}let A=`Total hours: ${M(R)}     Days logged: ${z.size}`,U=`Generated ${te(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,V=["Date","Day","Task","Time In","Time Out","Entry duration","Daily total"],H=`Reporting period: ${te(e.periodStart)} to ${te(n)}`,be=x+w,se=22+x;if(r.font("Helvetica-Bold").fontSize(7.5),V.some((v,T)=>r.widthOfString(v)>f[T]-h*2))throw new Error("Cannot generate PDF: a column heading does not fit.");r.font("Helvetica").fontSize(7.5);for(let v of E)if(v.values.some((T,P)=>P!==2&&r.widthOfString(T)>f[P]-h*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(r.widthOfString(U)>c)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica-Bold").fontSize(9),r.widthOfString(A)>c)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica").fontSize(9),r.widthOfString(H)>c)throw new Error("Cannot generate PDF: period does not fit on the page.");let L=r.page.margins.left,k=0,Q=!1,J=(v,T,P,d=!1)=>{let m=x+w,y=L;r.rect(y,k,c,m).fill(P);for(let i=0;i<v.length;i++){let a=f[i];r.rect(y,k,a,m).lineWidth(.35).stroke("#999999"),r.font(d?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),r.text(i===2?T[0]:v[i],y+h,k+w/2,{lineBreak:!1}),y+=a}k+=m},Y=()=>{Q?r.addPage():Q=!0,k=r.page.margins.top,r.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",L,k,{lineBreak:!1}),k+=20,r.font("Helvetica").fontSize(9).fillColor("#333333").text(H,L,k,{lineBreak:!1}),k+=16,J(V,[V[2]],"#dddddd",!0)};Y();let K=()=>r.page.height-r.page.margins.bottom,Z=()=>Math.max(1,Math.floor((K()-k-w)/x));for(let v of E){let T=0,P=!0;for(;T<v.taskLines.length;){let d=Math.min(v.taskLines.length-T,Z());if(k+d*x+w>K()){Y();continue}let m=v.taskLines.slice(T,T+d),y=P?v.values:[v.values[0],v.values[1],"","","","",""],i=L,a=d*x+w;r.rect(i,k,c,a).fill(v.fill);for(let s=0;s<y.length;s++){let p=f[s];r.rect(i,k,p,a).lineWidth(.35).stroke("#999999"),r.font("Helvetica").fontSize(7.5).fillColor("#222222"),(s===2?m:[y[s]]).forEach((g,b)=>{r.text(g,i+h,k+w/2+b*x,{lineBreak:!1})}),i+=p}k+=a,T+=d,P=!1,T<v.taskLines.length&&Y()}}k+se>K()&&Y(),k+=8,r.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(A,L,k,{lineBreak:!1}),k+=14,r.font("Helvetica").fontSize(7.5).fillColor("#555555").text(U,L,k,{lineBreak:!1}),r.end()})}var Se=require("node:perf_hooks");function ae(e){return{total:Object.values(e.fileTimes).reduce((t,o)=>t+o,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function tt(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),o=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof o!="function"||Function.prototype.toString.call(o)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let n=Object.create(null);for(let[r,u]of Object.entries(e)){if(!r||typeof u!="number"||!Number.isFinite(u)||u<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(r)}: expected a non-negative finite duration.`);n[r]=u}return{...n}}var re=class{constructor(t,o,n=()=>Se.performance.now(),r=[]){this.persistFileTimes=o;this.now=n;Object.assign(this.fileTimes,tt(t)),this.excludedFiles=new Set(r)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let o=this.now();return this.accrueTime(o),this.activeFile=t||void 0,this.startedAt=this.isTracking()?o:void 0,this.persist()}setPaused(t){let o=this.now();return this.accrueTime(o),this.paused=t,this.startedAt=this.isTracking()?o:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let o=this.now();return this.accrueTime(o),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?o:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},o=[...this.excludedFiles];this.pendingSnapshots.add(t);let n=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},o)}catch(r){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(u){throw new Error(`File time reset failed: ${String(r)}; recovery write failed: ${String(u)}. Retry saving file times.`)}throw r}this.subtractBaseline(this.fileTimes,t);for(let r of this.pendingSnapshots)r!==t&&this.subtractBaseline(r,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=n.then(()=>{},()=>{}),n}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[o,n]of Object.entries(t))n===0&&!(o===this.activeFile&&this.isTracking())&&delete t[o];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,o){for(let[n,r]of Object.entries(o))if(Object.hasOwn(t,n)){let u=t[n]-r;u>0?t[n]=u:delete t[n]}}persist(){let t={...this.fileTimes},o=[...this.excludedFiles];this.pendingSnapshots.add(t);let n=this.writeQueue.then(()=>this.persistFileTimes({...t},o)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=n.then(()=>{},()=>{}),n}};var ne=B(require("vscode")),De=require("node:crypto"),Fe=B(require("node:path"));function Ie(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(o=>String(o).padStart(2,"0")).join(":")}var ie=class{constructor(t,o){this.snapshot=t;this.toggleTracking=o}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=ne.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:ne.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let o=t.webview.onDidReceiveMessage(async r=>{if(!(!r||typeof r!="object"||!("type"in r)))switch(r.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),n=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{o.dispose(),n.dispose(),this.panel=void 0}),t.webview.html=rt()}update(){if(!this.panel)return;let t=this.snapshot(),o=ae(t);this.panel.webview.postMessage({type:"timer",totalTime:Ie(o.total),currentTime:Ie(o.current),currentFile:t.activeFile?Fe.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function rt(){let e=(0,De.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
</html>`}var de=require("node:crypto");var Ce=B(require("node:path")),Pe=B(require("pdfkit"));var Oe="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function Re(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function pe(e,t=new Date){let o=Object.entries(e).map(([f,h])=>{if(!f||!Number.isFinite(h)||h<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:Ce.basename(f),milliseconds:h,percent:0}}).sort((f,h)=>h.milliseconds-f.milliseconds||f.name.localeCompare(h.name)),n=o.reduce((f,h)=>f+h.milliseconds,0);if(!Number.isFinite(n))throw new Error("The total tracked time is too large to export.");let r=new Map;for(let f of o)r.set(f.name,(r.get(f.name)??0)+1);let u=new Map,c=new Set(o.map(f=>f.name));for(let f of o){f.percent=n>0?f.milliseconds/n*100:0;let h=f.name;if(r.get(h)>1){let x=u.get(h)??0;do f.name=`${h} (${++x})`;while(c.has(f.name));u.set(h,x),c.add(f.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:n,files:o}}function at(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function oe(e){return M(Math.floor(e/6e4))}function fe(e,t){let o=e.files.map(n=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${at(n.name)}</span>
<span class="file-time">${oe(n.milliseconds)} <small>${n.percent.toFixed(1)}%</small></span></div>
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
<section class="summary" aria-label="Activity summary"><div><strong>${oe(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
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
</html>`}function Ae(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,o)=>{let n=new Pe.default({size:"A4",margin:44,compress:!0}),r=[];n.on("data",x=>r.push(x)),n.on("error",o),n.on("end",()=>t(Buffer.concat(r)));let u=n.page.width-88,c=0,f=()=>{n.rect(0,0,n.page.width,n.page.height).fill(n.linearGradient(0,0,n.page.width,n.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),n.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),n.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),n.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${Re(e)}`,44,110),n.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${oe(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),c=190},h=()=>{n.addPage(),f()};f();for(let x of e.files){n.font("Helvetica").fontSize(11);let w=n.heightOfString(x.name,{width:u}),E=w+44;c+E>n.page.height-130&&h(),n.fillColor("#ffffff").font("Helvetica").fontSize(11).text(x.name,44,c,{width:u}),c+=w+6,n.fillColor("#ffe1a6").fontSize(10).text(`${oe(x.milliseconds)}  /  ${x.percent.toFixed(1)}%`,44,c),c+=18,n.roundedRect(44,c,u,6,3).fill("#45665d"),x.percent>0&&n.rect(44,c,u*x.percent/100,6).fill(n.linearGradient(44,c,44+u,c).stop(0,"#7edcbb").stop(1,"#ffcc7d")),c+=20}e.files.length||(n.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,c),c+=32),c+90>n.page.height-44&&h(),n.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(Oe,44,c+12,{width:u}),n.end()})}var N=require("node:fs"),$e=require("node:crypto"),Me=B(require("node:path"));function He(e){(0,N.mkdirSync)(e,{recursive:!0});let t=Me.join(e,"time-tracker.owner.lock"),o=JSON.stringify({pid:process.pid,token:(0,$e.randomBytes)(16).toString("hex")});try{(0,N.writeFileSync)(t,o,{flag:"wx"})}catch(n){throw n.code==="EEXIST"?new Error(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${t}, then reopen VS Code.`):n}return()=>{if((0,N.readFileSync)(t,"utf8")!==o)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,N.unlinkSync)(t)}}var it="time-tracker.data",nt="timesheet.json",Le="time-tracker.file-times",me="time-tracker.file-activity",Be="excludedFiles",ot="2026-10-21",W,q,ze=Promise.resolve(),ye,ve;function Ue(){return(0,de.randomBytes)(16).toString("hex")}function he(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function Ne(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},o=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[c,f]of Object.entries(e.entries)){let h=!Array.isArray(f),x=h?[f]:f;t[c]=x.map(w=>{if(!w||typeof w!="object"||typeof w.date!="string"||typeof w.task!="string"||typeof w.timeIn!="string"||typeof w.timeOut!="string"||w.date!==c||_(w))throw new Error(`The saved entry for ${c} is invalid. Restore or repair the JSON file before continuing.`);let E=w.id===void 0&&h?Ue():w.id;if(!he(E))throw new Error(`The saved entry for ${c} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(o.has(E))throw new Error(`The saved entry for ${c} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return o.add(E),{...w,id:E}}),t[c].length||delete t[c]}}let n=e.periodStart===void 0?ot:e.periodStart;if(typeof n!="string"||!C(n))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");try{j(n)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}let r=e.hourlyRate===void 0?null:e.hourlyRate;if(r!==null&&(typeof r!="number"||!Number.isFinite(r)||r<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");let u=e.holidays===void 0?[]:e.holidays;if(!Array.isArray(u)||u.some(c=>!c||typeof c!="object"||le(c)||c.name!==c.name.trim())||new Set(u.map(c=>JSON.stringify([c.date,c.name]))).size!==u.length)throw new Error("The saved public holidays are invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:n,hourlyRate:r,holidays:u}}function ge(e){return F.join(e.globalStorageUri.fsPath,nt)}async function Ve(e,t){let o=ge(e);await(0,S.mkdir)(F.dirname(o),{recursive:!0});let n=`${o}.${process.pid}.${(0,de.randomBytes)(8).toString("hex")}.tmp`,r=await(0,S.open)(n,"wx");try{await r.writeFile(JSON.stringify(t,null,2),"utf8"),await r.close(),await(0,S.rename)(n,o)}catch(u){try{await r.close(),await(0,S.unlink)(n)}catch(c){let f=u instanceof Error?u.message:String(u),h=c instanceof Error?c.message:String(c);throw new AggregateError([u,c],`Could not save the timesheet: ${f}. Temporary file cleanup failed: ${h}`)}throw u}}async function dt(e){try{let o=await(0,S.readFile)(ge(e),"utf8");return Ne(JSON.parse(o))}catch(o){if(o.code!=="ENOENT")throw o}let t=Ne(e.globalState.get(it));return await Ve(e,t),t}async function je(e,t,o){let n=l.workspace.workspaceFolders?.[0]?.uri??l.Uri.file((0,qe.homedir)()),r=await l.window.showSaveDialog({defaultUri:l.Uri.joinPath(n,e),filters:{[t==="html"?"HTML documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!r)return;let u=F.extname(r.fsPath).toLowerCase()===`.${t}`?r.fsPath:`${r.fsPath}.${t}`;return await(0,S.writeFile)(u,await o()),u}function st(e){let t=[],o=(d,m=!1)=>{let y=()=>{(async()=>{try{if(await l.window.showErrorMessage(d,...m?["Export raw data"]:[])!=="Export raw data")return;let s=await l.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!s)return;let p={fileActivity:e.globalState.get(me),fileTimes:e.globalState.get(Le),excludedFiles:e.globalState.get(Be),legacyFileTimers:e.globalState.get("fileTimers")};await(0,S.writeFile)(s.fsPath,JSON.stringify(p,null,2),"utf8"),l.window.showInformationMessage(`Raw file activity data saved to ${s.fsPath}.`)}catch(a){let s=a instanceof Error?a.message:String(a);l.window.showErrorMessage(`Could not export raw file activity data: ${s}`)}})()},i=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);i.text="$(debug-pause) Time Tracker unavailable",i.tooltip=d,i.command="time-tracker.openTimesheet",i.show(),e.subscriptions.push(i,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes"].map(a=>l.commands.registerCommand(a,y))),y()};try{q=He(e.globalStorageUri.fsPath);let d=e.globalState.get(me),m=e.globalState.get(Le),y=e.globalState.get(Be);if(d!==void 0){if(!d||typeof d!="object"||Array.isArray(d)||!("version"in d)||d.version!==1||!("fileTimes"in d)||d.fileTimes===void 0||!("excludedFiles"in d)||d.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");m=d.fileTimes,y=d.excludedFiles}if(y!==void 0){if(!Array.isArray(y)||y.some(i=>typeof i!="string"||!i))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(y)]}W=new re(m,async(i,a)=>e.globalState.update(me,{version:1,fileTimes:i,excludedFiles:[...a]}),void 0,t),e.globalState.get("fileTimers")!==void 0&&l.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(d){let m=d instanceof Error?d.message:String(d),y=!!q;if(q)try{q()}catch(i){let a=i instanceof Error?i.message:String(i);o(`${m} Could not release storage ownership: ${a}`);return}finally{q=void 0}o(m,y);return}let n=new Set,r=!1,u=W,c=()=>{let d=u.snapshot();return{...d,excluded:!!d.activeFile&&u.isExcluded(d.activeFile)}},f,h,x=Promise.resolve(),w=async()=>{if(f)return f;h||(h=dt(e),ye=h);try{return f=await h,f}finally{h=void 0,ye=void 0}},E=d=>{if(r)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let m=x.then(async()=>{let y=d(await w());await Ve(e,y),f=y;for(let i of n)await i.webview.postMessage({type:"saved",data:{...y,...c()}})});return x=m.then(()=>{},()=>{}),ze=x,m},R=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);R.command="time-tracker.openTimesheet",R.text="$(watch) 0h 00m | 0h 00m",R.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,R.show();let z=d=>{let m=d instanceof Error?d.message:String(d);l.window.showErrorMessage(`Could not save automatic file time data: ${m}`)},A=()=>{let d=c(),m=ae(d),y=M(Math.floor(m.total/6e4)),i=M(Math.floor(m.current/6e4)),a=d.activeFile?`Current file (${F.basename(d.activeFile)})`:"Current file";R.text=`${d.paused?"$(debug-pause)":"$(watch)"} ${y} | ${i}`+(d.excluded?" Excluded":d.activeFile?"":" Waiting"),R.tooltip=`Total tracked: ${y}
${a}: ${i}
${d.paused?`Automatic tracking paused
`:d.excluded?`Current file excluded
`:""}Click to open Time Tracker`,H.update();for(let s of n)s.webview.postMessage({type:"fileTimes",data:d})},U=async d=>{A();try{await d}catch(m){z(m)}A()},V=()=>r?Promise.resolve():U(u.setPaused(!u.snapshot().paused)),H=new ie(c,V),be=l.commands.registerCommand("time-tracker.showFloatingTimer",()=>H.show()),se=l.commands.registerCommand("time-tracker.hideFloatingTimer",()=>H.hide()),L=l.commands.registerCommand("time-tracker.toggleTracking",V),k=l.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(r){l.window.showErrorMessage("Time Tracker is shutting down.");return}let d=l.window.activeTextEditor,m=d?.document.uri.scheme==="file"?d.document.uri.fsPath:void 0,y=m?[m,...t.filter(p=>p!==m)]:t;if(!y.length){l.window.showInformationMessage("No local file is active and no files are excluded.");return}let i=await l.window.showQuickPick(y.map(p=>({label:`${u.isExcluded(p)?"Include":"Exclude"} ${F.basename(p)}`,description:p,file:p})),{placeHolder:"Choose a local file to exclude or include"});if(!i)return;let a=new Set(t);a.has(i.file)?a.delete(i.file):a.add(i.file),t=[...a];let s=u.setExcludedFiles(t);A();try{await s,l.window.showInformationMessage(`${F.basename(i.file)} is ${u.isExcluded(i.file)?"excluded":"included"}.`)}catch(p){z(p)}A()}),Q=l.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(r){l.window.showErrorMessage("Time Tracker is shutting down.");return}if(await l.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await u.reset(),A(),l.window.showInformationMessage("Automatic file activity was reset.")}catch(m){z(m),A()}}),J=()=>{if(r)return;let d=l.window.activeTextEditor,m=l.window.state.focused&&d?.document.uri.scheme==="file"?d.document.uri.fsPath:void 0;U(u.setActiveFile(m))};J();let Y=l.window.onDidChangeActiveTextEditor(J),K=l.window.onDidChangeWindowState(J),Z=setInterval(()=>{r||U(u.checkpoint())},6e4),v=setInterval(A,1e3);ve=()=>{r=!0,clearInterval(Z),clearInterval(v)};let T=l.commands.registerCommand("time-tracker.openTimeCard",()=>{let d;try{d=pe(W?.snapshot().fileTimes??{})}catch(a){let s=a instanceof Error?a.message:String(a);l.window.showErrorMessage(`Could not generate the time card: ${s}`);return}let m=l.window.createWebviewPanel("timeTrackerCard","Time Card Preview",l.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),y=()=>{m.webview.html=fe(d,{nonce:(0,de.randomBytes)(16).toString("hex")})};y();let i=m.webview.onDidReceiveMessage(async a=>{try{if(a.type==="refresh")d=pe(W?.snapshot().fileTimes??{}),y();else if(a.type==="export"){if(a.format!=="html"&&a.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let s=a.format,p=d,g=`time-card-${p.generatedAt.slice(0,10)}.${s}`,b=await je(g,s,()=>s==="html"?Buffer.from(fe(p),"utf8"):Ae(p));b&&l.window.showInformationMessage(`Time card saved to ${b}`)}}catch(s){let p=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not generate or export the time card: ${p}`)}});m.onDidDispose(()=>i.dispose())}),P=l.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(r){l.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let d=l.window.createWebviewPanel("timeTracker","Time Tracker",l.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});try{await w()}catch(i){d.dispose();let a=i instanceof Error?i.message:String(i);l.window.showErrorMessage(`Could not load ${ge(e)}: ${a}`);return}n.add(d),d.onDidDispose(()=>n.delete(d)),d.webview.html=xe(d.webview);let m=async()=>{await d.webview.postMessage({type:"state",data:{...await w(),...c()}})};function y(i,a){if(!i||!a||i.id!==a.id||i.date!==a.date||i.task!==a.task||i.timeIn!==a.timeIn||i.timeOut!==a.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}d.webview.onDidReceiveMessage(async i=>{if(!i||typeof i!="object"||typeof i.type!="string"){l.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(i.type){case"showFloatingTimer":H.show();break;case"openTimeCard":await l.commands.executeCommand("time-tracker.openTimeCard");break;case"ready":await m();break;case"addHoliday":case"deleteHoliday":{let a=i.holiday;if(!a||typeof a!="object"||le(a))throw new Error("Enter a valid holiday date and name.");let s={date:a.date,name:a.name.trim()};await E(p=>{let g=p.holidays.some(b=>b.date===s.date&&b.name===s.name);if(i.type==="addHoliday"&&g)throw new Error("This holiday already exists on that date.");if(i.type==="deleteHoliday"&&!g)throw new Error("This holiday was removed in another view.");return{...p,holidays:i.type==="addHoliday"?[...p.holidays,s]:p.holidays.filter(b=>b.date!==s.date||b.name!==s.name)}}),i.type==="addHoliday"&&await d.webview.postMessage({type:"holidayAdded",holiday:s});break}case"createEntry":case"saveEntry":{let a=i.entry;if(!a||typeof a.date!="string"||typeof a.task!="string"||typeof a.timeIn!="string"||typeof a.timeOut!="string"||!C(a.date))throw new Error("Enter a valid date, task, and time values.");let s=!a.task.trim()&&!a.timeIn&&!a.timeOut,p=s&&i.type==="saveEntry"?void 0:_(a);if(p)throw new Error(p);if(i.type==="createEntry"){if(typeof i.requestId!="string"||!i.requestId||i.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let g={...a,id:Ue(),task:a.task.trim()};await E(b=>({...b,entries:{...b.entries,[a.date]:[...b.entries[a.date]??[],g]}})),await d.webview.postMessage({type:"entryCreated",requestId:i.requestId,entry:g});break}if(!he(i.id))throw new Error("Select a saved entry before editing it.");await E(g=>{let b=g.entries[a.date]??[],$=b.findIndex(I=>I.id===i.id),O=b[$];y(O,i.expected);let D={...g.entries};if(s){let I=b.filter(G=>G.id!==i.id);I.length?D[a.date]=I:delete D[a.date]}else{let I=[...b];I[$]={...a,id:O.id,task:a.task.trim()},D[a.date]=I}return{...g,entries:D}});break}case"deleteEntry":if(!i.date||!C(i.date)||!he(i.id))throw new Error("Select a valid entry to delete.");await E(a=>{let s=i.date,p=a.entries[s]??[],g=p.find(O=>O.id===i.id);y(g,i.expected);let b={...a.entries},$=p.filter(O=>O.id!==i.id);return $.length?b[s]=$:delete b[s],{...a,entries:b}});break;case"setPeriodStart":if(typeof i.value!="string"||!C(i.value))throw new Error("Enter a valid period start date.");j(i.value),await E(a=>{if(a.periodStart!==i.expectedValue)throw new Error("The period start changed in another view. Reload it before editing again.");return{...a,periodStart:i.value}});break;case"setHourlyRate":{if(typeof i.value!="string"||i.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(i.value))throw new Error("Enter a valid hourly rate of zero or more.");let a=i.value===""?null:Number(i.value);if(a!==null&&(!Number.isFinite(a)||a<0))throw new Error("Enter a valid hourly rate of zero or more.");await E(s=>{if(s.hourlyRate!==i.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...s,hourlyRate:a}});break}case"requestReportAction":{await x;let a=await w(),s=await l.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(s?.value==="print"){try{let p=await ue(a),g=F.join(e.globalStorageUri.fsPath,"print-reports");await(0,S.mkdir)(g,{recursive:!0});let b=await(0,S.mkdtemp)(F.join(g,"report-")),$=`timesheet-${a.periodStart}-to-${j(a.periodStart)}.pdf`,O=F.join(b,$);if(await(0,S.writeFile)(O,p),!await l.env.openExternal(l.Uri.file(O)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");l.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(p){let g=p instanceof Error?p.message:String(p);l.window.showErrorMessage(`Could not open the report for printing: ${g}`)}break}if(s?.value==="pdf"){let p=`timesheet-${a.periodStart}-to-${j(a.periodStart)}.pdf`;try{let g=await je(p,"pdf",()=>ue(a));g&&l.window.showInformationMessage(`PDF saved to ${g}`)}catch(g){let b=g instanceof Error?g.message:String(g);l.window.showErrorMessage(`Could not save the PDF: ${b}`)}}break}}}catch(a){let s=a instanceof Error?a.message:String(a);await d.webview.postMessage({type:"error",operation:i.type,id:i.id,requestId:i.requestId,view:i.view??(i.type==="setPeriodStart"||i.type==="setHourlyRate"?"report":"entries"),message:s})}})});e.subscriptions.push(P,T,be,se,L,k,Q,H,R,Y,K,{dispose:()=>clearInterval(Z)},{dispose:()=>clearInterval(v)})}async function lt(){ve?.();try{let t=(await Promise.allSettled([W?.setActiveFile(void 0),ze,ye])).find(o=>o.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{W=void 0,ve=void 0,q?.(),q=void 0}}0&&(module.exports={activate,deactivate});
