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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingTimer = void 0;
exports.getFloatingTimerHtml = getFloatingTimerHtml;
const vscode = __importStar(require("vscode"));
const node_crypto_1 = require("node:crypto");
const path = __importStar(require("node:path"));
const fileTimeTracker_1 = require("./fileTimeTracker");
function clock(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
        .map(value => String(value).padStart(2, '0')).join(':');
}
class FloatingTimer {
    snapshot;
    toggleTracking;
    panel;
    constructor(snapshot, toggleTracking) {
        this.snapshot = snapshot;
        this.toggleTracking = toggleTracking;
    }
    show() {
        if (this.panel) {
            this.panel.reveal(this.panel.viewColumn, true);
            this.update();
            return;
        }
        const panel = vscode.window.createWebviewPanel('timeTrackerFloatingTimer', 'Floating Timer', { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true }, { enableScripts: true, retainContextWhenHidden: true, localResourceRoots: [] });
        this.panel = panel;
        const messages = panel.webview.onDidReceiveMessage(async (message) => {
            if (!message || typeof message !== 'object' || !('type' in message)) {
                return;
            }
            switch (message.type) {
                case 'ready':
                    this.update();
                    break;
                case 'toggleTracking':
                    await this.toggleTracking();
                    break;
                case 'hide':
                    this.hide();
                    break;
            }
        });
        const visibility = panel.onDidChangeViewState(() => this.update());
        panel.onDidDispose(() => {
            messages.dispose();
            visibility.dispose();
            this.panel = undefined;
        });
        panel.webview.html = getFloatingTimerHtml();
    }
    update() {
        if (!this.panel) {
            return;
        }
        const snapshot = this.snapshot();
        const totals = (0, fileTimeTracker_1.summarizeFileTime)(snapshot);
        void this.panel.webview.postMessage({
            type: 'timer',
            totalTime: clock(totals.total),
            currentTime: clock(totals.current),
            currentFile: snapshot.activeFile ? path.basename(snapshot.activeFile) : 'No local file active',
            paused: snapshot.paused,
            status: snapshot.paused ? 'Paused' : snapshot.excluded ? 'Excluded'
                : snapshot.activeFile ? 'Tracking' : 'Waiting for a focused local file',
        });
    }
    hide() {
        this.panel?.dispose();
    }
    dispose() {
        this.hide();
    }
}
exports.FloatingTimer = FloatingTimer;
function getFloatingTimerHtml() {
    const nonce = (0, node_crypto_1.randomBytes)(16).toString('hex');
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
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
<script nonce="${nonce}">
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
</html>`;
}
//# sourceMappingURL=floatingTimer.js.map