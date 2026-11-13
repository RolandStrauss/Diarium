"use strict";var ie=Object.create;var C=Object.defineProperty;var ne=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var se=Object.getPrototypeOf,de=Object.prototype.hasOwnProperty;var le=(e,a)=>{for(var r in a)C(e,r,{get:a[r],enumerable:!0})},j=(e,a,r,t)=>{if(a&&typeof a=="object"||typeof a=="function")for(let s of oe(a))!de.call(e,s)&&s!==r&&C(e,s,{get:()=>a[s],enumerable:!(t=ne(a,s))||t.enumerable});return e};var E=(e,a,r)=>(r=e!=null?ie(se(e)):{},j(a||!e||!e.__esModule?C(r,"default",{value:e,enumerable:!0}):r,e)),ce=e=>j(C({},"__esModule",{value:!0}),e);var Te={};le(Te,{activate:()=>we,deactivate:()=>xe});module.exports=ce(Te);var l=E(require("vscode")),w=require("node:fs/promises"),X=require("node:os"),T=E(require("node:path"));function pe(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function B(e){let a=pe();return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${e.cspSource} 'unsafe-inline'; script-src 'nonce-${a}';">
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
<label>Summary date<input id="summary-date" type="date" aria-label="Summary date"></label>
<div class="metric"><strong id="period-total">0h 00m</strong><span>period hours</span></div>
<div class="metric"><strong id="period-count">0</strong><span>completed entries</span></div>
<span id="period-range" class="subtle"></span>
</div>
<form id="add-form" class="quick-add">
<h2>Add entry</h2>
<label>Date<input id="add-date" type="date" required aria-label="Entry date"></label>
<label class="task">Task<input id="add-task" type="text" maxlength="240" required aria-label="Task description"></label>
<label>Time In<input id="add-in" type="time" step="60" aria-label="Time In"></label>
<label>Time Out<input id="add-out" type="time" step="60" aria-label="Time Out"></label>
<button class="primary" type="submit">Add entry</button>
</form>
<div class="filters">
<label>Filter by date<input id="filter-date" type="date" aria-label="Filter by date"></label>
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
<div class="toolbar"><div><h2>Automatic file tracking</h2><p class="subtle">Time accumulates while VS Code is focused and a local file is active, including idle periods. Totals stay separate from timesheet reports.</p></div><button id="time-card-button" class="primary" type="button">Preview time card</button></div>
<div class="totals" aria-live="polite">
<div class="metric"><strong id="tracked-total">0h 00m</strong><span>tracked time</span></div>
<div class="metric"><strong id="tracked-file-count">0</strong><span>files tracked</span></div>
<div class="metric"><strong id="tracked-active-file">No file active</strong><span>current file</span></div>
</div>
<div class="table-wrap"><table id="file-times-table" aria-label="Automatic file time totals">
<thead><tr><th scope="col">File path</th><th scope="col">Tracked time</th><th scope="col">Status</th></tr></thead>
<tbody id="file-times-body"></tbody>
</table></div>
</section>
<section id="report-view" class="view" role="tabpanel" aria-labelledby="report-tab" hidden>
<div class="period-controls screen-only">
<label>Period start<input id="period-start" type="date" aria-label="Period start date"></label>
<label>Period end<input id="period-end" type="date" readonly aria-label="Calculated period end date"></label>
<label>Hourly rate<input id="hourly-rate" type="number" min="0" step="0.01" placeholder="Not set" aria-label="Hourly rate"></label>
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
<script nonce="${a}">
const vscode = acquireVsCodeApi();
const byId = (id) => document.getElementById(id);
let data = { entries: {}, periodStart: '2026-10-21', hourlyRate: null, fileTimes: {}, activeFile: null };
const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
function esc(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function dateObj(value) { return new Date(value + 'T00:00:00Z'); }
function dateText(value) { return dateFormat.format(dateObj(value)); }
function localDateValue() { const date = new Date(); return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-'); }
function addDays(value, amount) { const date = dateObj(value); date.setUTCDate(date.getUTCDate() + amount); return date.toISOString().slice(0, 10); }
function monthEnd(value) { const [year, month, day] = value.split('-').map(Number); const targetYear = year + Math.floor(month / 12); const targetMonth = month % 12; const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate(); return [targetYear, String(targetMonth + 1).padStart(2, '0'), String(Math.min(day, lastDay)).padStart(2, '0')].join('-'); }
function periodEnd(value) { return addDays(monthEnd(value), -1); }
function minutes(entry) { if (!entry || !entry.timeIn || !entry.timeOut) return null; const a = entry.timeIn.match(/^([01]\\d|2[0-3]):([0-5]\\d)$/); const b = entry.timeOut.match(/^([01]\\d|2[0-3]):([0-5]\\d)$/); if (!a || !b) return null; const start = Number(a[1]) * 60 + Number(a[2]); let end = Number(b[1]) * 60 + Number(b[2]); if (end < start) end += 1440; return end - start; }
function durationText(value) { return Math.floor(value / 60) + 'h ' + String(value % 60).padStart(2, '0') + 'm'; }
function setError(id, message) { byId(id).textContent = message || ''; }
function allEntries() { return Object.values(data.entries); }
function entryFor(date) { return data.entries[date] || { date, task: '', timeIn: '', timeOut: '' }; }
function renderYearSelect() {
 const select = byId('year-select'); const current = Number(select.value) || new Date().getFullYear();
 select.innerHTML = ''; for (let year = current - 10; year <= current + 10; year++) { const option = document.createElement('option'); option.value = String(year); option.textContent = String(year); select.appendChild(option); }
 select.value = String(current);
}
function renderEntries() {
 const year = Number(byId('year-select').value) || new Date().getFullYear();
 const filterDate = byId('filter-date').value; const taskQuery = byId('filter-task').value.trim().toLowerCase();
 const dates = new Set();
 if (filterDate) dates.add(filterDate);
 else { const count = new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1 ? 366 : 365; for (let day = 0; day < count; day++) dates.add(addDays(year + '-01-01', day)); }
 if (taskQuery) allEntries().filter((entry) => entry.task.toLowerCase().includes(taskQuery)).forEach((entry) => dates.add(entry.date));
 let visible = Array.from(dates).sort().filter((date) => {
  const entry = entryFor(date); if (filterDate && date !== filterDate) return false;
  return !taskQuery || entry.task.toLowerCase().includes(taskQuery);
 });
 if (filterDate && taskQuery && data.entries[filterDate] && !visible.includes(filterDate)) visible = [];
 byId('row-count').textContent = visible.length + (visible.length === 1 ? ' date shown' : ' dates shown');
 byId('entries-body').innerHTML = visible.map((date) => {
  const entry = entryFor(date); const value = minutes(entry); const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut);
  return '<tr data-date="' + date + '" class="' + (incomplete ? 'incomplete ' : '') + (dateObj(date).getUTCDay() % 6 === 0 ? 'weekend' : '') + '">' +
   '<td class="date">' + esc(dateText(date)) + '</td>' +
   '<td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-label="Task for ' + esc(dateText(date)) + '"></td>' +
   '<td class="time"><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-label="Time In for ' + esc(dateText(date)) + '"></td>' +
   '<td class="time"><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-label="Time Out for ' + esc(dateText(date)) + '"></td>' +
   '<td class="duration ' + (incomplete ? 'warning-text' : '') + '" aria-label="Duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td>' +
   '<td><button type="button" data-action="delete" aria-label="Delete entry for ' + esc(dateText(date)) + '" ' + (data.entries[date] ? '' : 'disabled') + '>Delete</button></td></tr>';
 }).join('');
 byId('entries-body').querySelectorAll('input').forEach((input) => input.addEventListener('change', saveRow));
 byId('entries-body').querySelectorAll('[data-action="delete"]').forEach((button) => button.addEventListener('click', () => {
  const date = button.closest('tr').dataset.date; vscode.postMessage({ type: 'deleteEntry', date });
 }));
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
 const row = event.target.closest('tr'); const entry = { date: row.dataset.date, task: row.querySelector('[data-field="task"]').value.trim(), timeIn: row.querySelector('[data-field="timeIn"]').value, timeOut: row.querySelector('[data-field="timeOut"]').value };
 setError('entries-error', ''); vscode.postMessage({ type: 'saveEntry', entry });
}
function renderSummary() {
 const selected = byId('summary-date').value; const kind = byId('summary-kind').value;
 let start = selected; let end = selected;
 if (kind === 'weekly') { const weekday = dateObj(selected).getUTCDay(); start = addDays(selected, -((weekday + 6) % 7)); end = addDays(start, 6); }
 if (kind === 'monthly') { start = selected.slice(0, 7) + '-01'; end = addDays(monthEnd(start), -1); }
 if (kind === 'yearly') { start = selected.slice(0, 4) + '-01-01'; end = selected.slice(0, 4) + '-12-31'; }
 const completed = allEntries().filter((entry) => entry.date >= start && entry.date <= end).map(minutes).filter((value) => value !== null);
 byId('period-total').textContent = durationText(completed.reduce((sum, value) => sum + value, 0));
 byId('period-count').textContent = String(completed.length);
 byId('period-range').textContent = dateText(start) + ' \u2013 ' + dateText(end);
}
function renderFileTimes() {
 const files = Object.entries(data.fileTimes || {}).filter(([file, milliseconds]) => Number.isFinite(milliseconds) && milliseconds >= 0 && (milliseconds > 0 || file === data.activeFile));
 files.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
 const total = files.reduce((sum, [, milliseconds]) => sum + milliseconds, 0);
 byId('tracked-total').textContent = durationText(Math.floor(total / 60000));
 byId('tracked-file-count').textContent = String(files.length);
 byId('tracked-active-file').textContent = data.activeFile || 'No file active';
 byId('file-times-body').innerHTML = files.length
  ? files.map(([file, milliseconds]) => '<tr><td class="file">' + esc(file) + '</td><td class="duration">' + durationText(Math.floor(milliseconds / 60000)) + '</td><td>' + (file === data.activeFile ? 'Active' : '') + '</td></tr>').join('')
  : '<tr><td colspan="3" class="subtle">No files tracked yet.</td></tr>';
}
function renderReport() {
 const start = data.periodStart || '2026-10-21'; const end = periodEnd(start); byId('period-start').value = start; byId('period-end').value = end;
 byId('report-title').textContent = 'Period report: ' + dateText(start) + ' to ' + dateText(end);
 let total = 0; let days = 0; const rows = [];
 for (let date = start; date <= end; date = addDays(date, 1)) {
  const entry = entryFor(date); const value = minutes(entry); const incomplete = Boolean(entry.timeIn) !== Boolean(entry.timeOut); if (value !== null) { total += value; days++; }
  const weekday = dateObj(date).getUTCDay();
	rows.push('<tr data-date="' + date + '" class="' + (incomplete ? 'incomplete ' : '') + (weekday === 0 || weekday === 6 ? 'weekend' : '') + '"><td class="date">' + esc(date) + '</td><td>' + esc(new Intl.DateTimeFormat(undefined, { weekday: 'long', timeZone: 'UTC' }).format(dateObj(date))) + '</td><td class="task"><input data-field="task" value="' + esc(entry.task) + '" maxlength="240" aria-label="Task for ' + esc(dateText(date)) + '"><span class="print-task"></span></td><td><input data-field="timeIn" type="time" step="60" value="' + esc(entry.timeIn) + '" aria-label="Time In for ' + esc(dateText(date)) + '"><span class="print-time">' + esc(entry.timeIn) + '</span></td><td><input data-field="timeOut" type="time" step="60" value="' + esc(entry.timeOut) + '" aria-label="Time Out for ' + esc(dateText(date)) + '"><span class="print-time">' + esc(entry.timeOut) + '</span></td><td class="duration">' + (value === null ? (incomplete ? 'Incomplete' : '\u2014') : durationText(value)) + '</td></tr>');
 }
 byId('report-body').innerHTML = rows.join('');
 byId('report-body').querySelectorAll('input').forEach((input) => input.addEventListener('change', saveReportRow));
 byId('report-body').querySelectorAll('tr').forEach((row) => row.querySelector('.print-task').textContent = row.querySelector('[data-field="task"]').value);
 byId('report-days').textContent = days + (days === 1 ? ' day logged' : ' days logged');
 const rate = data.hourlyRate;
 byId('print-summary').innerHTML = '<div class="metric"><strong>' + durationText(total) + '</strong><span>Total hours</span></div><div class="metric"><strong>' + days + '</strong><span>Days logged</span></div>' + (rate === null ? '' : '<div class="metric"><strong>' + (total / 60 * rate).toFixed(2) + '</strong><span>Estimated value (informational)</span></div>');
}
function saveReportRow(event) {
 const row = event.target.closest('tr'); const entry = { date: row.dataset.date, task: row.querySelector('[data-field="task"]').value.trim(), timeIn: row.querySelector('[data-field="timeIn"]').value, timeOut: row.querySelector('[data-field="timeOut"]').value };
 row.querySelector('.print-task').textContent = entry.task; setError('report-error', ''); vscode.postMessage({ type: 'saveEntry', entry, view: 'report' });
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
byId('filter-date').addEventListener('change', () => { if (byId('filter-date').value) byId('year-select').value = byId('filter-date').value.slice(0, 4); renderEntries(); });
byId('filter-task').addEventListener('input', renderEntries);
byId('clear-filters').addEventListener('click', () => { byId('filter-date').value = ''; byId('filter-task').value = ''; renderEntries(); });
byId('add-date').value = localDateValue();
byId('add-form').addEventListener('submit', (event) => { event.preventDefault(); const entry = { date: byId('add-date').value, task: byId('add-task').value.trim(), timeIn: byId('add-in').value, timeOut: byId('add-out').value }; setError('entries-error', ''); vscode.postMessage({ type: 'createEntry', entry }); });
byId('period-start').addEventListener('change', () => { setError('report-error', ''); vscode.postMessage({ type: 'setPeriodStart', value: byId('period-start').value }); });
byId('hourly-rate').addEventListener('change', () => { const value = byId('hourly-rate').value; vscode.postMessage({ type: 'setHourlyRate', value }); });
byId('print-button').addEventListener('click', () => vscode.postMessage({ type: 'requestReportAction' }));
byId('time-card-button').addEventListener('click', () => vscode.postMessage({ type: 'openTimeCard' }));
window.addEventListener('message', (event) => {
 const message = event.data;
 if (message.type === 'state') { data = message.data; renderYearSelect(); byId('hourly-rate').value = data.hourlyRate === null ? '' : String(data.hourlyRate); render(); }
 if (message.type === 'saved') { data = message.data; byId('hourly-rate').value = data.hourlyRate === null ? '' : String(data.hourlyRate); render(); }
 if (message.type === 'fileTimes') { data.fileTimes = message.data.fileTimes; data.activeFile = message.data.activeFile; renderFileTimes(); }
 if (message.type === 'error') setError(message.view === 'report' ? 'report-error' : 'entries-error', message.message);
});
vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`}function P(e){if(!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;let[a,r,t]=e.split("-").map(Number),s=new Date(Date.UTC(a,r-1,t));return s.getUTCFullYear()===a&&s.getUTCMonth()===r-1&&s.getUTCDate()===t}function F(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function q(e){if(!F(e.timeIn)||!F(e.timeOut))return;let[a,r]=e.timeIn.split(":").map(Number),[t,s]=e.timeOut.split(":").map(Number),d=a*60+r,n=t*60+s;return n<d&&(n+=1440),n-d}function A(e,a){let[r,t,s]=e.split("-").map(Number);return new Date(Date.UTC(r,t-1,s+a)).toISOString().slice(0,10)}function ue(e){let[a,r,t]=e.split("-").map(Number),s=r,d=a+Math.floor(s/12),n=s%12,u=new Date(Date.UTC(d,n+1,0)).getUTCDate();return[d,String(n+1).padStart(2,"0"),String(Math.min(t,u)).padStart(2,"0")].join("-")}function D(e){return A(ue(e),-1)}function L(e){if(!P(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!F(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!F(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function S(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var Y=E(require("pdfkit"));function M(e){let[a,r,t]=e.split("-").map(Number);return new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(a,r-1,t)))}function me(e){let a=new Date(`${e}T00:00:00Z`),r=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(a);return a.getUTCDay()===0||a.getUTCDay()===6?`${r} (Weekend)`:r}function H(e){return new Promise((a,r)=>{let t=new Y.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),s=[];t.on("data",c=>s.push(c)),t.on("error",r),t.on("end",()=>a(Buffer.concat(s)));let d=e.periodStart,n=D(d),u=t.page.width-t.page.margins.left-t.page.margins.right,I=[70,94,u-70-94-58-58-82,58,58,82],h=14,y=t.page.margins.top;t.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",t.page.margins.left,y),y+=20,t.font("Helvetica").fontSize(9).fillColor("#333333").text(`Reporting period: ${M(d)} to ${M(n)}`,t.page.margins.left,y),y+=16;let o=["Date","Day","Task","Time In","Time Out","Duration"],p=(c,m,i=!1)=>{let f=t.page.margins.left;t.rect(f,y,u,h).fill(m);for(let v=0;v<c.length;v++){let b=I[v];t.rect(f,y,b,h).lineWidth(.35).stroke("#999999"),t.font(i?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222").text(c[v],f+4,y+3,{width:b-8,height:h-4,ellipsis:!0,lineBreak:!1}),f+=b}y+=h};p(o,"#dddddd",!0);let g=0,x=0;for(let c=d;c<=n;c=A(c,1)){let m=e.entries[c]??{date:c,task:"",timeIn:"",timeOut:""},i=q(m),f=!!m.timeIn!=!!m.timeOut;i!==void 0&&(g+=i,x++);let v=new Date(`${c}T00:00:00Z`).getUTCDay()%6===0;p([M(c),me(c),m.task,m.timeIn,m.timeOut,i===void 0?f?"INCOMPLETE":"":S(i)],f?"#fff2cc":v?"#eeeeee":"#ffffff")}y+=8,t.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(`Total hours: ${S(g)}     Days logged: ${x}`,t.page.margins.left,y),e.hourlyRate!==null&&(y+=14,t.font("Helvetica").fontSize(8).text(`Estimated value (informational): ${(g/60*e.hourlyRate).toFixed(2)}`,t.page.margins.left,y)),y+=15,t.font("Helvetica").fontSize(7).fillColor("#555555").text(`Generated ${M(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,t.page.margins.left,y),t.end()})}function fe(e){if(!e||typeof e!="object"||Array.isArray(e))return{};let a={};for(let[r,t]of Object.entries(e))r&&typeof t=="number"&&Number.isFinite(t)&&t>=0&&(a[r]=t);return a}var O=class{constructor(a,r,t=Date.now){this.persistFileTimes=r;this.now=t;this.fileTimes=fe(a)}persistFileTimes;now;fileTimes;activeFile;startedAt;writeQueue=Promise.resolve();setActiveFile(a){let r=this.now();return this.accrueTime(r),this.activeFile=a||void 0,this.startedAt=this.activeFile?r:void 0,this.persist()}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let a={...this.fileTimes};return this.activeFile&&this.startedAt!==void 0&&(a[this.activeFile]=(a[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt)),{fileTimes:a,activeFile:this.activeFile??null}}accrueTime(a){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,a-this.startedAt)),this.startedAt=this.activeFile?a:void 0}persist(){let a={...this.fileTimes},r=this.writeQueue.then(()=>this.persistFileTimes(a));return this.writeQueue=r.then(()=>{},()=>{}),r}};var ee=require("node:crypto");var V=E(require("node:path")),W=E(require("pdfkit"));var Q="All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.";function _(e){return e.generatedAt.replace("T"," ").replace("Z"," UTC")}function U(e,a=new Date){let r=Object.entries(e).map(([n,u])=>{if(!n||!Number.isFinite(u)||u<0)throw new Error("Time cards require non-negative, finite file durations and non-empty file names.");return{name:V.basename(n),milliseconds:u,percent:0}}).sort((n,u)=>u.milliseconds-n.milliseconds||n.name.localeCompare(u.name)),t=r.reduce((n,u)=>n+u.milliseconds,0);if(!Number.isFinite(t))throw new Error("The total tracked time is too large to export.");let s=new Map;for(let n of r)s.set(n.name,(s.get(n.name)??0)+1);let d=new Map;for(let n of r){n.percent=t>0?n.milliseconds/t*100:0;let u=n.name;d.set(u,(d.get(u)??0)+1),s.get(u)>1&&(n.name=`${u} (${d.get(u)})`)}return{generatedAt:a.toISOString(),totalMilliseconds:t,files:r}}function ve(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function $(e){return S(Math.floor(e/6e4))}function z(e,a){let r=e.files.map(t=>`<li class="file-row">
<div class="file-detail"><span class="file-name">${ve(t.name)}</span>
<span class="file-time">${$(t.milliseconds)} <small>${t.percent.toFixed(1)}%</small></span></div>
<div class="track" aria-hidden="true"><div class="bar" style="width:${t.percent}%"></div></div></li>`).join("");return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src ${a?`'nonce-${a.nonce}'`:"'none'"}; base-uri 'none'; form-action 'none';">
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
${a?'<nav class="actions" aria-label="Time card actions"><button id="save-html">Save HTML</button><button id="save-pdf">Save PDF</button><button id="refresh">Refresh snapshot</button></nav>':""}
<main class="card">
<p class="eyebrow">Time Tracker / File activity</p>
<h1>Time well spent.</h1>
<p class="date">Snapshot: <time datetime="${e.generatedAt}">${_(e)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${$(e.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${e.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${r||'<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${Q}</footer>
</main>
${a?`<script nonce="${a.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>`:""}
</body>
</html>`}function G(e){return e.files.some(a=>/[^\x20-\x7e\u00a0-\u00ff]/u.test(a.name))?Promise.reject(new Error("PDF cards support Latin file names only. Save HTML and print it from your browser for these file names.")):new Promise((a,r)=>{let t=new W.default({size:"A4",margin:44,compress:!0}),s=[];t.on("data",h=>s.push(h)),t.on("error",r),t.on("end",()=>a(Buffer.concat(s)));let d=t.page.width-88,n=0,u=()=>{t.rect(0,0,t.page.width,t.page.height).fill(t.linearGradient(0,0,t.page.width,t.page.height).stop(0,"#102d32").stop(.65,"#1b5246").stop(1,"#346447")),t.fillColor("#d0e4d7").font("Helvetica").fontSize(10).text("TIME TRACKER / FILE ACTIVITY",44,44),t.fillColor("#ffffff").font("Times-Roman").fontSize(32).text("Time well spent.",44,66),t.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(`Snapshot: ${_(e)}`,44,110),t.fillColor("#ffe1a6").font("Times-Roman").fontSize(24).text(`${$(e.totalMilliseconds)}   /   ${e.files.length} files`,44,140),n=190},I=()=>{t.addPage(),u()};u();for(let h of e.files){t.font("Helvetica").fontSize(11);let y=t.heightOfString(h.name,{width:d}),o=y+44;n+o>t.page.height-130&&I(),t.fillColor("#ffffff").font("Helvetica").fontSize(11).text(h.name,44,n,{width:d}),n+=y+6,t.fillColor("#ffe1a6").fontSize(10).text(`${$(h.milliseconds)}  /  ${h.percent.toFixed(1)}%`,44,n),n+=18,t.roundedRect(44,n,d,6,3).fill("#45665d"),h.percent>0&&t.rect(44,n,d*h.percent/100,6).fill(t.linearGradient(44,n,44+d,n).stop(0,"#7edcbb").stop(1,"#ffcc7d")),n+=20}e.files.length||(t.fillColor("#ffffff").font("Helvetica").fontSize(12).text("No files tracked yet.",44,n),n+=32),n+90>t.page.height-44&&I(),t.fillColor("#d0e4d7").font("Helvetica").fontSize(9).text(Q,44,n+12,{width:d}),t.end()})}var ye="time-tracker.data",be="timesheet.json",Z="time-tracker.file-times",he="2026-10-21",k;function K(e={}){let a={};if(e.entries&&typeof e.entries=="object")for(let[s,d]of Object.entries(e.entries))!d||typeof d.date!="string"||typeof d.task!="string"||typeof d.timeIn!="string"||typeof d.timeOut!="string"||d.date!==s||L(d)||(a[s]=d);let r=typeof e.periodStart=="string"&&P(e.periodStart)?e.periodStart:he,t=typeof e.hourlyRate=="number"&&Number.isFinite(e.hourlyRate)&&e.hourlyRate>=0?e.hourlyRate:null;return{entries:a,periodStart:r,hourlyRate:t}}function te(e){return T.join(e.globalStorageUri.fsPath,be)}async function ae(e,a){let r=te(e);await(0,w.mkdir)(T.dirname(r),{recursive:!0});let t=`${r}.${process.pid}.${Date.now()}.tmp`;await(0,w.writeFile)(t,JSON.stringify(a,null,2),"utf8"),await(0,w.rename)(t,r)}async function ge(e){try{let r=await(0,w.readFile)(te(e),"utf8");return K(JSON.parse(r))}catch(r){if(r.code!=="ENOENT")throw r}let a=K(e.globalState.get(ye));return await ae(e,a),a}async function J(e,a,r){let t=l.workspace.workspaceFolders?.[0]?.uri??l.Uri.file((0,X.homedir)()),s=await l.window.showSaveDialog({defaultUri:l.Uri.joinPath(t,e),filters:{[a==="html"?"HTML documents":"PDF documents"]:[a]},saveLabel:`Save ${a.toUpperCase()}`});if(!s)return;let d=T.extname(s.fsPath).toLowerCase()===`.${a}`?s.fsPath:`${s.fsPath}.${a}`;return await(0,w.writeFile)(d,await r()),d}function we(e){k=new O(e.globalState.get(Z),async o=>e.globalState.update(Z,o));let a=new Set,r=l.window.createStatusBarItem(l.StatusBarAlignment.Right,100);r.command="time-tracker.openTimesheet",r.text="$(watch) 0h 00m | 0h 00m",r.tooltip=`Total tracked: 0h 00m
Current file: 0h 00m
Click to open Time Tracker`,r.show();let t=o=>{let p=o instanceof Error?o.message:String(o);l.window.showErrorMessage(`Could not save automatic file time data: ${p}`)},s=()=>{let o=k?.snapshot();if(!o)return;let p=S(Math.floor(Object.values(o.fileTimes).reduce((c,m)=>c+m,0)/6e4)),g=S(Math.floor((o.activeFile?o.fileTimes[o.activeFile]??0:0)/6e4)),x=o.activeFile?`Current file (${T.basename(o.activeFile)})`:"Current file";r.text=`$(watch) ${p} | ${g}`,r.tooltip=`Total tracked: ${p}
${x}: ${g}
Click to open Time Tracker`;for(let c of a)c.webview.postMessage({type:"fileTimes",data:o})},d=()=>{let o=l.window.activeTextEditor,p=l.window.state.focused&&o?.document.uri.scheme==="file"?o.document.uri.fsPath:void 0;k?.setActiveFile(p).then(s,g=>{t(g),s()})};d();let n=l.window.onDidChangeActiveTextEditor(d),u=l.window.onDidChangeWindowState(d),I=setInterval(()=>{k?.checkpoint().then(s,o=>{t(o),s()})},6e4),h=l.commands.registerCommand("time-tracker.openTimeCard",()=>{let o;try{o=U(k?.snapshot().fileTimes??{})}catch(c){let m=c instanceof Error?c.message:String(c);l.window.showErrorMessage(`Could not generate the time card: ${m}`);return}let p=l.window.createWebviewPanel("timeTrackerCard","Time Card Preview",l.ViewColumn.One,{enableScripts:!0,localResourceRoots:[]}),g=()=>{p.webview.html=z(o,{nonce:(0,ee.randomBytes)(16).toString("hex")})};g();let x=p.webview.onDidReceiveMessage(async c=>{try{if(c.type==="refresh")o=U(k?.snapshot().fileTimes??{}),g();else if(c.type==="export"){if(c.format!=="html"&&c.format!=="pdf")throw new Error("Choose HTML or PDF for the time card export.");let m=c.format,i=o,f=`time-card-${i.generatedAt.slice(0,10)}.${m}`,v=await J(f,m,()=>m==="html"?Buffer.from(z(i),"utf8"):G(i));v&&l.window.showInformationMessage(`Time card saved to ${v}`)}}catch(m){let i=m instanceof Error?m.message:String(m);l.window.showErrorMessage(`Could not generate or export the time card: ${i}`)}});p.onDidDispose(()=>x.dispose())}),y=l.commands.registerCommand("time-tracker.openTimesheet",async()=>{let o=l.window.createWebviewPanel("timeTracker","Time Tracker",l.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),p;try{p=await ge(e)}catch(i){o.dispose();let f=i instanceof Error?i.message:String(i);l.window.showErrorMessage(`Could not load the Time Tracker JSON data: ${f}`);return}let g=Promise.resolve(),x=()=>(g=g.then(()=>ae(e,p)),g);a.add(o),o.onDidDispose(()=>a.delete(o)),o.webview.html=B(o.webview);let c=i=>{o.webview.postMessage({type:i,data:{...p,...k?.snapshot()}})},m=async(i,f,v)=>{if(f&&p.entries[i.date]){await o.webview.postMessage({type:"error",view:v,message:"There is already an entry for this date. Time Tracker allows one entry per date; edit the existing row instead."});return}let b=L(i);if(b){await o.webview.postMessage({type:"error",view:v,message:b});return}p.entries[i.date]={date:i.date,task:i.task.trim(),timeIn:i.timeIn,timeOut:i.timeOut},await x(),c("saved")};o.webview.onDidReceiveMessage(async i=>{switch(i.type){case"openTimeCard":await l.commands.executeCommand("time-tracker.openTimeCard");break;case"ready":c("state");break;case"createEntry":i.entry&&await m(i.entry,!0,"entries");break;case"saveEntry":i.entry&&(!i.entry.task.trim()&&!i.entry.timeIn&&!i.entry.timeOut?(delete p.entries[i.entry.date],await x(),c("saved")):await m(i.entry,!1,i.view??"entries"));break;case"deleteEntry":i.date&&(delete p.entries[i.date],await x(),c("saved"));break;case"setPeriodStart":if(!i.value||!P(i.value)){await o.webview.postMessage({type:"error",view:"report",message:"Enter a valid period start date."});break}p.periodStart=i.value,await x(),c("saved");break;case"setHourlyRate":if(i.value==="")p.hourlyRate=null;else{let f=Number(i.value);if(!Number.isFinite(f)||f<0){await o.webview.postMessage({type:"error",view:"report",message:"Enter a valid hourly rate of zero or more."});break}p.hourlyRate=f}await x(),c("saved");break;case"requestReportAction":{let f=await l.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(f?.value==="print"){try{let v=await H(p),b=T.join(e.globalStorageUri.fsPath,"print-reports");await(0,w.mkdir)(b,{recursive:!0});let R=await(0,w.mkdtemp)(T.join(b,"report-")),re=`timesheet-${p.periodStart}-to-${D(p.periodStart)}.pdf`,N=T.join(R,re);if(await(0,w.writeFile)(N,v),!await l.env.openExternal(l.Uri.file(N)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");l.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(v){let b=v instanceof Error?v.message:String(v);l.window.showErrorMessage(`Could not open the report for printing: ${b}`)}break}if(f?.value==="pdf"){let v=`timesheet-${p.periodStart}-to-${D(p.periodStart)}.pdf`;try{let b=await J(v,"pdf",()=>H(p));b&&l.window.showInformationMessage(`PDF saved to ${b}`)}catch(b){let R=b instanceof Error?b.message:String(b);l.window.showErrorMessage(`Could not save the PDF: ${R}`)}}break}}})});e.subscriptions.push(y,h,r,n,u,{dispose:()=>clearInterval(I)})}async function xe(){await k?.setActiveFile(void 0),k=void 0}0&&(module.exports={activate,deactivate});
