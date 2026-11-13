import * as assert from 'node:assert';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { spawn } from 'node:child_process';
import { acquireStorageOwnership } from '../storageOwnership';

suite('Storage ownership', () => {
	let directory: string;

	setup(() => { directory = mkdtempSync(path.join(tmpdir(), 'time-tracker-owner-')); });
	teardown(() => { rmSync(directory, { recursive: true, force: true }); });

	test('blocks competing owners and permits acquisition after release', () => {
		const release = acquireStorageOwnership(directory);
		assert.throws(() => acquireStorageOwnership(directory), /storage is in use/i);
		release();
		acquireStorageOwnership(directory)();
	});

	test('does not remove a changed owner lock', () => {
		const release = acquireStorageOwnership(directory);
		const lock = path.join(directory, 'time-tracker.owner.lock');
		writeFileSync(lock, 'another owner');
		assert.throws(release, /ownership changed unexpectedly/i);
		assert.strictEqual(readFileSync(lock, 'utf8'), 'another owner');
	});

	test('blocks another process until ownership is released', async function () {
		this.timeout(30000);
		const release = acquireStorageOwnership(directory);
		const script = 'try { require(process.argv[1]).acquireStorageOwnership(process.argv[2])(); } catch { process.exit(1); }';
		const run = () => new Promise<number | null>((resolve, reject) => {
			const child = spawn(process.execPath, ['-e', script, path.join(__dirname, '..', 'storageOwnership.js'), directory], {
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
		} finally {
			if (!released) { release(); }
		}
	});
});
