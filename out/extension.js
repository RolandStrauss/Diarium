"use strict";var rr=Object.create;var Ce=Object.defineProperty;var ir=Object.getOwnPropertyDescriptor;var ar=Object.getOwnPropertyNames;var nr=Object.getPrototypeOf,or=Object.prototype.hasOwnProperty;var sr=(e,t)=>{for(var r in t)Ce(e,r,{get:t[r],enumerable:!0})},ct=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ar(t))!or.call(e,i)&&i!==r&&Ce(e,i,{get:()=>t[i],enumerable:!(a=ir(t,i))||a.enumerable});return e};var ae=(e,t,r)=>(r=e!=null?rr(nr(e)):{},ct(t||!e||!e.__esModule?Ce(r,"default",{value:e,enumerable:!0}):r,e)),dr=e=>ct(Ce({},"__esModule",{value:!0}),e);var Pr={};sr(Pr,{activate:()=>Fr,createTimesheetTransfer:()=>Ut,deactivate:()=>Or,mergeTimesheetTransfer:()=>rt,parseTimesheetTransfer:()=>qt});module.exports=dr(Pr);var s=ae(require("vscode")),Bt=require("node:fs"),O=require("node:fs/promises"),it=require("node:os"),R=ae(require("node:path"));function cr(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function lt(e){let t=cr();return`<!DOCTYPE html>
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
<label class="task">Activity<input id="add-task" type="text" maxlength="240" required aria-label="Activity description" aria-describedby="entries-error"></label>
<label>Time In<input id="add-in" type="time" step="60" aria-label="Time In" aria-describedby="entries-error"></label>
<label>Time Out<input id="add-out" type="time" step="60" aria-label="Time Out" aria-describedby="entries-error"></label>
<button id="add-submit" class="primary" type="submit">Add entry</button>
</form>
<div class="filters">
<label>Filter by date<input id="filter-date" type="date" aria-label="Filter by date" aria-describedby="entries-error"></label>
<label>Filter by activity<input id="filter-task" type="search" placeholder="Search activities" aria-label="Filter by activity description"></label>
<button id="clear-filters" type="button">Clear filters</button>
</div>
<div class="totals" aria-live="polite">
<div class="metric"><strong id="entry-total">0h 00m</strong><span>filtered hours</span></div>
<div class="metric"><strong id="entry-count">0</strong><span>completed entries</span></div>
<span id="row-count" class="subtle"></span>
</div>
<div id="entries-error" class="error" role="alert" aria-live="assertive"></div>
<div class="table-wrap"><table aria-label="Daily time entries">
<thead><tr><th scope="col">Date</th><th scope="col">Activity</th><th scope="col">Time In</th><th scope="col">Time Out</th><th scope="col">Entry duration</th><th scope="col">Daily total</th><th scope="col">Action</th></tr></thead>
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
<thead><tr><th scope="col">Date</th><th scope="col">Day</th><th scope="col">Activity</th><th scope="col">Time In</th><th scope="col">Time Out</th><th scope="col">Entry duration</th><th scope="col">Daily total</th></tr></thead>
<tbody id="report-body"></tbody>
</table></div>
<div id="print-summary" class="totals" aria-live="polite"></div>
</section>
<section id="maintenance-view" class="view" role="tabpanel" aria-labelledby="maintenance-tab" hidden>
<div class="toolbar"><div><h2>Maintenance</h2><p class="subtle">Manage portable timesheet data and automatic file activity. Existing confirmation and validation still apply.</p></div></div>
<div class="maintenance-grid">
<section class="maintenance-card" aria-labelledby="maintenance-timesheet-heading">
<h2 id="maintenance-timesheet-heading">Timesheet data</h2>
<p>Import or export manual entries and public holidays. Export files contain activity and holiday text; review them before sharing.</p>
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
 else if ((!allowBlank || entry.timeIn || entry.timeOut) && !entry.task.trim()) { field = fields.task; message = 'Enter an activity description.'; }
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
    '<td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="entries-error" aria-label="Activity for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + (drafts[key]?.pending || drafts[key]?.deleting ? ' disabled' : '') + '></td>' +
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
		rows.push('<tr data-date="' + date + '" data-id="' + esc(original.id || '') + '" data-expected="' + esc(JSON.stringify(savedEntry)) + '" class="' + (incomplete ? 'incomplete ' : '') + (weekday === 0 || weekday === 6 ? 'weekend' : '') + '"><td class="date">' + esc(date) + '</td><td>' + esc(new Intl.DateTimeFormat(undefined, { weekday: 'long', timeZone: 'UTC' }).format(dateObj(date))) + '</td><td class="task">' + (index === 0 ? holidayLabels(date) : '') + '<input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="report-error" aria-label="Activity for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + disabled + '> ' + (drafts[key]?.deleting ? '<span class="screen-only">Deletion pending</span> ' : '') + '<button type="button" class="screen-only" data-action="save" aria-label="Save draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + (drafts[key]?.pending ? ' disabled' : '') + '>Save</button> <button type="button" class="screen-only" data-action="discard" aria-label="Discard draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + (drafts[key]?.pending ? ' disabled' : '') + '>Discard</button><span class="print-task"></span></td><td><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-describedby="report-error" aria-label="Time In for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + disabled + '><span class="print-time">' + esc(entry.timeIn) + '</span></td><td><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-describedby="report-error" aria-label="Time Out for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"' + disabled + '><span class="print-time">' + esc(entry.timeOut) + '</span></td><td class="duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td><td class="duration">' + (index === 0 ? dailyTotal : '') + '</td></tr>');
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
</html>`}function Ue(e){if(!j(e.date))return"Enter a valid holiday date.";if(typeof e.name!="string"||!e.name.trim()||e.name.length>240||/[\x00-\x1f\x7f]/.test(e.name))return"Enter a holiday name of up to 240 characters without control characters."}function j(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,r,a]=e.split("-").map(Number),i=new Date(`${e}T00:00:00Z`);return i.getUTCFullYear()===t&&i.getUTCMonth()===r-1&&i.getUTCDate()===a}function Ae(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function qe(e){if(!Ae(e.timeIn)||!Ae(e.timeOut))return;let[t,r]=e.timeIn.split(":").map(Number),[a,i]=e.timeOut.split(":").map(Number),d=t*60+r,p=a*60+i;return p<d&&(p+=1440),p-d}function ut(e){return[...e].sort((t,r)=>t.timeIn?r.timeIn?t.timeIn.localeCompare(r.timeIn):-1:r.timeIn?1:0)}function pt(e){if(typeof e!="string"||!e.trim())throw new Error("The Outlook calendar file is empty.");let t=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),r=[];for(let l of t)/^[ \t]/.test(l)&&r.length?r[r.length-1]+=l.slice(1):r.push(l);function a(l){let f=l.indexOf(":");if(f<0)return{name:"",params:"",value:""};let y=l.slice(0,f).split(";");return{name:(y.shift()??"").toUpperCase(),params:y.join(";").toUpperCase(),value:l.slice(f+1)}}function i(l){return l.replace(/\\([nN])/g,`
`).replace(/\\,/g,",").replace(/\\;/g,";").replace(/\\\\/g,"\\").trim()}function d(l,f){let c=f.includes("VALUE=DATE")||/^\d{8}$/.test(l),y,x,I,N=0,C=0;if(c){let E=/^(\d{4})(\d{2})(\d{2})$/.exec(l);if(!E)return;y=E[1]?Number(E[1]):0,x=Number(E[2]),I=Number(E[3])}else{let E=/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?Z?$/.exec(l);if(!E)return;if(y=Number(E[1]),x=Number(E[2]),I=Number(E[3]),N=Number(E[4]),C=Number(E[5]),l.endsWith("Z")){let q=new Date(Date.UTC(y,x-1,I,N,C));y=q.getFullYear(),x=q.getMonth()+1,I=q.getDate(),N=q.getHours(),C=q.getMinutes()}}let B=`${String(y).padStart(4,"0")}-${String(x).padStart(2,"0")}-${String(I).padStart(2,"0")}`;if(j(B))return{date:B,time:c?"":`${String(N).padStart(2,"0")}:${String(C).padStart(2,"0")}`,allDay:c}}let p=[];for(let l=0;l<r.length;l++){if(r[l].toUpperCase()!=="BEGIN:VEVENT")continue;let f=[];for(l++;l<r.length&&r[l].toUpperCase()!=="END:VEVENT";l++)f.push(r[l]);let c=f.map(a);if(c.some(E=>E.name==="STATUS"&&E.value.trim().toUpperCase()==="CANCELLED"))continue;let y=c.find(E=>E.name==="SUMMARY"),x=c.find(E=>E.name==="DTSTART");if(!x)continue;let I=d(x.value.trim(),x.params);if(!I)continue;let N=c.find(E=>E.name==="DTEND"),C=N?d(N.value.trim(),N.params):void 0,B=y?i(y.value):"Untitled calendar event";B&&(I.allDay?p.push({date:I.date,task:B,timeIn:"",timeOut:""}):C&&!C.allDay&&p.push({date:I.date,task:B,timeIn:I.time,timeOut:C.time}))}return p}function mt(e,t){if(!j(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),ft(r)}function ft(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function Fe(e){if(!j(e))throw new RangeError("Enter a valid period start date.");let[t,r,a]=e.split("-").map(Number),i=new Date(`${e}T00:00:00Z`);i.setUTCDate(1),i.setUTCFullYear(t,r+1,0);let d=i.getUTCDate();return i.setUTCDate(Math.min(a,d)-1),ft(i)}function ve(e){if(!j(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter an activity description.";if(typeof e.timeIn!="string"||e.timeIn&&!Ae(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!Ae(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function G(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var yt=ae(require("pdfkit"));function Oe(e){let[t,r,a]=e.split("-").map(Number),i=new Date(0);return i.setUTCFullYear(t,r-1,a),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(i)}function lr(e){let t=new Date(`${e}T00:00:00Z`),r=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${r} (Weekend)`:r}function ur(e,t){return ut(e[t]??[])}function ze(e){return new Promise((t,r)=>{if(!j(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let a;try{a=e.periodEnd===void 0?Fe(e.periodStart):e.periodEnd}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!j(a)||a<e.periodStart)throw new Error("Cannot generate PDF: invalid period end or period end precedes period start.");let i=new yt.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),d=[];i.on("data",w=>d.push(w)),i.on("error",r),i.on("end",()=>t(Buffer.concat(d)));let p=i.page.width-i.page.margins.left-i.page.margins.right,l=[70,70,p-70-70-48-48-60-70,48,48,60,70],f=3;i.font("Helvetica").fontSize(7.5);let c=i.currentLineHeight(!0),y=2,x=[],I=0,N=new Set;for(let w=e.periodStart;;w=mt(w,1)){let D=ur(e.entries,w),z=(e.holidays??[]).filter(F=>F.date===w),W=D.length?D:[{date:w,task:"",timeIn:"",timeOut:""}],$=D.map(qe).filter(F=>F!==void 0),Y=$.reduce((F,A)=>F+A,0),H=G(Y);$.length&&(N.add(w),I+=Y);for(let[F,A]of W.entries()){if(D.length){let U=ve(A);if(A.date!==w||U)throw new Error(`Cannot generate PDF: invalid entry for ${w}. ${U??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(A.task))throw new Error(`Cannot generate PDF: activity for ${w} contains unsupported characters; only printable ASCII is supported.`);let _=F===0?z.map(U=>`Public holiday: ${U.name}`):[];if(_.some(U=>/[^\x20-\x7e]/.test(U)))throw new Error(`Cannot generate PDF: holiday for ${w} contains unsupported characters; only printable ASCII is supported.`);let Q=[];for(let U of[..._,A.task]){let X="";for(let Ie of U){if(i.widthOfString(X+Ie)>l[2]-f*2){if(!X)throw new Error(`Cannot generate PDF: activity for ${w} cannot fit in the activity column.`);Q.push(X),X=""}X+=Ie}(X||!Q.length)&&Q.push(X)}let V=qe(A),ue=!!A.timeIn!=!!A.timeOut,Ee=new Date(`${w}T00:00:00Z`).getUTCDay()%6===0;x.push({values:[Oe(w),lr(w),A.task,A.timeIn,A.timeOut,V===void 0?ue?"INCOMPLETE":"":G(V),F===0?H:""],taskLines:Q,fill:ue?"#fff2cc":Ee?"#eeeeee":"#ffffff"})}if(w===a)break}let C=`Total hours: ${G(I)}     Days logged: ${N.size}`,B=`Generated ${Oe(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,E=["Date","Day","Activity","Time In","Time Out","Entry duration","Daily total"],q=`Reporting period: ${Oe(e.periodStart)} to ${Oe(a)}`,je=c+y,oe=22+c;if(i.font("Helvetica-Bold").fontSize(7.5),E.some((w,D)=>i.widthOfString(w)>l[D]-f*2))throw new Error("Cannot generate PDF: a column heading does not fit.");i.font("Helvetica").fontSize(7.5);for(let w of x)if(w.values.some((D,z)=>z!==2&&i.widthOfString(D)>l[z]-f*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(i.widthOfString(B)>p)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(i.font("Helvetica-Bold").fontSize(9),i.widthOfString(C)>p)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(i.font("Helvetica").fontSize(9),i.widthOfString(q)>p)throw new Error("Cannot generate PDF: period does not fit on the page.");let K=i.page.margins.left,P=0,xe=!1,Te=(w,D,z,W=!1)=>{let $=c+y,Y=K;i.rect(Y,P,p,$).fill(z);for(let H=0;H<w.length;H++){let F=l[H];i.rect(Y,P,F,$).lineWidth(.35).stroke("#999999"),i.font(W?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),i.text(H===2?D[0]:w[H],Y+f,P+y/2,{lineBreak:!1}),Y+=F}P+=$},ge=()=>{xe?i.addPage():xe=!0,P=i.page.margins.top,i.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",K,P,{lineBreak:!1}),P+=20,i.font("Helvetica").fontSize(9).fillColor("#333333").text(q,K,P,{lineBreak:!1}),P+=16,Te(E,[E[2]],"#dddddd",!0)};ge();let te=()=>i.page.height-i.page.margins.bottom,se=()=>Math.max(1,Math.floor((te()-P-y)/c));for(let w of x){let D=0,z=!0;for(;D<w.taskLines.length;){let W=Math.min(w.taskLines.length-D,se());if(P+W*c+y>te()){ge();continue}let $=w.taskLines.slice(D,D+W),Y=z?w.values:[w.values[0],w.values[1],"","","","",""],H=K,F=W*c+y;i.rect(H,P,p,F).fill(w.fill);for(let A=0;A<Y.length;A++){let _=l[A];i.rect(H,P,_,F).lineWidth(.35).stroke("#999999"),i.font("Helvetica").fontSize(7.5).fillColor("#222222"),(A===2?$:[Y[A]]).forEach((Q,V)=>{i.text(Q,H+f,P+y/2+V*c,{lineBreak:!1})}),H+=_}P+=F,D+=W,z=!1,D<w.taskLines.length&&ge()}}P+oe>te()&&ge(),P+=8,i.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(C,K,P,{lineBreak:!1}),P+=14,i.font("Helvetica").fontSize(7.5).fillColor("#555555").text(B,K,P,{lineBreak:!1}),i.end()})}var gt=require("node:perf_hooks");function Re(e){return{total:Object.values(e.fileTimes).reduce((t,r)=>t+r,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function pr(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),r=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof r!="function"||Function.prototype.toString.call(r)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let a=Object.create(null);for(let[i,d]of Object.entries(e)){if(!i||typeof d!="number"||!Number.isFinite(d)||d<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(i)}: expected a non-negative finite duration.`);a[i]=d}return{...a}}var Pe=class{constructor(t,r,a=()=>gt.performance.now(),i=[]){this.persistFileTimes=r;this.now=a;Object.assign(this.fileTimes,pr(t)),this.excludedFiles=new Set(i)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let r=this.now();return this.accrueTime(r),this.activeFile=t||void 0,this.startedAt=this.isTracking()?r:void 0,this.persist()}setPaused(t){let r=this.now();return this.accrueTime(r),this.paused=t,this.startedAt=this.isTracking()?r:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let r=this.now();return this.accrueTime(r),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?r:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},r)}catch(i){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(d){throw new Error(`File time reset failed: ${String(i)}; recovery write failed: ${String(d)}. Retry saving file times.`)}throw i}this.subtractBaseline(this.fileTimes,t);for(let i of this.pendingSnapshots)i!==t&&this.subtractBaseline(i,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[r,a]of Object.entries(t))a===0&&!(r===this.activeFile&&this.isTracking())&&delete t[r];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,r){for(let[a,i]of Object.entries(r))if(Object.hasOwn(t,a)){let d=t[a]-i;d>0?t[a]=d:delete t[a]}}persist(){let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(()=>this.persistFileTimes({...t},r)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}};var Ne=ae(require("vscode")),vt=require("node:crypto"),bt=ae(require("node:path"));function ht(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(r=>String(r).padStart(2,"0")).join(":")}var Me=class{constructor(t,r){this.snapshot=t;this.toggleTracking=r}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=Ne.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:Ne.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let r=t.webview.onDidReceiveMessage(async i=>{if(!(!i||typeof i!="object"||!("type"in i)))switch(i.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),a=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{r.dispose(),a.dispose(),this.panel=void 0}),t.webview.html=mr()}update(){if(!this.panel)return;let t=this.snapshot(),r=Re(t);this.panel.webview.postMessage({type:"timer",totalTime:ht(r.total),currentTime:ht(r.current),currentFile:t.activeFile?bt.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function mr(){let e=(0,vt.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
</html>`}var ye=require("node:crypto");var wt=ae(require("node:path")),kt=ae(require("pdfkit"));var xt="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function Tt(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function Ve(e,t=new Date){let r=Object.entries(e).map(([l,f])=>{if(!l||!Number.isFinite(f)||f<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:wt.basename(l),milliseconds:f,percent:0}}).sort((l,f)=>f.milliseconds-l.milliseconds||l.name.localeCompare(f.name)),a=r.reduce((l,f)=>l+f.milliseconds,0);if(!Number.isFinite(a))throw new Error("The total tracked time is too large to export.");let i=new Map;for(let l of r)i.set(l.name,(i.get(l.name)??0)+1);let d=new Map,p=new Set(r.map(l=>l.name));for(let l of r){l.percent=a>0?l.milliseconds/a*100:0;let f=l.name;if(i.get(f)>1){let c=d.get(f)??0;do l.name=`${f} (${++c})`;while(p.has(l.name));d.set(f,c),p.add(l.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:a,files:r}}function fr(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function $e(e){return G(Math.floor(e/6e4))}function Ye(e,t){let r=e.files.map(a=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${fr(a.name)}</span>
<span class="file-time">${$e(a.milliseconds)} <small>${a.percent.toFixed(1)}%</small></span></div>
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
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${Tt(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${$e(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${r||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${xt}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function Et(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,r)=>{let a=new kt.default({size:"A4",margin:44,compress:!0}),i=[];a.on("data",c=>i.push(c)),a.on("error",r),a.on("end",()=>t(Buffer.concat(i)));let d=a.page.width-88,p=0,l=()=>{a.rect(0,0,a.page.width,a.page.height).fill(a.linearGradient(0,0,a.page.width,a.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),a.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),a.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${Tt(e)}`,44,110),a.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${$e(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),p=190},f=()=>{a.addPage(),l()};l();for(let c of e.files){a.font("Helvetica").fontSize(11);let y=a.heightOfString(c.name,{width:d}),x=y+44;p+x>a.page.height-130&&f(),a.fillColor("#ffffff").font("Helvetica").fontSize(11).text(c.name,44,p,{width:d}),p+=y+6,a.fillColor("#ffe1a6").fontSize(10).text(`${$e(c.milliseconds)}  /  ${c.percent.toFixed(1)}%`,44,p),p+=18,a.roundedRect(44,p,d,6,3).fill("#45665d"),c.percent>0&&a.rect(44,p,d*c.percent/100,6).fill(a.linearGradient(44,p,44+d,p).stop(0,"#7edcbb").stop(1,"#ffcc7d")),p+=20}e.files.length||(a.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,p),p+=32),p+90>a.page.height-44&&f(),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(xt,44,p+12,{width:d}),a.end()})}var ne=require("node:fs"),It=require("node:crypto"),St=ae(require("node:path")),be=class extends Error{constructor(r){super(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${r}, then reopen VS Code.`);this.lockFile=r}lockFile};function Dt(e){(0,ne.mkdirSync)(e,{recursive:!0});let t=St.join(e,"time-tracker.owner.lock"),r=JSON.stringify({pid:process.pid,token:(0,It.randomBytes)(16).toString("hex")});try{(0,ne.writeFileSync)(t,r,{flag:"wx"})}catch(a){throw a.code==="EEXIST"?new be(t):a}return()=>{if((0,ne.readFileSync)(t,"utf8")!==r)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,ne.unlinkSync)(t)}}var pe=require("node:crypto");function Z(e){if(!e||typeof e!="object"||Array.isArray(e))return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function yr(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;let[t,r,a]=e.split("-").map(Number),i=new Date(t,r-1,a);return i.getFullYear()===t&&i.getMonth()===r-1&&i.getDate()===a}function de(e){return typeof e=="string"&&/^\d{4}-\d{2}-\d{2}T/.test(e)&&Number.isFinite(Date.parse(e))}function gr(e){return(0,pe.createHash)("sha256").update(`${e.repositoryId}\0${e.name}`).digest("hex").slice(0,32)}function Ct(e,t,r){let a=e.trim()||"Unnamed task",i=t.trim()||"Unknown",d=r.trim()||"Unknown";return{taskKey:(0,pe.createHash)("sha256").update(JSON.stringify([a,i,d])).digest("hex").slice(0,32),name:a,source:i,type:d}}function At(e,t){let r=e.trim()||"Unknown",a=t.trim()||"Unnamed session";return{debugKey:(0,pe.createHash)("sha256").update(JSON.stringify([r,a])).digest("hex").slice(0,32),type:r,name:a}}function Ft(e,t){let r=t.find(a=>a.languageIds.includes(e));return r?{extensionId:r.extensionId,displayName:r.builtIn?"Built-in":r.displayName}:{extensionId:"unknown",displayName:"Unknown"}}function hr(e){if(e===void 0)return{version:1,workspaces:Object.create(null),sessions:[]};if(!Z(e)||e.version!==1||!Z(e.workspaces)||!Array.isArray(e.sessions))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");let t=Object.create(null);for(let[a,i]of Object.entries(e.workspaces)){if(!/^[a-f0-9]{32}$/.test(a)||!Z(i)||typeof i.name!="string"||!i.name||typeof i.totalSeconds!="number"||!Number.isSafeInteger(i.totalSeconds)||i.totalSeconds<0||i.branches!==void 0&&!Z(i.branches)||i.extensions!==void 0&&!Z(i.extensions)||i.tasks!==void 0&&!Array.isArray(i.tasks)||i.debugSessions!==void 0&&!Array.isArray(i.debugSessions))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");let d=Object.create(null);for(let[c,y]of Object.entries(i.branches??{})){if(!Z(y)||typeof y.repositoryId!="string"||typeof y.name!="string"||!y.name||typeof y.totalSeconds!="number"||!Number.isSafeInteger(y.totalSeconds)||y.totalSeconds<0)throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");d[c]={repositoryId:y.repositoryId,name:y.name,totalSeconds:y.totalSeconds}}let p=Object.create(null);for(let[c,y]of Object.entries(i.extensions??{})){if(!Z(y)||typeof y.extensionId!="string"||!y.extensionId||typeof y.displayName!="string"||!y.displayName||typeof y.languageId!="string"||!y.languageId||typeof y.editCount!="number"||!Number.isSafeInteger(y.editCount)||y.editCount<0||typeof y.saveCount!="number"||!Number.isSafeInteger(y.saveCount)||y.saveCount<0||!de(y.lastSeenAt))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");p[c]={extensionId:y.extensionId,displayName:y.displayName,languageId:y.languageId,editCount:y.editCount,saveCount:y.saveCount,lastSeenAt:y.lastSeenAt}}let l=[];for(let c of i.tasks??[]){if(!Z(c)||typeof c.taskKey!="string"||!/^[a-f0-9]{32}$/.test(c.taskKey)||typeof c.name!="string"||!c.name||typeof c.source!="string"||!c.source||typeof c.type!="string"||!c.type||typeof c.startedAt!="string"||!de(c.startedAt)||typeof c.endedAt!="string"||!de(c.endedAt)||typeof c.seconds!="number"||!Number.isSafeInteger(c.seconds)||c.seconds<0||c.result!=="completed"&&c.result!=="failed"&&c.result!=="terminated"&&c.result!=="interrupted")throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");l.push({taskKey:c.taskKey,name:c.name,source:c.source,type:c.type,startedAt:c.startedAt,endedAt:c.endedAt,seconds:c.seconds,result:c.result})}let f=[];for(let c of i.debugSessions??[]){if(!Z(c)||typeof c.debugKey!="string"||!/^[a-f0-9]{32}$/.test(c.debugKey)||typeof c.type!="string"||!c.type||typeof c.name!="string"||!c.name||typeof c.startedAt!="string"||!de(c.startedAt)||typeof c.endedAt!="string"||!de(c.endedAt)||typeof c.seconds!="number"||!Number.isSafeInteger(c.seconds)||c.seconds<0||c.result!=="completed"&&c.result!=="interrupted")throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");f.push({debugKey:c.debugKey,type:c.type,name:c.name,startedAt:c.startedAt,endedAt:c.endedAt,seconds:c.seconds,result:c.result})}t[a]={name:i.name,totalSeconds:i.totalSeconds,branches:d,extensions:p,tasks:l,debugSessions:f}}let r=[];for(let a of e.sessions){if(!Z(a)||typeof a.workspaceId!="string"||!Object.hasOwn(t,a.workspaceId)||!yr(a.date)||typeof a.seconds!="number"||!Number.isSafeInteger(a.seconds)||a.seconds<0||!de(a.startedAt)||!de(a.endedAt))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");r.push({workspaceId:a.workspaceId,date:a.date,seconds:a.seconds,startedAt:a.startedAt,endedAt:a.endedAt})}return{version:1,workspaces:t,sessions:r}}function Ot(e,t){return{id:(0,pe.createHash)("sha256").update(e).digest("hex").slice(0,32),name:t.trim()||"Workspace"}}function Pt(e){return(0,pe.createHash)("sha256").update(e).digest("hex").slice(0,32)}function Rt(e){return e?.name?.trim()||(e?.commit?"Detached HEAD":"Unknown")}function Mt(e,t=Date.now()){let r=new Date(t),a=new Date(r.getFullYear(),r.getMonth(),r.getDate()-1),i=new Date(r.getFullYear(),r.getMonth(),r.getDate()-7),d=C=>`${C.getFullYear()}-${String(C.getMonth()+1).padStart(2,"0")}-${String(C.getDate()).padStart(2,"0")}`,p=d(a),l=d(i),f=d(r),c=C=>{let[B,E,q]=C.split("-").map(Number);return Date.UTC(B,E-1,q)},y=c(l),x=c(f),I=0,N=0;for(let C of e.sessions){C.date===p&&(I+=C.seconds);let B=c(C.date);B>=y&&B<x&&(N+=C.seconds)}return{yesterdaySeconds:I,sevenDaySeconds:N}}function vr(e,t){if(!Number.isSafeInteger(e)||!Number.isSafeInteger(t)||t<e)throw new Error("Invalid workspace interval.");let r=[],a=e;for(;a<t;){let i=new Date(a),d=new Date(i.getFullYear(),i.getMonth(),i.getDate()+1).getTime(),p=Math.min(t,d),l=Math.floor((p-a)/1e3);if(l>0){let f=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`;r.push({date:f,seconds:l,startedAt:new Date(a).toISOString(),endedAt:new Date(p).toISOString()})}a=p}return r}var Be=class{constructor(t,r,a=Date.now){this.persist=r;this.now=a;this.record=hr(t)}persist;now;record;enabled=!1;focused=!1;live;workspaceIdentity;branchIdentities=new Map;liveBranches=new Map;pendingWrites=Promise.resolve();snapshot(){return{version:1,workspaces:Object.fromEntries(Object.entries(this.record.workspaces).map(([t,r])=>[t,{name:r.name,totalSeconds:r.totalSeconds,branches:Object.fromEntries(Object.entries(r.branches??{}).map(([a,i])=>[a,{...i}])),extensions:Object.fromEntries(Object.entries(r.extensions??{}).map(([a,i])=>[a,{...i}])),tasks:(r.tasks??[]).map(a=>({...a})),debugSessions:(r.debugSessions??[]).map(a=>({...a}))}])),sessions:this.record.sessions.map(t=>({...t}))}}isEnabled(){return this.enabled}setEnabled(t){this.enabled!==t&&(this.enabled=t,t?this.startLive():this.settleAndPersist())}setFocused(t){this.focused!==t&&(this.focused=t,t?this.startLive():this.settleAndPersist())}setWorkspace(t){let r=this.now();this.settleAt(r),this.settleBranchesAt(r),this.live=void 0,this.liveBranches.clear(),this.workspaceIdentity=t,this.startLive(r),this.persistRecord()}checkpoint(){if(!this.live)return Promise.resolve();let t=this.now();return this.settleAt(t),this.settleBranchesAt(t),this.live=this.enabled&&this.focused&&this.workspaceIdentity?{identity:this.workspaceIdentity,startedAtMs:t}:void 0,this.liveBranches.clear(),this.startLiveBranches(t),this.persistRecord()}setBranches(t){let r=new Map;for(let d of t){let p=d.name.trim();d.repositoryId&&p&&r.set(d.repositoryId,{repositoryId:d.repositoryId,name:p})}if(!(r.size!==this.branchIdentities.size||[...r].some(([d,p])=>this.branchIdentities.get(d)?.name!==p.name)))return;let i=this.now();for(let[d,p]of this.liveBranches)r.get(d)?.name!==p.identity.name&&(this.settleBranchAt(p,i),this.liveBranches.delete(d));this.branchIdentities=r,this.startLiveBranches(i),this.persistRecord()}recordExtensionActivity(t,r,a=this.now()){if(!this.enabled||!this.workspaceIdentity)return;if(!t.extensionId||!t.displayName||!t.languageId||!Number.isFinite(a)||!Number.isFinite(new Date(a).getTime()))throw new Error("Invalid workspace extension activity.");let i=Object.hasOwn(this.record.workspaces,this.workspaceIdentity.id)?this.record.workspaces[this.workspaceIdentity.id]:{name:this.workspaceIdentity.name,totalSeconds:0,extensions:Object.create(null)};i.name=this.workspaceIdentity.name,i.extensions??=Object.create(null);let d=i.extensions[t.extensionId]??{extensionId:t.extensionId,displayName:t.displayName,languageId:t.languageId,editCount:0,saveCount:0,lastSeenAt:new Date(a).toISOString()};d.displayName=t.displayName,d.languageId=t.languageId,d.lastSeenAt=new Date(a).toISOString(),r==="edit"?d.editCount++:d.saveCount++,i.extensions[t.extensionId]=d,this.record.workspaces[this.workspaceIdentity.id]=i,this.persistRecord()}recordTaskExecution(t,r,a,i,d){if(!this.enabled)return;let p=new Date(a),l=new Date(i);if(!Number.isSafeInteger(a)||!Number.isSafeInteger(i)||i<a||!Number.isFinite(p.getTime())||!Number.isFinite(l.getTime()))throw new Error("Invalid workspace task activity.");let f=Object.hasOwn(this.record.workspaces,r.id)?this.record.workspaces[r.id]:{name:r.name,totalSeconds:0,tasks:[]};f.name=r.name,f.tasks??=[],f.tasks.push({...t,startedAt:p.toISOString(),endedAt:l.toISOString(),seconds:Math.floor((i-a)/1e3),result:d}),this.record.workspaces[r.id]=f,this.persistRecord()}recordDebugSession(t,r,a,i,d){if(!this.enabled)return;let p=new Date(a),l=new Date(i);if(!Number.isSafeInteger(a)||!Number.isSafeInteger(i)||i<a||!Number.isFinite(p.getTime())||!Number.isFinite(l.getTime()))throw new Error("Invalid workspace debug activity.");let f=Object.hasOwn(this.record.workspaces,r.id)?this.record.workspaces[r.id]:{name:r.name,totalSeconds:0,debugSessions:[]};f.name=r.name,f.debugSessions??=[],f.debugSessions.push({...t,startedAt:p.toISOString(),endedAt:l.toISOString(),seconds:Math.floor((i-a)/1e3),result:d}),this.record.workspaces[r.id]=f,this.persistRecord()}shutdown(){let t=this.now();return this.settleAt(t),this.settleBranchesAt(t),this.live=void 0,this.liveBranches.clear(),this.enabled=!1,this.focused=!1,this.persistRecord()}startLive(t=this.now()){!this.live&&this.enabled&&this.focused&&this.workspaceIdentity&&(this.live={identity:this.workspaceIdentity,startedAtMs:t}),this.startLiveBranches(t)}settleAndPersist(){let t=this.now();return this.settleAt(t),this.settleBranchesAt(t),this.live=void 0,this.liveBranches.clear(),this.persistRecord()}settleAt(t){if(!this.live)return;let r=this.live.identity;for(let a of vr(this.live.startedAtMs,t)){this.record.sessions.push({workspaceId:r.id,date:a.date,seconds:a.seconds,startedAt:a.startedAt,endedAt:a.endedAt});let i=Object.hasOwn(this.record.workspaces,r.id)?this.record.workspaces[r.id]:{name:r.name,totalSeconds:0,branches:Object.create(null)};i.name=r.name,i.branches??=Object.create(null),i.totalSeconds+=a.seconds,this.record.workspaces[r.id]=i}}startLiveBranches(t){if(!(!this.live||!this.enabled||!this.focused))for(let[r,a]of this.branchIdentities)this.liveBranches.has(r)||this.liveBranches.set(r,{identity:a,startedAtMs:t})}settleBranchesAt(t){for(let r of this.liveBranches.values())this.settleBranchAt(r,t)}settleBranchAt(t,r){if(!this.workspaceIdentity)return;let a=Math.floor(Math.max(0,r-t.startedAtMs)/1e3);if(!a)return;let i=Object.hasOwn(this.record.workspaces,this.workspaceIdentity.id)?this.record.workspaces[this.workspaceIdentity.id]:{name:this.workspaceIdentity.name,totalSeconds:0,branches:Object.create(null)};i.name=this.workspaceIdentity.name,i.branches??=Object.create(null);let d=gr(t.identity),p=i.branches[d]??{repositoryId:t.identity.repositoryId,name:t.identity.name,totalSeconds:0};p.totalSeconds+=a,i.branches[d]=p,this.record.workspaces[this.workspaceIdentity.id]=i}persistRecord(){let t=this.pendingWrites.then(async()=>{await this.persist(this.snapshot())});return this.pendingWrites=t.then(()=>{},()=>{}),t}};var br="time-tracker.data",wr="timesheet.json",Nt="time-tracker.file-times",Je="time-tracker.file-activity",$t="excludedFiles",Ke="time-tracker.workspace-activity",kr="2026-10-21",Wt="time-tracker-timesheet",Lt=1,me=5*1024*1024,xr=new Set(["time-tracker.importTimesheet","time-tracker.exportTimesheet","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.showFloatingTimer","time-tracker.openTimeCard"]),fe,le,jt=Promise.resolve(),Ge,Qe,S,ce=()=>{},ke,Ze,Xe;function Ht(){return(0,ye.randomBytes)(16).toString("hex")}function Tr(e){return(0,ye.createHash)("sha256").update(JSON.stringify([e.date,e.task,e.timeIn,e.timeOut])).digest("hex").slice(0,32)}function et(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function we(){let e=s.workspace?.workspaceFolders;if(!e?.length)return;let t=s.workspace.name?.trim(),r=t||e[0].name?.trim()||"Workspace",a=JSON.stringify([t??"",e.map(i=>i.uri.scheme==="file"?`file:${i.uri.fsPath}`:`${i.uri.scheme}:${i.uri.path}`)]);return Ot(a,r)}function Er(e){return Ct(e.name,e.source,e.definition.type)}function Ir(e){return At(e.type,e.name)}function tt(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},r=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[l,f]of Object.entries(e.entries)){let c=!Array.isArray(f),y=c?[f]:f;t[l]=y.map(x=>{if(!x||typeof x!="object"||typeof x.date!="string"||typeof x.task!="string"||typeof x.timeIn!="string"||typeof x.timeOut!="string"||x.date!==l||ve(x))throw new Error(`The saved entry for ${l} is invalid. Restore or repair the JSON file before continuing.`);let I=x.id===void 0&&c?Ht():x.id;if(!et(I))throw new Error(`The saved entry for ${l} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(r.has(I))throw new Error(`The saved entry for ${l} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return r.add(I),{...x,id:I}}),t[l].length||delete t[l]}}let a=e.periodStart===void 0?kr:e.periodStart;if(typeof a!="string"||!j(a))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");let i=e.periodEnd;if(i===void 0)try{i=Fe(a)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}if(typeof i!="string"||!j(i)||i<a)throw new Error("The saved period end is invalid. Restore or repair the JSON file before continuing.");let d=e.hourlyRate===void 0?null:e.hourlyRate;if(d!==null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");let p=e.holidays===void 0?[]:e.holidays;if(!Array.isArray(p)||p.some(l=>!l||typeof l!="object"||Ue(l)||l.name!==l.name.trim())||new Set(p.map(l=>JSON.stringify([l.date,l.name]))).size!==p.length)throw new Error("The saved public holidays are invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:a,periodEnd:i,hourlyRate:d,holidays:p}}function at(e){return Object.fromEntries(Object.entries(e).map(([t,r])=>[t,r.map(a=>({id:a.id,date:a.date,task:a.task,timeIn:a.timeIn,timeOut:a.timeOut}))]))}function nt(e){return e.map(t=>({date:t.date,name:t.name}))}function Sr(e,t){return e.id===t.id&&e.date===t.date&&e.task===t.task&&e.timeIn===t.timeIn&&e.timeOut===t.timeOut}function Ut(e,t=new Date){return{kind:Wt,schemaVersion:Lt,exportedAt:t.toISOString(),entries:at(e.entries),holidays:nt(e.holidays)}}function qt(e){if(Buffer.byteLength(e,"utf8")>me)throw new Error(`The timesheet file is too large. The limit is ${me} bytes.`);let t;try{t=JSON.parse(e)}catch{throw new Error("The selected timesheet file is not valid JSON.")}if(!t||typeof t!="object"||Array.isArray(t))throw new Error("The selected file is not a Time Tracker timesheet export.");let r=t,a=new Set(["kind","schemaVersion","exportedAt","entries","holidays"]);if(Object.keys(r).some(p=>!a.has(p)))throw new Error("The selected timesheet export contains unsupported fields.");if(r.kind!==Wt||r.schemaVersion!==Lt)throw new Error("The selected file uses an unsupported Time Tracker timesheet format.");let i=typeof r.exportedAt=="string"?new Date(r.exportedAt):void 0;if(!i||!Number.isFinite(i.getTime())||i.toISOString()!==r.exportedAt)throw new Error("The selected timesheet export has an invalid export timestamp.");if(!r.entries||typeof r.entries!="object"||Array.isArray(r.entries)||Object.values(r.entries).some(p=>!Array.isArray(p)))throw new Error("The selected timesheet export has invalid entries.");if(!Array.isArray(r.holidays))throw new Error("The selected timesheet export has invalid holidays.");let d=tt({entries:r.entries,holidays:r.holidays});return{entries:at(d.entries),holidays:nt(d.holidays)}}function rt(e,t){let r=new Map(Object.values(e.entries).flat().map(f=>[f.id,f])),a=at(e.entries),i=0;for(let[f,c]of Object.entries(t.entries))for(let y of c){let x=r.get(y.id);if(x){if(!Sr(x,y))throw new Error(`Imported entry ${y.id} conflicts with a local entry. Import was not applied.`);continue}a[f]=[...a[f]??[],{...y}],r.set(y.id,y),i++}let d=new Set(e.holidays.map(f=>JSON.stringify([f.date,f.name]))),p=nt(e.holidays),l=0;for(let f of t.holidays){let c=JSON.stringify([f.date,f.name]);d.has(c)||(d.add(c),p.push({...f}),l++)}return{state:i||l?{...e,entries:a,holidays:p}:e,addedEntries:i,addedHolidays:l}}function Le(e){return R.join(e.globalStorageUri.fsPath,wr)}async function zt(e,t){let r=Le(e);await(0,O.mkdir)(R.dirname(r),{recursive:!0});let a=`${r}.${process.pid}.${(0,ye.randomBytes)(8).toString("hex")}.tmp`,i=await(0,O.open)(a,"wx");try{await i.writeFile(JSON.stringify(t,null,2),"utf8"),await i.close(),await(0,O.rename)(a,r)}catch(d){try{await i.close(),await(0,O.unlink)(a)}catch(p){let l=d instanceof Error?d.message:String(d),f=p instanceof Error?p.message:String(p);throw new AggregateError([d,p],`Could not save the timesheet: ${l}. Temporary file cleanup failed: ${f}`)}throw d}}async function Dr(e){try{let r=await(0,O.readFile)(Le(e),"utf8");return tt(JSON.parse(r))}catch(r){if(r.code!=="ENOENT")throw r}let t=tt(e.globalState.get(br));return await zt(e,t),t}function Cr(e){return s.workspace.getConfiguration?.("diarium")?.get(e,"")?.trim()??""}function Ar(e){let t=s.workspace.workspaceFolders??[];if(R.isAbsolute(e))return{path:R.resolve(e),usedHostBase:!1};let r=t.length===1&&t[0].uri.scheme==="file"?t[0].uri.fsPath:(0,it.homedir)();return{path:R.resolve(r,e),usedHostBase:t.length!==1||t[0].uri.scheme!=="file"}}async function We(e){let t=Cr(e);if(!t)return;let r=Ar(t);r.usedHostBase&&s.window.showInformationMessage(`Relative ${e} has no single local workspace folder; using ${r.path}.`);try{if(!(await(0,O.stat)(r.path)).isDirectory())throw new Error("Configured path is not a directory.");return await(0,O.access)(r.path,Bt.constants.R_OK),r.path}catch{s.window.showWarningMessage(`Configured ${e} is unavailable at ${r.path}. Choose another folder or update the setting.`);return}}async function _e(e,t,r,a){let i=await We("exportDirectory"),d=i?s.Uri.file(i):s.workspace.workspaceFolders?.[0]?.uri??s.Uri.file((0,it.homedir)()),p=await s.window.showSaveDialog({defaultUri:s.Uri.joinPath(d,e),filters:{[t==="html"?"HTML documents":t==="json"?"JSON documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!p)return;let l=R.extname(p.fsPath).toLowerCase()===`.${t}`?p.fsPath:`${p.fsPath}.${t}`;if(a){let f=R.resolve(l),c=R.resolve(a);if(process.platform==="win32"?f.toLowerCase()===c.toLowerCase():f===c)throw new Error("Choose a different file; the active timesheet store cannot be overwritten by an export.")}return await(0,O.writeFile)(l,await r()),l}function Fr(e){let t=[],r=!1,a=(n,m=!1,g)=>{let h=()=>{(async()=>{try{if(g){let b=await s.window.showErrorMessage("Time Tracker is paused because another VS Code window may be using its storage.",{modal:!0,detail:"Close the other window, then reload this window. If VS Code crashed, see the recovery instructions."},"Reload Window","Recovery Instructions");b==="Reload Window"?await s.commands.executeCommand("workbench.action.reloadWindow"):b==="Recovery Instructions"&&await s.window.showErrorMessage("Recover Time Tracker after an unexpected shutdown",{modal:!0,detail:`Close all VS Code windows and ensure their extension hosts have stopped. Then remove only this lock file and reopen VS Code:

${g}`},"Copy Lock Path")==="Copy Lock Path"&&await s.env.clipboard.writeText(g);return}if(await s.window.showErrorMessage(n,...m?["Export raw data"]:[])!=="Export raw data")return;let v=await s.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!v)return;let T={fileActivity:e.globalState.get(Je),fileTimes:e.globalState.get(Nt),excludedFiles:e.globalState.get($t),workspaceActivity:e.globalState.get(Ke),legacyFileTimers:e.globalState.get("fileTimers")};await(0,O.writeFile)(v.fsPath,JSON.stringify(T,null,2),"utf8"),s.window.showInformationMessage(`Raw file activity data saved to ${v.fsPath}.`)}catch(u){let v=u instanceof Error?u.message:String(u);s.window.showErrorMessage(g?`Could not complete storage recovery: ${v}`:`Could not export raw file activity data: ${v}`)}})()},o=s.window.createStatusBarItem(s.StatusBarAlignment.Right,100);o.text="$(debug-pause) Time Tracker unavailable",o.tooltip=n,o.command="time-tracker.openTimesheet",o.show(),e.subscriptions.push(o,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.exportTimesheet","time-tracker.importTimesheet"].map(u=>s.commands.registerCommand(u,h))),h()};try{le=Dt(e.globalStorageUri.fsPath);let n=e.globalState.get(Je),m=e.globalState.get(Nt),g=e.globalState.get($t);if(n!==void 0){if(!n||typeof n!="object"||Array.isArray(n)||!("version"in n)||n.version!==1||!("fileTimes"in n)||n.fileTimes===void 0||!("excludedFiles"in n)||n.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");m=n.fileTimes,g=n.excludedFiles}if(g!==void 0){if(!Array.isArray(g)||g.some(o=>typeof o!="string"||!o))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(g)]}fe=new Pe(m,async(o,u)=>e.globalState.update(Je,{version:1,fileTimes:o,excludedFiles:[...u]}),void 0,t);try{S=new Be(e.globalState.get(Ke),async o=>e.globalState.update(Ke,o))}catch(o){S=void 0,r=!0;let u=o instanceof Error?o.message:String(o);s.window.showErrorMessage(u)}let h=s.workspace?.getConfiguration?.("diarium")?.get("workspaceActivity.enabled",!1)??!1;S&&(S.setEnabled(h),S.setWorkspace(we()),S.setFocused(s.window.state.focused)),e.globalState.get("fileTimers")!==void 0&&s.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(n){let m=n instanceof Error?n.message:String(n),g=!!le;if(le)try{le()}catch(h){let o=h instanceof Error?h.message:String(h);a(`${m} Could not release storage ownership: ${o}`);return}finally{le=void 0}a(m,g,n instanceof be?n.lockFile:void 0);return}let i=new Set,d=!1,p=fe,l=new Map,f=(n,m,g=Date.now())=>{let h=l.get(n);h&&(l.delete(n),S?.recordTaskExecution(h.identity,h.workspace,h.startedAtMs,g,m))},c=s.tasks?.onDidStartTask?.(n=>{if(d||!S?.isEnabled())return;let m=we();m&&l.set(n.execution,{identity:Er(n.execution.task),workspace:m,startedAtMs:Date.now()})})??{dispose:()=>{}},y=s.tasks?.onDidEndTask?.(n=>{f(n.execution,"completed")})??{dispose:()=>{}},x=s.tasks?.onDidEndTaskProcess?.(n=>{f(n.execution,n.exitCode===void 0?"terminated":n.exitCode===0?"completed":"failed")})??{dispose:()=>{}};Ze=()=>{for(let n of l.keys())f(n,"interrupted");l.clear()};let I=new Map,N=(n,m,g=Date.now())=>{let h=I.get(n);h&&(I.delete(n),S?.recordDebugSession(h.identity,h.workspace,h.startedAtMs,g,m))},C=s.debug?.onDidStartDebugSession?.(n=>{if(d||!S?.isEnabled())return;let m=we();m&&I.set(n.id,{identity:Ir(n),workspace:m,startedAtMs:Date.now()})})??{dispose:()=>{}},B=s.debug?.onDidTerminateDebugSession?.(n=>{N(n.id,"completed")})??{dispose:()=>{}};Xe=()=>{for(let n of I.keys())N(n,"interrupted");I.clear()};let E=(s.extensions?.all??[]).flatMap(n=>{let m=n.packageJSON,g=(m.contributes?.languages??[]).map(h=>h.id).filter(h=>!!h);return g.length?[{extensionId:n.id,displayName:m.displayName?.trim()||m.name?.trim()||n.id,languageIds:g,builtIn:m.isBuiltin===!0||n.id.startsWith("vscode.")}]:[]}),q=new Map,je=n=>{let m=q.get(n);if(m)return m;let g=Ft(n,E);return q.set(n,g),g},oe=new Map,K=new Map,P=s.workspace.onDidChangeTextDocument(n=>{if(d||!S?.isEnabled()||!s.workspace.getWorkspaceFolder(n.document.uri))return;let m=n.document.uri.toString(),g=oe.get(m);g&&clearTimeout(g),K.set(m,{document:n.document,languageId:n.document.languageId});let h=setTimeout(()=>{oe.delete(m);let o=K.get(m);if(K.delete(m),d||!S?.isEnabled()||!o||!s.workspace.getWorkspaceFolder(o.document.uri))return;let u=je(o.languageId);S?.recordExtensionActivity({...u,languageId:o.languageId||"unknown"},"edit")},500);oe.set(m,h)}),xe=s.workspace.onDidSaveTextDocument(n=>{if(d||!s.workspace.getWorkspaceFolder(n.uri))return;let m=n.languageId||"unknown",g=je(m);S?.recordExtensionActivity({...g,languageId:m},"save")}),Te={dispose:()=>{for(let n of oe.values())clearTimeout(n);oe.clear(),K.clear()}};(async()=>{let n=s.extensions?.getExtension("vscode.git");if(!n)return;let m=n.isActive?n.exports:await n.activate();if(d||!m)return;let g=m.getAPI(1),h=[],o=!1,u=()=>{if(o||d)return;for(let k of h)k.dispose();h=[];let b=[];for(let k of g.repositories)s.workspace.getWorkspaceFolder(k.rootUri)&&(b.push({repositoryId:Pt(k.rootUri.toString()),name:Rt(k.state?.HEAD)}),k.onDidChangeState&&h.push(k.onDidChangeState(u)));S?.setBranches(b)},v=g.onDidChangeState?.(u),T=()=>{if(!o){o=!0,v?.dispose();for(let b of h)b.dispose();h=[],ce===u&&(ce=()=>{}),ke===T&&(ke=void 0)}};ke=T,ce=u,u()})().catch(n=>{if(!d){let m=n instanceof Error?n.message:String(n);s.window.showWarningMessage(`Git branch activity is unavailable: ${m}`)}});let te=()=>{let n=p.snapshot();return{...n,excluded:!!n.activeFile&&p.isExcluded(n.activeFile)}},se,w,D=Promise.resolve(),z=new Map,W=async()=>{if(se)return se;w||(w=Dr(e),Ge=w);try{return se=await w,se}finally{w=void 0,Ge=void 0}},$=n=>{if(d)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let m=D.then(async()=>{let g=await W(),h=n(g);if(h!==g){await zt(e,h),se=h;for(let o of i)await o.webview.postMessage({type:"saved",data:{...h,...te()}})}});return D=m.then(()=>{},()=>{}),jt=D,m},Y=s.commands.registerCommand("time-tracker.exportTimesheet",async()=>{try{await D;let n=await W(),m=Ut(n),g=await _e(`time-tracker-timesheet-${m.exportedAt.slice(0,10)}.json`,"json",()=>Buffer.from(`${JSON.stringify(m,null,2)}
`,"utf8"),Le(e));g&&s.window.showInformationMessage(`Timesheet data saved to ${g}`)}catch(n){let m=n instanceof Error?n.message:String(n);s.window.showErrorMessage(`Could not export timesheet data: ${m}`)}}),H=s.commands.registerCommand("time-tracker.importTimesheet",async()=>{try{let n=await We("importDirectory"),m=await s.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Time Tracker timesheet":["json"],"All files":["*"]},openLabel:"Import timesheet data",...n?{defaultUri:s.Uri.file(n)}:{}});if(!m?.length)return;let g=await(0,O.open)(m[0].fsPath,"r"),h;try{let b=await g.stat();if(!b.isFile())throw new Error("Select a regular JSON file.");if(b.size>me)throw new Error(`The timesheet file is too large. The limit is ${me} bytes.`);h=await g.readFile({encoding:"utf8"})}finally{await g.close()}let o=qt(h);await D;let u=rt(await W(),o);if(await s.window.showWarningMessage(`Import ${u.addedEntries} new entries and ${u.addedHolidays} new holidays? Existing timesheet entries and preferences will be kept.`,{modal:!0},"Import")!=="Import")return;let T;await $(b=>(T=rt(b,o),T.state)),s.window.showInformationMessage(`Timesheet import complete: ${T.addedEntries} entries and ${T.addedHolidays} holidays added.`)}catch(n){let m=n instanceof Error?n.message:String(n);s.window.showErrorMessage(`Could not import timesheet data: ${m}`)}}),F=s.window.createStatusBarItem(s.StatusBarAlignment.Right,100);F.command="time-tracker.openTimesheet",F.text="$(watch) 0h 00m | 0h 00m",F.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,F.show();let A=r?"Usage unavailable":S?.isEnabled()?"":"Usage off",_=()=>{if(r||!S){A="Usage unavailable";return}if(!S.isEnabled()){A="Usage off";return}let n=Mt(S.snapshot()),m=G(Math.floor(n.yesterdaySeconds/60)),g=G(Math.floor(n.sevenDaySeconds/60));A=`Yesterday ${m} | 7d ${g}`};_();let Q=n=>{let m=n instanceof Error?n.message:String(n);s.window.showErrorMessage(`Could not save automatic file time data: ${m}`)},V=()=>{let n=te(),m=Re(n),g=G(Math.floor(m.total/6e4)),h=G(Math.floor(m.current/6e4)),o=n.activeFile?`Current file (${R.basename(n.activeFile)})`:"Current file";F.text=`${n.paused?"$(debug-pause)":"$(watch)"} ${g} | ${h}`+(n.excluded?" Excluded":n.activeFile?"":" Waiting")+(A?` | ${A}`:"");let u=r?"Workspace usage unavailable":S?.isEnabled()?`Workspace tracking on, ${s.window.state.focused?"focused":"unfocused"}`:"Workspace tracking off";F.tooltip=`Total tracked: ${g}
${o}: ${h}
${n.paused?`Automatic tracking paused
`:n.excluded?`Current file excluded
`:""}${u}
Click to open Time Tracker`,U.update();for(let v of i)v.webview.postMessage({type:"fileTimes",data:n})},ue=async n=>{V();try{await n}catch(m){Q(m)}V()},Ee=()=>d?Promise.resolve():ue(p.setPaused(!p.snapshot().paused)),U=new Me(te,Ee),X=s.commands.registerCommand("time-tracker.showFloatingTimer",()=>U.show()),Ie=s.commands.registerCommand("time-tracker.hideFloatingTimer",()=>U.hide()),Vt=s.commands.registerCommand("time-tracker.toggleTracking",Ee),Yt=s.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(d){s.window.showErrorMessage("Time Tracker is shutting down.");return}let n=s.window.activeTextEditor,m=n?.document.uri.scheme==="file"?n.document.uri.fsPath:void 0,g=m?[m,...t.filter(v=>v!==m)]:t;if(!g.length){s.window.showInformationMessage("No local file is active and no files are excluded.");return}let h=await s.window.showQuickPick(g.map(v=>({label:`${p.isExcluded(v)?"Include":"Exclude"} ${R.basename(v)}`,description:v,file:v})),{placeHolder:"Choose a local file to exclude or include"});if(!h)return;let o=new Set(t);o.has(h.file)?o.delete(h.file):o.add(h.file),t=[...o];let u=p.setExcludedFiles(t);V();try{await u,s.window.showInformationMessage(`${R.basename(h.file)} is ${p.isExcluded(h.file)?"excluded":"included"}.`)}catch(v){Q(v)}V()}),Jt=s.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(d){s.window.showErrorMessage("Time Tracker is shutting down.");return}if(await s.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await p.reset(),V(),s.window.showInformationMessage("Automatic file activity was reset.")}catch(m){Q(m),V()}}),He=()=>{if(d)return;let n=s.window.activeTextEditor,m=s.window.state.focused&&n?.document.uri.scheme==="file"?n.document.uri.fsPath:void 0;ue(p.setActiveFile(m))};He();let Kt=s.window.onDidChangeActiveTextEditor(He),_t=s.window.onDidChangeWindowState(()=>{He(),S?.setFocused(s.window.state.focused),_()}),Gt=s.workspace?.onDidChangeWorkspaceFolders?.(()=>{S?.setWorkspace(we()),ce(),_()})??{dispose:()=>{}},Qt=s.workspace?.onDidChangeConfiguration?.(n=>{if(!n.affectsConfiguration("diarium.workspaceActivity.enabled"))return;let m=s.workspace.getConfiguration("diarium").get("workspaceActivity.enabled",!1);S?.setEnabled(m),S?.setWorkspace(we()),S?.setFocused(s.window.state.focused),m||Te.dispose(),ce(),_()})??{dispose:()=>{}},ot=setInterval(()=>{d||ue(p.checkpoint())},6e4),st=setInterval(()=>{d||(ce(),S?.checkpoint()?.then(()=>{_(),V()}).catch(m=>{let g=m instanceof Error?m.message:String(m);s.window.showErrorMessage(`Could not save workspace activity: ${g}`)}))},6e4),dt=setInterval(V,1e3);Qe=()=>{d=!0,clearInterval(ot),clearInterval(st),clearInterval(dt)};let Zt=s.commands.registerCommand("time-tracker.openTimeCard",()=>{let n;try{n=Ve(fe?.snapshot().fileTimes??{})}catch(o){let u=o instanceof Error?o.message:String(o);s.window.showErrorMessage(`Could not generate the time card: ${u}`);return}let m=s.window.createWebviewPanel("timeTrackerCard","Time Card Preview",s.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),g=()=>{m.webview.html=Ye(n,{nonce:(0,ye.randomBytes)(16).toString("hex")})};g();let h=m.webview.onDidReceiveMessage(async o=>{try{if(o.type==="refresh")n=Ve(fe?.snapshot().fileTimes??{}),g();else if(o.type==="export"){if(o.format!=="html"&&o.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let u=o.format,v=n,T=`time-card-${v.generatedAt.slice(0,10)}.${u}`,b=await _e(T,u,()=>u==="html"?Buffer.from(Ye(v),"utf8"):Et(v));b&&s.window.showInformationMessage(`Time card saved to ${b}`)}}catch(u){let v=u instanceof Error?u.message:String(u);s.window.showErrorMessage(`Could not generate or export the time card: ${v}`)}});m.onDidDispose(()=>h.dispose())}),Xt=s.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(d){s.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let n=s.window.createWebviewPanel("timeTracker","Time Tracker",s.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),m=!1;try{await W()}catch(o){n.dispose();let u=o instanceof Error?o.message:String(o);s.window.showErrorMessage(`Could not load ${Le(e)}: ${u}`);return}i.add(n),n.onDidDispose(()=>i.delete(n)),n.webview.html=lt(n.webview);let g=async()=>{await n.webview.postMessage({type:"state",data:{...await W(),...te()}})};function h(o,u){if(!o||!u||o.id!==u.id||o.date!==u.date||o.task!==u.task||o.timeIn!==u.timeIn||o.timeOut!==u.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}n.webview.onDidReceiveMessage(async o=>{if(!o||typeof o!="object"||typeof o.type!="string"){s.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(o.type){case"maintenanceAction":if(typeof o.command!="string"||!xr.has(o.command))throw new Error("Choose a valid maintenance action.");if(d)throw new Error("Time Tracker is shutting down.");if(m)break;m=!0;try{await s.commands.executeCommand(o.command),await n.webview.postMessage({type:"maintenanceActionComplete"})}finally{m=!1}break;case"showFloatingTimer":U.show();break;case"openTimeCard":await s.commands.executeCommand("time-tracker.openTimeCard");break;case"importOutlookCalendar":{let u=await We("outlookImportDirectory")??await We("importDirectory"),v=await s.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Outlook Calendar":["ics"],"All files":["*"]},openLabel:"Import Outlook Calendar",...u?{defaultUri:s.Uri.file(u)}:{}});if(!v?.length){await n.webview.postMessage({type:"maintenanceActionComplete"});break}let T=await(0,O.open)(v[0].fsPath,"r"),b;try{let L=await T.stat();if(!L.isFile())throw new Error("Select a regular Outlook calendar .ics file.");if(L.size>me)throw new Error(`The calendar file is too large. The limit is ${me} bytes.`);b=await T.readFile({encoding:"utf8"})}finally{await T.close()}let k=pt(b);if(!k.length)throw new Error("No timed or all-day calendar entries found in this Outlook .ics file.");await D;let J=await W(),M=new Set(Object.values(J.entries).flat().map(L=>JSON.stringify([L.date,L.task,L.timeIn,L.timeOut]))),ee=k.filter(L=>!M.has(JSON.stringify([L.date,L.task,L.timeIn,L.timeOut])));if(!ee.length){s.window.showInformationMessage("Outlook Calendar import complete: 0 entries added."),await n.webview.postMessage({type:"maintenanceActionComplete"});break}if(await s.window.showWarningMessage(`Import ${ee.length} calendar ${ee.length===1?"entry":"entries"}?`,{modal:!0},"Import")!=="Import"){await n.webview.postMessage({type:"maintenanceActionComplete"});break}let he=0;await $(L=>{let Se={...L.entries};for(let ie of ee){let er=JSON.stringify([ie.date,ie.task,ie.timeIn,ie.timeOut]);if(Object.values(Se).flat().some(De=>JSON.stringify([De.date,De.task,De.timeIn,De.timeOut])===er))continue;let tr={...ie,id:Tr(ie)};Se[ie.date]=[...Se[ie.date]??[],tr],he++}return he?{...L,entries:Se}:L}),s.window.showInformationMessage(`Outlook Calendar import complete: ${he} entries added.`),await n.webview.postMessage({type:"maintenanceActionComplete"});break}case"ready":await g();break;case"addHoliday":case"deleteHoliday":{let u=o.holiday;if(!u||typeof u!="object"||Ue(u))throw new Error("Enter a valid holiday date and name.");let v={date:u.date,name:u.name.trim()};await $(T=>{let b=T.holidays.some(k=>k.date===v.date&&k.name===v.name);if(o.type==="addHoliday"&&b)throw new Error("This holiday already exists on that date.");if(o.type==="deleteHoliday"&&!b)throw new Error("This holiday was removed in another view.");return{...T,holidays:o.type==="addHoliday"?[...T.holidays,v]:T.holidays.filter(k=>k.date!==v.date||k.name!==v.name)}}),o.type==="addHoliday"&&await n.webview.postMessage({type:"holidayAdded",holiday:v});break}case"createEntry":case"saveEntry":{let u=o.entry;if(!u||typeof u.date!="string"||typeof u.task!="string"||typeof u.timeIn!="string"||typeof u.timeOut!="string"||!j(u.date))throw new Error("Enter a valid date, activity, and time values.");let v=!u.task.trim()&&!u.timeIn&&!u.timeOut,T=v&&o.type==="saveEntry"?void 0:ve(u);if(T)throw new Error(T);if(o.type==="createEntry"){if(typeof o.requestId!="string"||!o.requestId||o.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let b={...u,id:Ht(),task:u.task.trim()},k=z.get(o.requestId);if(k){if(!(k.entry.date===b.date&&k.entry.task===b.task&&k.entry.timeIn===b.timeIn&&k.entry.timeOut===b.timeOut))throw new Error("The create-entry request is invalid.");await k.operation,await n.webview.postMessage({type:"entryCreated",requestId:o.requestId,entry:k.entry});break}let J=$(M=>({...M,entries:{...M.entries,[u.date]:[...M.entries[u.date]??[],b]}}));z.set(o.requestId,{entry:b,operation:J});try{await J}catch(M){throw z.delete(o.requestId),M}await n.webview.postMessage({type:"entryCreated",requestId:o.requestId,entry:b});break}if(!et(o.id))throw new Error("Select a saved entry before editing it.");await $(b=>{let k=b.entries[u.date]??[],J=k.findIndex(re=>re.id===o.id),M=k[J];h(M,o.expected);let ee={...b.entries};if(v){let re=k.filter(he=>he.id!==o.id);re.length?ee[u.date]=re:delete ee[u.date]}else{let re=[...k];re[J]={...u,id:M.id,task:u.task.trim()},ee[u.date]=re}return{...b,entries:ee}});break}case"deleteEntry":if(!o.date||!j(o.date)||!et(o.id))throw new Error("Select a valid entry to delete.");await $(u=>{let v=o.date,T=u.entries[v]??[],b=T.find(M=>M.id===o.id);h(b,o.expected);let k={...u.entries},J=T.filter(M=>M.id!==o.id);return J.length?k[v]=J:delete k[v],{...u,entries:k}});break;case"setPeriod":if(typeof o.periodStart!="string"||!j(o.periodStart))throw new Error("Enter a valid period start date.");if(typeof o.periodEnd!="string"||!j(o.periodEnd))throw new Error("Enter a valid period end date.");if(o.periodEnd<o.periodStart)throw new Error("Period end must be on or after period start.");await $(u=>{if(u.periodStart!==o.expectedStart||u.periodEnd!==o.expectedEnd)throw new Error("The reporting period changed in another view. Reload it before editing again.");return{...u,periodStart:o.periodStart,periodEnd:o.periodEnd}});break;case"setHourlyRate":{if(typeof o.value!="string"||o.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(o.value))throw new Error("Enter a valid hourly rate of zero or more.");let u=o.value===""?null:Number(o.value);if(u!==null&&(!Number.isFinite(u)||u<0))throw new Error("Enter a valid hourly rate of zero or more.");await $(v=>{if(v.hourlyRate!==o.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...v,hourlyRate:u}});break}case"requestReportAction":{await D;let u=await W(),v=await s.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(v?.value==="print"){try{let T=await ze(u),b=R.join(e.globalStorageUri.fsPath,"print-reports");await(0,O.mkdir)(b,{recursive:!0});let k=await(0,O.mkdtemp)(R.join(b,"report-")),J=`timesheet-${u.periodStart}-to-${u.periodEnd}.pdf`,M=R.join(k,J);if(await(0,O.writeFile)(M,T),!await s.env.openExternal(s.Uri.file(M)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");s.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(T){let b=T instanceof Error?T.message:String(T);s.window.showErrorMessage(`Could not open the report for printing: ${b}`)}break}if(v?.value==="pdf"){let T=`timesheet-${u.periodStart}-to-${u.periodEnd}.pdf`;try{let b=await _e(T,"pdf",()=>ze(u));b&&s.window.showInformationMessage(`PDF saved to ${b}`)}catch(b){let k=b instanceof Error?b.message:String(b);s.window.showErrorMessage(`Could not save the PDF: ${k}`)}}break}}}catch(u){let v=u instanceof Error?u.message:String(u);if(o.type==="maintenanceAction"||o.type==="importOutlookCalendar"){await n.webview.postMessage({type:"maintenanceActionError",message:v});return}await n.webview.postMessage({type:"error",operation:o.type,id:o.id,requestId:o.requestId,view:o.view??(o.type==="setPeriod"||o.type==="setHourlyRate"?"report":"entries"),message:v})}})});e.subscriptions.push(Xt,Zt,X,Ie,Vt,Yt,Jt,Y,H,U,F,Kt,_t,Gt,Qt,P,xe,Te,c,y,x,C,B,{dispose:()=>clearInterval(ot)},{dispose:()=>clearInterval(st)},{dispose:()=>clearInterval(dt)})}async function Or(){Qe?.(),ke?.(),Ze?.(),Xe?.();try{let t=(await Promise.allSettled([fe?.setActiveFile(void 0),S?.shutdown(),jt,Ge])).find(r=>r.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{fe=void 0,S=void 0,Qe=void 0,ce=()=>{},ke=void 0,Ze=void 0,Xe=void 0,le?.(),le=void 0}}0&&(module.exports={activate,createTimesheetTransfer,deactivate,mergeTimesheetTransfer,parseTimesheetTransfer});
