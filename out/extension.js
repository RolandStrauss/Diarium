"use strict";var Ve=Object.create;var Q=Object.defineProperty;var Ye=Object.getOwnPropertyDescriptor;var We=Object.getOwnPropertyNames;var Je=Object.getPrototypeOf,Ke=Object.prototype.hasOwnProperty;var _e=(e,t)=>{for(var n in t)Q(e,n,{get:t[n],enumerable:!0})},he=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of We(t))!Ke.call(e,r)&&r!==n&&Q(e,r,{get:()=>t[r],enumerable:!(i=Ye(t,r))||i.enumerable});return e};var B=(e,t,n)=>(n=e!=null?Ve(Je(e)):{},he(t||!e||!e.__esModule?Q(n,"default",{value:e,enumerable:!0}):n,e)),Qe=e=>he(Q({},"__esModule",{value:!0}),e);var lt={};_e(lt,{activate:()=>st,deactivate:()=>dt});module.exports=Qe(lt);var d=B(require("vscode")),k=require("node:fs/promises"),je=require("node:os"),F=B(require("node:path"));function Ze(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function be(e){let t=Ze();return`<!DOCTYPE html>
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
@media (max-width: 700px) { body { padding: 0 10px 20px; } .toolbar { align-items: start; } .tabs { display: flex; width: 100%; } .filters > label, .period-controls > label { flex: 1 1 130px; } }
@media print {
	@page { size: A4 landscape; margin: 7mm; }
	body { padding: 0; color: #111; background: #fff; font: 8pt Arial, sans-serif; }
	header { position: static; border: 0; padding: 0; }
	h1 { font-size: 14pt; margin: 0 0 4mm; color: #111; }
	.tabs, .screen-only, #entries-view, #file-times-view, .error, #print-warning { display: none !important; }
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
<button id="discard-period" type="button" hidden>Discard period draft</button>
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
let data = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null, paused: false, excluded: false };
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
    '<td class="date">' + esc(dateText(date)) + (dateObj(date).getUTCDay() % 6 === 0 ? ' (Weekend)' : '') + '</td>' +
    '<td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="entries-error" aria-label="Task for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"></td>' +
    '<td class="time"><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-describedby="entries-error" aria-label="Time In for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"></td>' +
    '<td class="time"><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-describedby="entries-error" aria-label="Time Out for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"></td>' +
    '<td class="duration ' + (incomplete ? 'warning-text' : '') + '" aria-label="Entry duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td>' +
    '<td class="duration">' + (index === 0 ? dailyTotal : '') + '</td>' +
    '<td><button type="button" data-action="delete" aria-label="Delete entry ' + (index + 1) + ' for ' + esc(dateText(date)) + '" ' + (savedEntry ? '' : 'disabled') + '>Delete</button>' +
    ' <button type="button" data-action="discard" aria-label="Discard draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + '>Discard draft</button></td></tr>');
  });
 });
 byId('entries-body').innerHTML = rows.join('');
 byId('entries-body').querySelectorAll('input').forEach((input) => { input.addEventListener('input', rememberRow); input.addEventListener('change', saveRow); });
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
 const row = event.target.closest('tr'); const fields = { task: row.querySelector('[data-field="task"]'), timeIn: row.querySelector('[data-field="timeIn"]'), timeOut: row.querySelector('[data-field="timeOut"]') };
 const entry = { date: row.dataset.date, task: fields.task.value.trim(), timeIn: fields.timeIn.value, timeOut: fields.timeOut.value };
 const id = row.dataset.id; const key = draftKey(entry.date, id);
 const expected = JSON.parse(row.dataset.expected);
 if (!id && !entry.task && !entry.timeIn && !entry.timeOut) { delete drafts[key]; return; }
 const requestId = id ? undefined : 'row-' + (++nextRequestId);
 drafts[key] = { entry, id, expected, requestId, pending: false };
 if (!validateRow(entry, fields, 'entries-error', true)) return;
 drafts[key].pending = true;
 if (id) vscode.postMessage({ type: 'saveEntry', entry, id, expected });
 else vscode.postMessage({ type: 'createEntry', entry, requestId });
}
function rememberRow(event) {
 const row = event.target.closest('tr'); const date = row.dataset.date; const id = row.dataset.id; const key = draftKey(date, id);
 const previous = drafts[key];
 drafts[key] = { entry: { date, task: row.querySelector('[data-field="task"]').value, timeIn: row.querySelector('[data-field="timeIn"]').value, timeOut: row.querySelector('[data-field="timeOut"]').value, ...(id ? { id } : {}) }, id, expected: previous ? previous.expected : JSON.parse(row.dataset.expected), requestId: previous?.requestId, pending: false };
 const discard = row.querySelector('[data-action="discard"]'); if (discard) discard.hidden = false;
}
function deleteRow(event) {
 const row = event.target.closest('tr'); const date = row.dataset.date; const id = row.dataset.id; const key = draftKey(date, id);
 if (drafts[key]) drafts[key].deleting = true;
 vscode.postMessage({ type: 'deleteEntry', date, id, expected: JSON.parse(row.dataset.expected) });
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
 byId('discard-period').hidden = !periodDraft; byId('discard-rate').hidden = !rateDraft;
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
		rows.push('<tr data-date="' + date + '" data-id="' + esc(original.id || '') + '" data-expected="' + esc(JSON.stringify(savedEntry)) + '" class="' + (incomplete ? 'incomplete ' : '') + (weekday === 0 || weekday === 6 ? 'weekend' : '') + '"><td class="date">' + esc(date) + '</td><td>' + esc(new Intl.DateTimeFormat(undefined, { weekday: 'long', timeZone: 'UTC' }).format(dateObj(date))) + '</td><td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="report-error" aria-label="Task for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"> <button type="button" class="screen-only" data-action="discard" aria-label="Discard draft for ' + esc(dateText(date)) + '"' + (drafts[key] ? '' : ' hidden') + '>Discard draft</button><span class="print-task"></span></td><td><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-describedby="report-error" aria-label="Time In for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"><span class="print-time">' + esc(entry.timeIn) + '</span></td><td><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-describedby="report-error" aria-label="Time Out for ' + esc(dateText(date)) + ', entry ' + (index + 1) + '"><span class="print-time">' + esc(entry.timeOut) + '</span></td><td class="duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td><td class="duration">' + (index === 0 ? dailyTotal : '') + '</td></tr>');
	}
  if (date === end) break;
  date = addDays(date, 1);
 }
 byId('report-body').innerHTML = rows.join('');
 byId('report-body').querySelectorAll('input').forEach((input) => { input.addEventListener('input', rememberRow); input.addEventListener('change', saveReportRow); });
 byId('report-body').querySelectorAll('[data-action="discard"]').forEach((button) => button.addEventListener('click', discardDraft));
 byId('report-body').querySelectorAll('tr').forEach((row) => row.querySelector('.print-task').textContent = row.querySelector('[data-field="task"]').value);
 const days = loggedDates.size;
 byId('report-days').textContent = days + (days === 1 ? ' day logged' : ' days logged') + (Object.values(drafts).some((draft) => draft.entry.date >= start && draft.entry.date <= end) ? ' (saved entries only; drafts excluded)' : '');
 const rate = data.hourlyRate;
 const estimate = total / 60 * rate;
 byId('print-summary').innerHTML = '<div class="metric"><strong>' + durationText(total) + '</strong><span>Total hours</span></div><div class="metric"><strong>' + days + '</strong><span>Days logged</span></div>' + (rate === null ? '' : '<div class="metric"><strong>' + (Number.isFinite(estimate) ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }).format(estimate) : 'Estimate exceeds supported range') + '</strong><span>Estimated value (informational)</span></div>');
}
function saveReportRow(event) {
 saveEntryRow(event, 'report-error', 'report');
}
function saveEntryRow(event, errorId, view) {
 const row = event.target.closest('tr'); const fields = { task: row.querySelector('[data-field="task"]'), timeIn: row.querySelector('[data-field="timeIn"]'), timeOut: row.querySelector('[data-field="timeOut"]') };
 const entry = { date: row.dataset.date, task: fields.task.value.trim(), timeIn: fields.timeIn.value, timeOut: fields.timeOut.value };
 const id = row.dataset.id; const key = draftKey(entry.date, id); const expected = JSON.parse(row.dataset.expected);
 const requestId = id ? undefined : 'row-' + (++nextRequestId);
 drafts[key] = { entry, id, expected, requestId, pending: false };
 if (!validateRow(entry, fields, errorId, true)) return;
 if (!id && !entry.task && !entry.timeIn && !entry.timeOut) { delete drafts[key]; return; }
 drafts[key].pending = true;
 vscode.postMessage(id
  ? { type: 'saveEntry', entry, id, expected, view }
  : { type: 'createEntry', entry, requestId, view });
}
function render() { renderEntries(); renderSummary(); renderReport(); renderFileTimes(); }
function setView(view) {
 byId('entries-view').hidden = view !== 'entries'; byId('report-view').hidden = view !== 'report'; byId('file-times-view').hidden = view !== 'file-times';
 byId('entries-tab').setAttribute('aria-selected', String(view === 'entries')); byId('report-tab').setAttribute('aria-selected', String(view === 'report')); byId('file-times-tab').setAttribute('aria-selected', String(view === 'file-times'));
}
byId('entries-tab').addEventListener('click', () => setView('entries'));
byId('report-tab').addEventListener('click', () => setView('report'));
byId('file-times-tab').addEventListener('click', () => setView('file-times'));
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
 byId('discard-period').hidden = false;
});
byId('period-start').addEventListener('change', () => {
 const input = byId('period-start');
 periodDraft = periodDraft || { value: input.value, expectedValue: data.periodStart, pending: false };
 periodDraft.value = input.value;
 try { periodEnd(input.value); } catch (error) { fieldError(input, 'report-error', error.message); return; }
 input.removeAttribute('aria-invalid'); setError('report-error', ''); periodDraft.pending = true;
 vscode.postMessage({ type: 'setPeriodStart', value: input.value, expectedValue: periodDraft.expectedValue });
});
byId('hourly-rate').addEventListener('input', () => {
 rateDraft = { value: byId('hourly-rate').value, expectedValue: rateDraft ? rateDraft.expectedValue : data.hourlyRate, pending: false };
 byId('discard-rate').hidden = false;
});
byId('hourly-rate').addEventListener('change', () => {
 const input = byId('hourly-rate'); const value = input.value;
 rateDraft = rateDraft || { value, expectedValue: data.hourlyRate, pending: false }; rateDraft.value = value;
 if (input.validity.badInput || (value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0))) { fieldError(input, 'report-error', 'Enter a valid hourly rate of zero or more.'); return; }
 input.removeAttribute('aria-invalid'); setError('report-error', ''); rateDraft.pending = true;
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
   if ((draft.deleting && !saved) || (draft.pending && saved && sameEntry(saved, { ...draft.entry, id: draft.id }))) delete drafts[key];
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
  setError(message.view === 'report' ? 'report-error' : 'entries-error', message.message);
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
</html>`}function P(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,n,i]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);return r.getUTCFullYear()===t&&r.getUTCMonth()===n-1&&r.getUTCDate()===i}function Z(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function de(e){if(!Z(e.timeIn)||!Z(e.timeOut))return;let[t,n]=e.timeIn.split(":").map(Number),[i,r]=e.timeOut.split(":").map(Number),l=t*60+n,p=i*60+r;return p<l&&(p+=1440),p-l}function we(e,t){if(!P(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let n=new Date(`${e}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+t),xe(n)}function xe(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function j(e){if(!P(e))throw new RangeError("Enter a valid period start date.");let[t,n,i]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);r.setUTCDate(1),r.setUTCFullYear(t,n+1,0);let l=r.getUTCDate();return r.setUTCDate(Math.min(i,l)-1),xe(r)}function J(e){if(!P(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!Z(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!Z(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function $(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var Te=B(require("pdfkit"));function G(e){let[t,n,i]=e.split("-").map(Number),r=new Date(0);return r.setUTCFullYear(t,n-1,i),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(r)}function Ge(e){let t=new Date(`${e}T00:00:00Z`),n=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${n} (Weekend)`:n}function Xe(e,t){return e[t]??[]}function le(e){return new Promise((t,n)=>{if(!P(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let i;try{i=j(e.periodStart)}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!P(i)||i<e.periodStart)throw new Error("Cannot generate PDF: period end is outside the supported calendar.");let r=new Te.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),l=[];r.on("data",g=>l.push(g)),r.on("error",n),r.on("end",()=>t(Buffer.concat(l)));let p=r.page.width-r.page.margins.left-r.page.margins.right,m=[70,70,p-70-70-48-48-60-70,48,48,60,70],b=3;r.font("Helvetica").fontSize(7.5);let y=r.currentLineHeight(!0),T=2,C=[],O=0,H=new Set;for(let g=e.periodStart;;g=we(g,1)){let s=Xe(e.entries,g),f=s.length?s:[{date:g,task:"",timeIn:"",timeOut:""}],v=s.map(de).filter(c=>c!==void 0),o=v.reduce((c,u)=>c+u,0),a=$(o);v.length&&(H.add(g),O+=o);for(let[c,u]of f.entries()){if(s.length){let I=J(u);if(u.date!==g||I)throw new Error(`Cannot generate PDF: invalid entry for ${g}. ${I??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(u.task))throw new Error(`Cannot generate PDF: task for ${g} contains unsupported characters; only printable ASCII is supported.`);let h=[],w="";for(let I of u.task){if(r.widthOfString(w+I)>m[2]-b*2){if(!w)throw new Error(`Cannot generate PDF: task for ${g} cannot fit in the task column.`);h.push(w),w=""}w+=I}(w||!h.length)&&h.push(w);let D=de(u),E=!!u.timeIn!=!!u.timeOut,V=new Date(`${g}T00:00:00Z`).getUTCDay()%6===0;C.push({values:[G(g),Ge(g),u.task,u.timeIn,u.timeOut,D===void 0?E?"INCOMPLETE":"":$(D),c===0?a:""],taskLines:h,fill:E?"#fff2cc":V?"#eeeeee":"#ffffff"})}if(g===i)break}let S=e.hourlyRate===null?null:O/60*e.hourlyRate;if(S!==null&&(!Number.isFinite(S)||S>=1e21))throw new Error("Cannot generate PDF: estimated value is too large to display to two decimal places.");let z=`Total hours: ${$(O)}     Days logged: ${H.size}`,M=S===null?null:`Hourly rate: ${e.hourlyRate}     Estimated value (informational): ${S.toFixed(2)}`,A=`Generated ${G(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,W=["Date","Day","Task","Time In","Time Out","Entry duration","Daily total"],K=`Reporting period: ${G(e.periodStart)} to ${G(i)}`,ge=y+T,ne=22+(M===null?0:14)+y;if(r.font("Helvetica-Bold").fontSize(7.5),W.some((g,s)=>r.widthOfString(g)>m[s]-b*2))throw new Error("Cannot generate PDF: a column heading does not fit.");r.font("Helvetica").fontSize(7.5);for(let g of C)if(g.values.some((s,f)=>f!==2&&r.widthOfString(s)>m[f]-b*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if(M!==null&&r.widthOfString(M)>p||r.widthOfString(A)>p)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica-Bold").fontSize(9),r.widthOfString(z)>p)throw new Error("Cannot generate PDF: report summary does not fit on the page.");if(r.font("Helvetica").fontSize(9),r.widthOfString(K)>p)throw new Error("Cannot generate PDF: period does not fit on the page.");let R=r.page.margins.left,x=0,_=!1,oe=(g,s,f,v=!1)=>{let o=y+T,a=R;r.rect(a,x,p,o).fill(f);for(let c=0;c<g.length;c++){let u=m[c];r.rect(a,x,u,o).lineWidth(.35).stroke("#999999"),r.font(v?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),r.text(c===2?s[0]:g[c],a+b,x+T/2,{lineBreak:!1}),a+=u}x+=o},N=()=>{_?r.addPage():_=!0,x=r.page.margins.top,r.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",R,x,{lineBreak:!1}),x+=20,r.font("Helvetica").fontSize(9).fillColor("#333333").text(K,R,x,{lineBreak:!1}),x+=16,oe(W,[W[2]],"#dddddd",!0)};N();let U=()=>r.page.height-r.page.margins.bottom,se=()=>Math.max(1,Math.floor((U()-x-T)/y));for(let g of C){let s=0,f=!0;for(;s<g.taskLines.length;){let v=Math.min(g.taskLines.length-s,se());if(x+v*y+T>U()){N();continue}let o=g.taskLines.slice(s,s+v),a=f?g.values:[g.values[0],g.values[1],"","","","",""],c=R,u=v*y+T;r.rect(c,x,p,u).fill(g.fill);for(let h=0;h<a.length;h++){let w=m[h];r.rect(c,x,w,u).lineWidth(.35).stroke("#999999"),r.font("Helvetica").fontSize(7.5).fillColor("#222222"),(h===2?o:[a[h]]).forEach((D,E)=>{r.text(D,c+b,x+T/2+E*y,{lineBreak:!1})}),c+=w}x+=u,s+=v,f=!1,s<g.taskLines.length&&N()}}x+ne>U()&&N(),x+=8,r.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(z,R,x,{lineBreak:!1}),x+=14,M!==null&&(r.font("Helvetica").fontSize(7.5).text(M,R,x,{lineBreak:!1}),x+=14),r.font("Helvetica").fontSize(7.5).fillColor("#555555").text(A,R,x,{lineBreak:!1}),r.end()})}var ke=require("node:perf_hooks");function ee(e){return{total:Object.values(e.fileTimes).reduce((t,n)=>t+n,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function et(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),n=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof n!="function"||Function.prototype.toString.call(n)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let i=Object.create(null);for(let[r,l]of Object.entries(e)){if(!r||typeof l!="number"||!Number.isFinite(l)||l<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(r)}: expected a non-negative finite duration.`);i[r]=l}return{...i}}var X=class{constructor(t,n,i=()=>ke.performance.now(),r=[]){this.persistFileTimes=n;this.now=i;Object.assign(this.fileTimes,et(t)),this.excludedFiles=new Set(r)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let n=this.now();return this.accrueTime(n),this.activeFile=t||void 0,this.startedAt=this.isTracking()?n:void 0,this.persist()}setPaused(t){let n=this.now();return this.accrueTime(n),this.paused=t,this.startedAt=this.isTracking()?n:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let n=this.now();return this.accrueTime(n),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?n:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},n=[...this.excludedFiles];this.pendingSnapshots.add(t);let i=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},n)}catch(r){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(l){throw new Error(`File time reset failed: ${String(r)}; recovery write failed: ${String(l)}. Retry saving file times.`)}throw r}this.subtractBaseline(this.fileTimes,t);for(let r of this.pendingSnapshots)r!==t&&this.subtractBaseline(r,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=i.then(()=>{},()=>{}),i}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[n,i]of Object.entries(t))i===0&&!(n===this.activeFile&&this.isTracking())&&delete t[n];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,n){for(let[i,r]of Object.entries(n))if(Object.hasOwn(t,i)){let l=t[i]-r;l>0?t[i]=l:delete t[i]}}persist(){let t={...this.fileTimes},n=[...this.excludedFiles];this.pendingSnapshots.add(t);let i=this.writeQueue.then(()=>this.persistFileTimes({...t},n)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=i.then(()=>{},()=>{}),i}};var re=B(require("vscode")),Se=require("node:crypto"),Ie=B(require("node:path"));function Ee(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(n=>String(n).padStart(2,"0")).join(":")}var te=class{constructor(t,n){this.snapshot=t;this.toggleTracking=n}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=re.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:re.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let n=t.webview.onDidReceiveMessage(async r=>{if(!(!r||typeof r!="object"||!("type"in r)))switch(r.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),i=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{n.dispose(),i.dispose(),this.panel=void 0}),t.webview.html=tt()}update(){if(!this.panel)return;let t=this.snapshot(),n=ee(t);this.panel.webview.postMessage({type:"timer",totalTime:Ee(n.total),currentTime:Ee(n.current),currentFile:t.activeFile?Ie.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function tt(){let e=(0,Se.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
</html>`}var ae=require("node:crypto");var Fe=B(require("node:path")),De=B(require("pdfkit"));var Ce="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function Oe(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function ce(e,t=new Date){let n=Object.entries(e).map(([m,b])=>{if(!m||!Number.isFinite(b)||b<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:Fe.basename(m),milliseconds:b,percent:0}}).sort((m,b)=>b.milliseconds-m.milliseconds||m.name.localeCompare(b.name)),i=n.reduce((m,b)=>m+b.milliseconds,0);if(!Number.isFinite(i))throw new Error("The total tracked time is too large to export.");let r=new Map;for(let m of n)r.set(m.name,(r.get(m.name)??0)+1);let l=new Map,p=new Set(n.map(m=>m.name));for(let m of n){m.percent=i>0?m.milliseconds/i*100:0;let b=m.name;if(r.get(b)>1){let y=l.get(b)??0;do m.name=`${b} (${++y})`;while(p.has(m.name));l.set(b,y),p.add(m.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:i,files:n}}function rt(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ie(e){return $(Math.floor(e/6e4))}function ue(e,t){let n=e.files.map(i=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${rt(i.name)}</span>
<span class="file-time">${ie(i.milliseconds)} <small>${i.percent.toFixed(1)}%</small></span></div>
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
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${Oe(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${ie(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${n||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${Ce}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function Pe(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,n)=>{let i=new De.default({size:"A4",margin:44,compress:!0}),r=[];i.on("data",y=>r.push(y)),i.on("error",n),i.on("end",()=>t(Buffer.concat(r)));let l=i.page.width-88,p=0,m=()=>{i.rect(0,0,i.page.width,i.page.height).fill(i.linearGradient(0,0,i.page.width,i.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),i.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),i.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),i.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${Oe(e)}`,44,110),i.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${ie(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),p=190},b=()=>{i.addPage(),m()};m();for(let y of e.files){i.font("Helvetica").fontSize(11);let T=i.heightOfString(y.name,{width:l}),C=T+44;p+C>i.page.height-130&&b(),i.fillColor("#ffffff").font("Helvetica").fontSize(11).text(y.name,44,p,{width:l}),p+=T+6,i.fillColor("#ffe1a6").fontSize(10).text(`${ie(y.milliseconds)}  /  ${y.percent.toFixed(1)}%`,44,p),p+=18,i.roundedRect(44,p,l,6,3).fill("#45665d"),y.percent>0&&i.rect(44,p,l*y.percent/100,6).fill(i.linearGradient(44,p,44+l,p).stop(0,"#7edcbb").stop(1,"#ffcc7d")),p+=20}e.files.length||(i.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,p),p+=32),p+90>i.page.height-44&&b(),i.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(Ce,44,p+12,{width:l}),i.end()})}var L=require("node:fs"),Re=require("node:crypto"),$e=B(require("node:path"));function Me(e){(0,L.mkdirSync)(e,{recursive:!0});let t=$e.join(e,"time-tracker.owner.lock"),n=JSON.stringify({pid:process.pid,token:(0,Re.randomBytes)(16).toString("hex")});try{(0,L.writeFileSync)(t,n,{flag:"wx"})}catch(i){throw i.code==="EEXIST"?new Error(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${t}, then reopen VS Code.`):i}return()=>{if((0,L.readFileSync)(t,"utf8")!==n)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,L.unlinkSync)(t)}}var it="time-tracker.data",at="timesheet.json",Ae="time-tracker.file-times",pe="time-tracker.file-activity",Be="excludedFiles",nt="2026-10-21",Y,q,qe=Promise.resolve(),fe,me;function He(){return(0,ae.randomBytes)(16).toString("hex")}function ye(e){return typeof e=="string"&&/^[a-f0-9]{32}$/.test(e)}function Le(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={},n=new Set;if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[l,p]of Object.entries(e.entries)){let m=!Array.isArray(p),b=m?[p]:p;t[l]=b.map(y=>{if(!y||typeof y!="object"||typeof y.date!="string"||typeof y.task!="string"||typeof y.timeIn!="string"||typeof y.timeOut!="string"||y.date!==l||J(y))throw new Error(`The saved entry for ${l} is invalid. Restore or repair the JSON file before continuing.`);let T=y.id===void 0&&m?He():y.id;if(!ye(T))throw new Error(`The saved entry for ${l} has an invalid identifier. Restore or repair the JSON file before continuing.`);if(n.has(T))throw new Error(`The saved entry for ${l} has a duplicate identifier. Restore or repair the JSON file before continuing.`);return n.add(T),{...y,id:T}}),t[l].length||delete t[l]}}let i=e.periodStart===void 0?nt:e.periodStart;if(typeof i!="string"||!P(i))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");try{j(i)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}let r=e.hourlyRate===void 0?null:e.hourlyRate;if(r!==null&&(typeof r!="number"||!Number.isFinite(r)||r<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:i,hourlyRate:r}}function ve(e){return F.join(e.globalStorageUri.fsPath,at)}async function ze(e,t){let n=ve(e);await(0,k.mkdir)(F.dirname(n),{recursive:!0});let i=`${n}.${process.pid}.${(0,ae.randomBytes)(8).toString("hex")}.tmp`,r=await(0,k.open)(i,"wx");try{await r.writeFile(JSON.stringify(t,null,2),"utf8"),await r.close(),await(0,k.rename)(i,n)}catch(l){try{await r.close(),await(0,k.unlink)(i)}catch(p){let m=l instanceof Error?l.message:String(l),b=p instanceof Error?p.message:String(p);throw new AggregateError([l,p],`Could not save the timesheet: ${m}. Temporary file cleanup failed: ${b}`)}throw l}}async function ot(e){try{let n=await(0,k.readFile)(ve(e),"utf8");return Le(JSON.parse(n))}catch(n){if(n.code!=="ENOENT")throw n}let t=Le(e.globalState.get(it));return await ze(e,t),t}async function Ne(e,t,n){let i=d.workspace.workspaceFolders?.[0]?.uri??d.Uri.file((0,je.homedir)()),r=await d.window.showSaveDialog({defaultUri:d.Uri.joinPath(i,e),filters:{[t==="html"?"HTML documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!r)return;let l=F.extname(r.fsPath).toLowerCase()===`.${t}`?r.fsPath:`${r.fsPath}.${t}`;return await(0,k.writeFile)(l,await n()),l}function st(e){let t=[],n=(s,f=!1)=>{let v=()=>{(async()=>{try{if(await d.window.showErrorMessage(s,...f?["Export raw data"]:[])!=="Export raw data")return;let c=await d.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!c)return;let u={fileActivity:e.globalState.get(pe),fileTimes:e.globalState.get(Ae),excludedFiles:e.globalState.get(Be),legacyFileTimers:e.globalState.get("fileTimers")};await(0,k.writeFile)(c.fsPath,JSON.stringify(u,null,2),"utf8"),d.window.showInformationMessage(`Raw file activity data saved to ${c.fsPath}.`)}catch(a){let c=a instanceof Error?a.message:String(a);d.window.showErrorMessage(`Could not export raw file activity data: ${c}`)}})()},o=d.window.createStatusBarItem(d.StatusBarAlignment.Right,100);o.text="$(debug-pause) Time Tracker unavailable",o.tooltip=s,o.command="time-tracker.openTimesheet",o.show(),e.subscriptions.push(o,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes"].map(a=>d.commands.registerCommand(a,v))),v()};try{q=Me(e.globalStorageUri.fsPath);let s=e.globalState.get(pe),f=e.globalState.get(Ae),v=e.globalState.get(Be);if(s!==void 0){if(!s||typeof s!="object"||Array.isArray(s)||!("version"in s)||s.version!==1||!("fileTimes"in s)||s.fileTimes===void 0||!("excludedFiles"in s)||s.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");f=s.fileTimes,v=s.excludedFiles}if(v!==void 0){if(!Array.isArray(v)||v.some(o=>typeof o!="string"||!o))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(v)]}Y=new X(f,async(o,a)=>e.globalState.update(pe,{version:1,fileTimes:o,excludedFiles:[...a]}),void 0,t),e.globalState.get("fileTimers")!==void 0&&d.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(s){let f=s instanceof Error?s.message:String(s),v=!!q;if(q)try{q()}catch(o){let a=o instanceof Error?o.message:String(o);n(`${f} Could not release storage ownership: ${a}`);return}finally{q=void 0}n(f,v);return}let i=new Set,r=!1,l=Y,p=()=>{let s=l.snapshot();return{...s,excluded:!!s.activeFile&&l.isExcluded(s.activeFile)}},m,b,y=Promise.resolve(),T=async()=>{if(m)return m;b||(b=ot(e),fe=b);try{return m=await b,m}finally{b=void 0,fe=void 0}},C=s=>{if(r)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let f=y.then(async()=>{let v=s(await T());await ze(e,v),m=v;for(let o of i)await o.webview.postMessage({type:"saved",data:{...v,...p()}})});return y=f.then(()=>{},()=>{}),qe=y,f},O=d.window.createStatusBarItem(d.StatusBarAlignment.Right,100);O.command="time-tracker.openTimesheet",O.text="$(watch) 0h 00m | 0h 00m",O.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,O.show();let H=s=>{let f=s instanceof Error?s.message:String(s);d.window.showErrorMessage(`Could not save automatic file time data: ${f}`)},S=()=>{let s=p(),f=ee(s),v=$(Math.floor(f.total/6e4)),o=$(Math.floor(f.current/6e4)),a=s.activeFile?`Current file (${F.basename(s.activeFile)})`:"Current file";O.text=`${s.paused?"$(debug-pause)":"$(watch)"} ${v} | ${o}`+(s.excluded?" Excluded":s.activeFile?"":" Waiting"),O.tooltip=`Total tracked: ${v}
${a}: ${o}
${s.paused?`Automatic tracking paused
`:s.excluded?`Current file excluded
`:""}Click to open Time Tracker`,A.update();for(let c of i)c.webview.postMessage({type:"fileTimes",data:s})},z=async s=>{S();try{await s}catch(f){H(f)}S()},M=()=>r?Promise.resolve():z(l.setPaused(!l.snapshot().paused)),A=new te(p,M),W=d.commands.registerCommand("time-tracker.showFloatingTimer",()=>A.show()),K=d.commands.registerCommand("time-tracker.hideFloatingTimer",()=>A.hide()),ge=d.commands.registerCommand("time-tracker.toggleTracking",M),ne=d.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(r){d.window.showErrorMessage("Time Tracker is shutting down.");return}let s=d.window.activeTextEditor,f=s?.document.uri.scheme==="file"?s.document.uri.fsPath:void 0,v=f?[f,...t.filter(u=>u!==f)]:t;if(!v.length){d.window.showInformationMessage("No local file is active and no files are excluded.");return}let o=await d.window.showQuickPick(v.map(u=>({label:`${l.isExcluded(u)?"Include":"Exclude"} ${F.basename(u)}`,description:u,file:u})),{placeHolder:"Choose a local file to exclude or include"});if(!o)return;let a=new Set(t);a.has(o.file)?a.delete(o.file):a.add(o.file),t=[...a];let c=l.setExcludedFiles(t);S();try{await c,d.window.showInformationMessage(`${F.basename(o.file)} is ${l.isExcluded(o.file)?"excluded":"included"}.`)}catch(u){H(u)}S()}),R=d.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(r){d.window.showErrorMessage("Time Tracker is shutting down.");return}if(await d.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await l.reset(),S(),d.window.showInformationMessage("Automatic file activity was reset.")}catch(f){H(f),S()}}),x=()=>{if(r)return;let s=d.window.activeTextEditor,f=d.window.state.focused&&s?.document.uri.scheme==="file"?s.document.uri.fsPath:void 0;z(l.setActiveFile(f))};x();let _=d.window.onDidChangeActiveTextEditor(x),oe=d.window.onDidChangeWindowState(x),N=setInterval(()=>{r||z(l.checkpoint())},6e4),U=setInterval(S,1e3);me=()=>{r=!0,clearInterval(N),clearInterval(U)};let se=d.commands.registerCommand("time-tracker.openTimeCard",()=>{let s;try{s=ce(Y?.snapshot().fileTimes??{})}catch(a){let c=a instanceof Error?a.message:String(a);d.window.showErrorMessage(`Could not generate the time card: ${c}`);return}let f=d.window.createWebviewPanel("timeTrackerCard","Time Card Preview",d.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),v=()=>{f.webview.html=ue(s,{nonce:(0,ae.randomBytes)(16).toString("hex")})};v();let o=f.webview.onDidReceiveMessage(async a=>{try{if(a.type==="refresh")s=ce(Y?.snapshot().fileTimes??{}),v();else if(a.type==="export"){if(a.format!=="html"&&a.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let c=a.format,u=s,h=`time-card-${u.generatedAt.slice(0,10)}.${c}`,w=await Ne(h,c,()=>c==="html"?Buffer.from(ue(u),"utf8"):Pe(u));w&&d.window.showInformationMessage(`Time card saved to ${w}`)}}catch(c){let u=c instanceof Error?c.message:String(c);d.window.showErrorMessage(`Could not generate or export the time card: ${u}`)}});f.onDidDispose(()=>o.dispose())}),g=d.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(r){d.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let s=d.window.createWebviewPanel("timeTracker","Time Tracker",d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});try{await T()}catch(o){s.dispose();let a=o instanceof Error?o.message:String(o);d.window.showErrorMessage(`Could not load ${ve(e)}: ${a}`);return}i.add(s),s.onDidDispose(()=>i.delete(s)),s.webview.html=be(s.webview);let f=async()=>{await s.webview.postMessage({type:"state",data:{...await T(),...p()}})};function v(o,a){if(!o||!a||o.id!==a.id||o.date!==a.date||o.task!==a.task||o.timeIn!==a.timeIn||o.timeOut!==a.timeOut)throw new Error("This entry changed in another view. Reload it before editing again.")}s.webview.onDidReceiveMessage(async o=>{if(!o||typeof o!="object"||typeof o.type!="string"){d.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(o.type){case"showFloatingTimer":A.show();break;case"openTimeCard":await d.commands.executeCommand("time-tracker.openTimeCard");break;case"ready":await f();break;case"createEntry":case"saveEntry":{let a=o.entry;if(!a||typeof a.date!="string"||typeof a.task!="string"||typeof a.timeIn!="string"||typeof a.timeOut!="string"||!P(a.date))throw new Error("Enter a valid date, task, and time values.");let c=!a.task.trim()&&!a.timeIn&&!a.timeOut,u=c&&o.type==="saveEntry"?void 0:J(a);if(u)throw new Error(u);if(o.type==="createEntry"){if(typeof o.requestId!="string"||!o.requestId||o.requestId.length>128)throw new Error("The new entry request is invalid. Try again.");let h={...a,id:He(),task:a.task.trim()};await C(w=>({...w,entries:{...w.entries,[a.date]:[...w.entries[a.date]??[],h]}})),await s.webview.postMessage({type:"entryCreated",requestId:o.requestId,entry:h});break}if(!ye(o.id))throw new Error("Select a saved entry before editing it.");await C(h=>{let w=h.entries[a.date]??[],D=w.findIndex(I=>I.id===o.id),E=w[D];v(E,o.expected);let V={...h.entries};if(c){let I=w.filter(Ue=>Ue.id!==o.id);I.length?V[a.date]=I:delete V[a.date]}else{let I=[...w];I[D]={...a,id:E.id,task:a.task.trim()},V[a.date]=I}return{...h,entries:V}});break}case"deleteEntry":if(!o.date||!P(o.date)||!ye(o.id))throw new Error("Select a valid entry to delete.");await C(a=>{let c=o.date,u=a.entries[c]??[],h=u.find(E=>E.id===o.id);v(h,o.expected);let w={...a.entries},D=u.filter(E=>E.id!==o.id);return D.length?w[c]=D:delete w[c],{...a,entries:w}});break;case"setPeriodStart":if(typeof o.value!="string"||!P(o.value))throw new Error("Enter a valid period start date.");j(o.value),await C(a=>{if(a.periodStart!==o.expectedValue)throw new Error("The period start changed in another view. Reload it before editing again.");return{...a,periodStart:o.value}});break;case"setHourlyRate":{if(typeof o.value!="string"||o.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(o.value))throw new Error("Enter a valid hourly rate of zero or more.");let a=o.value===""?null:Number(o.value);if(a!==null&&(!Number.isFinite(a)||a<0))throw new Error("Enter a valid hourly rate of zero or more.");await C(c=>{if(c.hourlyRate!==o.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...c,hourlyRate:a}});break}case"requestReportAction":{await y;let a=await T(),c=await d.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(c?.value==="print"){try{let u=await le(a),h=F.join(e.globalStorageUri.fsPath,"print-reports");await(0,k.mkdir)(h,{recursive:!0});let w=await(0,k.mkdtemp)(F.join(h,"report-")),D=`timesheet-${a.periodStart}-to-${j(a.periodStart)}.pdf`,E=F.join(w,D);if(await(0,k.writeFile)(E,u),!await d.env.openExternal(d.Uri.file(E)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");d.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(u){let h=u instanceof Error?u.message:String(u);d.window.showErrorMessage(`Could not open the report for printing: ${h}`)}break}if(c?.value==="pdf"){let u=`timesheet-${a.periodStart}-to-${j(a.periodStart)}.pdf`;try{let h=await Ne(u,"pdf",()=>le(a));h&&d.window.showInformationMessage(`PDF saved to ${h}`)}catch(h){let w=h instanceof Error?h.message:String(h);d.window.showErrorMessage(`Could not save the PDF: ${w}`)}}break}}}catch(a){let c=a instanceof Error?a.message:String(a);await s.webview.postMessage({type:"error",requestId:o.requestId,view:o.view??(o.type==="setPeriodStart"||o.type==="setHourlyRate"?"report":"entries"),message:c})}})});e.subscriptions.push(g,se,W,K,ge,ne,R,A,O,_,oe,{dispose:()=>clearInterval(N)},{dispose:()=>clearInterval(U)})}async function dt(){me?.();try{let t=(await Promise.allSettled([Y?.setActiveFile(void 0),qe,fe])).find(n=>n.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{Y=void 0,me=void 0,q?.(),q=void 0}}0&&(module.exports={activate,deactivate});
