"use strict";var ut=Object.create;var le=Object.defineProperty;var mt=Object.getOwnPropertyDescriptor;var pt=Object.getOwnPropertyNames;var ft=Object.getPrototypeOf,yt=Object.prototype.hasOwnProperty;var ht=(e,t)=>{for(var r in t)le(e,r,{get:t[r],enumerable:!0})},Me=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of pt(t))!yt.call(e,a)&&a!==r&&le(e,a,{get:()=>t[a],enumerable:!(i=mt(t,a))||i.enumerable});return e};var W=(e,t,r)=>(r=e!=null?ut(ft(e)):{},Me(t||!e||!e.__esModule?le(r,"default",{value:e,enumerable:!0}):r,e)),vt=e=>Me(le({},"__esModule",{value:!0}),e);var Rt={};ht(Rt,{activate:()=>Pt,createTimesheetTransfer:()=>ot,deactivate:()=>At,mergeTimesheetTransfer:()=>Pe,parseTimesheetTransfer:()=>st});module.exports=vt(Rt);var l=W(require("vscode")),F=require("node:fs/promises"),tt=require("node:os"),R=W(require("node:path"));function gt(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function $e(e){let t=gt();return`<!DOCTYPE html>
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
.maintenance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; padding: 16px 0; }
.maintenance-card { border: 1px solid var(--line); padding: 14px; }
.maintenance-card h2 { font-size: 14px; margin: 0 0 6px; }
.maintenance-card p { color: var(--muted); line-height: 1.5; margin: 0 0 12px; }
.maintenance-actions { display: flex; flex-wrap: wrap; gap: 8px; }
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
	.tabs, .screen-only, #entries-view, #holidays-view, #file-times-view, #maintenance-view, .error, #print-warning { display: none !important; }
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
<button id="maintenance-tab" role="tab" aria-selected="false" aria-controls="maintenance-view" tabindex="-1">Maintenance</button>
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
<div class="toolbar"><div><h2>Automatic file tracking</h2><p class="subtle">Time accumulates while VS Code is focused and a local file is active, including idle periods. Totals stay separate from timesheet reports.</p></div></div>
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
<label>Period end<input id="period-end" type="date" aria-label="Period end date" aria-describedby="report-error"></label>
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
<section id="maintenance-view" class="view" role="tabpanel" aria-labelledby="maintenance-tab" hidden>
<div class="toolbar"><div><h2>Maintenance</h2><p class="subtle">Manage portable timesheet data and automatic file activity. Existing confirmation and validation still apply.</p></div></div>
<div class="maintenance-grid">
<section class="maintenance-card" aria-labelledby="maintenance-timesheet-heading">
<h2 id="maintenance-timesheet-heading">Timesheet data</h2>
<p>Import or export manual entries and public holidays. Export files contain task and holiday text; review them before sharing.</p>
<div class="maintenance-actions">
<button id="maintenance-import" type="button">Import data</button>
<button id="maintenance-export" class="primary" type="button">Export data</button>
<button id="maintenance-outlook" type="button">Import Outlook Calendar</button>
</div>
</section>
<section class="maintenance-card" aria-labelledby="maintenance-activity-heading">
<h2 id="maintenance-activity-heading">File activity</h2>
<p id="maintenance-tracking-status" role="status">Automatic tracking running</p>
<div class="maintenance-actions">
<button id="maintenance-toggle" type="button">Pause file tracking</button>
<button id="maintenance-exclusions" type="button">Manage exclusions</button>
<button id="maintenance-reset" type="button">Reset file activity</button>
</div>
</section>
<section class="maintenance-card" aria-labelledby="maintenance-views-heading">
<h2 id="maintenance-views-heading">Activity views</h2>
<p>Open the live timer or create a preview from the current file-activity snapshot.</p>
<div class="maintenance-actions">
<button id="maintenance-timer" type="button">Show floating timer</button>
<button id="maintenance-card" type="button">Preview time card</button>
</div>
</section>
</div>
<div id="maintenance-error" class="error" role="alert" aria-live="assertive"></div>
</section>
</main>
<script nonce="${t}">
const vscode = acquireVsCodeApi();
const byId = (id) => document.getElementById(id);
let data = { entries: {}, holidays: [], periodStart: '2026-10-21', periodEnd: '2026-11-20', hourlyRate: null, fileTimes: {}, activeFile: null, paused: false, excluded: false };
const drafts = {}; const pendingFormEntries = {};
let periodDraft = null; let rateDraft = null; let renderPending = false; let nextRequestId = 0;
let maintenanceActionPending = false;
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
 const entries = Array.isArray(value) ? value : value ? [value] : [];
 return [...entries].sort((a, b) => {
  if (!a.timeIn) return b.timeIn ? 1 : 0;
  if (!b.timeIn) return -1;
  return a.timeIn.localeCompare(b.timeIn);
 });
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
  byId('maintenance-tracking-status').textContent = byId('tracking-status').textContent;
  byId('maintenance-toggle').textContent = data.paused ? 'Resume file tracking' : 'Pause file tracking';
 byId('file-times-body').innerHTML = files.length
  ? files.map(([file, milliseconds]) => '<tr><td class="file">' + esc(file) + '</td><td class="duration">' + durationText(Math.floor(milliseconds / 60000)) + '</td><td>' + (file === data.activeFile ? (data.excluded ? 'Excluded' : data.paused ? 'Paused' : 'Active') : '') + '</td></tr>').join('')
  : '<tr><td colspan="3" class="subtle">No files tracked yet.</td></tr>';
}
function renderReport() {
 const start = data.periodStart; const end = data.periodEnd;
 byId('period-start').value = periodDraft ? periodDraft.start : start; byId('period-end').value = periodDraft ? periodDraft.end : end;
 byId('hourly-rate').value = rateDraft ? rateDraft.value : (data.hourlyRate === null ? '' : String(data.hourlyRate));
 byId('save-period').hidden = byId('discard-period').hidden = !periodDraft;
 byId('save-rate').hidden = byId('discard-rate').hidden = !rateDraft;
 byId('period-start').disabled = byId('period-end').disabled = byId('save-period').disabled = byId('discard-period').disabled = Boolean(periodDraft?.pending);
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
 byId('entries-view').hidden = view !== 'entries'; byId('report-view').hidden = view !== 'report'; byId('holidays-view').hidden = view !== 'holidays'; byId('file-times-view').hidden = view !== 'file-times'; byId('maintenance-view').hidden = view !== 'maintenance';
 byId('entries-tab').setAttribute('aria-selected', String(view === 'entries')); byId('report-tab').setAttribute('aria-selected', String(view === 'report')); byId('holidays-tab').setAttribute('aria-selected', String(view === 'holidays')); byId('file-times-tab').setAttribute('aria-selected', String(view === 'file-times')); byId('maintenance-tab').setAttribute('aria-selected', String(view === 'maintenance'));
 const tabs = ['entries', 'report', 'holidays', 'file-times', 'maintenance'];
 tabs.forEach((name) => byId(name + '-tab').tabIndex = name === view ? 0 : -1);
 if (focusTab) byId(view + '-tab').focus();
}
const tabNames = ['entries', 'report', 'holidays', 'file-times', 'maintenance'];
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
const maintenanceActions = [
 ['maintenance-import', 'time-tracker.importTimesheet'],
 ['maintenance-export', 'time-tracker.exportTimesheet'],
 ['maintenance-toggle', 'time-tracker.toggleTracking'],
 ['maintenance-exclusions', 'time-tracker.manageExclusions'],
 ['maintenance-reset', 'time-tracker.resetFileTimes'],
 ['maintenance-timer', 'time-tracker.showFloatingTimer'],
 ['maintenance-card', 'time-tracker.openTimeCard']
];
const maintenanceButtons = [...maintenanceActions.map(([id]) => id), 'maintenance-outlook'];
function setMaintenanceBusy(busy) {
 maintenanceActionPending = busy;
 maintenanceButtons.forEach((id) => { byId(id).disabled = busy; });
}
maintenanceActions.forEach(([id, command]) => byId(id).addEventListener('click', () => {
 if (maintenanceActionPending) return;
 setMaintenanceBusy(true);
 byId('maintenance-error').textContent = '';
 vscode.postMessage({ type: 'maintenanceAction', command });
}));
byId('maintenance-outlook').addEventListener('click', () => {
 if (maintenanceActionPending) return;
 setMaintenanceBusy(true);
 byId('maintenance-error').textContent = '';
 vscode.postMessage({ type: 'importOutlookCalendar', view: 'maintenance' });
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
function rememberPeriod() {
 periodDraft = { start: byId('period-start').value, end: byId('period-end').value, expectedStart: periodDraft ? periodDraft.expectedStart : data.periodStart, expectedEnd: periodDraft ? periodDraft.expectedEnd : data.periodEnd, pending: false };
 byId('save-period').hidden = byId('discard-period').hidden = false;
}
byId('period-start').addEventListener('input', rememberPeriod);
byId('period-end').addEventListener('input', rememberPeriod);
byId('save-period').addEventListener('click', () => {
 const start = byId('period-start'); const end = byId('period-end');
 if (!periodDraft) rememberPeriod();
 periodDraft.start = start.value; periodDraft.end = end.value;
 if (!validDate(start.value)) { fieldError(start, 'report-error', 'Enter a valid period start date.', true); return; }
 if (!validDate(end.value)) { fieldError(end, 'report-error', 'Enter a valid period end date.', true); return; }
 if (end.value < start.value) { fieldError(end, 'report-error', 'Period end must be on or after period start.', true); return; }
 start.removeAttribute('aria-invalid'); end.removeAttribute('aria-invalid'); setError('report-error', ''); periodDraft.pending = true; renderReport();
 vscode.postMessage({ type: 'setPeriod', periodStart: start.value, periodEnd: end.value, expectedStart: periodDraft.expectedStart, expectedEnd: periodDraft.expectedEnd });
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
byId('discard-period').addEventListener('click', () => { periodDraft = null; byId('period-start').removeAttribute('aria-invalid'); byId('period-end').removeAttribute('aria-invalid'); setError('report-error', ''); renderReport(); });
byId('discard-rate').addEventListener('click', () => { rateDraft = null; setError('report-error', ''); renderReport(); });
byId('print-button').addEventListener('click', () => {
 if (Object.keys(drafts).length || periodDraft || rateDraft) { setError('report-error', 'Save or discard unsaved changes before exporting the report.'); return; }
 vscode.postMessage({ type: 'requestReportAction' });
});
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
  if (periodDraft?.pending && periodDraft.start === data.periodStart && periodDraft.end === data.periodEnd) periodDraft = null;
  if (rateDraft?.pending && (rateDraft.value === '' ? null : Number(rateDraft.value)) === data.hourlyRate) rateDraft = null;
  if ((periodDraft && (periodDraft.expectedStart !== data.periodStart || periodDraft.expectedEnd !== data.periodEnd)) || (rateDraft && rateDraft.expectedValue !== data.hourlyRate)) setError('report-error', 'A setting changed elsewhere. Your draft is retained; copy it or discard it before editing the latest value.');
  const active = document.activeElement;
  if (active && ((active.closest('tr[data-date]') && drafts[draftKey(active.closest('tr[data-date]').dataset.date, active.closest('tr[data-date]').dataset.id)]) || ((active.id === 'period-start' || active.id === 'period-end') && periodDraft) || (active.id === 'hourly-rate' && rateDraft))) { renderPending = true; renderFileTimes(); }
  else { renderYearSelect(); render(); }
 }
 if (message.type === 'fileTimes') { data.fileTimes = message.data.fileTimes; data.activeFile = message.data.activeFile; data.paused = message.data.paused; data.excluded = message.data.excluded; data.activeEligible = message.data.activeEligible; renderFileTimes(); }
 if (message.type === 'maintenanceActionComplete') { setMaintenanceBusy(false); }
 if (message.type === 'maintenanceActionError') {
  setMaintenanceBusy(false);
  byId('maintenance-error').textContent = message.message;
 }
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
  if (message.operation === 'setPeriod' && periodDraft) periodDraft.pending = false;
  if (message.operation === 'setHourlyRate' && rateDraft) rateDraft.pending = false;
  setError(message.view === 'report' ? 'report-error' : message.view === 'holidays' ? 'holidays-error' : 'entries-error', message.message);
  if (Object.keys(drafts).length || periodDraft || rateDraft) {
   vscode.postMessage({ type: 'ready' });
   const active = document.activeElement;
   if (active && (active.closest('tr[data-date]') || active.id === 'period-start' || active.id === 'period-end' || active.id === 'hourly-rate')) renderPending = true;
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
</html>`}function we(e){if(!$(e.date))return"Enter a valid holiday date.";if(typeof e.name!="string"||!e.name.trim()||e.name.length>240||/[\x00-\x1f\x7f]/.test(e.name))return"Enter a holiday name of up to 240 characters without control characters."}function $(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,r,i]=e.split("-").map(Number),a=new Date(`${e}T00:00:00Z`);return a.getUTCFullYear()===t&&a.getUTCMonth()===r-1&&a.getUTCDate()===i}function ce(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function xe(e){if(!ce(e.timeIn)||!ce(e.timeOut))return;let[t,r]=e.timeIn.split(":").map(Number),[i,a]=e.timeOut.split(":").map(Number),c=t*60+r,u=i*60+a;return u<c&&(u+=1440),u-c}function Ne(e){return[...e].sort((t,r)=>t.timeIn?r.timeIn?t.timeIn.localeCompare(r.timeIn):-1:r.timeIn?1:0)}function He(e){if(typeof e!="string"||!e.trim())throw new Error("The Outlook calendar file is empty.");let t=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),r=[];for(let d of t)/^[ \t]/.test(d)&&r.length?r[r.length-1]+=d.slice(1):r.push(d);function i(d){let p=d.indexOf(":");if(p<0)return{name:"",params:"",value:""};let x=d.slice(0,p).split(";");return{name:(x.shift()??"").toUpperCase(),params:x.join(";").toUpperCase(),value:d.slice(p+1)}}function a(d){return d.replace(/\\([nN])/g,`
`).replace(/\\,/g,",").replace(/\\;/g,";").replace(/\\\\/g,"\\").trim()}function c(d,p){let h=p.includes("VALUE=DATE")||/^\d{8}$/.test(d),x,b,S,N=0,H=0;if(h){let E=/^(\d{4})(\d{2})(\d{2})$/.exec(d);if(!E)return;x=E[1]?Number(E[1]):0,b=Number(E[2]),S=Number(E[3])}else{let E=/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?Z?$/.exec(d);if(!E)return;if(x=Number(E[1]),b=Number(E[2]),S=Number(E[3]),N=Number(E[4]),H=Number(E[5]),d.endsWith("Z")){let A=new Date(Date.UTC(x,b-1,S,N,H));x=A.getFullYear(),b=A.getMonth()+1,S=A.getDate(),N=A.getHours(),H=A.getMinutes()}}let P=`${String(x).padStart(4,"0")}-${String(b).padStart(2,"0")}-${String(S).padStart(2,"0")}`;if($(P))return{date:P,time:h?"":`${String(N).padStart(2,"0")}:${String(H).padStart(2,"0")}`,allDay:h}}let u=[];for(let d=0;d<r.length;d++){if(r[d].toUpperCase()!=="BEGIN:VEVENT")continue;let p=[];for(d++;d<r.length&&r[d].toUpperCase()!=="END:VEVENT";d++)p.push(r[d]);let h=p.map(i);if(h.some(E=>E.name==="STATUS"&&E.value.trim().toUpperCase()==="CANCELLED"))continue;let x=h.find(E=>E.name==="SUMMARY"),b=h.find(E=>E.name==="DTSTART");if(!b)continue;let S=c(b.value.trim(),b.params);if(!S)continue;let N=h.find(E=>E.name==="DTEND"),H=N?c(N.value.trim(),N.params):void 0,P=x?a(x.value):"Untitled calendar event";P&&(S.allDay?u.push({date:S.date,task:P,timeIn:"",timeOut:""}):H&&!H.allDay&&u.push({date:S.date,task:P,timeIn:S.time,timeOut:H.time}))}return u}function Be(e,t){if(!$(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),Le(r)}function Le(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function ue(e){if(!$(e))throw new RangeError("Enter a valid period start date.");let[t,r,i]=e.split("-").map(Number),a=new Date(`${e}T00:00:00Z`);a.setUTCDate(1),a.setUTCFullYear(t,r+1,0);let c=a.getUTCDate();return a.setUTCDate(Math.min(i,c)-1),Le(a)}function re(e){if(!$(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!ce(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!ce(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function V(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var je=W(require("pdfkit"));function me(e){let[t,r,i]=e.split("-").map(Number),a=new Date(0);return a.setUTCFullYear(t,r-1,i),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(a)}function bt(e){let t=new Date(`${e}T00:00:00Z`),r=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${r} (Weekend)`:r}function wt(e,t){return Ne(e[t]??[])}function Te(e){return new Promise((t,r)=>{if(!$(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let i;try{i=e.periodEnd===void 0?ue(e.periodStart):e.periodEnd}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!$(i)||i<e.periodStart)throw new Error("Cannot generate PDF: invalid period end or period end precedes period start.");let a=new je.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),c=[];a.on("data",T=>c.push(T)),a.on("error",r),a.on("end",()=>t(Buffer.concat(c)));let u=a.page.width-a.page.margins.left-a.page.margins.right,d=[70,70,u-70-70-48-48-60-70,48,48,60,70],p=3;a.font("Helvetica").fontSize(7.5);let h=a.currentLineHeight(!0),x=2,b=[],S=0,N=new Set;for(let T=e.periodStart;;T=Be(T,1)){let C=wt(e.entries,T),L=(e.holidays??[]).filter(m=>m.date===T),q=C.length?C:[{date:T,task:"",timeIn:"",timeOut:""}],z=C.map(xe).filter(m=>m!==void 0),j=z.reduce((m,y)=>m+y,0),o=V(j);z.length&&(N.add(T),S+=j);for(let[m,y]of q.entries()){if(C.length){let v=re(y);if(y.date!==T||v)throw new Error(`Cannot generate PDF: invalid entry for ${T}. ${v??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(y.task))throw new Error(`Cannot generate PDF: task for ${T} contains unsupported characters; only printable ASCII is supported.`);let g=m===0?L.map(v=>`Public holiday: ${v.name}`):[];if(g.some(v=>/[^\x20-\x7e]/.test(v)))throw new Error(`Cannot generate PDF: holiday for ${T} contains unsupported characters; only printable ASCII is supported.`);let n=[];for(let v of[...g,y.task]){let w="";for(let M of v){if(a.widthOfString(w+M)>d[2]-p*2){if(!w)throw new Error(`Cannot generate PDF: task for ${T} cannot fit in the task column.`);n.push(w),w=""}w+=M}(w||!n.length)&&n.push(w)}let s=xe(y),f=!!y.timeIn!=!!y.timeOut,k=new Date(`${T}T00:00:00Z`).getUTCDay()%6===0;b.push({values:[me(T),bt(T),y.task,y.timeIn,y.timeOut,s===void 0?f?"INCOMPLETE":"":V(s),m===0?o:""],taskLines:n,fill:f?"#fff2cc":k?"#eeeeee":"#ffffff"})}if(T===i)break}let H=`Total hours: ${V(S)}     Days logged: ${N.size}`,P=`Generated ${me(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,E=["Date","Day","Task","Time In","Time Out","Entry duration","Daily total"],A=`Reporting period: ${me(e.periodStart)} to ${me(i)}`,ie=h+x,ne=22+h;if(a.font("Helvetica-Bold").fontSize(7.5),E.some((T,C)=>a.widthOfString(T)>d[C]-p*2))throw new Error("Cannot generate PDF: a column heading does not fit.");a.font("Helvetica").fontSize(7.5);for(let T of b)if(T.values.some((C,L)=>L!==2&&a.widthOfString(C)>d[L]-p*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(a.widthOfString(P)>u)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(a.font("Helvetica-Bold").fontSize(9),a.widthOfString(H)>u)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(a.font("Helvetica").fontSize(9),a.widthOfString(A)>u)throw new Error("Cannot generate PDF: period does not fit on the page.");let B=a.page.margins.left,I=0,oe=!1,be=(T,C,L,q=!1)=>{let z=h+x,j=B;a.rect(j,I,u,z).fill(L);for(let o=0;o<T.length;o++){let m=d[o];a.rect(j,I,m,z).lineWidth(.35).stroke("#999999"),a.font(q?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),a.text(o===2?C[0]:T[o],j+p,I+x/2,{lineBreak:!1}),j+=m}I+=z},K=()=>{oe?a.addPage():oe=!0,I=a.page.margins.top,a.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",B,I,{lineBreak:!1}),I+=20,a.font("Helvetica").fontSize(9).fillColor("#333333").text(A,B,I,{lineBreak:!1}),I+=16,be(E,[E[2]],"#dddddd",!0)};K();let X=()=>a.page.height-a.page.margins.bottom,ee=()=>Math.max(1,Math.floor((X()-I-x)/h));for(let T of b){let C=0,L=!0;for(;C<T.taskLines.length;){let q=Math.min(T.taskLines.length-C,ee());if(I+q*h+x>X()){K();continue}let z=T.taskLines.slice(C,C+q),j=L?T.values:[T.values[0],T.values[1],"","","","",""],o=B,m=q*h+x;a.rect(o,I,u,m).fill(T.fill);for(let y=0;y<j.length;y++){let g=d[y];a.rect(o,I,g,m).lineWidth(.35).stroke("#999999"),a.font("Helvetica").fontSize(7.5).fillColor("#222222"),(y===2?z:[j[y]]).forEach((n,s)=>{a.text(n,o+p,I+x/2+s*h,{lineBreak:!1})}),o+=g}I+=m,C+=q,L=!1,C<T.taskLines.length&&K()}}I+ne>X()&&K(),I+=8,a.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(H,B,I,{lineBreak:!1}),I+=14,a.font("Helvetica").fontSize(7.5).fillColor("#555555").text(P,B,I,{lineBreak:!1}),a.end()})}var qe=require("node:perf_hooks");function fe(e){return{total:Object.values(e.fileTimes).reduce((t,r)=>t+r,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function xt(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),r=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof r!="function"||Function.prototype.toString.call(r)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let i=Object.create(null);for(let[a,c]of Object.entries(e)){if(!a||typeof c!="number"||!Number.isFinite(c)||c<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(a)}: expected a non-negative finite duration.`);i[a]=c}return{...i}}var pe=class{constructor(t,r,i=()=>qe.performance.now(),a=[]){this.persistFileTimes=r;this.now=i;Object.assign(this.fileTimes,xt(t)),this.excludedFiles=new Set(a)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let r=this.now();return this.accrueTime(r),this.activeFile=t||void 0,this.startedAt=this.isTracking()?r:void 0,this.persist()}setPaused(t){let r=this.now();return this.accrueTime(r),this.paused=t,this.startedAt=this.isTracking()?r:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let r=this.now();return this.accrueTime(r),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?r:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let i=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},r)}catch(a){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(c){throw new Error(`File time reset failed: ${String(a)}; recovery write failed: ${String(c)}. Retry saving file times.`)}throw a}this.subtractBaseline(this.fileTimes,t);for(let a of this.pendingSnapshots)a!==t&&this.subtractBaseline(a,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=i.then(()=>{},()=>{}),i}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[r,i]of Object.entries(t))i===0&&!(r===this.activeFile&&this.isTracking())&&delete t[r];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,r){for(let[i,a]of Object.entries(r))if(Object.hasOwn(t,i)){let c=t[i]-a;c>0?t[i]=c:delete t[i]}}persist(){let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let i=this.writeQueue.then(()=>this.persistFileTimes({...t},r)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=i.then(()=>{},()=>{}),i}};var he=W(require("vscode")),ze=require("node:crypto"),Ve=W(require("node:path"));function Ue(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(r=>String(r).padStart(2,"0")).join(":")}var ye=class{constructor(t,r){this.snapshot=t;this.toggleTracking=r}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=he.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:he.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let r=t.webview.onDidReceiveMessage(async a=>{if(!(!a||typeof a!="object"||!("type"in a)))switch(a.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),i=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{r.dispose(),i.dispose(),this.panel=void 0}),t.webview.html=Tt()}update(){if(!this.panel)return;let t=this.snapshot(),r=fe(t);this.panel.webview.postMessage({type:"timer",totalTime:Ue(r.total),currentTime:Ue(r.current),currentFile:t.activeFile?Ve.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function Tt(){let e=(0,ze.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
</html>`}var G=require("node:crypto");var Je=W(require("node:path")),We=W(require("pdfkit"));var Ye="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function _e(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function ke(e,t=new Date){let r=Object.entries(e).map(([d,p])=>{if(!d||!Number.isFinite(p)||p<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:Je.basename(d),milliseconds:p,percent:0}}).sort((d,p)=>p.milliseconds-d.milliseconds||d.name.localeCompare(p.name)),i=r.reduce((d,p)=>d+p.milliseconds,0);if(!Number.isFinite(i))throw new Error("The total tracked time is too large to export.");let a=new Map;for(let d of r)a.set(d.name,(a.get(d.name)??0)+1);let c=new Map,u=new Set(r.map(d=>d.name));for(let d of r){d.percent=i>0?d.milliseconds/i*100:0;let p=d.name;if(a.get(p)>1){let h=c.get(p)??0;do d.name=`${p} (${++h})`;while(u.has(d.name));c.set(p,h),u.add(d.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:i,files:r}}function kt(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ve(e){return V(Math.floor(e/6e4))}function Ee(e,t){let r=e.files.map(i=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${kt(i.name)}</span>
<span class="file-time">${ve(i.milliseconds)} <small>${i.percent.toFixed(1)}%</small></span></div>
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
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${_e(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${ve(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${r||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${Ye}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function Ke(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,r)=>{let i=new We.default({size:"A4",margin:44,compress:!0}),a=[];i.on("data",h=>a.push(h)),i.on("error",r),i.on("end",()=>t(Buffer.concat(a)));let c=i.page.width-88,u=0,d=()=>{i.rect(0,0,i.page.width,i.page.height).fill(i.linearGradient(0,0,i.page.width,i.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),i.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),i.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),i.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${_e(e)}`,44,110),i.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${ve(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),u=190},p=()=>{i.addPage(),d()};d();for(let h of e.files){i.font("Helvetica").fontSize(11);let x=i.heightOfString(h.name,{width:c}),b=x+44;u+b>i.page.height-130&&p(),i.fillColor("#ffffff").font("Helvetica").fontSize(11).text(h.name,44,u,{width:c}),u+=x+6,i.fillColor("#ffe1a6").fontSize(10).text(`${ve(h.milliseconds)}  /  ${h.percent.toFixed(1)}%`,44,u),u+=18,i.roundedRect(44,u,c,6,3).fill("#45665d"),h.percent>0&&i.rect(44,u,c*h.percent/100,6).fill(i.linearGradient(44,u,44+c,u).stop(0,"#7edcbb").stop(1,"#ffcc7d")),u+=20}e.files.length||(i.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,u),u+=32),u+90>i.page.height-44&&p(),i.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(Ye,44,u+12,{width:c}),i.end()})}var Y=require("node:fs"),Qe=require("node:crypto"),Ze=W(require("node:path")),ae=class extends Error{constructor(r){super(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${r}, then reopen VS Code.`);this.lockFile=r}lockFile};function Ge(e){(0,Y.mkdirSync)(e,{recursive:!0});let t=Ze.join(e,"time-tracker.owner.lock"),r=JSON.stringify({pid:process.pid,token:(0,Qe.randomBytes)(16).toString("hex")});try{(0,Y.writeFileSync)(t,r,{flag:"wx"})}catch(i){throw i.code==="EEXIST"?new ae(t):i}return()=>{if((0,Y.readFileSync)(t,"utf8")!==r)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,Y.unlinkSync)(t)}}var Et="time-tracker.data",St="timesheet.json",Xe="time-tracker.file-times",Se="time-tracker.file-activity",et="excludedFiles",It="2026-10-21",rt="time-tracker-timesheet",at=1,Q=5*1024*1024,Dt=new Set(["time-tracker.importTimesheet","time-tracker.exportTimesheet","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.showFloatingTimer","time-tracker.openTimeCard"]),Z,_,it=Promise.resolve(),De,Ce;function nt(){return(0,G.randomBytes)(16).toString("hex")}function Ct(e){return(0,G.createHash)("sha256").update(JSON.stringify([e.date,e.task,e.timeIn,e.timeOut])).digest("hex").slice(0,32)}function Fe(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function Oe(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},r=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[d,p]of Object.entries(e.entries)){let h=!Array.isArray(p),x=h?[p]:p;t[d]=x.map(b=>{if(!b||typeof b!="object"||typeof b.date!="string"||typeof b.task!="string"||typeof b.timeIn!="string"||typeof b.timeOut!="string"||b.date!==d||re(b))throw new Error(`The saved entry for ${d} is invalid. Restore or repair the JSON file before continuing.`);let S=b.id===void 0&&h?nt():b.id;if(!Fe(S))throw new Error(`The saved entry for ${d} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(r.has(S))throw new Error(`The saved entry for ${d} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return r.add(S),{...b,id:S}}),t[d].length||delete t[d]}}let i=e.periodStart===void 0?It:e.periodStart;if(typeof i!="string"||!$(i))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");let a=e.periodEnd;if(a===void 0)try{a=ue(i)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}if(typeof a!="string"||!$(a)||a<i)throw new Error("The saved period end is invalid. Restore or repair the JSON file before continuing.");let c=e.hourlyRate===void 0?null:e.hourlyRate;if(c!==null&&(typeof c!="number"||!Number.isFinite(c)||c<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");let u=e.holidays===void 0?[]:e.holidays;if(!Array.isArray(u)||u.some(d=>!d||typeof d!="object"||we(d)||d.name!==d.name.trim())||new Set(u.map(d=>JSON.stringify([d.date,d.name]))).size!==u.length)throw new Error("The saved public holidays are invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:i,periodEnd:a,hourlyRate:c,holidays:u}}function Ae(e){return Object.fromEntries(Object.entries(e).map(([t,r])=>[t,r.map(i=>({id:i.id,date:i.date,task:i.task,timeIn:i.timeIn,timeOut:i.timeOut}))]))}function Re(e){return e.map(t=>({date:t.date,name:t.name}))}function Ft(e,t){return e.id===t.id&&e.date===t.date&&e.task===t.task&&e.timeIn===t.timeIn&&e.timeOut===t.timeOut}function ot(e,t=new Date){return{kind:rt,schemaVersion:at,exportedAt:t.toISOString(),entries:Ae(e.entries),holidays:Re(e.holidays)}}function st(e){if(Buffer.byteLength(e,"utf8")>Q)throw new Error(`The timesheet file is too large. The limit is ${Q} bytes.`);let t;try{t=JSON.parse(e)}catch{throw new Error("The selected timesheet file is not valid JSON.")}if(!t||typeof t!="object"||Array.isArray(t))throw new Error("The selected file is not a Time Tracker timesheet export.");let r=t,i=new Set(["kind","schemaVersion","exportedAt","entries","holidays"]);if(Object.keys(r).some(u=>!i.has(u)))throw new Error("The selected timesheet export contains unsupported fields.");if(r.kind!==rt||r.schemaVersion!==at)throw new Error("The selected file uses an unsupported Time Tracker timesheet format.");let a=typeof r.exportedAt=="string"?new Date(r.exportedAt):void 0;if(!a||!Number.isFinite(a.getTime())||a.toISOString()!==r.exportedAt)throw new Error("The selected timesheet export has an invalid export timestamp.");if(!r.entries||typeof r.entries!="object"||Array.isArray(r.entries)||Object.values(r.entries).some(u=>!Array.isArray(u)))throw new Error("The selected timesheet export has invalid entries.");if(!Array.isArray(r.holidays))throw new Error("The selected timesheet export has invalid holidays.");let c=Oe({entries:r.entries,holidays:r.holidays});return{entries:Ae(c.entries),holidays:Re(c.holidays)}}function Pe(e,t){let r=new Map(Object.values(e.entries).flat().map(p=>[p.id,p])),i=Ae(e.entries),a=0;for(let[p,h]of Object.entries(t.entries))for(let x of h){let b=r.get(x.id);if(b){if(!Ft(b,x))throw new Error(`Imported entry ${x.id} conflicts with a local entry. Import was not applied.`);continue}i[p]=[...i[p]??[],{...x}],r.set(x.id,x),a++}let c=new Set(e.holidays.map(p=>JSON.stringify([p.date,p.name]))),u=Re(e.holidays),d=0;for(let p of t.holidays){let h=JSON.stringify([p.date,p.name]);c.has(h)||(c.add(h),u.push({...p}),d++)}return{state:a||d?{...e,entries:i,holidays:u}:e,addedEntries:a,addedHolidays:d}}function ge(e){return R.join(e.globalStorageUri.fsPath,St)}async function dt(e,t){let r=ge(e);await(0,F.mkdir)(R.dirname(r),{recursive:!0});let i=`${r}.${process.pid}.${(0,G.randomBytes)(8).toString("hex")}.tmp`,a=await(0,F.open)(i,"wx");try{await a.writeFile(JSON.stringify(t,null,2),"utf8"),await a.close(),await(0,F.rename)(i,r)}catch(c){try{await a.close(),await(0,F.unlink)(i)}catch(u){let d=c instanceof Error?c.message:String(c),p=u instanceof Error?u.message:String(u);throw new AggregateError([c,u],`Could not save the timesheet: ${d}. Temporary file cleanup failed: ${p}`)}throw c}}async function Ot(e){try{let r=await(0,F.readFile)(ge(e),"utf8");return Oe(JSON.parse(r))}catch(r){if(r.code!=="ENOENT")throw r}let t=Oe(e.globalState.get(Et));return await dt(e,t),t}async function Ie(e,t,r,i){let a=l.workspace.workspaceFolders?.[0]?.uri??l.Uri.file((0,tt.homedir)()),c=await l.window.showSaveDialog({defaultUri:l.Uri.joinPath(a,e),filters:{[t==="html"?"HTML documents":t==="json"?"JSON documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!c)return;let u=R.extname(c.fsPath).toLowerCase()===`.${t}`?c.fsPath:`${c.fsPath}.${t}`;if(i){let d=R.resolve(u),p=R.resolve(i);if(process.platform==="win32"?d.toLowerCase()===p.toLowerCase():d===p)throw new Error("Choose a different file; the active timesheet store cannot be overwritten by an export.")}return await(0,F.writeFile)(u,await r()),u}function Pt(e){let t=[],r=(o,m=!1,y)=>{let g=()=>{(async()=>{try{if(y){let v=await l.window.showErrorMessage("Time Tracker is paused because another VS Code window may be using its storage.",{modal:!0,detail:"Close the other window, then reload this window. If VS Code crashed, see the recovery instructions."},"Reload Window","Recovery Instructions");v==="Reload Window"?await l.commands.executeCommand("workbench.action.reloadWindow"):v==="Recovery Instructions"&&await l.window.showErrorMessage("Recover Time Tracker after an unexpected shutdown",{modal:!0,detail:`Close all VS Code windows and ensure their extension hosts have stopped. Then remove only this lock file and reopen VS Code:

${y}`},"Copy Lock Path")==="Copy Lock Path"&&await l.env.clipboard.writeText(y);return}if(await l.window.showErrorMessage(o,...m?["Export raw data"]:[])!=="Export raw data")return;let f=await l.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!f)return;let k={fileActivity:e.globalState.get(Se),fileTimes:e.globalState.get(Xe),excludedFiles:e.globalState.get(et),legacyFileTimers:e.globalState.get("fileTimers")};await(0,F.writeFile)(f.fsPath,JSON.stringify(k,null,2),"utf8"),l.window.showInformationMessage(`Raw file activity data saved to ${f.fsPath}.`)}catch(s){let f=s instanceof Error?s.message:String(s);l.window.showErrorMessage(y?`Could not complete storage recovery: ${f}`:`Could not export raw file activity data: ${f}`)}})()},n=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);n.text="$(debug-pause) Time Tracker unavailable",n.tooltip=o,n.command="time-tracker.openTimesheet",n.show(),e.subscriptions.push(n,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.exportTimesheet","time-tracker.importTimesheet"].map(s=>l.commands.registerCommand(s,g))),g()};try{_=Ge(e.globalStorageUri.fsPath);let o=e.globalState.get(Se),m=e.globalState.get(Xe),y=e.globalState.get(et);if(o!==void 0){if(!o||typeof o!="object"||Array.isArray(o)||!("version"in o)||o.version!==1||!("fileTimes"in o)||o.fileTimes===void 0||!("excludedFiles"in o)||o.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");m=o.fileTimes,y=o.excludedFiles}if(y!==void 0){if(!Array.isArray(y)||y.some(g=>typeof g!="string"||!g))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(y)]}Z=new pe(m,async(g,n)=>e.globalState.update(Se,{version:1,fileTimes:g,excludedFiles:[...n]}),void 0,t),e.globalState.get("fileTimers")!==void 0&&l.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(o){let m=o instanceof Error?o.message:String(o),y=!!_;if(_)try{_()}catch(g){let n=g instanceof Error?g.message:String(g);r(`${m} Could not release storage ownership: ${n}`);return}finally{_=void 0}r(m,y,o instanceof ae?o.lockFile:void 0);return}let i=new Set,a=!1,c=Z,u=()=>{let o=c.snapshot();return{...o,excluded:!!o.activeFile&&c.isExcluded(o.activeFile)}},d,p,h=Promise.resolve(),x=new Map,b=async()=>{if(d)return d;p||(p=Ot(e),De=p);try{return d=await p,d}finally{p=void 0,De=void 0}},S=o=>{if(a)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let m=h.then(async()=>{let y=await b(),g=o(y);if(g!==y){await dt(e,g),d=g;for(let n of i)await n.webview.postMessage({type:"saved",data:{...g,...u()}})}});return h=m.then(()=>{},()=>{}),it=h,m},N=l.commands.registerCommand("time-tracker.exportTimesheet",async()=>{try{await h;let o=await b(),m=ot(o),y=await Ie(`time-tracker-timesheet-${m.exportedAt.slice(0,10)}.json`,"json",()=>Buffer.from(`${JSON.stringify(m,null,2)}
`,"utf8"),ge(e));y&&l.window.showInformationMessage(`Timesheet data saved to ${y}`)}catch(o){let m=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not export timesheet data: ${m}`)}}),H=l.commands.registerCommand("time-tracker.importTimesheet",async()=>{try{let o=await l.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Time Tracker timesheet":["json"],"All files":["*"]},openLabel:"Import timesheet data"});if(!o?.length)return;let m=await(0,F.open)(o[0].fsPath,"r"),y;try{let k=await m.stat();if(!k.isFile())throw new Error("Select a regular JSON file.");if(k.size>Q)throw new Error(`The timesheet file is too large. The limit is ${Q} bytes.`);y=await m.readFile({encoding:"utf8"})}finally{await m.close()}let g=st(y);await h;let n=Pe(await b(),g);if(await l.window.showWarningMessage(`Import ${n.addedEntries} new entries and ${n.addedHolidays} new holidays? Existing timesheet entries and preferences will be kept.`,{modal:!0},"Import")!=="Import")return;let f;await S(k=>(f=Pe(k,g),f.state)),l.window.showInformationMessage(`Timesheet import complete: ${f.addedEntries} entries and ${f.addedHolidays} holidays added.`)}catch(o){let m=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not import timesheet data: ${m}`)}}),P=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);P.command="time-tracker.openTimesheet",P.text="$(watch) 0h 00m | 0h 00m",P.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,P.show();let E=o=>{let m=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not save automatic file time data: ${m}`)},A=()=>{let o=u(),m=fe(o),y=V(Math.floor(m.total/6e4)),g=V(Math.floor(m.current/6e4)),n=o.activeFile?`Current file (${R.basename(o.activeFile)})`:"Current file";P.text=`${o.paused?"$(debug-pause)":"$(watch)"} ${y} | ${g}`+(o.excluded?" Excluded":o.activeFile?"":" Waiting"),P.tooltip=`Total tracked: ${y}
${n}: ${g}
${o.paused?`Automatic tracking paused
`:o.excluded?`Current file excluded
`:""}Click to open Time Tracker`,B.update();for(let s of i)s.webview.postMessage({type:"fileTimes",data:o})},ie=async o=>{A();try{await o}catch(m){E(m)}A()},ne=()=>a?Promise.resolve():ie(c.setPaused(!c.snapshot().paused)),B=new ye(u,ne),I=l.commands.registerCommand("time-tracker.showFloatingTimer",()=>B.show()),oe=l.commands.registerCommand("time-tracker.hideFloatingTimer",()=>B.hide()),be=l.commands.registerCommand("time-tracker.toggleTracking",ne),K=l.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(a){l.window.showErrorMessage("Time Tracker is shutting down.");return}let o=l.window.activeTextEditor,m=o?.document.uri.scheme==="file"?o.document.uri.fsPath:void 0,y=m?[m,...t.filter(f=>f!==m)]:t;if(!y.length){l.window.showInformationMessage("No local file is active and no files are excluded.");return}let g=await l.window.showQuickPick(y.map(f=>({label:`${c.isExcluded(f)?"Include":"Exclude"} ${R.basename(f)}`,description:f,file:f})),{placeHolder:"Choose a local file to exclude or include"});if(!g)return;let n=new Set(t);n.has(g.file)?n.delete(g.file):n.add(g.file),t=[...n];let s=c.setExcludedFiles(t);A();try{await s,l.window.showInformationMessage(`${R.basename(g.file)} is ${c.isExcluded(g.file)?"excluded":"included"}.`)}catch(f){E(f)}A()}),X=l.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(a){l.window.showErrorMessage("Time Tracker is shutting down.");return}if(await l.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await c.reset(),A(),l.window.showInformationMessage("Automatic file activity was reset.")}catch(m){E(m),A()}}),ee=()=>{if(a)return;let o=l.window.activeTextEditor,m=l.window.state.focused&&o?.document.uri.scheme==="file"?o.document.uri.fsPath:void 0;ie(c.setActiveFile(m))};ee();let T=l.window.onDidChangeActiveTextEditor(ee),C=l.window.onDidChangeWindowState(ee),L=setInterval(()=>{a||ie(c.checkpoint())},6e4),q=setInterval(A,1e3);Ce=()=>{a=!0,clearInterval(L),clearInterval(q)};let z=l.commands.registerCommand("time-tracker.openTimeCard",()=>{let o;try{o=ke(Z?.snapshot().fileTimes??{})}catch(n){let s=n instanceof Error?n.message:String(n);l.window.showErrorMessage(`Could not generate the time card: ${s}`);return}let m=l.window.createWebviewPanel("timeTrackerCard","Time Card Preview",l.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),y=()=>{m.webview.html=Ee(o,{nonce:(0,G.randomBytes)(16).toString("hex")})};y();let g=m.webview.onDidReceiveMessage(async n=>{try{if(n.type==="refresh")o=ke(Z?.snapshot().fileTimes??{}),y();else if(n.type==="export"){if(n.format!=="html"&&n.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let s=n.format,f=o,k=`time-card-${f.generatedAt.slice(0,10)}.${s}`,v=await Ie(k,s,()=>s==="html"?Buffer.from(Ee(f),"utf8"):Ke(f));v&&l.window.showInformationMessage(`Time card saved to ${v}`)}}catch(s){let f=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not generate or export the time card: ${f}`)}});m.onDidDispose(()=>g.dispose())}),j=l.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(a){l.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let o=l.window.createWebviewPanel("timeTracker","Time Tracker",l.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),m=!1;try{await b()}catch(n){o.dispose();let s=n instanceof Error?n.message:String(n);l.window.showErrorMessage(`Could not load ${ge(e)}: ${s}`);return}i.add(o),o.onDidDispose(()=>i.delete(o)),o.webview.html=$e(o.webview);let y=async()=>{await o.webview.postMessage({type:"state",data:{...await b(),...u()}})};function g(n,s){if(!n||!s||n.id!==s.id||n.date!==s.date||n.task!==s.task||n.timeIn!==s.timeIn||n.timeOut!==s.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}o.webview.onDidReceiveMessage(async n=>{if(!n||typeof n!="object"||typeof n.type!="string"){l.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(n.type){case"maintenanceAction":if(typeof n.command!="string"||!Dt.has(n.command))throw new Error("Choose a valid maintenance action.");if(a)throw new Error("Time Tracker is shutting down.");if(m)break;m=!0;try{await l.commands.executeCommand(n.command),await o.webview.postMessage({type:"maintenanceActionComplete"})}finally{m=!1}break;case"showFloatingTimer":B.show();break;case"openTimeCard":await l.commands.executeCommand("time-tracker.openTimeCard");break;case"importOutlookCalendar":{let s=await l.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Outlook Calendar":["ics"],"All files":["*"]},openLabel:"Import Outlook Calendar"});if(!s?.length){await o.webview.postMessage({type:"maintenanceActionComplete"});break}let f=await(0,F.open)(s[0].fsPath,"r"),k;try{let O=await f.stat();if(!O.isFile())throw new Error("Select a regular Outlook calendar .ics file.");if(O.size>Q)throw new Error(`The calendar file is too large. The limit is ${Q} bytes.`);k=await f.readFile({encoding:"utf8"})}finally{await f.close()}let v=He(k);if(!v.length)throw new Error("No timed or all-day calendar entries found in this Outlook .ics file.");await h;let w=await b(),M=new Set(Object.values(w.entries).flat().map(O=>JSON.stringify([O.date,O.task,O.timeIn,O.timeOut]))),D=v.filter(O=>!M.has(JSON.stringify([O.date,O.task,O.timeIn,O.timeOut])));if(!D.length){l.window.showInformationMessage("Outlook Calendar import complete: 0 entries added."),await o.webview.postMessage({type:"maintenanceActionComplete"});break}if(await l.window.showWarningMessage(`Import ${D.length} calendar ${D.length===1?"entry":"entries"}?`,{modal:!0},"Import")!=="Import"){await o.webview.postMessage({type:"maintenanceActionComplete"});break}let U=0;await S(O=>{let se={...O.entries};for(let J of D){let lt=JSON.stringify([J.date,J.task,J.timeIn,J.timeOut]);if(Object.values(se).flat().some(de=>JSON.stringify([de.date,de.task,de.timeIn,de.timeOut])===lt))continue;let ct={...J,id:Ct(J)};se[J.date]=[...se[J.date]??[],ct],U++}return U?{...O,entries:se}:O}),l.window.showInformationMessage(`Outlook Calendar import complete: ${U} entries added.`),await o.webview.postMessage({type:"maintenanceActionComplete"});break}case"ready":await y();break;case"addHoliday":case"deleteHoliday":{let s=n.holiday;if(!s||typeof s!="object"||we(s))throw new Error("Enter a valid holiday date and name.");let f={date:s.date,name:s.name.trim()};await S(k=>{let v=k.holidays.some(w=>w.date===f.date&&w.name===f.name);if(n.type==="addHoliday"&&v)throw new Error("This holiday already exists on that date.");if(n.type==="deleteHoliday"&&!v)throw new Error("This holiday was removed in another view.");return{...k,holidays:n.type==="addHoliday"?[...k.holidays,f]:k.holidays.filter(w=>w.date!==f.date||w.name!==f.name)}}),n.type==="addHoliday"&&await o.webview.postMessage({type:"holidayAdded",holiday:f});break}case"createEntry":case"saveEntry":{let s=n.entry;if(!s||typeof s.date!="string"||typeof s.task!="string"||typeof s.timeIn!="string"||typeof s.timeOut!="string"||!$(s.date))throw new Error("Enter a valid date, task, and time values.");let f=!s.task.trim()&&!s.timeIn&&!s.timeOut,k=f&&n.type==="saveEntry"?void 0:re(s);if(k)throw new Error(k);if(n.type==="createEntry"){if(typeof n.requestId!="string"||!n.requestId||n.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let v={...s,id:nt(),task:s.task.trim()},w=x.get(n.requestId);if(w){if(!(w.entry.date===v.date&&w.entry.task===v.task&&w.entry.timeIn===v.timeIn&&w.entry.timeOut===v.timeOut))throw new Error("The create-entry request is invalid.");await w.operation,await o.webview.postMessage({type:"entryCreated",requestId:n.requestId,entry:w.entry});break}let M=S(D=>({...D,entries:{...D.entries,[s.date]:[...D.entries[s.date]??[],v]}}));x.set(n.requestId,{entry:v,operation:M});try{await M}catch(D){throw x.delete(n.requestId),D}await o.webview.postMessage({type:"entryCreated",requestId:n.requestId,entry:v});break}if(!Fe(n.id))throw new Error("Select a saved entry before editing it.");await S(v=>{let w=v.entries[s.date]??[],M=w.findIndex(U=>U.id===n.id),D=w[M];g(D,n.expected);let te={...v.entries};if(f){let U=w.filter(O=>O.id!==n.id);U.length?te[s.date]=U:delete te[s.date]}else{let U=[...w];U[M]={...s,id:D.id,task:s.task.trim()},te[s.date]=U}return{...v,entries:te}});break}case"deleteEntry":if(!n.date||!$(n.date)||!Fe(n.id))throw new Error("Select a valid entry to delete.");await S(s=>{let f=n.date,k=s.entries[f]??[],v=k.find(D=>D.id===n.id);g(v,n.expected);let w={...s.entries},M=k.filter(D=>D.id!==n.id);return M.length?w[f]=M:delete w[f],{...s,entries:w}});break;case"setPeriod":if(typeof n.periodStart!="string"||!$(n.periodStart))throw new Error("Enter a valid period start date.");if(typeof n.periodEnd!="string"||!$(n.periodEnd))throw new Error("Enter a valid period end date.");if(n.periodEnd<n.periodStart)throw new Error("Period end must be on or after period start.");await S(s=>{if(s.periodStart!==n.expectedStart||s.periodEnd!==n.expectedEnd)throw new Error("The reporting period changed in another view. Reload it before editing again.");return{...s,periodStart:n.periodStart,periodEnd:n.periodEnd}});break;case"setHourlyRate":{if(typeof n.value!="string"||n.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(n.value))throw new Error("Enter a valid hourly rate of zero or more.");let s=n.value===""?null:Number(n.value);if(s!==null&&(!Number.isFinite(s)||s<0))throw new Error("Enter a valid hourly rate of zero or more.");await S(f=>{if(f.hourlyRate!==n.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...f,hourlyRate:s}});break}case"requestReportAction":{await h;let s=await b(),f=await l.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(f?.value==="print"){try{let k=await Te(s),v=R.join(e.globalStorageUri.fsPath,"print-reports");await(0,F.mkdir)(v,{recursive:!0});let w=await(0,F.mkdtemp)(R.join(v,"report-")),M=`timesheet-${s.periodStart}-to-${s.periodEnd}.pdf`,D=R.join(w,M);if(await(0,F.writeFile)(D,k),!await l.env.openExternal(l.Uri.file(D)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");l.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(k){let v=k instanceof Error?k.message:String(k);l.window.showErrorMessage(`Could not open the report for printing: ${v}`)}break}if(f?.value==="pdf"){let k=`timesheet-${s.periodStart}-to-${s.periodEnd}.pdf`;try{let v=await Ie(k,"pdf",()=>Te(s));v&&l.window.showInformationMessage(`PDF saved to ${v}`)}catch(v){let w=v instanceof Error?v.message:String(v);l.window.showErrorMessage(`Could not save the PDF: ${w}`)}}break}}}catch(s){let f=s instanceof Error?s.message:String(s);if(n.type==="maintenanceAction"||n.type==="importOutlookCalendar"){await o.webview.postMessage({type:"maintenanceActionError",message:f});return}await o.webview.postMessage({type:"error",operation:n.type,id:n.id,requestId:n.requestId,view:n.view??(n.type==="setPeriod"||n.type==="setHourlyRate"?"report":"entries"),message:f})}})});e.subscriptions.push(j,z,I,oe,be,K,X,N,H,B,P,T,C,{dispose:()=>clearInterval(L)},{dispose:()=>clearInterval(q)})}async function At(){Ce?.();try{let t=(await Promise.allSettled([Z?.setActiveFile(void 0),it,De])).find(r=>r.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{Z=void 0,Ce=void 0,_?.(),_=void 0}}0&&(module.exports={activate,createTimesheetTransfer,deactivate,mergeTimesheetTransfer,parseTimesheetTransfer});
