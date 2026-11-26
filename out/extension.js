"use strict";var Ht=Object.create;var Ee=Object.defineProperty;var Wt=Object.getOwnPropertyDescriptor;var qt=Object.getOwnPropertyNames;var Ut=Object.getPrototypeOf,zt=Object.prototype.hasOwnProperty;var Vt=(e,t)=>{for(var r in t)Ee(e,r,{get:t[r],enumerable:!0})},rt=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of qt(t))!zt.call(e,i)&&i!==r&&Ee(e,i,{get:()=>t[i],enumerable:!(a=Wt(t,i))||a.enumerable});return e};var ie=(e,t,r)=>(r=e!=null?Ht(Ut(e)):{},rt(t||!e||!e.__esModule?Ee(r,"default",{value:e,enumerable:!0}):r,e)),Yt=e=>rt(Ee({},"__esModule",{value:!0}),e);var pr={};Vt(pr,{activate:()=>cr,createTimesheetTransfer:()=>Rt,deactivate:()=>ur,mergeTimesheetTransfer:()=>Qe,parseTimesheetTransfer:()=>Mt});module.exports=Yt(pr);var d=ie(require("vscode")),P=require("node:fs/promises"),Ct=require("node:os"),j=ie(require("node:path"));function Jt(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function it(e){let t=Jt();return`<!DOCTYPE html>
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
</html>`}function Be(e){if(!W(e.date))return"Enter a valid holiday date.";if(typeof e.name!="string"||!e.name.trim()||e.name.length>240||/[\x00-\x1f\x7f]/.test(e.name))return"Enter a holiday name of up to 240 characters without control characters."}function W(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,r,a]=e.split("-").map(Number),i=new Date(`${e}T00:00:00Z`);return i.getUTCFullYear()===t&&i.getUTCMonth()===r-1&&i.getUTCDate()===a}function Te(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function Le(e){if(!Te(e.timeIn)||!Te(e.timeOut))return;let[t,r]=e.timeIn.split(":").map(Number),[a,i]=e.timeOut.split(":").map(Number),s=t*60+r,p=a*60+i;return p<s&&(p+=1440),p-s}function at(e){return[...e].sort((t,r)=>t.timeIn?r.timeIn?t.timeIn.localeCompare(r.timeIn):-1:r.timeIn?1:0)}function nt(e){if(typeof e!="string"||!e.trim())throw new Error("The Outlook calendar file is empty.");let t=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),r=[];for(let u of t)/^[ \t]/.test(u)&&r.length?r[r.length-1]+=u.slice(1):r.push(u);function a(u){let c=u.indexOf(":");if(c<0)return{name:"",params:"",value:""};let b=u.slice(0,c).split(";");return{name:(b.shift()??"").toUpperCase(),params:b.join(";").toUpperCase(),value:u.slice(c+1)}}function i(u){return u.replace(/\\([nN])/g,`
`).replace(/\\,/g,",").replace(/\\;/g,";").replace(/\\\\/g,"\\").trim()}function s(u,c){let h=c.includes("VALUE=DATE")||/^\d{8}$/.test(u),b,k,D,$=0,S=0;if(h){let T=/^(\d{4})(\d{2})(\d{2})$/.exec(u);if(!T)return;b=T[1]?Number(T[1]):0,k=Number(T[2]),D=Number(T[3])}else{let T=/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?Z?$/.exec(u);if(!T)return;if(b=Number(T[1]),k=Number(T[2]),D=Number(T[3]),$=Number(T[4]),S=Number(T[5]),u.endsWith("Z")){let B=new Date(Date.UTC(b,k-1,D,$,S));b=B.getFullYear(),k=B.getMonth()+1,D=B.getDate(),$=B.getHours(),S=B.getMinutes()}}let H=`${String(b).padStart(4,"0")}-${String(k).padStart(2,"0")}-${String(D).padStart(2,"0")}`;if(W(H))return{date:H,time:h?"":`${String($).padStart(2,"0")}:${String(S).padStart(2,"0")}`,allDay:h}}let p=[];for(let u=0;u<r.length;u++){if(r[u].toUpperCase()!=="BEGIN:VEVENT")continue;let c=[];for(u++;u<r.length&&r[u].toUpperCase()!=="END:VEVENT";u++)c.push(r[u]);let h=c.map(a);if(h.some(T=>T.name==="STATUS"&&T.value.trim().toUpperCase()==="CANCELLED"))continue;let b=h.find(T=>T.name==="SUMMARY"),k=h.find(T=>T.name==="DTSTART");if(!k)continue;let D=s(k.value.trim(),k.params);if(!D)continue;let $=h.find(T=>T.name==="DTEND"),S=$?s($.value.trim(),$.params):void 0,H=b?i(b.value):"Untitled calendar event";H&&(D.allDay?p.push({date:D.date,task:H,timeIn:"",timeOut:""}):S&&!S.allDay&&p.push({date:D.date,task:H,timeIn:D.time,timeOut:S.time}))}return p}function ot(e,t){if(!W(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),st(r)}function st(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function Ie(e){if(!W(e))throw new RangeError("Enter a valid period start date.");let[t,r,a]=e.split("-").map(Number),i=new Date(`${e}T00:00:00Z`);i.setUTCDate(1),i.setUTCFullYear(t,r+1,0);let s=i.getUTCDate();return i.setUTCDate(Math.min(a,s)-1),st(i)}function ge(e){if(!W(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter an activity description.";if(typeof e.timeIn!="string"||e.timeIn&&!Te(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!Te(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function K(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var dt=ie(require("pdfkit"));function Se(e){let[t,r,a]=e.split("-").map(Number),i=new Date(0);return i.setUTCFullYear(t,r-1,a),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(i)}function _t(e){let t=new Date(`${e}T00:00:00Z`),r=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${r} (Weekend)`:r}function Kt(e,t){return at(e[t]??[])}function je(e){return new Promise((t,r)=>{if(!W(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let a;try{a=e.periodEnd===void 0?Ie(e.periodStart):e.periodEnd}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!W(a)||a<e.periodStart)throw new Error("Cannot generate PDF: invalid period end or period end precedes period start.");let i=new dt.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),s=[];i.on("data",w=>s.push(w)),i.on("error",r),i.on("end",()=>t(Buffer.concat(s)));let p=i.page.width-i.page.margins.left-i.page.margins.right,u=[70,70,p-70-70-48-48-60-70,48,48,60,70],c=3;i.font("Helvetica").fontSize(7.5);let h=i.currentLineHeight(!0),b=2,k=[],D=0,$=new Set;for(let w=e.periodStart;;w=ot(w,1)){let F=Kt(e.entries,w),R=(e.holidays??[]).filter(N=>N.date===w),U=F.length?F:[{date:w,task:"",timeIn:"",timeOut:""}],J=F.map(Le).filter(N=>N!==void 0),L=J.reduce((N,O)=>N+O,0),q=K(L);J.length&&($.add(w),D+=L);for(let[N,O]of U.entries()){if(F.length){let Q=ge(O);if(O.date!==w||Q)throw new Error(`Cannot generate PDF: invalid entry for ${w}. ${Q??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(O.task))throw new Error(`Cannot generate PDF: activity for ${w} contains unsupported characters; only printable ASCII is supported.`);let se=N===0?R.map(Q=>`Public holiday: ${Q.name}`):[];if(se.some(Q=>/[^\x20-\x7e]/.test(Q)))throw new Error(`Cannot generate PDF: holiday for ${w} contains unsupported characters; only printable ASCII is supported.`);let ee=[];for(let Q of[...se,O.task]){let X="";for(let ye of Q){if(i.widthOfString(X+ye)>u[2]-c*2){if(!X)throw new Error(`Cannot generate PDF: activity for ${w} cannot fit in the activity column.`);ee.push(X),X=""}X+=ye}(X||!ee.length)&&ee.push(X)}let te=Le(O),we=!!O.timeIn!=!!O.timeOut,$e=new Date(`${w}T00:00:00Z`).getUTCDay()%6===0;k.push({values:[Se(w),_t(w),O.task,O.timeIn,O.timeOut,te===void 0?we?"INCOMPLETE":"":K(te),N===0?q:""],taskLines:ee,fill:we?"#fff2cc":$e?"#eeeeee":"#ffffff"})}if(w===a)break}let S=`Total hours: ${K(D)}     Days logged: ${$.size}`,H=`Generated ${Se(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,T=["Date","Day","Activity","Time In","Time Out","Entry duration","Daily total"],B=`Reporting period: ${Se(e.periodStart)} to ${Se(a)}`,ce=h+b,Z=22+h;if(i.font("Helvetica-Bold").fontSize(7.5),T.some((w,F)=>i.widthOfString(w)>u[F]-c*2))throw new Error("Cannot generate PDF: a column heading does not fit.");i.font("Helvetica").fontSize(7.5);for(let w of k)if(w.values.some((F,R)=>R!==2&&i.widthOfString(F)>u[R]-c*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(i.widthOfString(H)>p)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(i.font("Helvetica-Bold").fontSize(9),i.widthOfString(S)>p)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(i.font("Helvetica").fontSize(9),i.widthOfString(B)>p)throw new Error("Cannot generate PDF: period does not fit on the page.");let G=i.page.margins.left,I=0,V=!1,Ne=(w,F,R,U=!1)=>{let J=h+b,L=G;i.rect(L,I,p,J).fill(R);for(let q=0;q<w.length;q++){let N=u[q];i.rect(L,I,N,J).lineWidth(.35).stroke("#999999"),i.font(U?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),i.text(q===2?F[0]:w[q],L+c,I+b/2,{lineBreak:!1}),L+=N}I+=J},ue=()=>{V?i.addPage():V=!0,I=i.page.margins.top,i.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",G,I,{lineBreak:!1}),I+=20,i.font("Helvetica").fontSize(9).fillColor("#333333").text(B,G,I,{lineBreak:!1}),I+=16,Ne(T,[T[2]],"#dddddd",!0)};ue();let Y=()=>i.page.height-i.page.margins.bottom,oe=()=>Math.max(1,Math.floor((Y()-I-b)/h));for(let w of k){let F=0,R=!0;for(;F<w.taskLines.length;){let U=Math.min(w.taskLines.length-F,oe());if(I+U*h+b>Y()){ue();continue}let J=w.taskLines.slice(F,F+U),L=R?w.values:[w.values[0],w.values[1],"","","","",""],q=G,N=U*h+b;i.rect(q,I,p,N).fill(w.fill);for(let O=0;O<L.length;O++){let se=u[O];i.rect(q,I,se,N).lineWidth(.35).stroke("#999999"),i.font("Helvetica").fontSize(7.5).fillColor("#222222"),(O===2?J:[L[O]]).forEach((ee,te)=>{i.text(ee,q+c,I+b/2+te*h,{lineBreak:!1})}),q+=se}I+=N,F+=U,R=!1,F<w.taskLines.length&&ue()}}I+Z>Y()&&ue(),I+=8,i.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(S,G,I,{lineBreak:!1}),I+=14,i.font("Helvetica").fontSize(7.5).fillColor("#555555").text(H,G,I,{lineBreak:!1}),i.end()})}var lt=require("node:perf_hooks");function Ce(e){return{total:Object.values(e.fileTimes).reduce((t,r)=>t+r,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function Gt(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),r=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof r!="function"||Function.prototype.toString.call(r)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let a=Object.create(null);for(let[i,s]of Object.entries(e)){if(!i||typeof s!="number"||!Number.isFinite(s)||s<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(i)}: expected a non-negative finite duration.`);a[i]=s}return{...a}}var De=class{constructor(t,r,a=()=>lt.performance.now(),i=[]){this.persistFileTimes=r;this.now=a;Object.assign(this.fileTimes,Gt(t)),this.excludedFiles=new Set(i)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let r=this.now();return this.accrueTime(r),this.activeFile=t||void 0,this.startedAt=this.isTracking()?r:void 0,this.persist()}setPaused(t){let r=this.now();return this.accrueTime(r),this.paused=t,this.startedAt=this.isTracking()?r:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let r=this.now();return this.accrueTime(r),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?r:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},r)}catch(i){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(s){throw new Error(`File time reset failed: ${String(i)}; recovery write failed: ${String(s)}. Retry saving file times.`)}throw i}this.subtractBaseline(this.fileTimes,t);for(let i of this.pendingSnapshots)i!==t&&this.subtractBaseline(i,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[r,a]of Object.entries(t))a===0&&!(r===this.activeFile&&this.isTracking())&&delete t[r];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,r){for(let[a,i]of Object.entries(r))if(Object.hasOwn(t,a)){let s=t[a]-i;s>0?t[a]=s:delete t[a]}}persist(){let t={...this.fileTimes},r=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(()=>this.persistFileTimes({...t},r)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}};var Ae=ie(require("vscode")),ut=require("node:crypto"),pt=ie(require("node:path"));function ct(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(r=>String(r).padStart(2,"0")).join(":")}var Fe=class{constructor(t,r){this.snapshot=t;this.toggleTracking=r}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=Ae.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:Ae.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let r=t.webview.onDidReceiveMessage(async i=>{if(!(!i||typeof i!="object"||!("type"in i)))switch(i.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),a=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{r.dispose(),a.dispose(),this.panel=void 0}),t.webview.html=Qt()}update(){if(!this.panel)return;let t=this.snapshot(),r=Ce(t);this.panel.webview.postMessage({type:"timer",totalTime:ct(r.total),currentTime:ct(r.current),currentFile:t.activeFile?pt.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function Qt(){let e=(0,ut.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
</html>`}var fe=require("node:crypto");var mt=ie(require("node:path")),ft=ie(require("pdfkit"));var yt="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function ht(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function He(e,t=new Date){let r=Object.entries(e).map(([u,c])=>{if(!u||!Number.isFinite(c)||c<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:mt.basename(u),milliseconds:c,percent:0}}).sort((u,c)=>c.milliseconds-u.milliseconds||u.name.localeCompare(c.name)),a=r.reduce((u,c)=>u+c.milliseconds,0);if(!Number.isFinite(a))throw new Error("The total tracked time is too large to export.");let i=new Map;for(let u of r)i.set(u.name,(i.get(u.name)??0)+1);let s=new Map,p=new Set(r.map(u=>u.name));for(let u of r){u.percent=a>0?u.milliseconds/a*100:0;let c=u.name;if(i.get(c)>1){let h=s.get(c)??0;do u.name=`${c} (${++h})`;while(p.has(u.name));s.set(c,h),p.add(u.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:a,files:r}}function Zt(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Oe(e){return K(Math.floor(e/6e4))}function We(e,t){let r=e.files.map(a=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${Zt(a.name)}</span>
<span class="file-time">${Oe(a.milliseconds)} <small>${a.percent.toFixed(1)}%</small></span></div>
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
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${ht(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${Oe(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${r||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${yt}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function gt(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,r)=>{let a=new ft.default({size:"A4",margin:44,compress:!0}),i=[];a.on("data",h=>i.push(h)),a.on("error",r),a.on("end",()=>t(Buffer.concat(i)));let s=a.page.width-88,p=0,u=()=>{a.rect(0,0,a.page.width,a.page.height).fill(a.linearGradient(0,0,a.page.width,a.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),a.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),a.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${ht(e)}`,44,110),a.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${Oe(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),p=190},c=()=>{a.addPage(),u()};u();for(let h of e.files){a.font("Helvetica").fontSize(11);let b=a.heightOfString(h.name,{width:s}),k=b+44;p+k>a.page.height-130&&c(),a.fillColor("#ffffff").font("Helvetica").fontSize(11).text(h.name,44,p,{width:s}),p+=b+6,a.fillColor("#ffe1a6").fontSize(10).text(`${Oe(h.milliseconds)}  /  ${h.percent.toFixed(1)}%`,44,p),p+=18,a.roundedRect(44,p,s,6,3).fill("#45665d"),h.percent>0&&a.rect(44,p,s*h.percent/100,6).fill(a.linearGradient(44,p,44+s,p).stop(0,"#7edcbb").stop(1,"#ffcc7d")),p+=20}e.files.length||(a.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,p),p+=32),p+90>a.page.height-44&&c(),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(yt,44,p+12,{width:s}),a.end()})}var ae=require("node:fs"),vt=require("node:crypto"),bt=ie(require("node:path")),ve=class extends Error{constructor(r){super(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${r}, then reopen VS Code.`);this.lockFile=r}lockFile};function wt(e){(0,ae.mkdirSync)(e,{recursive:!0});let t=bt.join(e,"time-tracker.owner.lock"),r=JSON.stringify({pid:process.pid,token:(0,vt.randomBytes)(16).toString("hex")});try{(0,ae.writeFileSync)(t,r,{flag:"wx"})}catch(a){throw a.code==="EEXIST"?new ve(t):a}return()=>{if((0,ae.readFileSync)(t,"utf8")!==r)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,ae.unlinkSync)(t)}}var Re=require("node:crypto");function ne(e){if(!e||typeof e!="object"||Array.isArray(e))return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null}function Xt(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;let[t,r,a]=e.split("-").map(Number),i=new Date(t,r-1,a);return i.getFullYear()===t&&i.getMonth()===r-1&&i.getDate()===a}function qe(e){return typeof e=="string"&&/^\d{4}-\d{2}-\d{2}T/.test(e)&&Number.isFinite(Date.parse(e))}function er(e){return(0,Re.createHash)("sha256").update(`${e.repositoryId}\0${e.name}`).digest("hex").slice(0,32)}function kt(e,t){let r=t.find(a=>a.languageIds.includes(e));return r?{extensionId:r.extensionId,displayName:r.builtIn?"Built-in":r.displayName}:{extensionId:"unknown",displayName:"Unknown"}}function tr(e){if(e===void 0)return{version:1,workspaces:Object.create(null),sessions:[]};if(!ne(e)||e.version!==1||!ne(e.workspaces)||!Array.isArray(e.sessions))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");let t=Object.create(null);for(let[a,i]of Object.entries(e.workspaces)){if(!/^[a-f0-9]{32}$/.test(a)||!ne(i)||typeof i.name!="string"||!i.name||typeof i.totalSeconds!="number"||!Number.isSafeInteger(i.totalSeconds)||i.totalSeconds<0||i.branches!==void 0&&!ne(i.branches)||i.extensions!==void 0&&!ne(i.extensions))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");let s=Object.create(null);for(let[u,c]of Object.entries(i.branches??{})){if(!ne(c)||typeof c.repositoryId!="string"||typeof c.name!="string"||!c.name||typeof c.totalSeconds!="number"||!Number.isSafeInteger(c.totalSeconds)||c.totalSeconds<0)throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");s[u]={repositoryId:c.repositoryId,name:c.name,totalSeconds:c.totalSeconds}}let p=Object.create(null);for(let[u,c]of Object.entries(i.extensions??{})){if(!ne(c)||typeof c.extensionId!="string"||!c.extensionId||typeof c.displayName!="string"||!c.displayName||typeof c.languageId!="string"||!c.languageId||typeof c.editCount!="number"||!Number.isSafeInteger(c.editCount)||c.editCount<0||typeof c.saveCount!="number"||!Number.isSafeInteger(c.saveCount)||c.saveCount<0||!qe(c.lastSeenAt))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");p[u]={extensionId:c.extensionId,displayName:c.displayName,languageId:c.languageId,editCount:c.editCount,saveCount:c.saveCount,lastSeenAt:c.lastSeenAt}}t[a]={name:i.name,totalSeconds:i.totalSeconds,branches:s,extensions:p}}let r=[];for(let a of e.sessions){if(!ne(a)||typeof a.workspaceId!="string"||!Object.hasOwn(t,a.workspaceId)||!Xt(a.date)||typeof a.seconds!="number"||!Number.isSafeInteger(a.seconds)||a.seconds<0||!qe(a.startedAt)||!qe(a.endedAt))throw new Error("Invalid stored workspace activity data. Restore a backup before using workspace tracking.");r.push({workspaceId:a.workspaceId,date:a.date,seconds:a.seconds,startedAt:a.startedAt,endedAt:a.endedAt})}return{version:1,workspaces:t,sessions:r}}function xt(e,t){return{id:(0,Re.createHash)("sha256").update(e).digest("hex").slice(0,32),name:t.trim()||"Workspace"}}function Et(e){return(0,Re.createHash)("sha256").update(e).digest("hex").slice(0,32)}function Tt(e){return e?.name?.trim()||(e?.commit?"Detached HEAD":"Unknown")}function It(e,t=Date.now()){let r=new Date(t),a=new Date(r.getFullYear(),r.getMonth(),r.getDate()-1),i=new Date(r.getFullYear(),r.getMonth(),r.getDate()-7),s=S=>`${S.getFullYear()}-${String(S.getMonth()+1).padStart(2,"0")}-${String(S.getDate()).padStart(2,"0")}`,p=s(a),u=s(i),c=s(r),h=S=>{let[H,T,B]=S.split("-").map(Number);return Date.UTC(H,T-1,B)},b=h(u),k=h(c),D=0,$=0;for(let S of e.sessions){S.date===p&&(D+=S.seconds);let H=h(S.date);H>=b&&H<k&&($+=S.seconds)}return{yesterdaySeconds:D,sevenDaySeconds:$}}function rr(e,t){if(!Number.isSafeInteger(e)||!Number.isSafeInteger(t)||t<e)throw new Error("Invalid workspace interval.");let r=[],a=e;for(;a<t;){let i=new Date(a),s=new Date(i.getFullYear(),i.getMonth(),i.getDate()+1).getTime(),p=Math.min(t,s),u=Math.floor((p-a)/1e3);if(u>0){let c=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`;r.push({date:c,seconds:u,startedAt:new Date(a).toISOString(),endedAt:new Date(p).toISOString()})}a=p}return r}var Pe=class{constructor(t,r,a=Date.now){this.persist=r;this.now=a;this.record=tr(t)}persist;now;record;enabled=!1;focused=!1;live;workspaceIdentity;branchIdentities=new Map;liveBranches=new Map;pendingWrites=Promise.resolve();snapshot(){return{version:1,workspaces:Object.fromEntries(Object.entries(this.record.workspaces).map(([t,r])=>[t,{name:r.name,totalSeconds:r.totalSeconds,branches:Object.fromEntries(Object.entries(r.branches??{}).map(([a,i])=>[a,{...i}])),extensions:Object.fromEntries(Object.entries(r.extensions??{}).map(([a,i])=>[a,{...i}]))}])),sessions:this.record.sessions.map(t=>({...t}))}}isEnabled(){return this.enabled}setEnabled(t){this.enabled!==t&&(this.enabled=t,t?this.startLive():this.settleAndPersist())}setFocused(t){this.focused!==t&&(this.focused=t,t?this.startLive():this.settleAndPersist())}setWorkspace(t){let r=this.now();this.settleAt(r),this.settleBranchesAt(r),this.live=void 0,this.liveBranches.clear(),this.workspaceIdentity=t,this.startLive(r),this.persistRecord()}checkpoint(){if(!this.live)return Promise.resolve();let t=this.now();return this.settleAt(t),this.settleBranchesAt(t),this.live=this.enabled&&this.focused&&this.workspaceIdentity?{identity:this.workspaceIdentity,startedAtMs:t}:void 0,this.liveBranches.clear(),this.startLiveBranches(t),this.persistRecord()}setBranches(t){let r=new Map;for(let s of t){let p=s.name.trim();s.repositoryId&&p&&r.set(s.repositoryId,{repositoryId:s.repositoryId,name:p})}if(!(r.size!==this.branchIdentities.size||[...r].some(([s,p])=>this.branchIdentities.get(s)?.name!==p.name)))return;let i=this.now();for(let[s,p]of this.liveBranches)r.get(s)?.name!==p.identity.name&&(this.settleBranchAt(p,i),this.liveBranches.delete(s));this.branchIdentities=r,this.startLiveBranches(i),this.persistRecord()}recordExtensionActivity(t,r,a=this.now()){if(!this.enabled||!this.workspaceIdentity)return;if(!t.extensionId||!t.displayName||!t.languageId||!Number.isFinite(a)||!Number.isFinite(new Date(a).getTime()))throw new Error("Invalid workspace extension activity.");let i=Object.hasOwn(this.record.workspaces,this.workspaceIdentity.id)?this.record.workspaces[this.workspaceIdentity.id]:{name:this.workspaceIdentity.name,totalSeconds:0,extensions:Object.create(null)};i.name=this.workspaceIdentity.name,i.extensions??=Object.create(null);let s=i.extensions[t.extensionId]??{extensionId:t.extensionId,displayName:t.displayName,languageId:t.languageId,editCount:0,saveCount:0,lastSeenAt:new Date(a).toISOString()};s.displayName=t.displayName,s.languageId=t.languageId,s.lastSeenAt=new Date(a).toISOString(),r==="edit"?s.editCount++:s.saveCount++,i.extensions[t.extensionId]=s,this.record.workspaces[this.workspaceIdentity.id]=i,this.persistRecord()}shutdown(){let t=this.now();return this.settleAt(t),this.settleBranchesAt(t),this.live=void 0,this.liveBranches.clear(),this.enabled=!1,this.focused=!1,this.persistRecord()}startLive(t=this.now()){!this.live&&this.enabled&&this.focused&&this.workspaceIdentity&&(this.live={identity:this.workspaceIdentity,startedAtMs:t}),this.startLiveBranches(t)}settleAndPersist(){let t=this.now();return this.settleAt(t),this.settleBranchesAt(t),this.live=void 0,this.liveBranches.clear(),this.persistRecord()}settleAt(t){if(!this.live)return;let r=this.live.identity;for(let a of rr(this.live.startedAtMs,t)){this.record.sessions.push({workspaceId:r.id,date:a.date,seconds:a.seconds,startedAt:a.startedAt,endedAt:a.endedAt});let i=Object.hasOwn(this.record.workspaces,r.id)?this.record.workspaces[r.id]:{name:r.name,totalSeconds:0,branches:Object.create(null)};i.name=r.name,i.branches??=Object.create(null),i.totalSeconds+=a.seconds,this.record.workspaces[r.id]=i}}startLiveBranches(t){if(!(!this.live||!this.enabled||!this.focused))for(let[r,a]of this.branchIdentities)this.liveBranches.has(r)||this.liveBranches.set(r,{identity:a,startedAtMs:t})}settleBranchesAt(t){for(let r of this.liveBranches.values())this.settleBranchAt(r,t)}settleBranchAt(t,r){if(!this.workspaceIdentity)return;let a=Math.floor(Math.max(0,r-t.startedAtMs)/1e3);if(!a)return;let i=Object.hasOwn(this.record.workspaces,this.workspaceIdentity.id)?this.record.workspaces[this.workspaceIdentity.id]:{name:this.workspaceIdentity.name,totalSeconds:0,branches:Object.create(null)};i.name=this.workspaceIdentity.name,i.branches??=Object.create(null);let s=er(t.identity),p=i.branches[s]??{repositoryId:t.identity.repositoryId,name:t.identity.name,totalSeconds:0};p.totalSeconds+=a,i.branches[s]=p,this.record.workspaces[this.workspaceIdentity.id]=i}persistRecord(){let t=this.pendingWrites.then(async()=>{await this.persist(this.snapshot())});return this.pendingWrites=t.then(()=>{},()=>{}),t}};var ir="time-tracker.data",ar="timesheet.json",St="time-tracker.file-times",Ue="time-tracker.file-activity",Dt="excludedFiles",ze="time-tracker.workspace-activity",nr="2026-10-21",Ft="time-tracker-timesheet",At=1,pe=5*1024*1024,or=new Set(["time-tracker.importTimesheet","time-tracker.exportTimesheet","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.showFloatingTimer","time-tracker.openTimeCard"]),me,le,Ot=Promise.resolve(),Je,_e,C,de=()=>{},be;function Pt(){return(0,fe.randomBytes)(16).toString("hex")}function sr(e){return(0,fe.createHash)("sha256").update(JSON.stringify([e.date,e.task,e.timeIn,e.timeOut])).digest("hex").slice(0,32)}function Ke(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function Ve(){let e=d.workspace?.workspaceFolders;if(!e?.length)return;let t=d.workspace.name?.trim(),r=t||e[0].name?.trim()||"Workspace",a=JSON.stringify([t??"",e.map(i=>i.uri.scheme==="file"?`file:${i.uri.fsPath}`:`${i.uri.scheme}:${i.uri.path}`)]);return xt(a,r)}function Ge(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},r=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[u,c]of Object.entries(e.entries)){let h=!Array.isArray(c),b=h?[c]:c;t[u]=b.map(k=>{if(!k||typeof k!="object"||typeof k.date!="string"||typeof k.task!="string"||typeof k.timeIn!="string"||typeof k.timeOut!="string"||k.date!==u||ge(k))throw new Error(`The saved entry for ${u} is invalid. Restore or repair the JSON file before continuing.`);let D=k.id===void 0&&h?Pt():k.id;if(!Ke(D))throw new Error(`The saved entry for ${u} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(r.has(D))throw new Error(`The saved entry for ${u} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return r.add(D),{...k,id:D}}),t[u].length||delete t[u]}}let a=e.periodStart===void 0?nr:e.periodStart;if(typeof a!="string"||!W(a))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");let i=e.periodEnd;if(i===void 0)try{i=Ie(a)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}if(typeof i!="string"||!W(i)||i<a)throw new Error("The saved period end is invalid. Restore or repair the JSON file before continuing.");let s=e.hourlyRate===void 0?null:e.hourlyRate;if(s!==null&&(typeof s!="number"||!Number.isFinite(s)||s<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");let p=e.holidays===void 0?[]:e.holidays;if(!Array.isArray(p)||p.some(u=>!u||typeof u!="object"||Be(u)||u.name!==u.name.trim())||new Set(p.map(u=>JSON.stringify([u.date,u.name]))).size!==p.length)throw new Error("The saved public holidays are invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:a,periodEnd:i,hourlyRate:s,holidays:p}}function Ze(e){return Object.fromEntries(Object.entries(e).map(([t,r])=>[t,r.map(a=>({id:a.id,date:a.date,task:a.task,timeIn:a.timeIn,timeOut:a.timeOut}))]))}function Xe(e){return e.map(t=>({date:t.date,name:t.name}))}function dr(e,t){return e.id===t.id&&e.date===t.date&&e.task===t.task&&e.timeIn===t.timeIn&&e.timeOut===t.timeOut}function Rt(e,t=new Date){return{kind:Ft,schemaVersion:At,exportedAt:t.toISOString(),entries:Ze(e.entries),holidays:Xe(e.holidays)}}function Mt(e){if(Buffer.byteLength(e,"utf8")>pe)throw new Error(`The timesheet file is too large. The limit is ${pe} bytes.`);let t;try{t=JSON.parse(e)}catch{throw new Error("The selected timesheet file is not valid JSON.")}if(!t||typeof t!="object"||Array.isArray(t))throw new Error("The selected file is not a Time Tracker timesheet export.");let r=t,a=new Set(["kind","schemaVersion","exportedAt","entries","holidays"]);if(Object.keys(r).some(p=>!a.has(p)))throw new Error("The selected timesheet export contains unsupported fields.");if(r.kind!==Ft||r.schemaVersion!==At)throw new Error("The selected file uses an unsupported Time Tracker timesheet format.");let i=typeof r.exportedAt=="string"?new Date(r.exportedAt):void 0;if(!i||!Number.isFinite(i.getTime())||i.toISOString()!==r.exportedAt)throw new Error("The selected timesheet export has an invalid export timestamp.");if(!r.entries||typeof r.entries!="object"||Array.isArray(r.entries)||Object.values(r.entries).some(p=>!Array.isArray(p)))throw new Error("The selected timesheet export has invalid entries.");if(!Array.isArray(r.holidays))throw new Error("The selected timesheet export has invalid holidays.");let s=Ge({entries:r.entries,holidays:r.holidays});return{entries:Ze(s.entries),holidays:Xe(s.holidays)}}function Qe(e,t){let r=new Map(Object.values(e.entries).flat().map(c=>[c.id,c])),a=Ze(e.entries),i=0;for(let[c,h]of Object.entries(t.entries))for(let b of h){let k=r.get(b.id);if(k){if(!dr(k,b))throw new Error(`Imported entry ${b.id} conflicts with a local entry. Import was not applied.`);continue}a[c]=[...a[c]??[],{...b}],r.set(b.id,b),i++}let s=new Set(e.holidays.map(c=>JSON.stringify([c.date,c.name]))),p=Xe(e.holidays),u=0;for(let c of t.holidays){let h=JSON.stringify([c.date,c.name]);s.has(h)||(s.add(h),p.push({...c}),u++)}return{state:i||u?{...e,entries:a,holidays:p}:e,addedEntries:i,addedHolidays:u}}function Me(e){return j.join(e.globalStorageUri.fsPath,ar)}async function Nt(e,t){let r=Me(e);await(0,P.mkdir)(j.dirname(r),{recursive:!0});let a=`${r}.${process.pid}.${(0,fe.randomBytes)(8).toString("hex")}.tmp`,i=await(0,P.open)(a,"wx");try{await i.writeFile(JSON.stringify(t,null,2),"utf8"),await i.close(),await(0,P.rename)(a,r)}catch(s){try{await i.close(),await(0,P.unlink)(a)}catch(p){let u=s instanceof Error?s.message:String(s),c=p instanceof Error?p.message:String(p);throw new AggregateError([s,p],`Could not save the timesheet: ${u}. Temporary file cleanup failed: ${c}`)}throw s}}async function lr(e){try{let r=await(0,P.readFile)(Me(e),"utf8");return Ge(JSON.parse(r))}catch(r){if(r.code!=="ENOENT")throw r}let t=Ge(e.globalState.get(ir));return await Nt(e,t),t}async function Ye(e,t,r,a){let i=d.workspace.workspaceFolders?.[0]?.uri??d.Uri.file((0,Ct.homedir)()),s=await d.window.showSaveDialog({defaultUri:d.Uri.joinPath(i,e),filters:{[t==="html"?"HTML documents":t==="json"?"JSON documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!s)return;let p=j.extname(s.fsPath).toLowerCase()===`.${t}`?s.fsPath:`${s.fsPath}.${t}`;if(a){let u=j.resolve(p),c=j.resolve(a);if(process.platform==="win32"?u.toLowerCase()===c.toLowerCase():u===c)throw new Error("Choose a different file; the active timesheet store cannot be overwritten by an export.")}return await(0,P.writeFile)(p,await r()),p}function cr(e){let t=[],r=!1,a=(n,m=!1,y)=>{let g=()=>{(async()=>{try{if(y){let v=await d.window.showErrorMessage("Time Tracker is paused because another VS Code window may be using its storage.",{modal:!0,detail:"Close the other window, then reload this window. If VS Code crashed, see the recovery instructions."},"Reload Window","Recovery Instructions");v==="Reload Window"?await d.commands.executeCommand("workbench.action.reloadWindow"):v==="Recovery Instructions"&&await d.window.showErrorMessage("Recover Time Tracker after an unexpected shutdown",{modal:!0,detail:`Close all VS Code windows and ensure their extension hosts have stopped. Then remove only this lock file and reopen VS Code:

${y}`},"Copy Lock Path")==="Copy Lock Path"&&await d.env.clipboard.writeText(y);return}if(await d.window.showErrorMessage(n,...m?["Export raw data"]:[])!=="Export raw data")return;let f=await d.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!f)return;let E={fileActivity:e.globalState.get(Ue),fileTimes:e.globalState.get(St),excludedFiles:e.globalState.get(Dt),workspaceActivity:e.globalState.get(ze),legacyFileTimers:e.globalState.get("fileTimers")};await(0,P.writeFile)(f.fsPath,JSON.stringify(E,null,2),"utf8"),d.window.showInformationMessage(`Raw file activity data saved to ${f.fsPath}.`)}catch(l){let f=l instanceof Error?l.message:String(l);d.window.showErrorMessage(y?`Could not complete storage recovery: ${f}`:`Could not export raw file activity data: ${f}`)}})()},o=d.window.createStatusBarItem(d.StatusBarAlignment.Right,100);o.text="$(debug-pause) Time Tracker unavailable",o.tooltip=n,o.command="time-tracker.openTimesheet",o.show(),e.subscriptions.push(o,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes","time-tracker.exportTimesheet","time-tracker.importTimesheet"].map(l=>d.commands.registerCommand(l,g))),g()};try{le=wt(e.globalStorageUri.fsPath);let n=e.globalState.get(Ue),m=e.globalState.get(St),y=e.globalState.get(Dt);if(n!==void 0){if(!n||typeof n!="object"||Array.isArray(n)||!("version"in n)||n.version!==1||!("fileTimes"in n)||n.fileTimes===void 0||!("excludedFiles"in n)||n.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");m=n.fileTimes,y=n.excludedFiles}if(y!==void 0){if(!Array.isArray(y)||y.some(o=>typeof o!="string"||!o))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(y)]}me=new De(m,async(o,l)=>e.globalState.update(Ue,{version:1,fileTimes:o,excludedFiles:[...l]}),void 0,t);try{C=new Pe(e.globalState.get(ze),async o=>e.globalState.update(ze,o))}catch(o){C=void 0,r=!0;let l=o instanceof Error?o.message:String(o);d.window.showErrorMessage(l)}let g=d.workspace?.getConfiguration?.("diarium")?.get("workspaceActivity.enabled",!1)??!1;C&&(C.setEnabled(g),C.setWorkspace(Ve()),C.setFocused(d.window.state.focused)),e.globalState.get("fileTimers")!==void 0&&d.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(n){let m=n instanceof Error?n.message:String(n),y=!!le;if(le)try{le()}catch(g){let o=g instanceof Error?g.message:String(g);a(`${m} Could not release storage ownership: ${o}`);return}finally{le=void 0}a(m,y,n instanceof ve?n.lockFile:void 0);return}let i=new Set,s=!1,p=me,u=d.extensions.all.flatMap(n=>{let m=n.packageJSON,y=(m.contributes?.languages??[]).map(g=>g.id).filter(g=>!!g);return y.length?[{extensionId:n.id,displayName:m.displayName?.trim()||m.name?.trim()||n.id,languageIds:y,builtIn:m.isBuiltin===!0||n.id.startsWith("vscode.")}]:[]}),c=new Map,h=n=>{let m=c.get(n);if(m)return m;let y=kt(n,u);return c.set(n,y),y},b=new Map,k=new Map,D=d.workspace.onDidChangeTextDocument(n=>{if(s||!C?.isEnabled()||!d.workspace.getWorkspaceFolder(n.document.uri))return;let m=n.document.uri.toString(),y=b.get(m);y&&clearTimeout(y),k.set(m,{document:n.document,languageId:n.document.languageId});let g=setTimeout(()=>{b.delete(m);let o=k.get(m);if(k.delete(m),s||!C?.isEnabled()||!o||!d.workspace.getWorkspaceFolder(o.document.uri))return;let l=h(o.languageId);C?.recordExtensionActivity({...l,languageId:o.languageId||"unknown"},"edit")},500);b.set(m,g)}),$=d.workspace.onDidSaveTextDocument(n=>{if(s||!d.workspace.getWorkspaceFolder(n.uri))return;let m=n.languageId||"unknown",y=h(m);C?.recordExtensionActivity({...y,languageId:m},"save")}),S={dispose:()=>{for(let n of b.values())clearTimeout(n);b.clear(),k.clear()}};(async()=>{let n=d.extensions.getExtension("vscode.git");if(!n)return;let m=n.isActive?n.exports:await n.activate();if(s||!m)return;let y=m.getAPI(1),g=[],o=!1,l=()=>{if(o||s)return;for(let x of g)x.dispose();g=[];let v=[];for(let x of y.repositories)d.workspace.getWorkspaceFolder(x.rootUri)&&(v.push({repositoryId:Et(x.rootUri.toString()),name:Tt(x.state?.HEAD)}),x.onDidChangeState&&g.push(x.onDidChangeState(l)));C?.setBranches(v)},f=y.onDidChangeState?.(l),E=()=>{if(!o){o=!0,f?.dispose();for(let v of g)v.dispose();g=[],de===l&&(de=()=>{}),be===E&&(be=void 0)}};be=E,de=l,l()})().catch(n=>{if(!s){let m=n instanceof Error?n.message:String(n);d.window.showWarningMessage(`Git branch activity is unavailable: ${m}`)}});let T=()=>{let n=p.snapshot();return{...n,excluded:!!n.activeFile&&p.isExcluded(n.activeFile)}},B,ce,Z=Promise.resolve(),G=new Map,I=async()=>{if(B)return B;ce||(ce=lr(e),Je=ce);try{return B=await ce,B}finally{ce=void 0,Je=void 0}},V=n=>{if(s)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let m=Z.then(async()=>{let y=await I(),g=n(y);if(g!==y){await Nt(e,g),B=g;for(let o of i)await o.webview.postMessage({type:"saved",data:{...g,...T()}})}});return Z=m.then(()=>{},()=>{}),Ot=Z,m},Ne=d.commands.registerCommand("time-tracker.exportTimesheet",async()=>{try{await Z;let n=await I(),m=Rt(n),y=await Ye(`time-tracker-timesheet-${m.exportedAt.slice(0,10)}.json`,"json",()=>Buffer.from(`${JSON.stringify(m,null,2)}
`,"utf8"),Me(e));y&&d.window.showInformationMessage(`Timesheet data saved to ${y}`)}catch(n){let m=n instanceof Error?n.message:String(n);d.window.showErrorMessage(`Could not export timesheet data: ${m}`)}}),ue=d.commands.registerCommand("time-tracker.importTimesheet",async()=>{try{let n=await d.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Time Tracker timesheet":["json"],"All files":["*"]},openLabel:"Import timesheet data"});if(!n?.length)return;let m=await(0,P.open)(n[0].fsPath,"r"),y;try{let E=await m.stat();if(!E.isFile())throw new Error("Select a regular JSON file.");if(E.size>pe)throw new Error(`The timesheet file is too large. The limit is ${pe} bytes.`);y=await m.readFile({encoding:"utf8"})}finally{await m.close()}let g=Mt(y);await Z;let o=Qe(await I(),g);if(await d.window.showWarningMessage(`Import ${o.addedEntries} new entries and ${o.addedHolidays} new holidays? Existing timesheet entries and preferences will be kept.`,{modal:!0},"Import")!=="Import")return;let f;await V(E=>(f=Qe(E,g),f.state)),d.window.showInformationMessage(`Timesheet import complete: ${f.addedEntries} entries and ${f.addedHolidays} holidays added.`)}catch(n){let m=n instanceof Error?n.message:String(n);d.window.showErrorMessage(`Could not import timesheet data: ${m}`)}}),Y=d.window.createStatusBarItem(d.StatusBarAlignment.Right,100);Y.command="time-tracker.openTimesheet",Y.text="$(watch) 0h 00m | 0h 00m",Y.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,Y.show();let oe=r?"Usage unavailable":C?.isEnabled()?"":"Usage off",w=()=>{if(r||!C){oe="Usage unavailable";return}if(!C.isEnabled()){oe="Usage off";return}let n=It(C.snapshot()),m=K(Math.floor(n.yesterdaySeconds/60)),y=K(Math.floor(n.sevenDaySeconds/60));oe=`Yesterday ${m} | 7d ${y}`};w();let F=n=>{let m=n instanceof Error?n.message:String(n);d.window.showErrorMessage(`Could not save automatic file time data: ${m}`)},R=()=>{let n=T(),m=Ce(n),y=K(Math.floor(m.total/6e4)),g=K(Math.floor(m.current/6e4)),o=n.activeFile?`Current file (${j.basename(n.activeFile)})`:"Current file";Y.text=`${n.paused?"$(debug-pause)":"$(watch)"} ${y} | ${g}`+(n.excluded?" Excluded":n.activeFile?"":" Waiting")+(oe?` | ${oe}`:"");let l=r?"Workspace usage unavailable":C?.isEnabled()?`Workspace tracking on, ${d.window.state.focused?"focused":"unfocused"}`:"Workspace tracking off";Y.tooltip=`Total tracked: ${y}
${o}: ${g}
${n.paused?`Automatic tracking paused
`:n.excluded?`Current file excluded
`:""}${l}
Click to open Time Tracker`,L.update();for(let f of i)f.webview.postMessage({type:"fileTimes",data:n})},U=async n=>{R();try{await n}catch(m){F(m)}R()},J=()=>s?Promise.resolve():U(p.setPaused(!p.snapshot().paused)),L=new Fe(T,J),q=d.commands.registerCommand("time-tracker.showFloatingTimer",()=>L.show()),N=d.commands.registerCommand("time-tracker.hideFloatingTimer",()=>L.hide()),O=d.commands.registerCommand("time-tracker.toggleTracking",J),se=d.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(s){d.window.showErrorMessage("Time Tracker is shutting down.");return}let n=d.window.activeTextEditor,m=n?.document.uri.scheme==="file"?n.document.uri.fsPath:void 0,y=m?[m,...t.filter(f=>f!==m)]:t;if(!y.length){d.window.showInformationMessage("No local file is active and no files are excluded.");return}let g=await d.window.showQuickPick(y.map(f=>({label:`${p.isExcluded(f)?"Include":"Exclude"} ${j.basename(f)}`,description:f,file:f})),{placeHolder:"Choose a local file to exclude or include"});if(!g)return;let o=new Set(t);o.has(g.file)?o.delete(g.file):o.add(g.file),t=[...o];let l=p.setExcludedFiles(t);R();try{await l,d.window.showInformationMessage(`${j.basename(g.file)} is ${p.isExcluded(g.file)?"excluded":"included"}.`)}catch(f){F(f)}R()}),ee=d.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(s){d.window.showErrorMessage("Time Tracker is shutting down.");return}if(await d.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await p.reset(),R(),d.window.showInformationMessage("Automatic file activity was reset.")}catch(m){F(m),R()}}),te=()=>{if(s)return;let n=d.window.activeTextEditor,m=d.window.state.focused&&n?.document.uri.scheme==="file"?n.document.uri.fsPath:void 0;U(p.setActiveFile(m))};te();let we=d.window.onDidChangeActiveTextEditor(te),$e=d.window.onDidChangeWindowState(()=>{te(),C?.setFocused(d.window.state.focused),w()}),Q=d.workspace?.onDidChangeWorkspaceFolders?.(()=>{C?.setWorkspace(Ve()),de(),w()})??{dispose:()=>{}},X=d.workspace?.onDidChangeConfiguration?.(n=>{if(!n.affectsConfiguration("diarium.workspaceActivity.enabled"))return;let m=d.workspace.getConfiguration("diarium").get("workspaceActivity.enabled",!1);C?.setEnabled(m),C?.setWorkspace(Ve()),C?.setFocused(d.window.state.focused),m||S.dispose(),de(),w()})??{dispose:()=>{}},ye=setInterval(()=>{s||U(p.checkpoint())},6e4),et=setInterval(()=>{s||(de(),C?.checkpoint()?.then(()=>{w(),R()}).catch(m=>{let y=m instanceof Error?m.message:String(m);d.window.showErrorMessage(`Could not save workspace activity: ${y}`)}))},6e4),tt=setInterval(R,1e3);_e=()=>{s=!0,clearInterval(ye),clearInterval(et),clearInterval(tt)};let $t=d.commands.registerCommand("time-tracker.openTimeCard",()=>{let n;try{n=He(me?.snapshot().fileTimes??{})}catch(o){let l=o instanceof Error?o.message:String(o);d.window.showErrorMessage(`Could not generate the time card: ${l}`);return}let m=d.window.createWebviewPanel("timeTrackerCard","Time Card Preview",d.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),y=()=>{m.webview.html=We(n,{nonce:(0,fe.randomBytes)(16).toString("hex")})};y();let g=m.webview.onDidReceiveMessage(async o=>{try{if(o.type==="refresh")n=He(me?.snapshot().fileTimes??{}),y();else if(o.type==="export"){if(o.format!=="html"&&o.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let l=o.format,f=n,E=`time-card-${f.generatedAt.slice(0,10)}.${l}`,v=await Ye(E,l,()=>l==="html"?Buffer.from(We(f),"utf8"):gt(f));v&&d.window.showInformationMessage(`Time card saved to ${v}`)}}catch(l){let f=l instanceof Error?l.message:String(l);d.window.showErrorMessage(`Could not generate or export the time card: ${f}`)}});m.onDidDispose(()=>g.dispose())}),Bt=d.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(s){d.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let n=d.window.createWebviewPanel("timeTracker","Time Tracker",d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),m=!1;try{await I()}catch(o){n.dispose();let l=o instanceof Error?o.message:String(o);d.window.showErrorMessage(`Could not load ${Me(e)}: ${l}`);return}i.add(n),n.onDidDispose(()=>i.delete(n)),n.webview.html=it(n.webview);let y=async()=>{await n.webview.postMessage({type:"state",data:{...await I(),...T()}})};function g(o,l){if(!o||!l||o.id!==l.id||o.date!==l.date||o.task!==l.task||o.timeIn!==l.timeIn||o.timeOut!==l.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}n.webview.onDidReceiveMessage(async o=>{if(!o||typeof o!="object"||typeof o.type!="string"){d.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(o.type){case"maintenanceAction":if(typeof o.command!="string"||!or.has(o.command))throw new Error("Choose a valid maintenance action.");if(s)throw new Error("Time Tracker is shutting down.");if(m)break;m=!0;try{await d.commands.executeCommand(o.command),await n.webview.postMessage({type:"maintenanceActionComplete"})}finally{m=!1}break;case"showFloatingTimer":L.show();break;case"openTimeCard":await d.commands.executeCommand("time-tracker.openTimeCard");break;case"importOutlookCalendar":{let l=await d.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,filters:{"Outlook Calendar":["ics"],"All files":["*"]},openLabel:"Import Outlook Calendar"});if(!l?.length){await n.webview.postMessage({type:"maintenanceActionComplete"});break}let f=await(0,P.open)(l[0].fsPath,"r"),E;try{let M=await f.stat();if(!M.isFile())throw new Error("Select a regular Outlook calendar .ics file.");if(M.size>pe)throw new Error(`The calendar file is too large. The limit is ${pe} bytes.`);E=await f.readFile({encoding:"utf8"})}finally{await f.close()}let v=nt(E);if(!v.length)throw new Error("No timed or all-day calendar entries found in this Outlook .ics file.");await Z;let x=await I(),z=new Set(Object.values(x.entries).flat().map(M=>JSON.stringify([M.date,M.task,M.timeIn,M.timeOut]))),A=v.filter(M=>!z.has(JSON.stringify([M.date,M.task,M.timeIn,M.timeOut])));if(!A.length){d.window.showInformationMessage("Outlook Calendar import complete: 0 entries added."),await n.webview.postMessage({type:"maintenanceActionComplete"});break}if(await d.window.showWarningMessage(`Import ${A.length} calendar ${A.length===1?"entry":"entries"}?`,{modal:!0},"Import")!=="Import"){await n.webview.postMessage({type:"maintenanceActionComplete"});break}let _=0;await V(M=>{let ke={...M.entries};for(let re of A){let Lt=JSON.stringify([re.date,re.task,re.timeIn,re.timeOut]);if(Object.values(ke).flat().some(xe=>JSON.stringify([xe.date,xe.task,xe.timeIn,xe.timeOut])===Lt))continue;let jt={...re,id:sr(re)};ke[re.date]=[...ke[re.date]??[],jt],_++}return _?{...M,entries:ke}:M}),d.window.showInformationMessage(`Outlook Calendar import complete: ${_} entries added.`),await n.webview.postMessage({type:"maintenanceActionComplete"});break}case"ready":await y();break;case"addHoliday":case"deleteHoliday":{let l=o.holiday;if(!l||typeof l!="object"||Be(l))throw new Error("Enter a valid holiday date and name.");let f={date:l.date,name:l.name.trim()};await V(E=>{let v=E.holidays.some(x=>x.date===f.date&&x.name===f.name);if(o.type==="addHoliday"&&v)throw new Error("This holiday already exists on that date.");if(o.type==="deleteHoliday"&&!v)throw new Error("This holiday was removed in another view.");return{...E,holidays:o.type==="addHoliday"?[...E.holidays,f]:E.holidays.filter(x=>x.date!==f.date||x.name!==f.name)}}),o.type==="addHoliday"&&await n.webview.postMessage({type:"holidayAdded",holiday:f});break}case"createEntry":case"saveEntry":{let l=o.entry;if(!l||typeof l.date!="string"||typeof l.task!="string"||typeof l.timeIn!="string"||typeof l.timeOut!="string"||!W(l.date))throw new Error("Enter a valid date, activity, and time values.");let f=!l.task.trim()&&!l.timeIn&&!l.timeOut,E=f&&o.type==="saveEntry"?void 0:ge(l);if(E)throw new Error(E);if(o.type==="createEntry"){if(typeof o.requestId!="string"||!o.requestId||o.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let v={...l,id:Pt(),task:l.task.trim()},x=G.get(o.requestId);if(x){if(!(x.entry.date===v.date&&x.entry.task===v.task&&x.entry.timeIn===v.timeIn&&x.entry.timeOut===v.timeOut))throw new Error("The create-entry request is invalid.");await x.operation,await n.webview.postMessage({type:"entryCreated",requestId:o.requestId,entry:x.entry});break}let z=V(A=>({...A,entries:{...A.entries,[l.date]:[...A.entries[l.date]??[],v]}}));G.set(o.requestId,{entry:v,operation:z});try{await z}catch(A){throw G.delete(o.requestId),A}await n.webview.postMessage({type:"entryCreated",requestId:o.requestId,entry:v});break}if(!Ke(o.id))throw new Error("Select a saved entry before editing it.");await V(v=>{let x=v.entries[l.date]??[],z=x.findIndex(_=>_.id===o.id),A=x[z];g(A,o.expected);let he={...v.entries};if(f){let _=x.filter(M=>M.id!==o.id);_.length?he[l.date]=_:delete he[l.date]}else{let _=[...x];_[z]={...l,id:A.id,task:l.task.trim()},he[l.date]=_}return{...v,entries:he}});break}case"deleteEntry":if(!o.date||!W(o.date)||!Ke(o.id))throw new Error("Select a valid entry to delete.");await V(l=>{let f=o.date,E=l.entries[f]??[],v=E.find(A=>A.id===o.id);g(v,o.expected);let x={...l.entries},z=E.filter(A=>A.id!==o.id);return z.length?x[f]=z:delete x[f],{...l,entries:x}});break;case"setPeriod":if(typeof o.periodStart!="string"||!W(o.periodStart))throw new Error("Enter a valid period start date.");if(typeof o.periodEnd!="string"||!W(o.periodEnd))throw new Error("Enter a valid period end date.");if(o.periodEnd<o.periodStart)throw new Error("Period end must be on or after period start.");await V(l=>{if(l.periodStart!==o.expectedStart||l.periodEnd!==o.expectedEnd)throw new Error("The reporting period changed in another view. Reload it before editing again.");return{...l,periodStart:o.periodStart,periodEnd:o.periodEnd}});break;case"setHourlyRate":{if(typeof o.value!="string"||o.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(o.value))throw new Error("Enter a valid hourly rate of zero or more.");let l=o.value===""?null:Number(o.value);if(l!==null&&(!Number.isFinite(l)||l<0))throw new Error("Enter a valid hourly rate of zero or more.");await V(f=>{if(f.hourlyRate!==o.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...f,hourlyRate:l}});break}case"requestReportAction":{await Z;let l=await I(),f=await d.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(f?.value==="print"){try{let E=await je(l),v=j.join(e.globalStorageUri.fsPath,"print-reports");await(0,P.mkdir)(v,{recursive:!0});let x=await(0,P.mkdtemp)(j.join(v,"report-")),z=`timesheet-${l.periodStart}-to-${l.periodEnd}.pdf`,A=j.join(x,z);if(await(0,P.writeFile)(A,E),!await d.env.openExternal(d.Uri.file(A)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");d.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(E){let v=E instanceof Error?E.message:String(E);d.window.showErrorMessage(`Could not open the report for printing: ${v}`)}break}if(f?.value==="pdf"){let E=`timesheet-${l.periodStart}-to-${l.periodEnd}.pdf`;try{let v=await Ye(E,"pdf",()=>je(l));v&&d.window.showInformationMessage(`PDF saved to ${v}`)}catch(v){let x=v instanceof Error?v.message:String(v);d.window.showErrorMessage(`Could not save the PDF: ${x}`)}}break}}}catch(l){let f=l instanceof Error?l.message:String(l);if(o.type==="maintenanceAction"||o.type==="importOutlookCalendar"){await n.webview.postMessage({type:"maintenanceActionError",message:f});return}await n.webview.postMessage({type:"error",operation:o.type,id:o.id,requestId:o.requestId,view:o.view??(o.type==="setPeriod"||o.type==="setHourlyRate"?"report":"entries"),message:f})}})});e.subscriptions.push(Bt,$t,q,N,O,se,ee,Ne,ue,L,Y,we,$e,Q,X,D,$,S,{dispose:()=>clearInterval(ye)},{dispose:()=>clearInterval(et)},{dispose:()=>clearInterval(tt)})}async function ur(){_e?.(),be?.();try{let t=(await Promise.allSettled([me?.setActiveFile(void 0),C?.shutdown(),Ot,Je])).find(r=>r.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{me=void 0,C=void 0,_e=void 0,de=()=>{},be=void 0,le?.(),le=void 0}}0&&(module.exports={activate,createTimesheetTransfer,deactivate,mergeTimesheetTransfer,parseTimesheetTransfer});
