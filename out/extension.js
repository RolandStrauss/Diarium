"use strict";var Be=Object.create;var Q=Object.defineProperty;var He=Object.getOwnPropertyDescriptor;var ze=Object.getOwnPropertyNames;var Ue=Object.getPrototypeOf,Ve=Object.prototype.hasOwnProperty;var qe=(e,t)=>{for(var i in t)Q(e,i,{get:t[i],enumerable:!0})},fe=(e,t,i,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of ze(t))!Ve.call(e,r)&&r!==i&&Q(e,r,{get:()=>t[r],enumerable:!(a=He(t,r))||a.enumerable});return e};var L=(e,t,i)=>(i=e!=null?Be(Ue(e)):{},fe(t||!e||!e.__esModule?Q(i,"default",{value:e,enumerable:!0}):i,e)),Ye=e=>fe(Q({},"__esModule",{value:!0}),e);var at={};qe(at,{activate:()=>tt,deactivate:()=>rt});module.exports=Ye(at);var d=L(require("vscode")),x=require("node:fs/promises"),Ae=require("node:os"),S=L(require("node:path"));function We(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function me(e){let t=We();return`<!DOCTYPE html>
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
<div class="toolbar"><div><label for="year-select">Calendar year</label><select id="year-select"></select></div><p class="subtle">One entry per date. Overnight shifts are calculated automatically.</p></div>
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
<thead><tr><th scope="col">Date</th><th scope="col">Task</th><th scope="col">Time In</th><th scope="col">Time Out</th><th scope="col">Duration</th><th scope="col">Action</th></tr></thead>
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
<thead><tr><th scope="col">Date</th><th scope="col">Day</th><th scope="col">Task</th><th scope="col">Time In</th><th scope="col">Time Out</th><th scope="col">Duration</th></tr></thead>
<tbody id="report-body"></tbody>
</table></div>
<div id="print-summary" class="totals" aria-live="polite"></div>
</section>
</main>
<script nonce="${t}">
const vscode = acquireVsCodeApi();
const byId = (id) => document.getElementById(id);
let data = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null, paused: false, excluded: false };
const drafts = {};
let periodDraft = null; let rateDraft = null; let renderPending = false;
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
function allEntries() { return Object.values(data.entries); }
function entryFor(date) { return drafts[date]?.entry || data.entries[date] || { date, task: '', timeIn: '', timeOut: '' }; }
function expectedFor(date) { return drafts[date] ? drafts[date].expected : (data.entries[date] || null); }
function sameEntry(a, b) { return (!a && !b) || Boolean(a && b && a.date === b.date && a.task === b.task && a.timeIn === b.timeIn && a.timeOut === b.timeOut); }
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
 let visible = Array.from(dates).sort().filter((date) => {
  const entry = data.entries[date]; if (filterDate && date !== filterDate) return false;
  return !taskQuery || (entry && entry.task.toLowerCase().includes(taskQuery));
 });
 if (filterDate && taskQuery && data.entries[filterDate] && !visible.includes(filterDate)) visible = [];
 byId('row-count').textContent = visible.length + (visible.length === 1 ? ' date shown' : ' dates shown');
 byId('entries-body').innerHTML = visible.map((date) => {
  const entry = entryFor(date); const value = minutes(entry); const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut);
  return '<tr data-date="' + date + '" data-expected="' + esc(JSON.stringify(expectedFor(date))) + '" class="' + (incomplete ? 'incomplete ' : '') + (dateObj(date).getUTCDay() % 6 === 0 ? 'weekend' : '') + '">' +
   '<td class="date">' + esc(dateText(date)) + (dateObj(date).getUTCDay() % 6 === 0 ? ' (Weekend)' : '') + '</td>' +
   '<td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="entries-error" aria-label="Task for ' + esc(dateText(date)) + '"></td>' +
   '<td class="time"><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-describedby="entries-error" aria-label="Time In for ' + esc(dateText(date)) + '"></td>' +
   '<td class="time"><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-describedby="entries-error" aria-label="Time Out for ' + esc(dateText(date)) + '"></td>' +
   '<td class="duration ' + (incomplete ? 'warning-text' : '') + '" aria-label="Duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td>' +
   '<td><button type="button" data-action="delete" aria-label="Delete entry for ' + esc(dateText(date)) + '" ' + (data.entries[date] ? '' : 'disabled') + '>Delete</button>' +
   ' <button type="button" data-action="discard" aria-label="Discard draft for ' + esc(dateText(date)) + '"' + (drafts[date] ? '' : ' hidden') + '>Discard draft</button></td></tr>';
 }).join('');
 byId('entries-body').querySelectorAll('input').forEach((input) => { input.addEventListener('input', rememberRow); input.addEventListener('change', saveRow); });
 byId('entries-body').querySelectorAll('[data-action="discard"]').forEach((button) => button.addEventListener('click', discardDraft));
 byId('entries-body').querySelectorAll('[data-action="delete"]').forEach((button) => button.addEventListener('click', deleteRow));
 updateEntryTotals(visible);
}
function updateEntryTotals(visibleDates) {
 const visibleSet = new Set(visibleDates);
 const filtered = allEntries().filter((entry) => visibleSet.has(entry.date));
 const values = filtered.map(minutes).filter((value) => value !== null);
 byId('entry-total').textContent = durationText(values.reduce((sum, value) => sum + value, 0));
 byId('entry-count').textContent = String(values.length);
}
function saveRow(event) {
 const row = event.target.closest('tr'); const fields = { task: row.querySelector('[data-field="task"]'), timeIn: row.querySelector('[data-field="timeIn"]'), timeOut: row.querySelector('[data-field="timeOut"]') };
 const entry = { date: row.dataset.date, task: fields.task.value.trim(), timeIn: fields.timeIn.value, timeOut: fields.timeOut.value };
 const expected = JSON.parse(row.dataset.expected);
 drafts[entry.date] = { entry, expected, pending: false };
 if (!validateRow(entry, fields, 'entries-error', true)) return;
 drafts[entry.date].pending = true;
 vscode.postMessage({ type: 'saveEntry', entry, expected });
}
function rememberRow(event) {
 const row = event.target.closest('tr'); const date = row.dataset.date;
 drafts[date] = { entry: { date, task: row.querySelector('[data-field="task"]').value, timeIn: row.querySelector('[data-field="timeIn"]').value, timeOut: row.querySelector('[data-field="timeOut"]').value }, expected: JSON.parse(row.dataset.expected), pending: false };
 row.querySelector('[data-action="discard"]').hidden = false;
}
function deleteRow(event) {
 const row = event.target.closest('tr'); const date = row.dataset.date;
 if (drafts[date]) drafts[date].deleting = true;
 vscode.postMessage({ type: 'deleteEntry', date, expected: JSON.parse(row.dataset.expected) });
}
function discardDraft(event) {
 delete drafts[event.target.closest('tr').dataset.date]; setError('entries-error', ''); setError('report-error', ''); renderEntries(); renderReport();
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
 let total = 0; let days = 0; const rows = [];
 for (let date = start; date <= end;) {
  const entry = entryFor(date); const value = minutes(entry); const savedValue = minutes(data.entries[date]); const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut); if (savedValue !== null) { total += savedValue; days++; }
  const weekday = dateObj(date).getUTCDay();
	rows.push('<tr data-date="' + date + '" data-expected="' + esc(JSON.stringify(expectedFor(date))) + '" class="' + (incomplete ? 'incomplete ' : '') + (weekday === 0 || weekday === 6 ? 'weekend' : '') + '"><td class="date">' + esc(date) + '</td><td>' + esc(new Intl.DateTimeFormat(undefined, { weekday: 'long', timeZone: 'UTC' }).format(dateObj(date))) + '</td><td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-describedby="report-error" aria-label="Task for ' + esc(dateText(date)) + '"> <button type="button" class="screen-only" data-action="discard" aria-label="Discard draft for ' + esc(dateText(date)) + '"' + (drafts[date] ? '' : ' hidden') + '>Discard draft</button><span class="print-task"></span></td><td><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-describedby="report-error" aria-label="Time In for ' + esc(dateText(date)) + '"><span class="print-time">' + esc(entry.timeIn) + '</span></td><td><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-describedby="report-error" aria-label="Time Out for ' + esc(dateText(date)) + '"><span class="print-time">' + esc(entry.timeOut) + '</span></td><td class="duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td></tr>');
  if (date === end) break;
  date = addDays(date, 1);
 }
 byId('report-body').innerHTML = rows.join('');
 byId('report-body').querySelectorAll('input').forEach((input) => { input.addEventListener('input', rememberRow); input.addEventListener('change', saveReportRow); });
 byId('report-body').querySelectorAll('[data-action="discard"]').forEach((button) => button.addEventListener('click', discardDraft));
 byId('report-body').querySelectorAll('tr').forEach((row) => row.querySelector('.print-task').textContent = row.querySelector('[data-field="task"]').value);
 byId('report-days').textContent = days + (days === 1 ? ' day logged' : ' days logged') + (Object.keys(drafts).some((date) => date >= start && date <= end) ? ' (saved entries only; drafts excluded)' : '');
 const rate = data.hourlyRate;
 const estimate = total / 60 * rate;
 byId('print-summary').innerHTML = '<div class="metric"><strong>' + durationText(total) + '</strong><span>Total hours</span></div><div class="metric"><strong>' + days + '</strong><span>Days logged</span></div>' + (rate === null ? '' : '<div class="metric"><strong>' + (Number.isFinite(estimate) ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }).format(estimate) : 'Estimate exceeds supported range') + '</strong><span>Estimated value (informational)</span></div>');
}
function saveReportRow(event) {
 const row = event.target.closest('tr'); const fields = { task: row.querySelector('[data-field="task"]'), timeIn: row.querySelector('[data-field="timeIn"]'), timeOut: row.querySelector('[data-field="timeOut"]') };
 const entry = { date: row.dataset.date, task: fields.task.value.trim(), timeIn: fields.timeIn.value, timeOut: fields.timeOut.value };
 row.querySelector('.print-task').textContent = entry.task;
 const expected = JSON.parse(row.dataset.expected);
 drafts[entry.date] = { entry, expected, pending: false };
 if (!validateRow(entry, fields, 'report-error', true)) return;
 drafts[entry.date].pending = true;
 vscode.postMessage({ type: 'saveEntry', entry, view: 'report', expected });
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
 if (data.entries[entry.date]) { fieldError(fields.date, 'entries-error', 'There is already an entry for this date. Edit the existing row instead.'); return; }
 vscode.postMessage({ type: 'createEntry', entry });
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
 if (message.type === 'state' || message.type === 'saved') {
  data = message.data;
  Object.keys(drafts).forEach((date) => {
   const entry = drafts[date].entry; const saved = data.entries[date];
   if ((drafts[date].deleting && !saved) || (drafts[date].pending && ((!saved && !entry.task && !entry.timeIn && !entry.timeOut) || sameEntry(saved, entry)))) delete drafts[date];
  });
  if (Object.keys(drafts).some((date) => !sameEntry(drafts[date].expected, data.entries[date]))) {
   const text = 'An entry changed elsewhere. Your draft is retained; copy it or discard it before editing the latest entry.';
   setError('entries-error', text); setError('report-error', text);
  }
  if (periodDraft?.pending && periodDraft.value === data.periodStart) periodDraft = null;
  if (rateDraft?.pending && (rateDraft.value === '' ? null : Number(rateDraft.value)) === data.hourlyRate) rateDraft = null;
  if ((periodDraft && periodDraft.expectedValue !== data.periodStart) || (rateDraft && rateDraft.expectedValue !== data.hourlyRate)) setError('report-error', 'A setting changed elsewhere. Your draft is retained; copy it or discard it before editing the latest value.');
  const active = document.activeElement;
  if (active && ((active.closest('tr[data-date]') && drafts[active.closest('tr[data-date]').dataset.date]) || (active.id === 'period-start' && periodDraft) || (active.id === 'hourly-rate' && rateDraft))) { renderPending = true; renderFileTimes(); }
  else { renderYearSelect(); render(); }
 }
 if (message.type === 'fileTimes') { data.fileTimes = message.data.fileTimes; data.activeFile = message.data.activeFile; data.paused = message.data.paused; data.excluded = message.data.excluded; data.activeEligible = message.data.activeEligible; renderFileTimes(); }
 if (message.type === 'error') {
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
</html>`}function P(e){if(typeof e!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(e)||e.startsWith("0000-"))return!1;let[t,i,a]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);return r.getUTCFullYear()===t&&r.getUTCMonth()===i-1&&r.getUTCDate()===a}function Z(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function ve(e){if(!Z(e.timeIn)||!Z(e.timeOut))return;let[t,i]=e.timeIn.split(":").map(Number),[a,r]=e.timeOut.split(":").map(Number),l=t*60+i,c=a*60+r;return c<l&&(c+=1440),c-l}function ge(e,t){if(!P(e)||!Number.isSafeInteger(t))throw new RangeError("Enter a valid calendar date and day offset.");let i=new Date(`${e}T00:00:00Z`);return i.setUTCDate(i.getUTCDate()+t),ye(i)}function ye(e){if(!Number.isFinite(e.getTime())||e.getUTCFullYear()<1||e.getUTCFullYear()>9999)throw new RangeError("Date is outside the supported four-digit calendar range.");return e.toISOString().slice(0,10)}function B(e){if(!P(e))throw new RangeError("Enter a valid period start date.");let[t,i,a]=e.split("-").map(Number),r=new Date(`${e}T00:00:00Z`);r.setUTCDate(1),r.setUTCFullYear(t,i+1,0);let l=r.getUTCDate();return r.setUTCDate(Math.min(a,l)-1),ye(r)}function Y(e){if(!P(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!Z(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!Z(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function N(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var he=L(require("pdfkit"));function G(e){let[t,i,a]=e.split("-").map(Number),r=new Date(0);return r.setUTCFullYear(t,i-1,a),new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(r)}function Je(e){let t=new Date(`${e}T00:00:00Z`),i=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${i} (Weekend)`:i}function ae(e){return new Promise((t,i)=>{if(!P(e.periodStart))throw new Error("Cannot generate PDF: invalid period start date.");if(e.hourlyRate!==null&&(!Number.isFinite(e.hourlyRate)||e.hourlyRate<0))throw new Error("Cannot generate PDF: hourly rate must be finite and non-negative.");let a;try{a=B(e.periodStart)}catch{throw new Error("Cannot generate PDF: period end is outside the supported calendar.")}if(!P(a)||a<e.periodStart)throw new Error("Cannot generate PDF: period end is outside the supported calendar.");let r=new he.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),l=[];r.on("data",v=>l.push(v)),r.on("error",i),r.on("end",()=>t(Buffer.concat(l)));let c=r.page.width-r.page.margins.left-r.page.margins.right,p=[70,80,c-70-80-48-48-70,48,48,70],y=3;r.font("Helvetica").fontSize(7.5);let h=r.currentLineHeight(!0),I=2,F=[],D=0,z=0;for(let v=e.periodStart;;v=ge(v,1)){let b=e.entries[v]??{date:v,task:"",timeIn:"",timeOut:""};if(e.entries[v]){let f=Y(b);if(b.date!==v||f)throw new Error(`Cannot generate PDF: invalid entry for ${v}. ${f??"Entry date does not match."}`)}if(/[^\x20-\x7e]/.test(b.task))throw new Error(`Cannot generate PDF: task for ${v} contains unsupported characters; only printable ASCII is supported.`);let k=[],C="";for(let f of b.task){if(r.widthOfString(C+f)>p[2]-y*2){if(!C)throw new Error(`Cannot generate PDF: task for ${v} cannot fit in the task column.`);k.push(C),C=""}C+=f}(C||!k.length)&&k.push(C);let A=ve(b),o=!!b.timeIn!=!!b.timeOut;A!==void 0&&(D+=A,z++);let u=new Date(`${v}T00:00:00Z`).getUTCDay()%6===0;if(F.push({values:[G(v),Je(v),b.task,b.timeIn,b.timeOut,A===void 0?o?"INCOMPLETE":"":N(A)],taskLines:k,height:k.length*h+I,fill:o?"#fff2cc":u?"#eeeeee":"#ffffff"}),v===a)break}let E=e.hourlyRate===null?null:D/60*e.hourlyRate;if(E!==null&&(!Number.isFinite(E)||E>=1e21))throw new Error("Cannot generate PDF: estimated value is too large to display to two decimal places.");let U=`Total hours: ${N(D)}     Days logged: ${z}`,$=E===null?null:`Hourly rate: ${e.hourlyRate}     Estimated value (informational): ${E.toFixed(2)}`,M=`Generated ${G(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,q=["Date","Day","Task","Time In","Time Out","Duration"],W=`Reporting period: ${G(e.periodStart)} to ${G(a)}`,J=h+I;if(36+J+F.reduce((v,b)=>v+b.height,0)+8+14+($===null?0:14)+h>r.page.height-r.page.margins.top-r.page.margins.bottom)throw new Error("Cannot generate PDF: all task content does not fit on one landscape A4 page at 7.5-point type.");if(r.font("Helvetica-Bold").fontSize(7.5),q.some((v,b)=>r.widthOfString(v)>p[b]-y*2))throw new Error("Cannot generate PDF: a column heading does not fit.");r.font("Helvetica").fontSize(7.5);for(let v of F)if(v.values.some((b,k)=>k!==2&&r.widthOfString(b)>p[k]-y*2))throw new Error("Cannot generate PDF: a report value does not fit in its column.");if($!==null&&r.widthOfString($)>c||r.widthOfString(M)>c)throw new Error("Cannot generate PDF: report summary does not fit on one page.");if(r.font("Helvetica-Bold").fontSize(9),r.widthOfString(U)>c)throw new Error("Cannot generate PDF: report summary does not fit on one page.");if(r.font("Helvetica").fontSize(9),r.widthOfString(W)>c)throw new Error("Cannot generate PDF: period does not fit on one page.");let T=r.page.margins.top,O=r.page.margins.left;r.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",O,T,{lineBreak:!1}),T+=20,r.font("Helvetica").fontSize(9).fillColor("#333333").text(W,O,T,{lineBreak:!1}),T+=16;let _=(v,b,k,C,A=!1)=>{let o=O;r.rect(o,T,c,k).fill(C);for(let u=0;u<v.length;u++){let f=p[u];r.rect(o,T,f,k).lineWidth(.35).stroke("#999999"),r.font(A?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222"),(u===2?b:[v[u]]).forEach((n,m)=>{r.text(n,o+y,T+I/2+m*h,{lineBreak:!1})}),o+=f}T+=k};_(q,[q[2]],J,"#dddddd",!0);for(let v of F)_(v.values,v.taskLines,v.height,v.fill);T+=8,r.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(U,O,T,{lineBreak:!1}),T+=14,$!==null&&(r.font("Helvetica").fontSize(7.5).text($,O,T,{lineBreak:!1}),T+=14),r.font("Helvetica").fontSize(7.5).fillColor("#555555").text(M,O,T,{lineBreak:!1}),r.end()})}var be=require("node:perf_hooks");function X(e){return{total:Object.values(e.fileTimes).reduce((t,i)=>t+i,0),current:e.activeFile&&Object.hasOwn(e.fileTimes,e.activeFile)?e.fileTimes[e.activeFile]:0}}function _e(e){if(e===void 0)return{};if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let t=Object.getPrototypeOf(e),i=t&&Object.getOwnPropertyDescriptor(t,"constructor")?.value;if(t!==null&&(Object.getPrototypeOf(t)!==null||typeof i!="function"||Function.prototype.toString.call(i)!==Function.prototype.toString.call(Object)))throw new Error("Invalid stored file time data: expected an object of file paths and durations.");let a=Object.create(null);for(let[r,l]of Object.entries(e)){if(!r||typeof l!="number"||!Number.isFinite(l)||l<0)throw new Error(`Invalid stored file time data for ${JSON.stringify(r)}: expected a non-negative finite duration.`);a[r]=l}return{...a}}var K=class{constructor(t,i,a=()=>be.performance.now(),r=[]){this.persistFileTimes=i;this.now=a;Object.assign(this.fileTimes,_e(t)),this.excludedFiles=new Set(r)}persistFileTimes;now;fileTimes=Object.create(null);activeFile;startedAt;paused=!1;writeQueue=Promise.resolve();pendingSnapshots=new Set;excludedFiles;setActiveFile(t){let i=this.now();return this.accrueTime(i),this.activeFile=t||void 0,this.startedAt=this.isTracking()?i:void 0,this.persist()}setPaused(t){let i=this.now();return this.accrueTime(i),this.paused=t,this.startedAt=this.isTracking()?i:void 0,this.persist()}isExcluded(t){return this.excludedFiles.has(t)}setExcludedFiles(t){let i=this.now();return this.accrueTime(i),this.excludedFiles=new Set(t),this.startedAt=this.isTracking()?i:void 0,this.persist()}reset(){this.accrueTime(this.now());let t={...this.fileTimes},i=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(async()=>{try{await this.persistFileTimes({},i)}catch(r){try{await this.persistFileTimes({...this.fileTimes},[...this.excludedFiles])}catch(l){throw new Error(`File time reset failed: ${String(r)}; recovery write failed: ${String(l)}. Retry saving file times.`)}throw r}this.subtractBaseline(this.fileTimes,t);for(let r of this.pendingSnapshots)r!==t&&this.subtractBaseline(r,t)}).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};this.activeFile&&this.startedAt!==void 0&&Object.defineProperty(t,this.activeFile,{value:(this.fileTimes[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt),enumerable:!0,configurable:!0,writable:!0});for(let[i,a]of Object.entries(t))a===0&&!(i===this.activeFile&&this.isTracking())&&delete t[i];return{fileTimes:t,activeFile:this.activeFile??null,paused:this.paused}}isTracking(){return!!this.activeFile&&!this.paused&&!this.excludedFiles.has(this.activeFile)}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.isTracking()?t:void 0}subtractBaseline(t,i){for(let[a,r]of Object.entries(i))if(Object.hasOwn(t,a)){let l=t[a]-r;l>0?t[a]=l:delete t[a]}}persist(){let t={...this.fileTimes},i=[...this.excludedFiles];this.pendingSnapshots.add(t);let a=this.writeQueue.then(()=>this.persistFileTimes({...t},i)).finally(()=>this.pendingSnapshots.delete(t));return this.writeQueue=a.then(()=>{},()=>{}),a}};var te=L(require("vscode")),xe=require("node:crypto"),Te=L(require("node:path"));function we(e){let t=Math.floor(e/1e3);return[Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(i=>String(i).padStart(2,"0")).join(":")}var ee=class{constructor(t,i){this.snapshot=t;this.toggleTracking=i}snapshot;toggleTracking;panel;show(){if(this.panel){this.panel.reveal(this.panel.viewColumn,!0),this.update();return}let t=te.window.createWebviewPanel("timeTrackerFloatingTimer","Floating Timer",{viewColumn:te.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]});this.panel=t;let i=t.webview.onDidReceiveMessage(async r=>{if(!(!r||typeof r!="object"||!("type"in r)))switch(r.type){case"ready":this.update();break;case"toggleTracking":await this.toggleTracking();break;case"hide":this.hide();break}}),a=t.onDidChangeViewState(()=>this.update());t.onDidDispose(()=>{i.dispose(),a.dispose(),this.panel=void 0}),t.webview.html=Qe()}update(){if(!this.panel)return;let t=this.snapshot(),i=X(t);this.panel.webview.postMessage({type:"timer",totalTime:we(i.total),currentTime:we(i.current),currentFile:t.activeFile?Te.basename(t.activeFile):"No local file active",paused:t.paused,status:t.paused?"Paused":t.excluded?"Excluded":t.activeFile?"Tracking":"Waiting for a focused local file"})}hide(){this.panel?.dispose()}dispose(){this.hide()}};function Qe(){let e=(0,xe.randomBytes)(16).toString("hex");return`<!DOCTYPE html>
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
</html>`}var le=require("node:crypto");var ke=L(require("node:path")),Ee=L(require("pdfkit"));var Se="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function Ie(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function ie(e,t=new Date){let i=Object.entries(e).map(([p,y])=>{if(!p||!Number.isFinite(y)||y<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:ke.basename(p),milliseconds:y,percent:0}}).sort((p,y)=>y.milliseconds-p.milliseconds||p.name.localeCompare(y.name)),a=i.reduce((p,y)=>p+y.milliseconds,0);if(!Number.isFinite(a))throw new Error("The total tracked time is too large to export.");let r=new Map;for(let p of i)r.set(p.name,(r.get(p.name)??0)+1);let l=new Map,c=new Set(i.map(p=>p.name));for(let p of i){p.percent=a>0?p.milliseconds/a*100:0;let y=p.name;if(r.get(y)>1){let h=l.get(y)??0;do p.name=`${y} (${++h})`;while(c.has(p.name));l.set(y,h),c.add(p.name)}}return{generatedAt:t.toISOString(),totalMilliseconds:a,files:i}}function Ze(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function re(e){return N(Math.floor(e/6e4))}function ne(e,t){let i=e.files.map(a=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${Ze(a.name)}</span>
<span class="file-time">${re(a.milliseconds)} <small>${a.percent.toFixed(1)}%</small></span></div>
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
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${Ie(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${re(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${i||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${Se}</footer>
</main>
${t?`<script nonce="${t.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function Fe(e){return e.files.some(t=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(t.name))?Promise.reject(new Error("PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.")):new Promise((t,i)=>{let a=new Ee.default({size:"A4",margin:44,compress:!0}),r=[];a.on("data",h=>r.push(h)),a.on("error",i),a.on("end",()=>t(Buffer.concat(r)));let l=a.page.width-88,c=0,p=()=>{a.rect(0,0,a.page.width,a.page.height).fill(a.linearGradient(0,0,a.page.width,a.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),a.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),a.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${Ie(e)}`,44,110),a.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${re(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),c=190},y=()=>{a.addPage(),p()};p();for(let h of e.files){a.font("Helvetica").fontSize(11);let I=a.heightOfString(h.name,{width:l}),F=I+44;c+F>a.page.height-130&&y(),a.fillColor("#ffffff").font("Helvetica").fontSize(11).text(h.name,44,c,{width:l}),c+=I+6,a.fillColor("#ffe1a6").fontSize(10).text(`${re(h.milliseconds)}  /  ${h.percent.toFixed(1)}%`,44,c),c+=18,a.roundedRect(44,c,l,6,3).fill("#45665d"),h.percent>0&&a.rect(44,c,l*h.percent/100,6).fill(a.linearGradient(44,c,44+l,c).stop(0,"#7edcbb").stop(1,"#ffcc7d")),c+=20}e.files.length||(a.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,c),c+=32),c+90>a.page.height-44&&y(),a.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(Se,44,c+12,{width:l}),a.end()})}var j=require("node:fs"),De=require("node:crypto"),Ce=L(require("node:path"));function Pe(e){(0,j.mkdirSync)(e,{recursive:!0});let t=Ce.join(e,"time-tracker.owner.lock"),i=JSON.stringify({pid:process.pid,token:(0,De.randomBytes)(16).toString("hex")});try{(0,j.writeFileSync)(t,i,{flag:"wx"})}catch(a){throw a.code==="EEXIST"?new Error(`Time Tracker is paused because its storage is in use. Close the other window and reload. If the owner crashed, close every VS Code window before removing ${t}, then reopen VS Code.`):a}return()=>{if((0,j.readFileSync)(t,"utf8")!==i)throw new Error(`Storage ownership changed unexpectedly; the lock at ${t} was not removed.`);(0,j.unlinkSync)(t)}}var Ge="time-tracker.data",Ke="timesheet.json",Oe="time-tracker.file-times",oe="time-tracker.file-activity",Re="excludedFiles",Xe="2026-10-21",V,H,Le=Promise.resolve(),se,de;function $e(e={}){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("The saved timesheet is invalid. Restore or repair the JSON file before continuing.");let t={};if(e.entries!==void 0){if(!e.entries||typeof e.entries!="object"||Array.isArray(e.entries))throw new Error("The saved timesheet entries are invalid. Restore or repair the JSON file before continuing.");for(let[r,l]of Object.entries(e.entries)){if(!l||typeof l.date!="string"||typeof l.task!="string"||typeof l.timeIn!="string"||typeof l.timeOut!="string"||l.date!==r||Y(l))throw new Error(`The saved entry for ${r} is invalid. Restore or repair the JSON file before continuing.`);t[r]=l}}let i=e.periodStart===void 0?Xe:e.periodStart;if(typeof i!="string"||!P(i))throw new Error("The saved period start is invalid. Restore or repair the JSON file before continuing.");try{B(i)}catch{throw new Error("The saved period end is outside the supported calendar. Restore or repair the JSON file before continuing.")}let a=e.hourlyRate===void 0?null:e.hourlyRate;if(a!==null&&(typeof a!="number"||!Number.isFinite(a)||a<0))throw new Error("The saved hourly rate is invalid. Restore or repair the JSON file before continuing.");return{entries:t,periodStart:i,hourlyRate:a}}function ce(e){return S.join(e.globalStorageUri.fsPath,Ke)}async function Ne(e,t){let i=ce(e);await(0,x.mkdir)(S.dirname(i),{recursive:!0});let a=`${i}.${process.pid}.${(0,le.randomBytes)(8).toString("hex")}.tmp`,r=await(0,x.open)(a,"wx");try{await r.writeFile(JSON.stringify(t,null,2),"utf8"),await r.close(),await(0,x.rename)(a,i)}catch(l){try{await r.close(),await(0,x.unlink)(a)}catch(c){let p=l instanceof Error?l.message:String(l),y=c instanceof Error?c.message:String(c);throw new AggregateError([l,c],`Could not save the timesheet: ${p}. Temporary file cleanup failed: ${y}`)}throw l}}async function et(e){try{let i=await(0,x.readFile)(ce(e),"utf8");return $e(JSON.parse(i))}catch(i){if(i.code!=="ENOENT")throw i}let t=$e(e.globalState.get(Ge));return await Ne(e,t),t}async function Me(e,t,i){let a=d.workspace.workspaceFolders?.[0]?.uri??d.Uri.file((0,Ae.homedir)()),r=await d.window.showSaveDialog({defaultUri:d.Uri.joinPath(a,e),filters:{[t==="html"?"HTML documents":"PDF documents"]:[t]},saveLabel:`Save ${t.toUpperCase()}`});if(!r)return;let l=S.extname(r.fsPath).toLowerCase()===`.${t}`?r.fsPath:`${r.fsPath}.${t}`;return await(0,x.writeFile)(l,await i()),l}function tt(e){let t=[],i=(o,u=!1)=>{let f=()=>{(async()=>{try{if(await d.window.showErrorMessage(o,...u?["Export raw data"]:[])!=="Export raw data")return;let m=await d.window.showSaveDialog({filters:{"JSON documents":["json"]},saveLabel:"Export raw data containing file paths"});if(!m)return;let g={fileActivity:e.globalState.get(oe),fileTimes:e.globalState.get(Oe),excludedFiles:e.globalState.get(Re),legacyFileTimers:e.globalState.get("fileTimers")};await(0,x.writeFile)(m.fsPath,JSON.stringify(g,null,2),"utf8"),d.window.showInformationMessage(`Raw file activity data saved to ${m.fsPath}.`)}catch(n){let m=n instanceof Error?n.message:String(n);d.window.showErrorMessage(`Could not export raw file activity data: ${m}`)}})()},s=d.window.createStatusBarItem(d.StatusBarAlignment.Right,100);s.text="$(debug-pause) Time Tracker unavailable",s.tooltip=o,s.command="time-tracker.openTimesheet",s.show(),e.subscriptions.push(s,...["time-tracker.openTimesheet","time-tracker.openTimeCard","time-tracker.showFloatingTimer","time-tracker.hideFloatingTimer","time-tracker.toggleTracking","time-tracker.manageExclusions","time-tracker.resetFileTimes"].map(n=>d.commands.registerCommand(n,f))),f()};try{H=Pe(e.globalStorageUri.fsPath);let o=e.globalState.get(oe),u=e.globalState.get(Oe),f=e.globalState.get(Re);if(o!==void 0){if(!o||typeof o!="object"||Array.isArray(o)||!("version"in o)||o.version!==1||!("fileTimes"in o)||o.fileTimes===void 0||!("excludedFiles"in o)||o.excludedFiles===void 0)throw new Error("Invalid stored file activity data. Restore a backup before using Time Tracker.");u=o.fileTimes,f=o.excludedFiles}if(f!==void 0){if(!Array.isArray(f)||f.some(s=>typeof s!="string"||!s))throw new Error("Invalid stored file exclusions. Restore a backup before using Time Tracker.");t=[...new Set(f)]}V=new K(u,async(s,n)=>e.globalState.update(oe,{version:1,fileTimes:s,excludedFiles:[...n]}),void 0,t),e.globalState.get("fileTimers")!==void 0&&d.window.showWarningMessage("Older fileTimers data remains separate and was not imported. Back up your VS Code profile and reconcile it before relying on file activity totals.")}catch(o){let u=o instanceof Error?o.message:String(o),f=!!H;if(H)try{H()}catch(s){let n=s instanceof Error?s.message:String(s);i(`${u} Could not release storage ownership: ${n}`);return}finally{H=void 0}i(u,f);return}let a=new Set,r=!1,l=V,c=()=>{let o=l.snapshot();return{...o,excluded:!!o.activeFile&&l.isExcluded(o.activeFile)}},p,y,h=Promise.resolve(),I=async()=>{if(p)return p;y||(y=et(e),se=y);try{return p=await y,p}finally{y=void 0,se=void 0}},F=o=>{if(r)return Promise.reject(new Error("Time Tracker is shutting down; reopen it before editing."));let u=h.then(async()=>{let f=o(await I());await Ne(e,f),p=f;for(let s of a)await s.webview.postMessage({type:"saved",data:{...f,...c()}})});return h=u.then(()=>{},()=>{}),Le=h,u},D=d.window.createStatusBarItem(d.StatusBarAlignment.Right,100);D.command="time-tracker.openTimesheet",D.text="$(watch) 0h 00m | 0h 00m",D.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,D.show();let z=o=>{let u=o instanceof Error?o.message:String(o);d.window.showErrorMessage(`Could not save automatic file time data: ${u}`)},E=()=>{let o=c(),u=X(o),f=N(Math.floor(u.total/6e4)),s=N(Math.floor(u.current/6e4)),n=o.activeFile?`Current file (${S.basename(o.activeFile)})`:"Current file";D.text=`${o.paused?"$(debug-pause)":"$(watch)"} ${f} | ${s}`+(o.excluded?" Excluded":o.activeFile?"":" Waiting"),D.tooltip=`Total tracked: ${f}
${n}: ${s}
${o.paused?`Automatic tracking paused
`:o.excluded?`Current file excluded
`:""}Click to open Time Tracker`,M.update();for(let m of a)m.webview.postMessage({type:"fileTimes",data:o})},U=async o=>{E();try{await o}catch(u){z(u)}E()},$=()=>r?Promise.resolve():U(l.setPaused(!l.snapshot().paused)),M=new ee(c,$),q=d.commands.registerCommand("time-tracker.showFloatingTimer",()=>M.show()),W=d.commands.registerCommand("time-tracker.hideFloatingTimer",()=>M.hide()),J=d.commands.registerCommand("time-tracker.toggleTracking",$),ue=d.commands.registerCommand("time-tracker.manageExclusions",async()=>{if(r){d.window.showErrorMessage("Time Tracker is shutting down.");return}let o=d.window.activeTextEditor,u=o?.document.uri.scheme==="file"?o.document.uri.fsPath:void 0,f=u?[u,...t.filter(g=>g!==u)]:t;if(!f.length){d.window.showInformationMessage("No local file is active and no files are excluded.");return}let s=await d.window.showQuickPick(f.map(g=>({label:`${l.isExcluded(g)?"Include":"Exclude"} ${S.basename(g)}`,description:g,file:g})),{placeHolder:"Choose a local file to exclude or include"});if(!s)return;let n=new Set(t);n.has(s.file)?n.delete(s.file):n.add(s.file),t=[...n];let m=l.setExcludedFiles(t);E();try{await m,d.window.showInformationMessage(`${S.basename(s.file)} is ${l.isExcluded(s.file)?"excluded":"included"}.`)}catch(g){z(g)}E()}),T=d.commands.registerCommand("time-tracker.resetFileTimes",async()=>{if(r){d.window.showErrorMessage("Time Tracker is shutting down.");return}if(await d.window.showWarningMessage("Reset all automatic file activity across workspaces? Timesheet entries, exclusions, and exports will be kept.",{modal:!0},"Reset")==="Reset")try{await l.reset(),E(),d.window.showInformationMessage("Automatic file activity was reset.")}catch(u){z(u),E()}}),O=()=>{if(r)return;let o=d.window.activeTextEditor,u=d.window.state.focused&&o?.document.uri.scheme==="file"?o.document.uri.fsPath:void 0;U(l.setActiveFile(u))};O();let _=d.window.onDidChangeActiveTextEditor(O),v=d.window.onDidChangeWindowState(O),b=setInterval(()=>{r||U(l.checkpoint())},6e4),k=setInterval(E,1e3);de=()=>{r=!0,clearInterval(b),clearInterval(k)};let C=d.commands.registerCommand("time-tracker.openTimeCard",()=>{let o;try{o=ie(V?.snapshot().fileTimes??{})}catch(n){let m=n instanceof Error?n.message:String(n);d.window.showErrorMessage(`Could not generate the time card: ${m}`);return}let u=d.window.createWebviewPanel("timeTrackerCard","Time Card Preview",d.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),f=()=>{u.webview.html=ne(o,{nonce:(0,le.randomBytes)(16).toString("hex")})};f();let s=u.webview.onDidReceiveMessage(async n=>{try{if(n.type==="refresh")o=ie(V?.snapshot().fileTimes??{}),f();else if(n.type==="export"){if(n.format!=="html"&&n.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let m=n.format,g=o,w=`time-card-${g.generatedAt.slice(0,10)}.${m}`,R=await Me(w,m,()=>m==="html"?Buffer.from(ne(g),"utf8"):Fe(g));R&&d.window.showInformationMessage(`Time card saved to ${R}`)}}catch(m){let g=m instanceof Error?m.message:String(m);d.window.showErrorMessage(`Could not generate or export the time card: ${g}`)}});u.onDidDispose(()=>s.dispose())}),A=d.commands.registerCommand("time-tracker.openTimesheet",async()=>{if(r){d.window.showErrorMessage("Time Tracker is shutting down; reopen it before editing.");return}let o=d.window.createWebviewPanel("timeTracker","Time Tracker",d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});try{await I()}catch(s){o.dispose();let n=s instanceof Error?s.message:String(s);d.window.showErrorMessage(`Could not load ${ce(e)}: ${n}`);return}a.add(o),o.onDidDispose(()=>a.delete(o)),o.webview.html=me(o.webview);let u=async()=>{await o.webview.postMessage({type:"state",data:{...await I(),...c()}})},f=(s,n)=>{if(n===void 0||s===void 0!=(n===null)||s&&n&&(s.date!==n.date||s.task!==n.task||s.timeIn!==n.timeIn||s.timeOut!==n.timeOut))throw new Error("This entry changed in another view. Reload it before editing again.")};o.webview.onDidReceiveMessage(async s=>{if(!s||typeof s!="object"||typeof s.type!="string"){d.window.showErrorMessage("Invalid Time Tracker message.");return}try{switch(s.type){case"showFloatingTimer":M.show();break;case"openTimeCard":await d.commands.executeCommand("time-tracker.openTimeCard");break;case"ready":await u();break;case"createEntry":case"saveEntry":{let n=s.entry;if(!n||typeof n.date!="string"||typeof n.task!="string"||typeof n.timeIn!="string"||typeof n.timeOut!="string"||!P(n.date))throw new Error("Enter a valid date, task, and time values.");let m=!n.task.trim()&&!n.timeIn&&!n.timeOut,g=m&&s.type==="saveEntry"?void 0:Y(n);if(g)throw new Error(g);await F(w=>{if(s.type==="createEntry"&&w.entries[n.date])throw new Error("There is already an entry for this date. Edit the existing row instead.");s.type==="saveEntry"&&f(w.entries[n.date],s.expected);let R={...w.entries};return m?delete R[n.date]:R[n.date]={...n,task:n.task.trim()},{...w,entries:R}});break}case"deleteEntry":if(!s.date||!P(s.date))throw new Error("Enter a valid date for the entry to delete.");await F(n=>{let m=s.date;f(n.entries[m],s.expected);let g={...n.entries};return delete g[m],{...n,entries:g}});break;case"setPeriodStart":if(typeof s.value!="string"||!P(s.value))throw new Error("Enter a valid period start date.");B(s.value),await F(n=>{if(n.periodStart!==s.expectedValue)throw new Error("The period start changed in another view. Reload it before editing again.");return{...n,periodStart:s.value}});break;case"setHourlyRate":{if(typeof s.value!="string"||s.value!==""&&!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(s.value))throw new Error("Enter a valid hourly rate of zero or more.");let n=s.value===""?null:Number(s.value);if(n!==null&&(!Number.isFinite(n)||n<0))throw new Error("Enter a valid hourly rate of zero or more.");await F(m=>{if(m.hourlyRate!==s.expectedValue)throw new Error("The hourly rate changed in another view. Reload it before editing again.");return{...m,hourlyRate:n}});break}case"requestReportAction":{await h;let n=await I(),m=await d.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(m?.value==="print"){try{let g=await ae(n),w=S.join(e.globalStorageUri.fsPath,"print-reports");await(0,x.mkdir)(w,{recursive:!0});let R=await(0,x.mkdtemp)(S.join(w,"report-")),je=`timesheet-${n.periodStart}-to-${B(n.periodStart)}.pdf`,pe=S.join(R,je);if(await(0,x.writeFile)(pe,g),!await d.env.openExternal(d.Uri.file(pe)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");d.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(g){let w=g instanceof Error?g.message:String(g);d.window.showErrorMessage(`Could not open the report for printing: ${w}`)}break}if(m?.value==="pdf"){let g=`timesheet-${n.periodStart}-to-${B(n.periodStart)}.pdf`;try{let w=await Me(g,"pdf",()=>ae(n));w&&d.window.showInformationMessage(`PDF saved to ${w}`)}catch(w){let R=w instanceof Error?w.message:String(w);d.window.showErrorMessage(`Could not save the PDF: ${R}`)}}break}}}catch(n){let m=n instanceof Error?n.message:String(n);await o.webview.postMessage({type:"error",view:s.view??(s.type==="setPeriodStart"||s.type==="setHourlyRate"?"report":"entries"),message:m})}})});e.subscriptions.push(A,C,q,W,J,ue,T,M,D,_,v,{dispose:()=>clearInterval(b)},{dispose:()=>clearInterval(k)})}async function rt(){de?.();try{let t=(await Promise.allSettled([V?.setActiveFile(void 0),Le,se])).find(i=>i.status==="rejected");if(t&&t.status==="rejected")throw t.reason}finally{V=void 0,de=void 0,H?.(),H=void 0}}0&&(module.exports={activate,deactivate});
