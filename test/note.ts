/*
 * Tests of Note
 *
 * How to run the tests:
 * > npx cross-env TS_NODE_FILES=true TS_NODE_TRANSPILE_ONLY=true npx mocha test/note.ts --require ts-node/register
 *
 * To specify test:
 * > npx cross-env TS_NODE_FILES=true TS_NODE_TRANSPILE_ONLY=true npx mocha test/note.ts --require ts-node/register -g 'test name'
 */

process.env.NODE_ENV = 'test';

import * as assert from 'assert';
import * as childProcess from 'child_process';
import { async, signup, request, uploadFile, launchServer } from './utils';

describe('Note', () => {
	let p: childProcess.ChildProcess;
	//let Notes: any;

	let alice: any;
	let bob: any;

	before(launchServer(g => p = g, async () => {
		//const connection = await initDb(true);
		//Notes = connection.getRepository(Note);
		alice = await signup({ username: 'alice' });
		bob = await signup({ username: 'bob' });
	}));

	after(() => {
		p.kill();
	});

	it('ファイルを添付できる', async(async () => {
		const file = await uploadFile(alice);

		const res = await request('/notes/create', {
			fileIds: [file.id]
		}, alice);

		assert.strictEqual(res.status, 200);
		assert.strictEqual(typeof res.body === 'object' && !Array.isArray(res.body), true);
		assert.deepStrictEqual(res.body.createdNote.fileIds, [file.id]);
	}));

	it('他人のファイルは無視', async(async () => {
		const file = await uploadFile(bob);

		const res = await request('/notes/create', {
			text: 'test',
			fileIds: [file.id]
		}, alice);

		assert.strictEqual(res.status, 200);
		assert.strictEqual(typeof res.body === 'object' && !Array.isArray(res.body), true);
		assert.deepStrictEqual(res.body.createdNote.fileIds, []);
	}));
});
