import * as Bull from 'bull';
import { queueLogger } from '../../logger';
import { Users, Notes } from '../../../models';
import del from '../../../services/note/delete';

const logger = queueLogger.createSubLogger('delete-note');

export async function deleteNote(job: Bull.Job, done: any): Promise<void> {
	logger.info(`deleting note ${job.data.noteId} ...`);

	const note = await Notes.findOne(job.data.noteId);
	if (note == null) {
		done();
		return;
	}

	const user = await Users.findOne(note.userId);
	if (user == null) {
		done();
		return;
	}

	await del(user, note);

	logger.succ(`deleted note: ${note.id}`);
	done();
}
