"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTimeTracker = void 0;
exports.parseFileTimeTotals = parseFileTimeTotals;
function parseFileTimeTotals(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }
    const totals = {};
    for (const [filePath, total] of Object.entries(value)) {
        if (filePath && typeof total === 'number' && Number.isFinite(total) && total >= 0) {
            totals[filePath] = total;
        }
    }
    return totals;
}
class FileTimeTracker {
    persistFileTimes;
    now;
    fileTimes;
    activeFile;
    startedAt;
    writeQueue = Promise.resolve();
    constructor(initialFileTimes, persistFileTimes, now = Date.now) {
        this.persistFileTimes = persistFileTimes;
        this.now = now;
        this.fileTimes = parseFileTimeTotals(initialFileTimes);
    }
    setActiveFile(filePath) {
        const timestamp = this.now();
        this.accrueTime(timestamp);
        this.activeFile = filePath || undefined;
        this.startedAt = this.activeFile ? timestamp : undefined;
        return this.persist();
    }
    checkpoint() {
        this.accrueTime(this.now());
        return this.persist();
    }
    snapshot() {
        const fileTimes = { ...this.fileTimes };
        if (this.activeFile && this.startedAt !== undefined) {
            fileTimes[this.activeFile] = (fileTimes[this.activeFile] ?? 0) +
                Math.max(0, this.now() - this.startedAt);
        }
        return { fileTimes, activeFile: this.activeFile ?? null };
    }
    accrueTime(timestamp) {
        if (this.activeFile && this.startedAt !== undefined) {
            this.fileTimes[this.activeFile] = (this.fileTimes[this.activeFile] ?? 0) +
                Math.max(0, timestamp - this.startedAt);
        }
        this.startedAt = this.activeFile ? timestamp : undefined;
    }
    persist() {
        const snapshot = { ...this.fileTimes };
        const write = this.writeQueue.then(() => this.persistFileTimes(snapshot));
        this.writeQueue = write.then(() => undefined, () => undefined);
        return write;
    }
}
exports.FileTimeTracker = FileTimeTracker;
//# sourceMappingURL=fileTimeTracker.js.map