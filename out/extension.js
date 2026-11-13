"use strict";var V=Object.create;var D=Object.defineProperty;var Q=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var _=Object.getPrototypeOf,G=Object.prototype.hasOwnProperty;var J=(e,t)=>{for(var r in t)D(e,r,{get:t[r],enumerable:!0})},N=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Z(t))!G.call(e,s)&&s!==r&&D(e,s,{get:()=>t[s],enumerable:!(a=Q(t,s))||a.enumerable});return e};var M=(e,t,r)=>(r=e!=null?V(_(e)):{},N(t||!e||!e.__esModule?D(r,"default",{value:e,enumerable:!0}):r,e)),K=e=>N(D({},"__esModule",{value:!0}),e);var le={};J(le,{activate:()=>se,deactivate:()=>de});module.exports=K(le);var d=M(require("vscode")),f=require("node:fs/promises"),B=require("node:os"),h=M(require("node:path"));function X(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function $(e){let t=X();return`<!DOCTYPE html>
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
<div class="toolbar"><div><h2>Automatic file tracking</h2><p class="subtle">Time accumulates while VS Code is focused and a local file is active, including idle periods. Totals stay separate from timesheet reports.</p></div></div>
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
<script nonce="${t}">
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
</html>`}function F(e){if(!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;let[t,r,a]=e.split("-").map(Number),s=new Date(Date.UTC(t,r-1,a));return s.getUTCFullYear()===t&&s.getUTCMonth()===r-1&&s.getUTCDate()===a}function E(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function j(e){if(!E(e.timeIn)||!E(e.timeOut))return;let[t,r]=e.timeIn.split(":").map(Number),[a,s]=e.timeOut.split(":").map(Number),l=t*60+r,y=a*60+s;return y<l&&(y+=1440),y-l}function R(e,t){let[r,a,s]=e.split("-").map(Number);return new Date(Date.UTC(r,a-1,s+t)).toISOString().slice(0,10)}function ee(e){let[t,r,a]=e.split("-").map(Number),s=r,l=t+Math.floor(s/12),y=s%12,x=new Date(Date.UTC(l,y+1,0)).getUTCDate();return[l,String(y+1).padStart(2,"0"),String(Math.min(a,x)).padStart(2,"0")].join("-")}function I(e){return R(ee(e),-1)}function A(e){if(!F(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!E(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!E(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function U(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var H=M(require("pdfkit"));function C(e){let[t,r,a]=e.split("-").map(Number);return new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(t,r-1,a)))}function te(e){let t=new Date(`${e}T00:00:00Z`),r=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(t);return t.getUTCDay()===0||t.getUTCDay()===6?`${r} (Weekend)`:r}function L(e){return new Promise((t,r)=>{let a=new H.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),s=[];a.on("data",i=>s.push(i)),a.on("error",r),a.on("end",()=>t(Buffer.concat(s)));let l=e.periodStart,y=I(l),x=a.page.width-a.page.margins.left-a.page.margins.right,O=[70,94,x-70-94-58-58-82,58,58,82],o=14,n=a.page.margins.top;a.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",a.page.margins.left,n),n+=20,a.font("Helvetica").fontSize(9).fillColor("#333333").text(`Reporting period: ${C(l)} to ${C(y)}`,a.page.margins.left,n),n+=16;let w=["Date","Day","Task","Time In","Time Out","Duration"],g=(i,c,u=!1)=>{let p=a.page.margins.left;a.rect(p,n,x,o).fill(c);for(let m=0;m<i.length;m++){let v=O[m];a.rect(p,n,v,o).lineWidth(.35).stroke("#999999"),a.font(u?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222").text(i[m],p+4,n+3,{width:v-8,height:o-4,ellipsis:!0,lineBreak:!1}),p+=v}n+=o};g(w,"#dddddd",!0);let b=0,S=0;for(let i=l;i<=y;i=R(i,1)){let c=e.entries[i]??{date:i,task:"",timeIn:"",timeOut:""},u=j(c),p=!!c.timeIn!=!!c.timeOut;u!==void 0&&(b+=u,S++);let m=new Date(`${i}T00:00:00Z`).getUTCDay()%6===0;g([C(i),te(i),c.task,c.timeIn,c.timeOut,u===void 0?p?"INCOMPLETE":"":U(u)],p?"#fff2cc":m?"#eeeeee":"#ffffff")}n+=8,a.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(`Total hours: ${U(b)}     Days logged: ${S}`,a.page.margins.left,n),e.hourlyRate!==null&&(n+=14,a.font("Helvetica").fontSize(8).text(`Estimated value (informational): ${(b/60*e.hourlyRate).toFixed(2)}`,a.page.margins.left,n)),n+=15,a.font("Helvetica").fontSize(7).fillColor("#555555").text(`Generated ${C(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,a.page.margins.left,n),a.end()})}function ae(e){if(!e||typeof e!="object"||Array.isArray(e))return{};let t={};for(let[r,a]of Object.entries(e))r&&typeof a=="number"&&Number.isFinite(a)&&a>=0&&(t[r]=a);return t}var P=class{constructor(t,r,a=Date.now){this.persistFileTimes=r;this.now=a;this.fileTimes=ae(t)}persistFileTimes;now;fileTimes;activeFile;startedAt;writeQueue=Promise.resolve();setActiveFile(t){let r=this.now();return this.accrueTime(r),this.activeFile=t||void 0,this.startedAt=this.activeFile?r:void 0,this.persist()}checkpoint(){return this.accrueTime(this.now()),this.persist()}snapshot(){let t={...this.fileTimes};return this.activeFile&&this.startedAt!==void 0&&(t[this.activeFile]=(t[this.activeFile]??0)+Math.max(0,this.now()-this.startedAt)),{fileTimes:t,activeFile:this.activeFile??null}}accrueTime(t){this.activeFile&&this.startedAt!==void 0&&(this.fileTimes[this.activeFile]=(this.fileTimes[this.activeFile]??0)+Math.max(0,t-this.startedAt)),this.startedAt=this.activeFile?t:void 0}persist(){let t={...this.fileTimes},r=this.writeQueue.then(()=>this.persistFileTimes(t));return this.writeQueue=r.then(()=>{},()=>{}),r}};var re="time-tracker.data",ie="timesheet.json",q="time-tracker.file-times",ne="2026-10-21",k;function z(e={}){let t={};if(e.entries&&typeof e.entries=="object")for(let[s,l]of Object.entries(e.entries))!l||typeof l.date!="string"||typeof l.task!="string"||typeof l.timeIn!="string"||typeof l.timeOut!="string"||l.date!==s||A(l)||(t[s]=l);let r=typeof e.periodStart=="string"&&F(e.periodStart)?e.periodStart:ne,a=typeof e.hourlyRate=="number"&&Number.isFinite(e.hourlyRate)&&e.hourlyRate>=0?e.hourlyRate:null;return{entries:t,periodStart:r,hourlyRate:a}}function Y(e){return h.join(e.globalStorageUri.fsPath,ie)}async function W(e,t){let r=Y(e);await(0,f.mkdir)(h.dirname(r),{recursive:!0});let a=`${r}.${process.pid}.${Date.now()}.tmp`;await(0,f.writeFile)(a,JSON.stringify(t,null,2),"utf8"),await(0,f.rename)(a,r)}async function oe(e){try{let r=await(0,f.readFile)(Y(e),"utf8");return z(JSON.parse(r))}catch(r){if(r.code!=="ENOENT")throw r}let t=z(e.globalState.get(re));return await W(e,t),t}function se(e){k=new P(e.globalState.get(q),async o=>e.globalState.update(q,o));let t=new Set,r=o=>{let n=o instanceof Error?o.message:String(o);d.window.showErrorMessage(`Could not save automatic file time data: ${n}`)},a=()=>{let o=k?.snapshot();if(o)for(let n of t)n.webview.postMessage({type:"fileTimes",data:o})},s=()=>{let o=d.window.activeTextEditor,n=d.window.state.focused&&o?.document.uri.scheme==="file"?o.document.uri.fsPath:void 0;k?.setActiveFile(n).then(a,w=>{r(w),a()})};s();let l=d.window.onDidChangeActiveTextEditor(s),y=d.window.onDidChangeWindowState(s),x=setInterval(()=>{k?.checkpoint().then(a,o=>{r(o),a()})},6e4),O=d.commands.registerCommand("time-tracker.openTimesheet",async()=>{let o=d.window.createWebviewPanel("timeTracker","Time Tracker",d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),n;try{n=await oe(e)}catch(i){o.dispose();let c=i instanceof Error?i.message:String(i);d.window.showErrorMessage(`Could not load the Time Tracker JSON data: ${c}`);return}let w=Promise.resolve(),g=()=>(w=w.then(()=>W(e,n)),w);t.add(o),o.onDidDispose(()=>t.delete(o)),o.webview.html=$(o.webview);let b=i=>{o.webview.postMessage({type:i,data:{...n,...k?.snapshot()}})},S=async(i,c,u)=>{if(c&&n.entries[i.date]){await o.webview.postMessage({type:"error",view:u,message:"There is already an entry for this date. Time Tracker allows one entry per date; edit the existing row instead."});return}let p=A(i);if(p){await o.webview.postMessage({type:"error",view:u,message:p});return}n.entries[i.date]={date:i.date,task:i.task.trim(),timeIn:i.timeIn,timeOut:i.timeOut},await g(),b("saved")};o.webview.onDidReceiveMessage(async i=>{switch(i.type){case"ready":b("state");break;case"createEntry":i.entry&&await S(i.entry,!0,"entries");break;case"saveEntry":i.entry&&(!i.entry.task.trim()&&!i.entry.timeIn&&!i.entry.timeOut?(delete n.entries[i.entry.date],await g(),b("saved")):await S(i.entry,!1,i.view??"entries"));break;case"deleteEntry":i.date&&(delete n.entries[i.date],await g(),b("saved"));break;case"setPeriodStart":if(!i.value||!F(i.value)){await o.webview.postMessage({type:"error",view:"report",message:"Enter a valid period start date."});break}n.periodStart=i.value,await g(),b("saved");break;case"setHourlyRate":if(i.value==="")n.hourlyRate=null;else{let c=Number(i.value);if(!Number.isFinite(c)||c<0){await o.webview.postMessage({type:"error",view:"report",message:"Enter a valid hourly rate of zero or more."});break}n.hourlyRate=c}await g(),b("saved");break;case"requestReportAction":{let c=await d.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(c?.value==="print"){try{let u=await L(n),p=h.join(e.globalStorageUri.fsPath,"print-reports");await(0,f.mkdir)(p,{recursive:!0});let m=await(0,f.mkdtemp)(h.join(p,"report-")),v=`timesheet-${n.periodStart}-to-${I(n.periodStart)}.pdf`,T=h.join(m,v);if(await(0,f.writeFile)(T,u),!await d.env.openExternal(d.Uri.file(T)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");d.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(u){let p=u instanceof Error?u.message:String(u);d.window.showErrorMessage(`Could not open the report for printing: ${p}`)}break}if(c?.value==="pdf"){let u=`timesheet-${n.periodStart}-to-${I(n.periodStart)}.pdf`,p=d.workspace.workspaceFolders?.[0]?.uri??d.Uri.file((0,B.homedir)()),m=await d.window.showSaveDialog({defaultUri:d.Uri.joinPath(p,u),filters:{"PDF documents":["pdf"]},saveLabel:"Save PDF"});if(!m)break;try{let v=await L(n),T=h.extname(m.fsPath).toLowerCase()===".pdf"?m.fsPath:`${m.fsPath}.pdf`;await(0,f.writeFile)(T,v),d.window.showInformationMessage(`PDF saved to ${T}`)}catch(v){let T=v instanceof Error?v.message:String(v);d.window.showErrorMessage(`Could not save the PDF: ${T}`)}}break}}})});e.subscriptions.push(O,l,y,{dispose:()=>clearInterval(x)})}async function de(){await k?.setActiveFile(void 0),k=void 0}0&&(module.exports={activate,deactivate});
