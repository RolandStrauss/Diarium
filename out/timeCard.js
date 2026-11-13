"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeCard = createTimeCard;
exports.renderTimeCardHtml = renderTimeCardHtml;
exports.renderTimeCardPdf = renderTimeCardPdf;
const path = __importStar(require("node:path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const timeData_1 = require("./timeData");
const CARD_NOTE = 'All-time file activity across workspaces, including idle time while focused. Not a timesheet or billable-hours report. Durations display whole minutes; shares use unrounded time. Only file names are included; repeated names are numbered. Review file names before sharing.';
function snapshotLabel(card) {
    return card.generatedAt.replace('T', ' ').replace('Z', ' UTC');
}
function createTimeCard(fileTimes, now = new Date()) {
    const files = Object.entries(fileTimes).map(([file, milliseconds]) => {
        if (!file || !Number.isFinite(milliseconds) || milliseconds < 0) {
            throw new Error('Time cards require non-negative, finite file durations and non-empty file names.');
        }
        return { name: path.basename(file), milliseconds, percent: 0 };
    }).sort((a, b) => b.milliseconds - a.milliseconds || a.name.localeCompare(b.name));
    const totalMilliseconds = files.reduce((total, file) => total + file.milliseconds, 0);
    if (!Number.isFinite(totalMilliseconds)) {
        throw new Error('The total tracked time is too large to export.');
    }
    const counts = new Map();
    for (const file of files) {
        counts.set(file.name, (counts.get(file.name) ?? 0) + 1);
    }
    const occurrences = new Map();
    const labels = new Set(files.map(file => file.name));
    for (const file of files) {
        file.percent = totalMilliseconds > 0 ? file.milliseconds / totalMilliseconds * 100 : 0;
        const name = file.name;
        if (counts.get(name) > 1) {
            let occurrence = occurrences.get(name) ?? 0;
            do {
                file.name = `${name} (${++occurrence})`;
            } while (labels.has(file.name));
            occurrences.set(name, occurrence);
            labels.add(file.name);
        }
    }
    return { generatedAt: now.toISOString(), totalMilliseconds, files };
}
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
}
function cardDuration(milliseconds) {
    return (0, timeData_1.formatDuration)(Math.floor(milliseconds / 60_000));
}
function renderTimeCardHtml(card, preview) {
    const rows = card.files.map(file => `<li class="file-row">
<div class="file-detail"><span class="file-name">${escapeHtml(file.name)}</span>
<span class="file-time">${cardDuration(file.milliseconds)} <small>${file.percent.toFixed(1)}%</small></span></div>
<div class="track" aria-hidden="true"><div class="bar" style="width:${file.percent}%"></div></div></li>`).join('');
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src ${preview ? `'nonce-${preview.nonce}'` : "'none'"}; base-uri 'none'; form-action 'none';">
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
${preview ? '<nav class="actions" aria-label="Time card actions"><button id="save-html">Save HTML</button><button id="save-pdf">Save PDF</button><button id="refresh">Refresh snapshot</button></nav>' : ''}
<main class="card">
<p class="eyebrow">Time Tracker / File activity</p>
<h1>Time well spent.</h1>
<p class="date">Snapshot: <time datetime="${card.generatedAt}">${snapshotLabel(card)}</time></p>
<section class="summary" aria-label="Activity summary"><div><strong>${cardDuration(card.totalMilliseconds)}</strong><span>Total tracked time</span></div><div><strong>${card.files.length}</strong><span>Files tracked</span></div></section>
<ul aria-label="Tracked files">${rows || '<li class="note">No files tracked yet.</li>'}</ul>
<footer class="note">${CARD_NOTE}</footer>
</main>
${preview ? `<script nonce="${preview.nonce}">
const vscode = acquireVsCodeApi();
document.getElementById('save-html').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'html' }));
document.getElementById('save-pdf').addEventListener('click', () => vscode.postMessage({ type: 'export', format: 'pdf' }));
document.getElementById('refresh').addEventListener('click', () => vscode.postMessage({ type: 'refresh' }));
</script>` : ''}
</body>
</html>`;
}
function renderTimeCardPdf(card) {
    // shortcut: PDFKit's built-in fonts support printable ASCII/Latin-1 names; use HTML/browser print until a Unicode font is bundled.
    if (card.files.some(file => /[^\x20-\x7e\u00a0-\u00ff]/u.test(file.name))) {
        return Promise.reject(new Error('PDF cards support printable ASCII and Latin-1 file names only. Save HTML and print it from your browser for these file names.'));
    }
    return new Promise((resolve, reject) => {
        const document = new pdfkit_1.default({ size: 'A4', margin: 44, compress: true });
        const chunks = [];
        document.on('data', (chunk) => chunks.push(chunk));
        document.on('error', reject);
        document.on('end', () => resolve(Buffer.concat(chunks)));
        const width = document.page.width - 88;
        let y = 0;
        const heading = () => {
            document.rect(0, 0, document.page.width, document.page.height)
                .fill(document.linearGradient(0, 0, document.page.width, document.page.height)
                .stop(0, '#102d32').stop(0.65, '#1b5246').stop(1, '#346447'));
            document.fillColor('#d0e4d7').font('Helvetica').fontSize(10).text('TIME TRACKER / FILE ACTIVITY', 44, 44);
            document.fillColor('#ffffff').font('Times-Roman').fontSize(32).text('Time well spent.', 44, 66);
            document.fillColor('#d0e4d7').font('Helvetica').fontSize(9)
                .text(`Snapshot: ${snapshotLabel(card)}`, 44, 110);
            document.fillColor('#ffe1a6').font('Times-Roman').fontSize(24)
                .text(`${cardDuration(card.totalMilliseconds)}   /   ${card.files.length} files`, 44, 140);
            y = 190;
        };
        const nextPage = () => { document.addPage(); heading(); };
        heading();
        for (const file of card.files) {
            document.font('Helvetica').fontSize(11);
            const nameHeight = document.heightOfString(file.name, { width });
            const rowHeight = nameHeight + 44;
            if (y + rowHeight > document.page.height - 130) {
                nextPage();
            }
            document.fillColor('#ffffff').font('Helvetica').fontSize(11).text(file.name, 44, y, { width });
            y += nameHeight + 6;
            document.fillColor('#ffe1a6').fontSize(10)
                .text(`${cardDuration(file.milliseconds)}  /  ${file.percent.toFixed(1)}%`, 44, y);
            y += 18;
            document.roundedRect(44, y, width, 6, 3).fill('#45665d');
            if (file.percent > 0) {
                document.rect(44, y, width * file.percent / 100, 6)
                    .fill(document.linearGradient(44, y, 44 + width, y).stop(0, '#7edcbb').stop(1, '#ffcc7d'));
            }
            y += 20;
        }
        if (!card.files.length) {
            document.fillColor('#ffffff').font('Helvetica').fontSize(12).text('No files tracked yet.', 44, y);
            y += 32;
        }
        if (y + 90 > document.page.height - 44) {
            nextPage();
        }
        document.fillColor('#d0e4d7').font('Helvetica').fontSize(9).text(CARD_NOTE, 44, y + 12, { width });
        document.end();
    });
}
//# sourceMappingURL=timeCard.js.map