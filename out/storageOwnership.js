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
exports.StorageInUseError = void 0;
exports.acquireStorageOwnership = acquireStorageOwnership;
const node_fs_1 = require("node:fs");
const node_crypto_1 = require("node:crypto");
const path = __importStar(require("node:path"));
class StorageInUseError extends Error {
    lockFile;
    constructor(lockFile) {
        super(`Time Tracker is paused because its storage is in use. Close the other window and reload. ` +
            `If the owner crashed, close every VS Code window before removing ${lockFile}, then reopen VS Code.`);
        this.lockFile = lockFile;
    }
}
exports.StorageInUseError = StorageInUseError;
function acquireStorageOwnership(directory) {
    (0, node_fs_1.mkdirSync)(directory, { recursive: true });
    const lockFile = path.join(directory, 'time-tracker.owner.lock');
    const owner = JSON.stringify({ pid: process.pid, token: (0, node_crypto_1.randomBytes)(16).toString('hex') });
    try {
        (0, node_fs_1.writeFileSync)(lockFile, owner, { flag: 'wx' });
    }
    catch (error) {
        if (error.code === 'EEXIST') {
            throw new StorageInUseError(lockFile);
        }
        throw error;
    }
    return () => {
        if ((0, node_fs_1.readFileSync)(lockFile, 'utf8') !== owner) {
            throw new Error(`Storage ownership changed unexpectedly; the lock at ${lockFile} was not removed.`);
        }
        (0, node_fs_1.unlinkSync)(lockFile);
    };
}
//# sourceMappingURL=storageOwnership.js.map