"use strict";var rt=Object.create;var re=Object.defineProperty;var at=Object.getOwnPropertyDescriptor;var it=Object.getOwnPropertyNames;var nt=Object.getPrototypeOf,ot=Object.prototype.hasOwnProperty;var st=(e,t)=>{for(var a in t)re(e,a,{get:t[a],enumerable:!0})},Fe=(e,t,a,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of it(t))!ot.call(e,r)&&r!==a&&re(e,r,{get:()=>t[r],enumerable:!(i=at(t,r))||i.enumerable});return e};var j=(e,t,a)=>(a=e!=null?rt(nt(e)):{},Fe(t||!e||!e.__esModule?re(a,"default",{value:e,enumerable:!0}):a,e)),dt=e=>Fe(re({},"__esModule",{value:!0}),e);var Tt={};st(Tt,{activate:()=>wt,createTimesheetTransfer:()=>Ge,deactivate:()=>xt,mergeTimesheetTransfer:()=>Se,parseTimesheetTransfer:()=>Xe});module.exports=dt(Tt);var l=j(require("vscode")),D=require("node:fs/promises"),Ye=require("node:os"),F=j(require("node:path"));function lt(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function Ce(e){let t=lt();return`<!DOCTYPE html>
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
@media (forced-colors: active) {
	* { box-shadow: none !important; text-shadow: none !important; }
	body, header, th { background: Canvas; color: CanvasText; }
	button, input, select { border: 1px solid ButtonText; }
	button[aria-selected="true"] { border: 3px double Highlight; }
	button:focus-visible, input:focus, select:focus { outline: 2px solid Highlight; }
	tr.weekend { outline: 1px dashed CanvasText; outline-offset: -1px; }
	tr.incomplete { border-inline-start: 3px solid Highlight; }
	.error, .warning-text, #print-warning { color: CanvasText; }
}
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
<nav class="tabs" role="tablist" aria-label="Timesheet views" aria-orientation="horizontal">
<button id="entries-tab" role="tab" aria-selected="true" aria-controls="entries-view" tabindex="0">Entries</button>
<button id="report-tab" role="tab" aria-selected="false" aria-controls="report-view" tabindex="-1">Period report</button>
<button id="holidays-tab" role="tab" aria-selected="false" aria-controls="holidays-view" tabindex="-1">Public holidays</button>
<button id="file-times-tab" role="tab" aria-selected="false" aria-controls="file-times-view" tabindex="-1">File activity</button>
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
function fieldError(input, errorId, message, focus = false) {
 input.setAttribute('aria-invalid', String(Boolean(message))); setError(errorId, message);
 if (message && focus) input.focus();
}
function validateRow(entry, fields, errorId, allowBlank) {
 Object.values(fields).forEach((input) => input.removeAttribute('aria-invalid'));
 let field; let message;
 if (fields.date && (!validDate(entry.date) || fields.date.validity.badInput)) { field = fields.date; message = 'Enter a valid calendar date.'; }
 else if ((!allowBlank || entry.timeIn || entry.timeOut) && !entry.task.trim()) { field = fields.task; message = 'Enter a task description.'; }
 else if (fields.timeIn.validity.badInput || (entry.timeIn && !/^([01]\\d|2[0-3]):[0-5]\\d$/.test(entry.timeIn))) { field = fields.timeIn; message = 'Time In must use 24-hour HH:mm format.'; }
 else if (fields.timeOut.validity.badInput || (entry.timeOut && !/^([01]\\d|2[0-3]):[0-5]\\d$/.test(entry.timeOut))) { field = fields.timeOut; message = 'Time Out must use 24-hour HH:mm format.'; }
 if (field) { fieldError(field, errorId, message, true); return false; }
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
 byId('tracking-status').textContent = data.excluded
  ? 'Current file excluded from automatic tracking'
  : data.paused ? 'Automatic tracking paused'
  : data.activeFile ? 'Automatic tracking running' : 'Waiting for a focused local file';
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
function setView(view, focusTab = false) {
 if (view === 'entries' && byId('entries-view').hidden) renderEntries();
 if (view === 'report' && byId('report-view').hidden) renderReport();
 byId('entries-view').hidden = view !== 'entries'; byId('report-view').hidden = view !== 'report'; byId('holidays-view').hidden = view !== 'holidays'; byId('file-times-view').hidden = view !== 'file-times';
 byId('entries-tab').setAttribute('aria-selected', String(view === 'entries')); byId('report-tab').setAttribute('aria-selected', String(view === 'report')); byId('holidays-tab').setAttribute('aria-selected', String(view === 'holidays')); byId('file-times-tab').setAttribute('aria-selected', String(view === 'file-times'));
 const tabs = ['entries', 'report', 'holidays', 'file-times'];
 tabs.forEach((name) => byId(name + '-tab').tabIndex = name === view ? 0 : -1);
 if (focusTab) byId(view + '-tab').focus();
}
const tabNames = ['entries', 'report', 'holidays', 'file-times'];
tabNames.forEach((name, index) => {
 const tab = byId(name + '-tab');
 tab.addEventListener('click', () => setView(name, true));
 tab.addEventListener('keydown', (event) => {
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % tabNames.length;
  else if (event.key === 'ArrowLeft') next = (index - 1 + tabNames.length) % tabNames.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabNames.length - 1;
  else return;
  event.preventDefault();
  setView(tabNames[next], true);
 });
});
byId('holiday-date').value = localDateValue();
byId('holiday-form').addEventListener('submit', (event) => {
 event.preventDefault();
 const date = byId('holiday-date'); const name = byId('holiday-name');
 if (!validDate(date.value) || date.validity.badInput) { fieldError(date, 'holidays-error', 'Enter a valid holiday date.', true); return; }
 if (!name.value.trim() || name.value.length > 240 || /[\\x00-\\x1f\\x7f]/.test(name.value)) { fieldError(name, 'holidays-error', 'Enter a holiday name of up to 240 characters without control characters.', true); return; }
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
 try { periodEnd(input.value); } catch (error) { fieldError(input, 'report-error', error.message, true); return; }
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
 if (input.validity.badInput || (value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0))) { fieldError(input, 'report-error', 'Enter a valid hourly rate of zero or more.', true); return; }
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
  if (message.requestId && Object.hasOwn(pendingFormEntries, message.requestId)) {
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
</html>`}function me(e){if(!R(e.date))return"Enter a valid holiday date.";if(typeof e.name!="string"||!e.name.trim()||e.name.length>240||/[\x00-\x1f\x7f]/.test(e.name))return"Enter a holiday name of up to 240 characters without control characters."}function R(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,a,i]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);return r.getUTCFullYear()===t&&r.getUTCMonth()===a-1&&r.getUTCDate()===i}function ae(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function ye(e){if(!ae(e.timeIn)||!ae(e.timeOut))return;let[t,a]=e.timeIn.split(":").map(Number),[i,r]=e.timeOut.split(":").map(Number),c=t*60+a,d=i*60+r;return d<c&&(d+=1440),d-c}function Oe(e,t){if(!R(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let a=new Date(`${e}T00:00:00Z`);return a.setUTCDate(a.getUTCDate()+t),Pe(a)}function Pe(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function U(e){if(!R(e))throw new RangeError("Enter a valid period start date.");let[t,a,i]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);r.setUTCDate(1),r.setUTCFullYear(t,a+1,0);let c=r.getUTCDate();return r.setUTCDate(Math.min(i,c)-1),Pe(r)}function K(e){if(!R(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!ae(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!ae(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function B(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var Re=j(require("pdfkit"));function ie(e){let[t,a,i]=e.split("-").map(Number),r=new Date(0);return r.setUTCFullYear(t,a-1,i),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(r)}function ct(e){let t=new Date(`${e}T00:00:00Z`),a=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${a} (Weekend)`:a}function ut(e,t){return e[t]??[]}function he(e){return new Promise((t,a)=>{if(!R(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let i;try{i=U(e.periodStart)}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!R(i)||i<e.periodStart)throw new Error("Cannot generate PDF: period end is outside the supported calendar.");let r=new Re.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),c=[];r.on("data",g=>c.push(g)),r.on("error",a),r.on("end",()=>t(Buffer.concat(c)));let d=r.page.width-r.page.margins.left-r.page.margins.right,m=[70,70,d-70-70-48-48-60-70,48,48,60,70],f=3;r.font("Helvetica").fontSize(7.5);let w=r.currentLineHeight(!0),x=2,k=[],M=0,Q=new Set;for(let g=e.periodStart;;g=Oe(g,1)){let E=ut(e.entries,g),O=(e.holidays??[]).filter(u=>u.date===g),A=E.length?E:[{date:g,task:"",timeIn:"",timeOut:""}],N=E.map(ye).filter(u=>u!==void 0),P=N.reduce((u,p)=>u+p,0),s=B(P);N.length&&(Q.add(g),M+=P);for(let[u,p]of A.entries()){if(E.length){let v=K(p);if(p.date!==g||v)throw new Error(`Cannot generate PDF: invalid entry for ${g}. ${v??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(p.task))throw new Error(`Cannot generate PDF: task for ${g} contains unsupported characters; only printable ASCII is supported.`);let n=u===0?O.map(v=>`Public holiday: ${v.name}`):[];if(n.some(v=>/[^\x20-\x7e]/.test(v)))throw new Error(`Cannot generate PDF: holiday for ${g} contains unsupported characters; only printable ASCII is supported.`);let o=[];for(let v of[...n,p.task]){let I="";for(let S of v){if(r.widthOfString(I+S)>m[2]-f*2){if(!I)throw new Error(`Cannot generate PDF: task for ${g} cannot fit in the task column.`);o.push(I),I=""}I+=S}(I||!o.length)&&o.push(I)}let y=ye(p),h=!!p.timeIn!=!!p.timeOut,b=new Date(`${g}T00:00:00Z`).getUTCDay()%6===0;k.push({values:[ie(g),ct(g),p.task,p.timeIn,p.timeOut,y===void 0?h?"INCOMPLETE":"":B(y),u===0?s:""],taskLines:o,fill:h?"#fff2cc":b?"#eeeeee":"#ffffff"})}if(g===i)break}let Z=`Total hours: ${B(M)}     Days logged: ${Q.size}`,$=`Generated ${ie(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,q=["Date","Day","Task","Time In","Time Out","Entry duration","Daily total"],H=`Reporting period: ${ie(e.periodStart)} to ${ie(i)}`,G=w+x,X=22+w;if(r.font("Helvetica-Bold").fontSize(7.5),q.some((g,E)=>r.widthOfString(g)>m[E]-f*2))throw new Error("Cannot generate PDF: a column heading does not fit.");r.font("Helvetica").fontSize(7.5);for(let g of k)if(g.values.some((E,O)=>O!==2&&r.widthOfString(E)>m[O]-f*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(r.widthOfString($)>d)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica-Bold").fontSize(9),r.widthOfString(Z)>d)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica").fontSize(9),r.widthOfString(H)>d)throw new Error("Cannot generate PDF: period does not fit on the page.");let C=r.page.margins.left,T=0,ee=!1,fe=(g,E,O,A=!1)=>{let N=w+x,P=C;r.rect(P,T,d,N).fill(O);for(let s=0;s<g.length;s++){let u=m[s];r.rect(P,T,u,N).lineWidth(.35).stroke("#999999"),r.font(A?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),r.text(s===2?E[0]:g[s],P+f,T+x/2,{lineBreak:!1}),P+=u}T+=N},J=()=>{ee?r.addPage():ee=!0,T=r.page.margins.top,r.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",C,T,{lineBreak:!1}),T+=20,r.font("Helvetica").fontSize(9).fillColor("#333333").text(H,C,T,{lineBreak:!1}),T+=16,fe(q,[q[2]],"#dddddd",!0)};J();let Y=()=>r.page.height-r.page.margins.bottom,_=()=>Math.max(1,Math.floor((Y()-T-x)/w));for(let g of k){let E=0,O=!0;for(;E<g.taskLines.length;){let A=Math.min(g.taskLines.length-E,_());if(T+A*w+x>Y()){J();continue}let N=g.taskLines.slice(E,E+A),P=O?g.values:[g.values[0],g.values[1],"","","","",""],s=C,u=A*w+x;r.rect(s,T,d,u).fill(g.fill);for(let p=0;p<P.length;p++){let n=m[p];r.rect(s,T,n,u).lineWidth(.35).stroke("#999999"),r.font("Helvetica").fontSize(7.5).fillColor("#222222"),(p===2?N:[P[p]]).forEach((o,y)=>{r.text(o,s+f,T+x/2+y*w,{lineBreak:!1})}),s+=n}T+=u,E+=A,O=!1,E<g.taskLines.length&&J()}}T+X>Y()&&J(),T+=8,r.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(Z,C,T,{lineBreak:!1}),T+=14,r.font("Helvetica").fontSize(7.5).fillColor("#555555").text($,C,T,{lineBreak:!1}),r.end()})}var Ae=require("node:perf_hooks");function oe(e){return{total:Object.values(e.fileTimes).reduce((t,a)=>t+a,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function pt(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),a=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof a!="function"||Function.prototype.toString.call(a)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let i=Object.create(null);for(let[r,c]of Object.entries(e)){if(!r||typeof c!="number"||!Number.isFinite(c)||c<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(r)}: expected a non-negative finite duration.`);i[r]=c}return{...i}}var ne=class{constructor(t,a,i=()=>Ae.performance.now(),r=[]){this.persistFileTimes=a;this.now=i;Object.assign(this.fileTimes,pt(t)),this.excludedFiles=new Set(r)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let a=this.now();return this.accrueTime(a),this.activeFile=t||void 0,this.startedAt=this.isTracking()?a:void 0,this.persist()}setPaused(t){let a=this.now();return this.accrueTime(a),this.paused=t,this.startedAt=this.isTracking()?a:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let a=this.now();return this.accrueTime(a),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?a:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},a=[...this.excludedFiles];this.pendingSnapshots.add(t);let i=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},a)}catch(r){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(c){throw new Error(`File time reset failed: ${String(r)}; recovery write failed: ${String(c)}. Retry saving file times.`)}throw r}this.subtractBaseline(this.fileTimes,t);for(let r of this.pendingSnapshots)r!==t&&this.subtractBaseline(r,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=i.then(()=>{},()=>{}),i}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[a,i]of Object.entries(t))i===0&&!(a===this.activeFile&&this.isTracking())&&delete t[a];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,a){for(let[i,r]of Object.entries(a))if(Object.hasOwn(t,i)){let c=t[i]-r;c>0?t[i]=c:delete t[i]}}persist(){let t={...this.fileTimes},a=[...this.excludedFiles];this.pendingSnapshots.add(t);let i=this.writeQueue.then(()=>this.persistFileTimes({...t},a)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=i.then(()=>{},()=>{}),i}};var de=j(require("vscode")),$e=require("node:crypto"),He=j(require("node:path"));function Me(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(a=>String(a).padStart(2,"0")).join(":")}var se=class{constructor(t,a){this.snapshot=t;this.toggleTracking=a}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=de.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:de.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let a=t.webview.onDidReceiveMessage(async r=>{if(!(!r||typeof r!="object"||!("type"in r)))switch(r.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),i=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{a.dispose(),i.dispose(),this.panel=void 0}),t.webview.html=ft()}update(){if(!this.panel)return;let t=this.snapshot(),a=oe(t);this.panel.webview.postMessage({type:"timer",totalTime:Me(a.total),currentTime:Me(a.current),currentFile:t.activeFile?He.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function ft(){let e=(0,$e.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
@media (forced-colors: active) {
	main, button { border-color: ButtonText; background: Canvas; color: CanvasText; box-shadow: none; }
	button:focus-visible { outline-color: Highlight; }
	#toggle { background: ButtonFace; color: ButtonText; }
}
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
<button id="toggle" type="button" aria-pressed="false" disabled>Pause</button>
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
	toggle.setAttribute('aria-pressed', String(message.paused));
	toggle.disabled = false;
});
vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`}var pe=require("node:crypto");var Ne=j(require("node:path")),Be=j(require("pdfkit"));var je="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function Le(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function ve(e,t=new Date){let a=Object.entries(e).map(([m,f])=>{if(!m||!Number.isFinite(f)||f<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:Ne.basename(m),milliseconds:f,percent:0}}).sort((m,f)=>f.milliseconds-m.milliseconds||m.name.localeCompare(f.name)),i=a.reduce((m,f)=>m+f.milliseconds,0);if(!Number.isFinite(i))throw new Error("The total tracked time is too large to export.");let r=new Map;for(let m of a)r.set(m.name,(r.get(m.name)??0)+1);let c=new Map,d=new Set(a.map(m=>m.name));for(let m of a){m.percent=i>0?m.milliseconds/i*100:0;let f=m.name;if(r.get(f)>1){let w=c.get(f)??0;do m.name=`${f} (${++w})`;while(d.has(m.name));c.set(f,w),d.add(m.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:i,files:a}}function mt(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function le(e){return B(Math.floor(e/6e4))}function be(e,t){let a=e.files.map(i=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${mt(i.name)}</span>
<span class="file-time">${le(i.milliseconds)} <small>${i.percent.toFixed(1)}%</small></span></div>
<div class="track" aria-hidden="true"><div class="bar" style="width:${i.percent}%"></div></div></li>`).join("");return`<!DOCTYPE html>
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
@media (forced-colors: active) {
 body, .card { background: Canvas; color: CanvasText; box-shadow: none; }
 button { border: 1px solid ButtonText; background: ButtonFace; color: ButtonText; }
 button:focus-visible { outline-color: Highlight; }
 .eyebrow, .date, .note, .summary span, .file-time, small, .summary strong { color: CanvasText; }
 .summary, footer { border-color: CanvasText; }
 .track { border: 1px solid CanvasText; background: Canvas; }
 .bar { background: Highlight; }
}
@media print {
 @page { size: A4; margin: 14mm; }
 body { padding: 0; background: white; color: #111; }
 .actions { display: none; }
 .card { max-width: none; border-radius: 0; box-shadow: none; padding: 20px; background: white; color: #111; }
 .eyebrow, .date, .note, .summary span, .file-time, small, .summary strong { color: #111; }
 .summary, footer { border-color: #777; }
 .track { background: #ddd; border: 1px solid #777; }
 .bar { background: #333; }
 .card, .bar { animation: none; }
 h1, .summary, footer { break-inside: avoid; }
}
</style>
</head>
<body>
${t?'<nav class="actions" aria-label="Time card actions"><button id="save-html">Save HTML</button><button id="save-pdf">Save PDF</button><button id="refresh">Refresh snapshot</button></nav>':""}
<main class="card">
<p class="eyebrow">Time Tracker / File activity</p>
<h1>Time well spent.</h1>
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${Le(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${le(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${a||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${je}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function qe(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,a)=>{let i=new Be.default({size:"A4",margin:44,compress:!0}),r=[];i.on("data",w=>r.push(w)),i.on("error",a),i.on("end",()=>t(Buffer.concat(r)));let c=i.page.width-88,d=0,m=()=>{i.rect(0,0,i.page.width,i.page.height).fill(i.linearGradient(0,0,i.page.width,i.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),i.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),i.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),i.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${Le(e)}`,44,110),i.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${le(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),d=190},f=()=>{i.addPage(),m()};m();for(let w of e.files){i.font("Helvetica").fontSize(11);let x=i.heightOfString(w.name,{width:c}),k=x+44;d+k>i.page.height-130&&f(),i.fillColor("#ffffff").font("Helvetica").fontSize(11).text(w.name,44,d,{width:c}),d+=x+6,i.fillColor("#ffe1a6").fontSize(10).text(`${le(w.milliseconds)}  /  ${w.percent.toFixed(1)}%`,44,d),d+=18,i.roundedRect(44,d,c,6,3).fill("#45665d"),w.percent>0&&i.rect(44,d,c*w.percent/100,6).fill(i.linearGradient(44,d,44+c,d).stop(0,"#7edcbb").stop(1,"#ffcc7d")),d+=20}e.files.length||(i.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,d),d+=32),d+90>i.page.height-44&&f(),i.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(je,44,d+12,{width:c}),i.end()})}var L=require("node:fs"),ze=require("node:crypto"),Ue=j(require("node:path"));function Ve(e){(0,L.mkdirSync)(e,{recursive:!0});let t=Ue.join(e,"time-tracker.owner.lock"),a=JSON.stringify({pid:process.pid,token:(0,ze.randomBytes)(16).toString("hex")});try{(0,L.writeFileSync)(t,a,{flag:"wx"})}catch(i){throw i.code==="EEXIST"?new Error(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${t}, then reopen VS Code.`):i}return()=>{if((0,L.readFileSync)(t,"utf8")!==a)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,L.unlinkSync)(t)}}var yt="time-tracker.data",ht="timesheet.json",Je="time-tracker.file-times",ge="time-tracker.file-activity",We="excludedFiles",vt="2026-10-21",_e="time-tracker-timesheet",Ke=1,ce=5*1024*1024,W,V,Qe=Promise.resolve(),xe,Te;function Ze(){return(0,pe.randomBytes)(16).toString("hex")}function ke(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function Ee(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},a=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[d,m]of Object.entries(e.entries)){let f=!Array.isArray(m),w=f?[m]:m;t[d]=w.map(x=>{if(!x||typeof x!="object"||typeof x.date!="string"||typeof x.task!="string"||typeof x.timeIn!="string"||typeof x.timeOut!="string"||x.date!==d||K(x))throw new Error(`The saved entry for ${d} is invalid. Restore or repair the JSON file before continuing.`);let k=x.id===void 0&&f?Ze():x.id;if(!ke(k))throw new Error(`The saved entry for ${d} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(a.has(k))throw new Error(`The saved entry for ${d} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return a.add(k),{...x,id:k}}),t[d].length||delete t[d]}}let i=e.periodStart===void 0?vt:e.periodStart;if(typeof i!="string"||!R(i))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");try{U(i)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}let r=e.hourlyRate===void 0?null:e.hourlyRate;if(r!==null&&(typeof r!="number"||!Number.isFinite(r)||r<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");let c=e.holidays===void 0?[]:e.holidays;if(!Array.isArray(c)||c.some(d=>!d||typeof d!="object"||me(d)||d.name!==d.name.trim())||new Set(c.map(d=>JSON.stringify([d.date,d.name]))).size!==c.length)throw new Error("The saved public holidays are invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:i,hourlyRate:r,holidays:c}}function Ie(e){return Object.fromEntries(Object.entries(e).map(([t,a])=>[t,a.map(i=>({id:i.id,date:i.date,task:i.task,timeIn:i.timeIn,timeOut:i.timeOut}))]))}function De(e){return e.map(t=>({date:t.date,name:t.name}))}function bt(e,t){return e.id===t.id&&e.date===t.date&&e.task===t.task&&e.timeIn===t.timeIn&&e.timeOut===t.timeOut}function Ge(e,t=new Date){return{kind:_e,schemaVersion:Ke,exportedAt:t.toISOString(),entries:Ie(e.entries),holidays:De(e.holidays)}}function Xe(e){if(Buffer.byteLength(e,"utf8")>ce)throw new Error(`The timesheet file is too large. The limit is ${ce} bytes.`);let t;try{t=JSON.parse(e)}catch{throw new Error("The selected timesheet file is not valid JSON.")}if(!t||typeof t!="object"||Array.isArray(t))throw new Error("The selected file is not a Time Tracker timesheet export.");let a=t,i=new Set(["kind","schemaVersion","exportedAt","entries","holidays"]);if(Object.keys(a).some(d=>!i.has(d)))throw new Error("The selected timesheet export contains unsupported fields.");if(a.kind!==_e||a.schemaVersion!==Ke)throw new Error("The selected file uses an unsupported Time Tracker timesheet format.");let r=typeof a.exportedAt=="string"?new Date(a.exportedAt):void 0;if(!r||!Number.isFinite(r.getTime())||r.toISOString()!==a.exportedAt)throw new Error("The selected timesheet export has an invalid export timestamp.");if(!a.entries||typeof a.entries!="object"||Array.isArray(a.entries)||Object.values(a.entries).some(d=>!Array.isArray(d)))throw new Error("The selected timesheet export has invalid entries.");if(!Array.isArray(a.holidays))throw new Error("The selected timesheet export has invalid holidays.");let c=Ee({entries:a.entries,holidays:a.holidays});return{entries:Ie(c.entries),holidays:De(c.holidays)}}function Se(e,t){let a=new Map(Object.values(e.entries).flat().map(f=>[f.id,f])),i=Ie(e.entries),r=0;for(let[f,w]of Object.entries(t.entries))for(let x of w){let k=a.get(x.id);if(k){if(!bt(k,x))throw new Error(`Imported entry ${x.id} conflicts with a local entry. Import was not applied.`);continue}i[f]=[...i[f]??[],{...x}],a.set(x.id,x),r++}let c=new Set(e.holidays.map(f=>JSON.stringify([f.date,f.name]))),d=De(e.holidays),m=0;for(let f of t.holidays){let w=JSON.stringify([f.date,f.name]);c.has(w)||(c.add(w),d.push({...f}),m++)}return{state:r||m?{...e,entries:i,holidays:d}:e,addedEntries:r,addedHolidays:m}}function ue(e){return F.join(e.globalStorageUri.fsPath,ht)}async function et(e,t){let a=ue(e);await(0,D.mkdir)(F.dirname(a),{recursive:!0});let i=`${a}.${process.pid}.${(0,pe.randomBytes)(8).toString("hex")}.tmp`,r=await(0,D.open)(i,"wx");try{await r.writeFile(JSON.stringify(t,null,2),"utf8"),await r.close(),await(0,D.rename)(i,a)}catch(c){try{await r.close(),await(0,D.unlink)(i)}catch(d){let m=c instanceof Error?c.message:String(c),f=d instanceof Error?d.message:String(d);throw new AggregateError([c,d],`Could not save the timesheet: ${m}. Temporary file cleanup failed: ${f}`)}throw c}}async function gt(e){try{let a=await(0,D.readFile)(ue(e),"utf8");return Ee(JSON.parse(a))}catch(a){if(a.code!=="ENOENT")throw a}let t=Ee(e.globalState.get(yt));return await et(e,t),t}async function we(e,t,a,i){let r=l.workspace.workspaceFolders?.[0]?.uri??l.Uri.file((0,Ye.homedir)()),c=await l.window.showSaveDialog({defaultUri:l.Uri.joinPath(r,e),filters:{[t==="html"?"HTML documents":t==="json"?"JSON documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!c)return;let d=F.extname(c.fsPath).toLowerCase()===`.${t}`?c.fsPath:`${c.fsPath}.${t}`;if(i){let m=F.resolve(d),f=F.resolve(i);if(process.platform==="win32"?m.toLowerCase()===f.toLowerCase():m===f)throw new Error("Choose a different file; the active timesheet store cannot be overwritten by an export.")}return await(0,D.writeFile)(d,await a()),d}function wt(e){let t=[],a=(s,u=!1)=>{let p=()=>{(async()=>{try{if(await l.window.showErrorMessage(s,...u?["Export raw data"]:[])!=="Export raw data")return;let y=await l.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!y)return;let h={fileActivity:e.globalState.get(ge),fileTimes:e.globalState.get(Je),excludedFiles:e.globalState.get(We),legacyFileTimers:e.globalState.get("fileTimers")};await(0,D.writeFile)(y.fsPath,JSON.stringify(h,null,2),"utf8"),l.window.showInformationMessage(`Raw file activity data saved to ${y.fsPath}.`)}catch(o){let y=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not export raw file activity data: ${y}`)}})()},n=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);n.text="$(debug-pause) Time Tracker unavailable",n.tooltip=s,n.command="time-tracker.openTimesheet",n.show(),e.subscriptions.push(n,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.exportTimesheet","time-tracker.importTimesheet"].map(o=>l.commands.registerCommand(o,p))),p()};try{V=Ve(e.globalStorageUri.fsPath);let s=e.globalState.get(ge),u=e.globalState.get(Je),p=e.globalState.get(We);if(s!==void 0){if(!s||typeof s!="object"||Array.isArray(s)||!("version"in s)||s.version!==1||!("fileTimes"in s)||s.fileTimes===void 0||!("excludedFiles"in s)||s.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");u=s.fileTimes,p=s.excludedFiles}if(p!==void 0){if(!Array.isArray(p)||p.some(n=>typeof n!="string"||!n))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(p)]}W=new ne(u,async(n,o)=>e.globalState.update(ge,{version:1,fileTimes:n,excludedFiles:[...o]}),void 0,t),e.globalState.get("fileTimers")!==void 0&&l.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(s){let u=s instanceof Error?s.message:String(s),p=!!V;if(V)try{V()}catch(n){let o=n instanceof Error?n.message:String(n);a(`${u} Could not release storage ownership: ${o}`);return}finally{V=void 0}a(u,p);return}let i=new Set,r=!1,c=W,d=()=>{let s=c.snapshot();return{...s,excluded:!!s.activeFile&&c.isExcluded(s.activeFile)}},m,f,w=Promise.resolve(),x=new Map,k=async()=>{if(m)return m;f||(f=gt(e),xe=f);try{return m=await f,m}finally{f=void 0,xe=void 0}},M=s=>{if(r)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let u=w.then(async()=>{let p=await k(),n=s(p);if(n!==p){await et(e,n),m=n;for(let o of i)await o.webview.postMessage({type:"saved",data:{...n,...d()}})}});return w=u.then(()=>{},()=>{}),Qe=w,u},Q=l.commands.registerCommand("time-tracker.exportTimesheet",async()=>{try{await w;let s=await k(),u=Ge(s),p=await we(`time-tracker-timesheet-${u.exportedAt.slice(0,10)}.json`,"json",()=>Buffer.from(`${JSON.stringify(u,null,2)}
`,"utf8"),ue(e));p&&l.window.showInformationMessage(`Timesheet data saved to ${p}`)}catch(s){let u=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not export timesheet data: ${u}`)}}),Z=l.commands.registerCommand("time-tracker.importTimesheet",async()=>{try{let s=await l.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Time Tracker timesheet":["json"],"All files":["*"]},openLabel:"Import timesheet data"});if(!s?.length)return;let u=await(0,D.open)(s[0].fsPath,"r"),p;try{let b=await u.stat();if(!b.isFile())throw new Error("Select a regular JSON file.");if(b.size>ce)throw new Error(`The timesheet file is too large. The limit is ${ce} bytes.`);p=await u.readFile({encoding:"utf8"})}finally{await u.close()}let n=Xe(p);await w;let o=Se(await k(),n);if(await l.window.showWarningMessage(`Import ${o.addedEntries} new entries and ${o.addedHolidays} new holidays? Existing timesheet entries and preferences will be kept.`,{modal:!0},"Import")!=="Import")return;let h;await M(b=>(h=Se(b,n),h.state)),l.window.showInformationMessage(`Timesheet import complete: ${h.addedEntries} entries and ${h.addedHolidays} holidays added.`)}catch(s){let u=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not import timesheet data: ${u}`)}}),$=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);$.command="time-tracker.openTimesheet",$.text="$(watch) 0h 00m | 0h 00m",$.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,$.show();let q=s=>{let u=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not save automatic file time data: ${u}`)},H=()=>{let s=d(),u=oe(s),p=B(Math.floor(u.total/6e4)),n=B(Math.floor(u.current/6e4)),o=s.activeFile?`Current file (${F.basename(s.activeFile)})`:"Current file";$.text=`${s.paused?"$(debug-pause)":"$(watch)"} ${p} | ${n}`+(s.excluded?" Excluded":s.activeFile?"":" Waiting"),$.tooltip=`Total tracked: ${p}
${o}: ${n}
${s.paused?`Automatic tracking paused
`:s.excluded?`Current file excluded
`:""}Click to open Time Tracker`,C.update();for(let y of i)y.webview.postMessage({type:"fileTimes",data:s})},G=async s=>{H();try{await s}catch(u){q(u)}H()},X=()=>r?Promise.resolve():G(c.setPaused(!c.snapshot().paused)),C=new se(d,X),T=l.commands.registerCommand("time-tracker.showFloatingTimer",()=>C.show()),ee=l.commands.registerCommand("time-tracker.hideFloatingTimer",()=>C.hide()),fe=l.commands.registerCommand("time-tracker.toggleTracking",X),J=l.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(r){l.window.showErrorMessage("Time Tracker is shutting down.");return}let s=l.window.activeTextEditor,u=s?.document.uri.scheme==="file"?s.document.uri.fsPath:void 0,p=u?[u,...t.filter(h=>h!==u)]:t;if(!p.length){l.window.showInformationMessage("No local file is active and no files are excluded.");return}let n=await l.window.showQuickPick(p.map(h=>({label:`${c.isExcluded(h)?"Include":"Exclude"} ${F.basename(h)}`,description:h,file:h})),{placeHolder:"Choose a local file to exclude or include"});if(!n)return;let o=new Set(t);o.has(n.file)?o.delete(n.file):o.add(n.file),t=[...o];let y=c.setExcludedFiles(t);H();try{await y,l.window.showInformationMessage(`${F.basename(n.file)} is ${c.isExcluded(n.file)?"excluded":"included"}.`)}catch(h){q(h)}H()}),Y=l.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(r){l.window.showErrorMessage("Time Tracker is shutting down.");return}if(await l.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await c.reset(),H(),l.window.showInformationMessage("Automatic file activity was reset.")}catch(u){q(u),H()}}),_=()=>{if(r)return;let s=l.window.activeTextEditor,u=l.window.state.focused&&s?.document.uri.scheme==="file"?s.document.uri.fsPath:void 0;G(c.setActiveFile(u))};_();let g=l.window.onDidChangeActiveTextEditor(_),E=l.window.onDidChangeWindowState(_),O=setInterval(()=>{r||G(c.checkpoint())},6e4),A=setInterval(H,1e3);Te=()=>{r=!0,clearInterval(O),clearInterval(A)};let N=l.commands.registerCommand("time-tracker.openTimeCard",()=>{let s;try{s=ve(W?.snapshot().fileTimes??{})}catch(o){let y=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not generate the time card: ${y}`);return}let u=l.window.createWebviewPanel("timeTrackerCard","Time Card Preview",l.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),p=()=>{u.webview.html=be(s,{nonce:(0,pe.randomBytes)(16).toString("hex")})};p();let n=u.webview.onDidReceiveMessage(async o=>{try{if(o.type==="refresh")s=ve(W?.snapshot().fileTimes??{}),p();else if(o.type==="export"){if(o.format!=="html"&&o.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let y=o.format,h=s,b=`time-card-${h.generatedAt.slice(0,10)}.${y}`,v=await we(b,y,()=>y==="html"?Buffer.from(be(h),"utf8"):qe(h));v&&l.window.showInformationMessage(`Time card saved to ${v}`)}}catch(y){let h=y instanceof Error?y.message:String(y);l.window.showErrorMessage(`Could not generate or export the time card: ${h}`)}});u.onDidDispose(()=>n.dispose())}),P=l.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(r){l.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let s=l.window.createWebviewPanel("timeTracker","Time Tracker",l.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});try{await k()}catch(n){s.dispose();let o=n instanceof Error?n.message:String(n);l.window.showErrorMessage(`Could not load ${ue(e)}: ${o}`);return}i.add(s),s.onDidDispose(()=>i.delete(s)),s.webview.html=Ce(s.webview);let u=async()=>{await s.webview.postMessage({type:"state",data:{...await k(),...d()}})};function p(n,o){if(!n||!o||n.id!==o.id||n.date!==o.date||n.task!==o.task||n.timeIn!==o.timeIn||n.timeOut!==o.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}s.webview.onDidReceiveMessage(async n=>{if(!n||typeof n!="object"||typeof n.type!="string"){l.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(n.type){case"showFloatingTimer":C.show();break;case"openTimeCard":await l.commands.executeCommand("time-tracker.openTimeCard");break;case"ready":await u();break;case"addHoliday":case"deleteHoliday":{let o=n.holiday;if(!o||typeof o!="object"||me(o))throw new Error("Enter a valid holiday date and name.");let y={date:o.date,name:o.name.trim()};await M(h=>{let b=h.holidays.some(v=>v.date===y.date&&v.name===y.name);if(n.type==="addHoliday"&&b)throw new Error("This holiday already exists on that date.");if(n.type==="deleteHoliday"&&!b)throw new Error("This holiday was removed in another view.");return{...h,holidays:n.type==="addHoliday"?[...h.holidays,y]:h.holidays.filter(v=>v.date!==y.date||v.name!==y.name)}}),n.type==="addHoliday"&&await s.webview.postMessage({type:"holidayAdded",holiday:y});break}case"createEntry":case"saveEntry":{let o=n.entry;if(!o||typeof o.date!="string"||typeof o.task!="string"||typeof o.timeIn!="string"||typeof o.timeOut!="string"||!R(o.date))throw new Error("Enter a valid date, task, and time values.");let y=!o.task.trim()&&!o.timeIn&&!o.timeOut,h=y&&n.type==="saveEntry"?void 0:K(o);if(h)throw new Error(h);if(n.type==="createEntry"){if(typeof n.requestId!="string"||!n.requestId||n.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let b={...o,id:Ze(),task:o.task.trim()},v=x.get(n.requestId);if(v){if(!(v.entry.date===b.date&&v.entry.task===b.task&&v.entry.timeIn===b.timeIn&&v.entry.timeOut===b.timeOut))throw new Error("The create-entry request is invalid.");await v.operation,await s.webview.postMessage({type:"entryCreated",requestId:n.requestId,entry:v.entry});break}let I=M(S=>({...S,entries:{...S.entries,[o.date]:[...S.entries[o.date]??[],b]}}));x.set(n.requestId,{entry:b,operation:I});try{await I}catch(S){throw x.delete(n.requestId),S}await s.webview.postMessage({type:"entryCreated",requestId:n.requestId,entry:b});break}if(!ke(n.id))throw new Error("Select a saved entry before editing it.");await M(b=>{let v=b.entries[o.date]??[],I=v.findIndex(z=>z.id===n.id),S=v[I];p(S,n.expected);let te={...b.entries};if(y){let z=v.filter(tt=>tt.id!==n.id);z.length?te[o.date]=z:delete te[o.date]}else{let z=[...v];z[I]={...o,id:S.id,task:o.task.trim()},te[o.date]=z}return{...b,entries:te}});break}case"deleteEntry":if(!n.date||!R(n.date)||!ke(n.id))throw new Error("Select a valid entry to delete.");await M(o=>{let y=n.date,h=o.entries[y]??[],b=h.find(S=>S.id===n.id);p(b,n.expected);let v={...o.entries},I=h.filter(S=>S.id!==n.id);return I.length?v[y]=I:delete v[y],{...o,entries:v}});break;case"setPeriodStart":if(typeof n.value!="string"||!R(n.value))throw new Error("Enter a valid period start date.");U(n.value),await M(o=>{if(o.periodStart!==n.expectedValue)throw new Error("The period start changed in another view. Reload it before editing again.");return{...o,periodStart:n.value}});break;case"setHourlyRate":{if(typeof n.value!="string"||n.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(n.value))throw new Error("Enter a valid hourly rate of zero or more.");let o=n.value===""?null:Number(n.value);if(o!==null&&(!Number.isFinite(o)||o<0))throw new Error("Enter a valid hourly rate of zero or more.");await M(y=>{if(y.hourlyRate!==n.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...y,hourlyRate:o}});break}case"requestReportAction":{await w;let o=await k(),y=await l.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(y?.value==="print"){try{let h=await he(o),b=F.join(e.globalStorageUri.fsPath,"print-reports");await(0,D.mkdir)(b,{recursive:!0});let v=await(0,D.mkdtemp)(F.join(b,"report-")),I=`timesheet-${o.periodStart}-to-${U(o.periodStart)}.pdf`,S=F.join(v,I);if(await(0,D.writeFile)(S,h),!await l.env.openExternal(l.Uri.file(S)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");l.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(h){let b=h instanceof Error?h.message:String(h);l.window.showErrorMessage(`Could not open the report for printing: ${b}`)}break}if(y?.value==="pdf"){let h=`timesheet-${o.periodStart}-to-${U(o.periodStart)}.pdf`;try{let b=await we(h,"pdf",()=>he(o));b&&l.window.showInformationMessage(`PDF saved to ${b}`)}catch(b){let v=b instanceof Error?b.message:String(b);l.window.showErrorMessage(`Could not save the PDF: ${v}`)}}break}}}catch(o){let y=o instanceof Error?o.message:String(o);await s.webview.postMessage({type:"error",operation:n.type,id:n.id,requestId:n.requestId,view:n.view??(n.type==="setPeriodStart"||n.type==="setHourlyRate"?"report":"entries"),message:y})}})});e.subscriptions.push(P,N,T,ee,fe,J,Y,Q,Z,C,$,g,E,{dispose:()=>clearInterval(O)},{dispose:()=>clearInterval(A)})}async function xt(){Te?.();try{let t=(await Promise.allSettled([W?.setActiveFile(void 0),Qe,xe])).find(a=>a.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{W=void 0,Te=void 0,V?.(),V=void 0}}0&&(module.exports={activate,createTimesheetTransfer,deactivate,mergeTimesheetTransfer,parseTimesheetTransfer});
