"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTimeTracker = void 0;
exports.summarizeFileTime = summarizeFileTime;
exports.parseFileTimeTotals = parseFileTimeTotals;
const node_perf_hooks_1 = require("node:perf_hooks");
function summarizeFileTime(snapshot) {
    return {
        total: Object.values(snapshot.fileTimes).reduce((total, milliseconds) => total + milliseconds, 0),
        current: snapshot.activeFile && Object.hasOwn(snapshot.fileTimes, snapshot.activeFile)
            ? snapshot.fileTimes[snapshot.activeFile] : 0,
    };
}
function parseFileTimeTotals(value) {
    if (value === undefined) {
        return {};
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Invalid stored file time data: expected an object of file paths and durations.');
    }
    const prototype = Object.getPrototypeOf(value);
    const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value;
    if (prototype !== null && (Object.getPrototypeOf(prototype) !== null ||
        typeof constructor !== 'function' ||
        Function.prototype.toString.call(constructor) !== Function.prototype.toString.call(Object))) {
        throw new Error('Invalid stored file time data: expected an object of file paths and durations.');
    }
    const totals = Object.create(null);
    for (const [filePath, total] of Object.entries(value)) {
        if (!filePath || typeof total !== 'number' || !Number.isFinite(total) || total < 0) {
            throw new Error(`Invalid stored file time data for ${JSON.stringify(filePath)}: expected a non-negative finite duration.`);
        }
        totals[filePath] = total;
    }
    return { ...totals };
}
class FileTimeTracker {
    persistFileTimes;
    now;
    fileTimes = Object.create(null);
    activeFile;
    startedAt;
    paused = false;
    writeQueue = Promise.resolve();
    pendingSnapshots = new Set();
    excludedFiles;
    constructor(initialFileTimes, persistFileTimes, now = () => node_perf_hooks_1.performance.now(), initialExcludedFiles = []) {
        this.persistFileTimes = persistFileTimes;
        this.now = now;
        Object.assign(this.fileTimes, parseFileTimeTotals(initialFileTimes));
        this.excludedFiles = new Set(initialExcludedFiles);
    }
    setActiveFile(filePath) {
        const timestamp = this.now();
        this.accrueTime(timestamp);
        this.activeFile = filePath || undefined;
        this.startedAt = this.isTracking() ? timestamp : undefined;
        return this.persist();
    }
    setPaused(paused) {
        const timestamp = this.now();
        this.accrueTime(timestamp);
        this.paused = paused;
        this.startedAt = this.isTracking() ? timestamp : undefined;
        return this.persist();
    }
    isExcluded(filePath) {
        return this.excludedFiles.has(filePath);
    }
    setExcludedFiles(filePaths) {
        const timestamp = this.now();
        this.accrueTime(timestamp);
        this.excludedFiles = new Set(filePaths);
        this.startedAt = this.isTracking() ? timestamp : undefined;
        return this.persist();
    }
    reset() {
        this.accrueTime(this.now());
        const baseline = { ...this.fileTimes };
        const excludedFiles = [...this.excludedFiles];
        this.pendingSnapshots.add(baseline);
        const write = this.writeQueue.then(async () => {
            try {
                await this.persistFileTimes({}, excludedFiles);
            }
            catch (error) {
                try {
                    await this.persistFileTimes({ ...this.fileTimes }, [...this.excludedFiles]);
                }
                catch (recoveryError) {
                    throw new Error(`File time reset failed: ${String(error)}; recovery write failed: ${String(recoveryError)}. Retry saving file times.`);
                }
                throw error;
            }
            this.subtractBaseline(this.fileTimes, baseline);
            for (const pending of this.pendingSnapshots) {
                if (pending !== baseline) {
                    this.subtractBaseline(pending, baseline);
                }
            }
        }).finally(() => this.pendingSnapshots.delete(baseline));
        this.writeQueue = write.then(() => undefined, () => undefined);
        return write;
    }
    checkpoint() {
        this.accrueTime(this.now());
        return this.persist();
    }
    snapshot() {
        const fileTimes = { ...this.fileTimes };
        if (this.activeFile && this.startedAt !== undefined) {
            Object.defineProperty(fileTimes, this.activeFile, {
                value: (this.fileTimes[this.activeFile] ?? 0) + Math.max(0, this.now() - this.startedAt),
                enumerable: true, configurable: true, writable: true,
            });
        }
        for (const [filePath, total] of Object.entries(fileTimes)) {
            if (total === 0 && !(filePath === this.activeFile && this.isTracking())) {
                delete fileTimes[filePath];
            }
        }
        return { fileTimes, activeFile: this.activeFile ?? null, paused: this.paused };
    }
    isTracking() {
        return !!this.activeFile && !this.paused && !this.excludedFiles.has(this.activeFile);
    }
    accrueTime(timestamp) {
        if (this.activeFile && this.startedAt !== undefined) {
            this.fileTimes[this.activeFile] = (this.fileTimes[this.activeFile] ?? 0) +
                Math.max(0, timestamp - this.startedAt);
        }
        this.startedAt = this.isTracking() ? timestamp : undefined;
    }
    subtractBaseline(totals, baseline) {
        for (const [filePath, total] of Object.entries(baseline)) {
            if (Object.hasOwn(totals, filePath)) {
                const remaining = totals[filePath] - total;
                if (remaining > 0) {
                    totals[filePath] = remaining;
                }
                else {
                    delete totals[filePath];
                }
            }
        }
    }
    persist() {
        const snapshot = { ...this.fileTimes };
        const excludedFiles = [...this.excludedFiles];
        this.pendingSnapshots.add(snapshot);
        const write = this.writeQueue.then(() => this.persistFileTimes({ ...snapshot }, excludedFiles))
            .finally(() => this.pendingSnapshots.delete(snapshot));
        this.writeQueue = write.then(() => undefined, () => undefined);
        return write;
    }
}
exports.FileTimeTracker = FileTimeTracker;
//# sourceMappingURL=fileTimeTracker.js.map