import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import * as path from 'node:path';

export function acquireStorageOwnership(directory: string): () => void {
	mkdirSync(directory, { recursive: true });
	const lockFile = path.join(directory, 'time-tracker.owner.lock');
	const owner = JSON.stringify({ pid: process.pid, token: randomBytes(16).toString('hex') });
	try {
		writeFileSync(lockFile, owner, { flag: 'wx' });
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
			throw new Error(`Time Tracker is paused because its storage is in use. Close the other window and reload. ` +
				`If the owner crashed, close every VS Code window before removing ${lockFile}, then reopen VS Code.`);
		}
		throw error;
	}
	return () => {
		if (readFileSync(lockFile, 'utf8') !== owner) {
			throw new Error(`Storage ownership changed unexpectedly; the lock at ${lockFile} was not removed.`);
		}
		unlinkSync(lockFile);
	};
}
