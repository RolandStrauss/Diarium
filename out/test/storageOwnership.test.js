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
const assert = __importStar(require("node:assert"));
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
const path = __importStar(require("node:path"));
const node_child_process_1 = require("node:child_process");
const storageOwnership_1 = require("../storageOwnership");
suite('Storage ownership', () => {
    let directory;
    setup(() => { directory = (0, node_fs_1.mkdtempSync)(path.join((0, node_os_1.tmpdir)(), 'time-tracker-owner-')); });
    teardown(() => { (0, node_fs_1.rmSync)(directory, { recursive: true, force: true }); });
    test('blocks competing owners and permits acquisition after release', () => {
        const release = (0, storageOwnership_1.acquireStorageOwnership)(directory);
        assert.throws(() => (0, storageOwnership_1.acquireStorageOwnership)(directory), /storage is in use/i);
        release();
        (0, storageOwnership_1.acquireStorageOwnership)(directory)();
    });
    test('does not remove a changed owner lock', () => {
        const release = (0, storageOwnership_1.acquireStorageOwnership)(directory);
        const lock = path.join(directory, 'time-tracker.owner.lock');
        (0, node_fs_1.writeFileSync)(lock, 'another owner');
        assert.throws(release, /ownership changed unexpectedly/i);
        assert.strictEqual((0, node_fs_1.readFileSync)(lock, 'utf8'), 'another owner');
    });
    test('blocks another process until ownership is released', async function () {
        this.timeout(30000);
        const release = (0, storageOwnership_1.acquireStorageOwnership)(directory);
        const script = 'try { require(process.argv[1]).acquireStorageOwnership(process.argv[2])(); } catch { process.exit(1); }';
        const run = () => new Promise((resolve, reject) => {
            const child = (0, node_child_process_1.spawn)(process.execPath, ['-e', script, path.join(__dirname, '..', 'storageOwnership.js'), directory], {
                env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
                stdio: 'ignore',
                timeout: 10000,
                windowsHide: true,
            });
            child.once('error', reject);
            child.once('exit', resolve);
        });
        let released = false;
        try {
            assert.strictEqual(await run(), 1);
            release();
            released = true;
            assert.strictEqual(await run(), 0);
        }
        finally {
            if (!released) {
                release();
            }
        }
    });
});
//# sourceMappingURL=storageOwnership.test.js.map