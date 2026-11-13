"use strict";var A=Object.create;var S=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var W=Object.getPrototypeOf,V=Object.prototype.hasOwnProperty;var Q=(e,r)=>{for(var a in r)S(e,a,{get:r[a],enumerable:!0})},U=(e,r,a,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of Y(r))!V.call(e,i)&&i!==a&&S(e,i,{get:()=>r[i],enumerable:!(t=B(r,i))||t.enumerable});return e};var O=(e,r,a)=>(a=e!=null?A(W(e)):{},U(r||!e||!e.__esModule?S(a,"default",{value:e,enumerable:!0}):a,e)),Z=e=>U(S({},"__esModule",{value:!0}),e);var ne={};Q(ne,{activate:()=>ae,deactivate:()=>re});module.exports=Z(ne);var d=O(require("vscode")),p=require("node:fs/promises"),j=require("node:os"),b=O(require("node:path"));function J(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from({length:32},()=>e[Math.floor(Math.random()*e.length)]).join("")}function L(e){let r=J();return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${e.cspSource} 'unsafe-inline'; script-src 'nonce-${r}';">
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
	.tabs, .screen-only, #entries-view, .error, #print-warning { display: none !important; }
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
<script nonce="${r}">
const vscode = acquireVsCodeApi();
const byId = (id) => document.getElementById(id);
let data = { entries: {}, periodStart: '2026-10-21', hourlyRate: null };
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
function render() { renderEntries(); renderSummary(); renderReport(); }
function setView(view) {
 activeView = view; byId('entries-view').hidden = view !== 'entries'; byId('report-view').hidden = view !== 'report';
 byId('entries-tab').setAttribute('aria-selected', String(view === 'entries')); byId('report-tab').setAttribute('aria-selected', String(view === 'report'));
}
byId('entries-tab').addEventListener('click', () => setView('entries'));
byId('report-tab').addEventListener('click', () => setView('report'));
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
 if (message.type === 'error') setError(message.view === 'report' ? 'report-error' : 'entries-error', message.message);
});
vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`}function I(e){if(!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;let[r,a,t]=e.split("-").map(Number),i=new Date(Date.UTC(r,a-1,t));return i.getUTCFullYear()===r&&i.getUTCMonth()===a-1&&i.getUTCDate()===t}function D(e){return!!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)}function $(e){if(!D(e.timeIn)||!D(e.timeOut))return;let[r,a]=e.timeIn.split(":").map(Number),[t,i]=e.timeOut.split(":").map(Number),o=r*60+a,l=t*60+i;return l<o&&(l+=1440),l-o}function P(e,r){let[a,t,i]=e.split("-").map(Number);return new Date(Date.UTC(a,t-1,i+r)).toISOString().slice(0,10)}function G(e){let[r,a,t]=e.split("-").map(Number),i=a,o=r+Math.floor(i/12),l=i%12,h=new Date(Date.UTC(o,l+1,0)).getUTCDate();return[o,String(l+1).padStart(2,"0"),String(Math.min(t,h)).padStart(2,"0")].join("-")}function T(e){return P(G(e),-1)}function R(e){if(!I(e.date))return"Enter a valid calendar date.";if(typeof e.task!="string"||!e.task.trim())return"Enter a task description.";if(typeof e.timeIn!="string"||e.timeIn&&!D(e.timeIn))return"Time In must use 24-hour HH:mm format.";if(typeof e.timeOut!="string"||e.timeOut&&!D(e.timeOut))return"Time Out must use 24-hour HH:mm format."}function F(e){return`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`}var H=O(require("pdfkit"));function E(e){let[r,a,t]=e.split("-").map(Number);return new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(r,a-1,t)))}function K(e){let r=new Date(`${e}T00:00:00Z`),a=new Intl.DateTimeFormat("en",{weekday:"short",timeZone:"UTC"}).format(r);return r.getUTCDay()===0||r.getUTCDay()===6?`${a} (Weekend)`:a}function M(e){return new Promise((r,a)=>{let t=new H.default({layout:"landscape",size:"A4",margins:{top:28,bottom:28,left:28,right:28},compress:!0}),i=[];t.on("data",u=>i.push(u)),t.on("error",a),t.on("end",()=>r(Buffer.concat(i)));let o=e.periodStart,l=T(o),h=t.page.width-t.page.margins.left-t.page.margins.right,n=[70,94,h-70-94-58-58-82,58,58,82],c=14,s=t.page.margins.top;t.font("Helvetica-Bold").fontSize(14).fillColor("#202020").text("Time Tracker",t.page.margins.left,s),s+=20,t.font("Helvetica").fontSize(9).fillColor("#333333").text(`Reporting period: ${E(o)} to ${E(l)}`,t.page.margins.left,s),s+=16;let m=["Date","Day","Task","Time In","Time Out","Duration"],f=(u,g,k=!1)=>{let w=t.page.margins.left;t.rect(w,s,h,c).fill(g);for(let x=0;x<u.length;x++){let C=n[x];t.rect(w,s,C,c).lineWidth(.35).stroke("#999999"),t.font(k?"Helvetica-Bold":"Helvetica").fontSize(7.5).fillColor("#222222").text(u[x],w+4,s+3,{width:C-8,height:c-4,ellipsis:!0,lineBreak:!1}),w+=C}s+=c};f(m,"#dddddd",!0);let y=0,v=0;for(let u=o;u<=l;u=P(u,1)){let g=e.entries[u]??{date:u,task:"",timeIn:"",timeOut:""},k=$(g),w=!!g.timeIn!=!!g.timeOut;k!==void 0&&(y+=k,v++);let x=new Date(`${u}T00:00:00Z`).getUTCDay()%6===0;f([E(u),K(u),g.task,g.timeIn,g.timeOut,k===void 0?w?"INCOMPLETE":"":F(k)],w?"#fff2cc":x?"#eeeeee":"#ffffff")}s+=8,t.font("Helvetica-Bold").fontSize(9).fillColor("#202020").text(`Total hours: ${F(y)}     Days logged: ${v}`,t.page.margins.left,s),e.hourlyRate!==null&&(s+=14,t.font("Helvetica").fontSize(8).text(`Estimated value (informational): ${(y/60*e.hourlyRate).toFixed(2)}`,t.page.margins.left,s)),s+=15,t.font("Helvetica").fontSize(7).fillColor("#555555").text(`Generated ${E(new Date().toISOString().slice(0,10))}. Weekend and incomplete entries are labeled.`,t.page.margins.left,s),t.end()})}var _="time-tracker.data",X="timesheet.json",ee="2026-10-21";function N(e={}){let r={};if(e.entries&&typeof e.entries=="object")for(let[i,o]of Object.entries(e.entries))!o||typeof o.date!="string"||typeof o.task!="string"||typeof o.timeIn!="string"||typeof o.timeOut!="string"||o.date!==i||R(o)||(r[i]=o);let a=typeof e.periodStart=="string"&&I(e.periodStart)?e.periodStart:ee,t=typeof e.hourlyRate=="number"&&Number.isFinite(e.hourlyRate)&&e.hourlyRate>=0?e.hourlyRate:null;return{entries:r,periodStart:a,hourlyRate:t}}function q(e){return b.join(e.globalStorageUri.fsPath,X)}async function z(e,r){let a=q(e);await(0,p.mkdir)(b.dirname(a),{recursive:!0});let t=`${a}.${process.pid}.${Date.now()}.tmp`;await(0,p.writeFile)(t,JSON.stringify(r,null,2),"utf8"),await(0,p.rename)(t,a)}async function te(e){try{let a=await(0,p.readFile)(q(e),"utf8");return N(JSON.parse(a))}catch(a){if(a.code!=="ENOENT")throw a}let r=N(e.globalState.get(_));return await z(e,r),r}function ae(e){let r=d.commands.registerCommand("time-tracker.openTimesheet",async()=>{let a=d.window.createWebviewPanel("timeTracker","Time Tracker",d.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),t;try{t=await te(e)}catch(n){a.dispose();let c=n instanceof Error?n.message:String(n);d.window.showErrorMessage(`Could not load the Time Tracker JSON data: ${c}`);return}let i=Promise.resolve(),o=()=>(i=i.then(()=>z(e,t)),i);a.webview.html=L(a.webview);let l=()=>{a.webview.postMessage({type:"saved",data:t})},h=async(n,c,s)=>{if(c&&t.entries[n.date]){await a.webview.postMessage({type:"error",view:s,message:"There is already an entry for this date. Time Tracker allows one entry per date; edit the existing row instead."});return}let m=R(n);if(m){await a.webview.postMessage({type:"error",view:s,message:m});return}t.entries[n.date]={date:n.date,task:n.task.trim(),timeIn:n.timeIn,timeOut:n.timeOut},await o(),l()};a.webview.onDidReceiveMessage(async n=>{switch(n.type){case"ready":await a.webview.postMessage({type:"state",data:t});break;case"createEntry":n.entry&&await h(n.entry,!0,"entries");break;case"saveEntry":n.entry&&(!n.entry.task.trim()&&!n.entry.timeIn&&!n.entry.timeOut?(delete t.entries[n.entry.date],await o(),l()):await h(n.entry,!1,n.view??"entries"));break;case"deleteEntry":n.date&&(delete t.entries[n.date],await o(),l());break;case"setPeriodStart":if(!n.value||!I(n.value)){await a.webview.postMessage({type:"error",view:"report",message:"Enter a valid period start date."});break}t.periodStart=n.value,await o(),l();break;case"setHourlyRate":if(n.value==="")t.hourlyRate=null;else{let c=Number(n.value);if(!Number.isFinite(c)||c<0){await a.webview.postMessage({type:"error",view:"report",message:"Enter a valid hourly rate of zero or more."});break}t.hourlyRate=c}await o(),l();break;case"requestReportAction":{let c=await d.window.showQuickPick([{label:"Print report",detail:"Open a PDF in your default viewer, then choose Print",value:"print"},{label:"Save as PDF",detail:"Choose a location and save a PDF file",value:"pdf"}],{placeHolder:"Choose how to export this report"});if(c?.value==="print"){try{let s=await M(t),m=b.join(e.globalStorageUri.fsPath,"print-reports");await(0,p.mkdir)(m,{recursive:!0});let f=await(0,p.mkdtemp)(b.join(m,"report-")),y=`timesheet-${t.periodStart}-to-${T(t.periodStart)}.pdf`,v=b.join(f,y);if(await(0,p.writeFile)(v,s),!await d.env.openExternal(d.Uri.file(v)))throw new Error("No PDF viewer could be opened. Use Save as PDF and open the file manually.");d.window.showInformationMessage("Report opened in your default PDF viewer. Use its Print command to print.")}catch(s){let m=s instanceof Error?s.message:String(s);d.window.showErrorMessage(`Could not open the report for printing: ${m}`)}break}if(c?.value==="pdf"){let s=`timesheet-${t.periodStart}-to-${T(t.periodStart)}.pdf`,m=d.workspace.workspaceFolders?.[0]?.uri??d.Uri.file((0,j.homedir)()),f=await d.window.showSaveDialog({defaultUri:d.Uri.joinPath(m,s),filters:{"PDF documents":["pdf"]},saveLabel:"Save PDF"});if(!f)break;try{let y=await M(t),v=b.extname(f.fsPath).toLowerCase()===".pdf"?f.fsPath:`${f.fsPath}.pdf`;await(0,p.writeFile)(v,y),d.window.showInformationMessage(`PDF saved to ${v}`)}catch(y){let v=y instanceof Error?y.message:String(y);d.window.showErrorMessage(`Could not save the PDF: ${v}`)}}break}}})});e.subscriptions.push(r)}function re(){}0&&(module.exports={activate,deactivate});
