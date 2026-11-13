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
exports.TimeTrackerProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class TimeTrackerProvider {
    context;
    timeTracker;
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(context, timeTracker) {
        this.context = context;
        this.timeTracker = timeTracker;
        // Refresh the panel periodically
        setInterval(() => {
            this.refresh();
        }, 10000); // Refresh every 10 seconds
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // Root level
            const items = [];
            // Calculate total time
            const fileTimers = this.timeTracker.getFileTimers();
            let totalTime = 0;
            for (const [, timer] of fileTimers) {
                totalTime += timer.totalTime;
            }
            // Total time
            const totalTimeStr = totalTime > 0 ? this.formatTime(totalTime) : '0h 0m';
            const totalItem = new TimeTrackerItem('Total Time', totalTimeStr, 'stopwatch', vscode.TreeItemCollapsibleState.None);
            items.push(totalItem);
            // Project folder
            const projectItem = new TimeTrackerItem('Active Files', '', 'folder', vscode.TreeItemCollapsibleState.Expanded);
            items.push(projectItem);
            return Promise.resolve(items);
        }
        else if (element.label === 'Active Files') {
            // File list
            const fileTimers = this.timeTracker.getFileTimers();
            const items = [];
            for (const [filePath, timer] of fileTimers) {
                const fileName = path.basename(filePath);
                const timeStr = this.formatTime(timer.totalTime);
                const description = timeStr;
                const iconName = this.getFileIcon(filePath);
                const item = new TimeTrackerItem(fileName, description, iconName, vscode.TreeItemCollapsibleState.None);
                item.tooltip = `${filePath}\nTotal time: ${timeStr}`;
                item.contextValue = 'fileItem';
                items.push(item);
            }
            return Promise.resolve(items);
        }
        return Promise.resolve([]);
    }
    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
    getFileIcon(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const iconMap = {
            '.js': 'file-javascript',
            '.ts': 'file-typescript',
            '.html': 'file-html',
            '.css': 'file-css',
            '.md': 'file-markdown',
            '.json': 'file-json',
            '.txt': 'file-text',
            '.png': 'file-image',
            '.jpg': 'file-image',
            '.jpeg': 'file-image'
        };
        return iconMap[ext] || 'file';
    }
}
exports.TimeTrackerProvider = TimeTrackerProvider;
class TimeTrackerItem extends vscode.TreeItem {
    label;
    description;
    collapsibleState;
    constructor(label, description, iconName, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.description = description;
        this.collapsibleState = collapsibleState;
        this.tooltip = `${this.label}: ${this.description}`;
        this.description = description;
        if (this.label !== 'Total Time' && this.label !== 'Active Files') {
            this.iconPath = new vscode.ThemeIcon(iconName);
        }
        else {
            this.iconPath = new vscode.ThemeIcon(iconName);
        }
    }
}
//# sourceMappingURL=timeTrackerProvider.js.map