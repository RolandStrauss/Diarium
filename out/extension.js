"use strict";var lt=Object.create;var se=Object.defineProperty;var ct=Object.getOwnPropertyDescriptor;var ut=Object.getOwnPropertyNames;var pt=Object.getPrototypeOf,ft=Object.prototype.hasOwnProperty;var mt=(e,t)=>{for(var r in t)se(e,r,{get:t[r],enumerable:!0})},Re=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ut(t))!ft.call(e,i)&&i!==r&&se(e,i,{get:()=>t[i],enumerable:!(a=ct(t,i))||a.enumerable});return e};var J=(e,t,r)=>(r=e!=null?lt(pt(e)):{},Re(t||!e||!e.__esModule?se(r,"default",{value:e,enumerable:!0}):r,e)),yt=e=>Re(se({},"__esModule",{value:!0}),e);var Ot={};mt(Ot,{activate:()=>Ft,createTimesheetTransfer:()=>at,deactivate:()=>Ct,mergeTimesheetTransfer:()=>Ce,parseTimesheetTransfer:()=>nt});module.exports=yt(Ot);var l=J(require("vscode")),C=require("node:fs/promises"),Xe=require("node:os"),A=J(require("node:path"));function ht(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function Ae(e){let t=ht();return`<!DOCTYPE html>
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
<div class="toolbar"><div><label for="year-select">Calendar year</label><select id="year-select"></select></div><p class="subtle">Add multiple entries per date. Overnight shifts are calculated automatically.</p><button id="import-outlook-calendar" type="button">Import Outlook Calendar</button></div>
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
const maintenanceButtons = maintenanceActions.map(([id]) => id);
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
byId('import-outlook-calendar').addEventListener('click', () => {
 vscode.postMessage({ type: 'importOutlookCalendar', view: 'entries' });
});
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
</html>`}function ge(e){if(!M(e.date))return"Enter a valid holiday date.";if(typeof e.name!="string"||!e.name.trim()||e.name.length>240||/[\x00-\x1f\x7f]/.test(e.name))return"Enter a holiday name of up to 240 characters without control characters."}function M(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,r,a]=e.split("-").map(Number),i=new Date(`${e}T00:00:00Z`);return i.getUTCFullYear()===t&&i.getUTCMonth()===r-1&&i.getUTCDate()===a}function de(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function be(e){if(!de(e.timeIn)||!de(e.timeOut))return;let[t,r]=e.timeIn.split(":").map(Number),[a,i]=e.timeOut.split(":").map(Number),c=t*60+r,u=a*60+i;return u<c&&(u+=1440),u-c}function Me(e){return[...e].sort((t,r)=>t.timeIn?r.timeIn?t.timeIn.localeCompare(r.timeIn):-1:r.timeIn?1:0)}function $e(e){if(typeof e!="string"||!e.trim())throw new Error("The Outlook calendar file is empty.");let t=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),r=[];for(let d of t)/^[ \t]/.test(d)&&r.length?r[r.length-1]+=d.slice(1):r.push(d);function a(d){let p=d.indexOf(":");if(p<0)return{name:"",params:"",value:""};let T=d.slice(0,p).split(";");return{name:(T.shift()??"").toUpperCase(),params:T.join(";").toUpperCase(),value:d.slice(p+1)}}function i(d){return d.replace(/\\([nN])/g,`
`).replace(/\\,/g,",").replace(/\\;/g,";").replace(/\\\\/g,"\\").trim()}function c(d,p){let h=p.includes("VALUE=DATE")||/^\d{8}$/.test(d),T,w,E,$=0,N=0;if(h){let k=/^(\d{4})(\d{2})(\d{2})$/.exec(d);if(!k)return;T=k[1]?Number(k[1]):0,w=Number(k[2]),E=Number(k[3])}else{let k=/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?Z?$/.exec(d);if(!k)return;if(T=Number(k[1]),w=Number(k[2]),E=Number(k[3]),$=Number(k[4]),N=Number(k[5]),d.endsWith("Z")){let R=new Date(Date.UTC(T,w-1,E,$,N));T=R.getFullYear(),w=R.getMonth()+1,E=R.getDate(),$=R.getHours(),N=R.getMinutes()}}let P=`${String(T).padStart(4,"0")}-${String(w).padStart(2,"0")}-${String(E).padStart(2,"0")}`;if(M(P))return{date:P,time:h?"":`${String($).padStart(2,"0")}:${String(N).padStart(2,"0")}`,allDay:h}}let u=[];for(let d=0;d<r.length;d++){if(r[d].toUpperCase()!=="BEGIN:VEVENT")continue;let p=[];for(d++;d<r.length&&r[d].toUpperCase()!=="END:VEVENT";d++)p.push(r[d]);let h=p.map(a);if(h.some(k=>k.name==="STATUS"&&k.value.trim().toUpperCase()==="CANCELLED"))continue;let T=h.find(k=>k.name==="SUMMARY"),w=h.find(k=>k.name==="DTSTART");if(!w)continue;let E=c(w.value.trim(),w.params);if(!E)continue;let $=h.find(k=>k.name==="DTEND"),N=$?c($.value.trim(),$.params):void 0,P=T?i(T.value):"Untitled calendar event";P&&(E.allDay?u.push({date:E.date,task:P,timeIn:"",timeOut:""}):N&&!N.allDay&&u.push({date:E.date,task:P,timeIn:E.time,timeOut:N.time}))}return u}function Ne(e,t){if(!M(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),He(r)}function He(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function le(e){if(!M(e))throw new RangeError("Enter a valid period start date.");let[t,r,a]=e.split("-").map(Number),i=new Date(`${e}T00:00:00Z`);i.setUTCDate(1),i.setUTCFullYear(t,r+1,0);let c=i.getUTCDate();return i.setUTCDate(Math.min(a,c)-1),He(i)}function te(e){if(!M(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!de(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!de(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function z(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var Be=J(require("pdfkit"));function ce(e){let[t,r,a]=e.split("-").map(Number),i=new Date(0);return i.setUTCFullYear(t,r-1,a),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(i)}function vt(e){let t=new Date(`${e}T00:00:00Z`),r=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${r} (Weekend)`:r}function gt(e,t){return Me(e[t]??[])}function we(e){return new Promise((t,r)=>{if(!M(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let a;try{a=e.periodEnd===void 0?le(e.periodStart):e.periodEnd}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!M(a)||a<e.periodStart)throw new Error("Cannot generate PDF: invalid period end or period end precedes period start.");let i=new Be.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),c=[];i.on("data",x=>c.push(x)),i.on("error",r),i.on("end",()=>t(Buffer.concat(c)));let u=i.page.width-i.page.margins.left-i.page.margins.right,d=[70,70,u-70-70-48-48-60-70,48,48,60,70],p=3;i.font("Helvetica").fontSize(7.5);let h=i.currentLineHeight(!0),T=2,w=[],E=0,$=new Set;for(let x=e.periodStart;;x=Ne(x,1)){let F=gt(e.entries,x),B=(e.holidays??[]).filter(f=>f.date===x),j=F.length?F:[{date:x,task:"",timeIn:"",timeOut:""}],U=F.map(be).filter(f=>f!==void 0),L=U.reduce((f,y)=>f+y,0),s=z(L);U.length&&($.add(x),E+=L);for(let[f,y]of j.entries()){if(F.length){let b=te(y);if(y.date!==x||b)throw new Error(`Cannot generate PDF: invalid entry for ${x}. ${b??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(y.task))throw new Error(`Cannot generate PDF: task for ${x} contains unsupported characters; only printable ASCII is supported.`);let n=f===0?B.map(b=>`Public holiday: ${b.name}`):[];if(n.some(b=>/[^\x20-\x7e]/.test(b)))throw new Error(`Cannot generate PDF: holiday for ${x} contains unsupported characters; only printable ASCII is supported.`);let o=[];for(let b of[...n,y.task]){let D="";for(let S of b){if(i.widthOfString(D+S)>d[2]-p*2){if(!D)throw new Error(`Cannot generate PDF: task for ${x} cannot fit in the task column.`);o.push(D),D=""}D+=S}(D||!o.length)&&o.push(D)}let m=be(y),v=!!y.timeIn!=!!y.timeOut,g=new Date(`${x}T00:00:00Z`).getUTCDay()%6===0;w.push({values:[ce(x),vt(x),y.task,y.timeIn,y.timeOut,m===void 0?v?"INCOMPLETE":"":z(m),f===0?s:""],taskLines:o,fill:v?"#fff2cc":g?"#eeeeee":"#ffffff"})}if(x===a)break}let N=`Total hours: ${z(E)}     Days logged: ${$.size}`,P=`Generated ${ce(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,k=["Date","Day","Task","Time In","Time Out","Entry duration","Daily total"],R=`Reporting period: ${ce(e.periodStart)} to ${ce(a)}`,re=h+T,ie=22+h;if(i.font("Helvetica-Bold").fontSize(7.5),k.some((x,F)=>i.widthOfString(x)>d[F]-p*2))throw new Error("Cannot generate PDF: a column heading does not fit.");i.font("Helvetica").fontSize(7.5);for(let x of w)if(x.values.some((F,B)=>B!==2&&i.widthOfString(F)>d[B]-p*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(i.widthOfString(P)>u)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(i.font("Helvetica-Bold").fontSize(9),i.widthOfString(N)>u)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(i.font("Helvetica").fontSize(9),i.widthOfString(R)>u)throw new Error("Cannot generate PDF: period does not fit on the page.");let H=i.page.margins.left,I=0,ae=!1,ve=(x,F,B,j=!1)=>{let U=h+T,L=H;i.rect(L,I,u,U).fill(B);for(let s=0;s<x.length;s++){let f=d[s];i.rect(L,I,f,U).lineWidth(.35).stroke("#999999"),i.font(j?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),i.text(s===2?F[0]:x[s],L+p,I+T/2,{lineBreak:!1}),L+=f}I+=U},_=()=>{ae?i.addPage():ae=!0,I=i.page.margins.top,i.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",H,I,{lineBreak:!1}),I+=20,i.font("Helvetica").fontSize(9).fillColor("#333333").text(R,H,I,{lineBreak:!1}),I+=16,ve(k,[k[2]],"#dddddd",!0)};_();let G=()=>i.page.height-i.page.margins.bottom,X=()=>Math.max(1,Math.floor((G()-I-T)/h));for(let x of w){let F=0,B=!0;for(;F<x.taskLines.length;){let j=Math.min(x.taskLines.length-F,X());if(I+j*h+T>G()){_();continue}let U=x.taskLines.slice(F,F+j),L=B?x.values:[x.values[0],x.values[1],"","","","",""],s=H,f=j*h+T;i.rect(s,I,u,f).fill(x.fill);for(let y=0;y<L.length;y++){let n=d[y];i.rect(s,I,n,f).lineWidth(.35).stroke("#999999"),i.font("Helvetica").fontSize(7.5).fillColor("#222222"),(y===2?U:[L[y]]).forEach((o,m)=>{i.text(o,s+p,I+T/2+m*h,{lineBreak:!1})}),s+=n}I+=f,F+=j,B=!1,F<x.taskLines.length&&_()}}I+ie>G()&&_(),I+=8,i.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(N,H,I,{lineBreak:!1}),I+=14,i.font("Helvetica").fontSize(7.5).fillColor("#555555").text(P,H,I,{lineBreak:!1}),i.end()})}var Le=require("node:perf_hooks");function pe(e){return{total:Object.values(e.fileTimes).reduce((t,r)=>t+r,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function bt(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),r=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof r!="function"||Function.prototype.toString.call(r)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let a=Object.create(null);for(let[i,c]of Object.entries(e)){if(!i||typeof c!="number"||!Number.isFinite(c)||c<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(i)}: expected a non-negative finite duration.`);a[i]=c}return{...a}}var ue=class{constructor(t,r,a=()=>Le.performance.now(),i=[]){this.persistFileTimes=r;this.now=a;Object.assign(this.fileTimes,bt(t)),this.excludedFiles=new Set(i)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let r=this.now();return this.accrueTime(r),this.activeFile=t||void 0,this.startedAt=this.isTracking()?r:void 0,this.persist()}setPaused(t){let r=this.now();return this.accrueTime(r),this.paused=t,this.startedAt=this.isTracking()?r:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let r=this.now();return this.accrueTime(r),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?r:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},r)}catch(i){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(c){throw new Error(`File time reset failed: ${String(i)}; recovery write failed: ${String(c)}. Retry saving file times.`)}throw i}this.subtractBaseline(this.fileTimes,t);for(let i of this.pendingSnapshots)i!==t&&this.subtractBaseline(i,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[r,a]of Object.entries(t))a===0&&!(r===this.activeFile&&this.isTracking())&&delete t[r];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,r){for(let[a,i]of Object.entries(r))if(Object.hasOwn(t,a)){let c=t[a]-i;c>0?t[a]=c:delete t[a]}}persist(){let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(()=>this.persistFileTimes({...t},r)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}};var me=J(require("vscode")),qe=require("node:crypto"),Ue=J(require("node:path"));function je(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(r=>String(r).padStart(2,"0")).join(":")}var fe=class{constructor(t,r){this.snapshot=t;this.toggleTracking=r}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=me.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:me.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let r=t.webview.onDidReceiveMessage(async i=>{if(!(!i||typeof i!="object"||!("type"in i)))switch(i.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),a=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{r.dispose(),a.dispose(),this.panel=void 0}),t.webview.html=wt()}update(){if(!this.panel)return;let t=this.snapshot(),r=pe(t);this.panel.webview.postMessage({type:"timer",totalTime:je(r.total),currentTime:je(r.current),currentFile:t.activeFile?Ue.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function wt(){let e=(0,qe.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
</html>`}var Z=require("node:crypto");var ze=J(require("node:path")),Ve=J(require("pdfkit"));var Je="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function We(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function Te(e,t=new Date){let r=Object.entries(e).map(([d,p])=>{if(!d||!Number.isFinite(p)||p<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:ze.basename(d),milliseconds:p,percent:0}}).sort((d,p)=>p.milliseconds-d.milliseconds||d.name.localeCompare(p.name)),a=r.reduce((d,p)=>d+p.milliseconds,0);if(!Number.isFinite(a))throw new Error("The total tracked time is too large to export.");let i=new Map;for(let d of r)i.set(d.name,(i.get(d.name)??0)+1);let c=new Map,u=new Set(r.map(d=>d.name));for(let d of r){d.percent=a>0?d.milliseconds/a*100:0;let p=d.name;if(i.get(p)>1){let h=c.get(p)??0;do d.name=`${p} (${++h})`;while(u.has(d.name));c.set(p,h),u.add(d.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:a,files:r}}function Tt(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ye(e){return z(Math.floor(e/6e4))}function xe(e,t){let r=e.files.map(a=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${Tt(a.name)}</span>
<span class="file-time">${ye(a.milliseconds)} <small>${a.percent.toFixed(1)}%</small></span></div>
<div class="track" aria-hidden="true"><div class="bar" style="width:${a.percent}%"></div></div></li>`).join("");return`<!DOCTYPE html>
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
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${We(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${ye(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${r||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${Je}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function Ye(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,r)=>{let a=new Ve.default({size:"A4",margin:44,compress:!0}),i=[];a.on("data",h=>i.push(h)),a.on("error",r),a.on("end",()=>t(Buffer.concat(i)));let c=a.page.width-88,u=0,d=()=>{a.rect(0,0,a.page.width,a.page.height).fill(a.linearGradient(0,0,a.page.width,a.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),a.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),a.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${We(e)}`,44,110),a.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${ye(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),u=190},p=()=>{a.addPage(),d()};d();for(let h of e.files){a.font("Helvetica").fontSize(11);let T=a.heightOfString(h.name,{width:c}),w=T+44;u+w>a.page.height-130&&p(),a.fillColor("#ffffff").font("Helvetica").fontSize(11).text(h.name,44,u,{width:c}),u+=T+6,a.fillColor("#ffe1a6").fontSize(10).text(`${ye(h.milliseconds)}  /  ${h.percent.toFixed(1)}%`,44,u),u+=18,a.roundedRect(44,u,c,6,3).fill("#45665d"),h.percent>0&&a.rect(44,u,c*h.percent/100,6).fill(a.linearGradient(44,u,44+c,u).stop(0,"#7edcbb").stop(1,"#ffcc7d")),u+=20}e.files.length||(a.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,u),u+=32),u+90>a.page.height-44&&p(),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(Je,44,u+12,{width:c}),a.end()})}var W=require("node:fs"),_e=require("node:crypto"),Ke=J(require("node:path"));function Qe(e){(0,W.mkdirSync)(e,{recursive:!0});let t=Ke.join(e,"time-tracker.owner.lock"),r=JSON.stringify({pid:process.pid,token:(0,_e.randomBytes)(16).toString("hex")});try{(0,W.writeFileSync)(t,r,{flag:"wx"})}catch(a){throw a.code==="EEXIST"?new Error(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${t}, then reopen VS Code.`):a}return()=>{if((0,W.readFileSync)(t,"utf8")!==r)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,W.unlinkSync)(t)}}var xt="time-tracker.data",kt="timesheet.json",Ze="time-tracker.file-times",ke="time-tracker.file-activity",Ge="excludedFiles",Et="2026-10-21",et="time-tracker-timesheet",tt=1,K=5*1024*1024,Q,Y,rt=Promise.resolve(),Se,Ie;function it(){return(0,Z.randomBytes)(16).toString("hex")}function St(e){return(0,Z.createHash)("sha256").update(JSON.stringify([e.date,e.task,e.timeIn,e.timeOut])).digest("hex").slice(0,32)}function De(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function Fe(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},r=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[d,p]of Object.entries(e.entries)){let h=!Array.isArray(p),T=h?[p]:p;t[d]=T.map(w=>{if(!w||typeof w!="object"||typeof w.date!="string"||typeof w.task!="string"||typeof w.timeIn!="string"||typeof w.timeOut!="string"||w.date!==d||te(w))throw new Error(`The saved entry for ${d} is invalid. Restore or repair the JSON file before continuing.`);let E=w.id===void 0&&h?it():w.id;if(!De(E))throw new Error(`The saved entry for ${d} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(r.has(E))throw new Error(`The saved entry for ${d} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return r.add(E),{...w,id:E}}),t[d].length||delete t[d]}}let a=e.periodStart===void 0?Et:e.periodStart;if(typeof a!="string"||!M(a))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");let i=e.periodEnd;if(i===void 0)try{i=le(a)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}if(typeof i!="string"||!M(i)||i<a)throw new Error("The saved period end is invalid. Restore or repair the JSON file before continuing.");let c=e.hourlyRate===void 0?null:e.hourlyRate;if(c!==null&&(typeof c!="number"||!Number.isFinite(c)||c<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");let u=e.holidays===void 0?[]:e.holidays;if(!Array.isArray(u)||u.some(d=>!d||typeof d!="object"||ge(d)||d.name!==d.name.trim())||new Set(u.map(d=>JSON.stringify([d.date,d.name]))).size!==u.length)throw new Error("The saved public holidays are invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:a,periodEnd:i,hourlyRate:c,holidays:u}}function Oe(e){return Object.fromEntries(Object.entries(e).map(([t,r])=>[t,r.map(a=>({id:a.id,date:a.date,task:a.task,timeIn:a.timeIn,timeOut:a.timeOut}))]))}function Pe(e){return e.map(t=>({date:t.date,name:t.name}))}function It(e,t){return e.id===t.id&&e.date===t.date&&e.task===t.task&&e.timeIn===t.timeIn&&e.timeOut===t.timeOut}function at(e,t=new Date){return{kind:et,schemaVersion:tt,exportedAt:t.toISOString(),entries:Oe(e.entries),holidays:Pe(e.holidays)}}function nt(e){if(Buffer.byteLength(e,"utf8")>K)throw new Error(`The timesheet file is too large. The limit is ${K} bytes.`);let t;try{t=JSON.parse(e)}catch{throw new Error("The selected timesheet file is not valid JSON.")}if(!t||typeof t!="object"||Array.isArray(t))throw new Error("The selected file is not a Time Tracker timesheet export.");let r=t,a=new Set(["kind","schemaVersion","exportedAt","entries","holidays"]);if(Object.keys(r).some(u=>!a.has(u)))throw new Error("The selected timesheet export contains unsupported fields.");if(r.kind!==et||r.schemaVersion!==tt)throw new Error("The selected file uses an unsupported Time Tracker timesheet format.");let i=typeof r.exportedAt=="string"?new Date(r.exportedAt):void 0;if(!i||!Number.isFinite(i.getTime())||i.toISOString()!==r.exportedAt)throw new Error("The selected timesheet export has an invalid export timestamp.");if(!r.entries||typeof r.entries!="object"||Array.isArray(r.entries)||Object.values(r.entries).some(u=>!Array.isArray(u)))throw new Error("The selected timesheet export has invalid entries.");if(!Array.isArray(r.holidays))throw new Error("The selected timesheet export has invalid holidays.");let c=Fe({entries:r.entries,holidays:r.holidays});return{entries:Oe(c.entries),holidays:Pe(c.holidays)}}function Ce(e,t){let r=new Map(Object.values(e.entries).flat().map(p=>[p.id,p])),a=Oe(e.entries),i=0;for(let[p,h]of Object.entries(t.entries))for(let T of h){let w=r.get(T.id);if(w){if(!It(w,T))throw new Error(`Imported entry ${T.id} conflicts with a local entry. Import was not applied.`);continue}a[p]=[...a[p]??[],{...T}],r.set(T.id,T),i++}let c=new Set(e.holidays.map(p=>JSON.stringify([p.date,p.name]))),u=Pe(e.holidays),d=0;for(let p of t.holidays){let h=JSON.stringify([p.date,p.name]);c.has(h)||(c.add(h),u.push({...p}),d++)}return{state:i||d?{...e,entries:a,holidays:u}:e,addedEntries:i,addedHolidays:d}}function he(e){return A.join(e.globalStorageUri.fsPath,kt)}async function ot(e,t){let r=he(e);await(0,C.mkdir)(A.dirname(r),{recursive:!0});let a=`${r}.${process.pid}.${(0,Z.randomBytes)(8).toString("hex")}.tmp`,i=await(0,C.open)(a,"wx");try{await i.writeFile(JSON.stringify(t,null,2),"utf8"),await i.close(),await(0,C.rename)(a,r)}catch(c){try{await i.close(),await(0,C.unlink)(a)}catch(u){let d=c instanceof Error?c.message:String(c),p=u instanceof Error?u.message:String(u);throw new AggregateError([c,u],`Could not save the timesheet: ${d}. Temporary file cleanup failed: ${p}`)}throw c}}async function Dt(e){try{let r=await(0,C.readFile)(he(e),"utf8");return Fe(JSON.parse(r))}catch(r){if(r.code!=="ENOENT")throw r}let t=Fe(e.globalState.get(xt));return await ot(e,t),t}async function Ee(e,t,r,a){let i=l.workspace.workspaceFolders?.[0]?.uri??l.Uri.file((0,Xe.homedir)()),c=await l.window.showSaveDialog({defaultUri:l.Uri.joinPath(i,e),filters:{[t==="html"?"HTML documents":t==="json"?"JSON documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!c)return;let u=A.extname(c.fsPath).toLowerCase()===`.${t}`?c.fsPath:`${c.fsPath}.${t}`;if(a){let d=A.resolve(u),p=A.resolve(a);if(process.platform==="win32"?d.toLowerCase()===p.toLowerCase():d===p)throw new Error("Choose a different file; the active timesheet store cannot be overwritten by an export.")}return await(0,C.writeFile)(u,await r()),u}function Ft(e){let t=[],r=(s,f=!1)=>{let y=()=>{(async()=>{try{if(await l.window.showErrorMessage(s,...f?["Export raw data"]:[])!=="Export raw data")return;let m=await l.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!m)return;let v={fileActivity:e.globalState.get(ke),fileTimes:e.globalState.get(Ze),excludedFiles:e.globalState.get(Ge),legacyFileTimers:e.globalState.get("fileTimers")};await(0,C.writeFile)(m.fsPath,JSON.stringify(v,null,2),"utf8"),l.window.showInformationMessage(`Raw file activity data saved to ${m.fsPath}.`)}catch(o){let m=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not export raw file activity data: ${m}`)}})()},n=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);n.text="$(debug-pause) Time Tracker unavailable",n.tooltip=s,n.command="time-tracker.openTimesheet",n.show(),e.subscriptions.push(n,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.exportTimesheet","time-tracker.importTimesheet"].map(o=>l.commands.registerCommand(o,y))),y()};try{Y=Qe(e.globalStorageUri.fsPath);let s=e.globalState.get(ke),f=e.globalState.get(Ze),y=e.globalState.get(Ge);if(s!==void 0){if(!s||typeof s!="object"||Array.isArray(s)||!("version"in s)||s.version!==1||!("fileTimes"in s)||s.fileTimes===void 0||!("excludedFiles"in s)||s.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");f=s.fileTimes,y=s.excludedFiles}if(y!==void 0){if(!Array.isArray(y)||y.some(n=>typeof n!="string"||!n))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(y)]}Q=new ue(f,async(n,o)=>e.globalState.update(ke,{version:1,fileTimes:n,excludedFiles:[...o]}),void 0,t),e.globalState.get("fileTimers")!==void 0&&l.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(s){let f=s instanceof Error?s.message:String(s),y=!!Y;if(Y)try{Y()}catch(n){let o=n instanceof Error?n.message:String(n);r(`${f} Could not release storage ownership: ${o}`);return}finally{Y=void 0}r(f,y);return}let a=new Set,i=!1,c=Q,u=()=>{let s=c.snapshot();return{...s,excluded:!!s.activeFile&&c.isExcluded(s.activeFile)}},d,p,h=Promise.resolve(),T=new Map,w=async()=>{if(d)return d;p||(p=Dt(e),Se=p);try{return d=await p,d}finally{p=void 0,Se=void 0}},E=s=>{if(i)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let f=h.then(async()=>{let y=await w(),n=s(y);if(n!==y){await ot(e,n),d=n;for(let o of a)await o.webview.postMessage({type:"saved",data:{...n,...u()}})}});return h=f.then(()=>{},()=>{}),rt=h,f},$=l.commands.registerCommand("time-tracker.exportTimesheet",async()=>{try{await h;let s=await w(),f=at(s),y=await Ee(`time-tracker-timesheet-${f.exportedAt.slice(0,10)}.json`,"json",()=>Buffer.from(`${JSON.stringify(f,null,2)}
`,"utf8"),he(e));y&&l.window.showInformationMessage(`Timesheet data saved to ${y}`)}catch(s){let f=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not export timesheet data: ${f}`)}}),N=l.commands.registerCommand("time-tracker.importTimesheet",async()=>{try{let s=await l.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Time Tracker timesheet":["json"],"All files":["*"]},openLabel:"Import timesheet data"});if(!s?.length)return;let f=await(0,C.open)(s[0].fsPath,"r"),y;try{let g=await f.stat();if(!g.isFile())throw new Error("Select a regular JSON file.");if(g.size>K)throw new Error(`The timesheet file is too large. The limit is ${K} bytes.`);y=await f.readFile({encoding:"utf8"})}finally{await f.close()}let n=nt(y);await h;let o=Ce(await w(),n);if(await l.window.showWarningMessage(`Import ${o.addedEntries} new entries and ${o.addedHolidays} new holidays? Existing timesheet entries and preferences will be kept.`,{modal:!0},"Import")!=="Import")return;let v;await E(g=>(v=Ce(g,n),v.state)),l.window.showInformationMessage(`Timesheet import complete: ${v.addedEntries} entries and ${v.addedHolidays} holidays added.`)}catch(s){let f=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not import timesheet data: ${f}`)}}),P=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);P.command="time-tracker.openTimesheet",P.text="$(watch) 0h 00m | 0h 00m",P.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,P.show();let k=s=>{let f=s instanceof Error?s.message:String(s);l.window.showErrorMessage(`Could not save automatic file time data: ${f}`)},R=()=>{let s=u(),f=pe(s),y=z(Math.floor(f.total/6e4)),n=z(Math.floor(f.current/6e4)),o=s.activeFile?`Current file (${A.basename(s.activeFile)})`:"Current file";P.text=`${s.paused?"$(debug-pause)":"$(watch)"} ${y} | ${n}`+(s.excluded?" Excluded":s.activeFile?"":" Waiting"),P.tooltip=`Total tracked: ${y}
${o}: ${n}
${s.paused?`Automatic tracking paused
`:s.excluded?`Current file excluded
`:""}Click to open Time Tracker`,H.update();for(let m of a)m.webview.postMessage({type:"fileTimes",data:s})},re=async s=>{R();try{await s}catch(f){k(f)}R()},ie=()=>i?Promise.resolve():re(c.setPaused(!c.snapshot().paused)),H=new fe(u,ie),I=l.commands.registerCommand("time-tracker.showFloatingTimer",()=>H.show()),ae=l.commands.registerCommand("time-tracker.hideFloatingTimer",()=>H.hide()),ve=l.commands.registerCommand("time-tracker.toggleTracking",ie),_=l.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(i){l.window.showErrorMessage("Time Tracker is shutting down.");return}let s=l.window.activeTextEditor,f=s?.document.uri.scheme==="file"?s.document.uri.fsPath:void 0,y=f?[f,...t.filter(v=>v!==f)]:t;if(!y.length){l.window.showInformationMessage("No local file is active and no files are excluded.");return}let n=await l.window.showQuickPick(y.map(v=>({label:`${c.isExcluded(v)?"Include":"Exclude"} ${A.basename(v)}`,description:v,file:v})),{placeHolder:"Choose a local file to exclude or include"});if(!n)return;let o=new Set(t);o.has(n.file)?o.delete(n.file):o.add(n.file),t=[...o];let m=c.setExcludedFiles(t);R();try{await m,l.window.showInformationMessage(`${A.basename(n.file)} is ${c.isExcluded(n.file)?"excluded":"included"}.`)}catch(v){k(v)}R()}),G=l.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(i){l.window.showErrorMessage("Time Tracker is shutting down.");return}if(await l.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await c.reset(),R(),l.window.showInformationMessage("Automatic file activity was reset.")}catch(f){k(f),R()}}),X=()=>{if(i)return;let s=l.window.activeTextEditor,f=l.window.state.focused&&s?.document.uri.scheme==="file"?s.document.uri.fsPath:void 0;re(c.setActiveFile(f))};X();let x=l.window.onDidChangeActiveTextEditor(X),F=l.window.onDidChangeWindowState(X),B=setInterval(()=>{i||re(c.checkpoint())},6e4),j=setInterval(R,1e3);Ie=()=>{i=!0,clearInterval(B),clearInterval(j)};let U=l.commands.registerCommand("time-tracker.openTimeCard",()=>{let s;try{s=Te(Q?.snapshot().fileTimes??{})}catch(o){let m=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not generate the time card: ${m}`);return}let f=l.window.createWebviewPanel("timeTrackerCard","Time Card Preview",l.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),y=()=>{f.webview.html=xe(s,{nonce:(0,Z.randomBytes)(16).toString("hex")})};y();let n=f.webview.onDidReceiveMessage(async o=>{try{if(o.type==="refresh")s=Te(Q?.snapshot().fileTimes??{}),y();else if(o.type==="export"){if(o.format!=="html"&&o.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let m=o.format,v=s,g=`time-card-${v.generatedAt.slice(0,10)}.${m}`,b=await Ee(g,m,()=>m==="html"?Buffer.from(xe(v),"utf8"):Ye(v));b&&l.window.showInformationMessage(`Time card saved to ${b}`)}}catch(m){let v=m instanceof Error?m.message:String(m);l.window.showErrorMessage(`Could not generate or export the time card: ${v}`)}});f.onDidDispose(()=>n.dispose())}),L=l.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(i){l.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let s=l.window.createWebviewPanel("timeTracker","Time Tracker",l.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});try{await w()}catch(n){s.dispose();let o=n instanceof Error?n.message:String(n);l.window.showErrorMessage(`Could not load ${he(e)}: ${o}`);return}a.add(s),s.onDidDispose(()=>a.delete(s)),s.webview.html=Ae(s.webview);let f=async()=>{await s.webview.postMessage({type:"state",data:{...await w(),...u()}})};function y(n,o){if(!n||!o||n.id!==o.id||n.date!==o.date||n.task!==o.task||n.timeIn!==o.timeIn||n.timeOut!==o.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}s.webview.onDidReceiveMessage(async n=>{if(!n||typeof n!="object"||typeof n.type!="string"){l.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(n.type){case"showFloatingTimer":H.show();break;case"openTimeCard":await l.commands.executeCommand("time-tracker.openTimeCard");break;case"importOutlookCalendar":{let o=await l.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Outlook Calendar":["ics"],"All files":["*"]},openLabel:"Import Outlook Calendar"});if(!o?.length)break;let m=await(0,C.open)(o[0].fsPath,"r"),v;try{let O=await m.stat();if(!O.isFile())throw new Error("Select a regular Outlook calendar .ics file.");if(O.size>K)throw new Error(`The calendar file is too large. The limit is ${K} bytes.`);v=await m.readFile({encoding:"utf8"})}finally{await m.close()}let g=$e(v);if(!g.length)throw new Error("No timed or all-day calendar entries found in this Outlook .ics file.");await h;let b=await w(),D=new Set(Object.values(b.entries).flat().map(O=>JSON.stringify([O.date,O.task,O.timeIn,O.timeOut]))),S=g.filter(O=>!D.has(JSON.stringify([O.date,O.task,O.timeIn,O.timeOut])));if(!S.length){l.window.showInformationMessage("Outlook Calendar import complete: 0 entries added.");break}if(await l.window.showWarningMessage(`Import ${S.length} calendar ${S.length===1?"entry":"entries"}?`,{modal:!0},"Import")!=="Import")break;let q=0;await E(O=>{let ne={...O.entries};for(let V of S){let st=JSON.stringify([V.date,V.task,V.timeIn,V.timeOut]);if(Object.values(ne).flat().some(oe=>JSON.stringify([oe.date,oe.task,oe.timeIn,oe.timeOut])===st))continue;let dt={...V,id:St(V)};ne[V.date]=[...ne[V.date]??[],dt],q++}return q?{...O,entries:ne}:O}),l.window.showInformationMessage(`Outlook Calendar import complete: ${q} entries added.`);break}case"ready":await f();break;case"addHoliday":case"deleteHoliday":{let o=n.holiday;if(!o||typeof o!="object"||ge(o))throw new Error("Enter a valid holiday date and name.");let m={date:o.date,name:o.name.trim()};await E(v=>{let g=v.holidays.some(b=>b.date===m.date&&b.name===m.name);if(n.type==="addHoliday"&&g)throw new Error("This holiday already exists on that date.");if(n.type==="deleteHoliday"&&!g)throw new Error("This holiday was removed in another view.");return{...v,holidays:n.type==="addHoliday"?[...v.holidays,m]:v.holidays.filter(b=>b.date!==m.date||b.name!==m.name)}}),n.type==="addHoliday"&&await s.webview.postMessage({type:"holidayAdded",holiday:m});break}case"createEntry":case"saveEntry":{let o=n.entry;if(!o||typeof o.date!="string"||typeof o.task!="string"||typeof o.timeIn!="string"||typeof o.timeOut!="string"||!M(o.date))throw new Error("Enter a valid date, task, and time values.");let m=!o.task.trim()&&!o.timeIn&&!o.timeOut,v=m&&n.type==="saveEntry"?void 0:te(o);if(v)throw new Error(v);if(n.type==="createEntry"){if(typeof n.requestId!="string"||!n.requestId||n.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let g={...o,id:it(),task:o.task.trim()},b=T.get(n.requestId);if(b){if(!(b.entry.date===g.date&&b.entry.task===g.task&&b.entry.timeIn===g.timeIn&&b.entry.timeOut===g.timeOut))throw new Error("The create-entry request is invalid.");await b.operation,await s.webview.postMessage({type:"entryCreated",requestId:n.requestId,entry:b.entry});break}let D=E(S=>({...S,entries:{...S.entries,[o.date]:[...S.entries[o.date]??[],g]}}));T.set(n.requestId,{entry:g,operation:D});try{await D}catch(S){throw T.delete(n.requestId),S}await s.webview.postMessage({type:"entryCreated",requestId:n.requestId,entry:g});break}if(!De(n.id))throw new Error("Select a saved entry before editing it.");await E(g=>{let b=g.entries[o.date]??[],D=b.findIndex(q=>q.id===n.id),S=b[D];y(S,n.expected);let ee={...g.entries};if(m){let q=b.filter(O=>O.id!==n.id);q.length?ee[o.date]=q:delete ee[o.date]}else{let q=[...b];q[D]={...o,id:S.id,task:o.task.trim()},ee[o.date]=q}return{...g,entries:ee}});break}case"deleteEntry":if(!n.date||!M(n.date)||!De(n.id))throw new Error("Select a valid entry to delete.");await E(o=>{let m=n.date,v=o.entries[m]??[],g=v.find(S=>S.id===n.id);y(g,n.expected);let b={...o.entries},D=v.filter(S=>S.id!==n.id);return D.length?b[m]=D:delete b[m],{...o,entries:b}});break;case"setPeriod":if(typeof n.periodStart!="string"||!M(n.periodStart))throw new Error("Enter a valid period start date.");if(typeof n.periodEnd!="string"||!M(n.periodEnd))throw new Error("Enter a valid period end date.");if(n.periodEnd<n.periodStart)throw new Error("Period end must be on or after period start.");await E(o=>{if(o.periodStart!==n.expectedStart||o.periodEnd!==n.expectedEnd)throw new Error("The reporting period changed in another view. Reload it before editing again.");return{...o,periodStart:n.periodStart,periodEnd:n.periodEnd}});break;case"setHourlyRate":{if(typeof n.value!="string"||n.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(n.value))throw new Error("Enter a valid hourly rate of zero or more.");let o=n.value===""?null:Number(n.value);if(o!==null&&(!Number.isFinite(o)||o<0))throw new Error("Enter a valid hourly rate of zero or more.");await E(m=>{if(m.hourlyRate!==n.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...m,hourlyRate:o}});break}case"requestReportAction":{await h;let o=await w(),m=await l.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(m?.value==="print"){try{let v=await we(o),g=A.join(e.globalStorageUri.fsPath,"print-reports");await(0,C.mkdir)(g,{recursive:!0});let b=await(0,C.mkdtemp)(A.join(g,"report-")),D=`timesheet-${o.periodStart}-to-${o.periodEnd}.pdf`,S=A.join(b,D);if(await(0,C.writeFile)(S,v),!await l.env.openExternal(l.Uri.file(S)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");l.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(v){let g=v instanceof Error?v.message:String(v);l.window.showErrorMessage(`Could not open the report for printing: ${g}`)}break}if(m?.value==="pdf"){let v=`timesheet-${o.periodStart}-to-${o.periodEnd}.pdf`;try{let g=await Ee(v,"pdf",()=>we(o));g&&l.window.showInformationMessage(`PDF saved to ${g}`)}catch(g){let b=g instanceof Error?g.message:String(g);l.window.showErrorMessage(`Could not save the PDF: ${b}`)}}break}}}catch(o){let m=o instanceof Error?o.message:String(o);await s.webview.postMessage({type:"error",operation:n.type,id:n.id,requestId:n.requestId,view:n.view??(n.type==="setPeriod"||n.type==="setHourlyRate"?"report":"entries"),message:m})}})});e.subscriptions.push(L,U,I,ae,ve,_,G,$,N,H,P,x,F,{dispose:()=>clearInterval(B)},{dispose:()=>clearInterval(j)})}async function Ct(){Ie?.();try{let t=(await Promise.allSettled([Q?.setActiveFile(void 0),rt,Se])).find(r=>r.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{Q=void 0,Ie=void 0,Y?.(),Y=void 0}}0&&(module.exports={activate,createTimesheetTransfer,deactivate,mergeTimesheetTransfer,parseTimesheetTransfer});
