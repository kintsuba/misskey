import { IRemoteUser } from '../../../../models/entities/user';
import deleteNode from '../../../../services/note/delete';
import { apLogger } from '../../logger';
import { Notes } from '../../../../models';
import { getApLock } from '../../../../misc/app-lock';

const logger = apLogger;

export default async function(actor: IRemoteUser, uri: string): Promise<void> {
	logger.info(`Deleting the Note: ${uri}`);

	const unlock = await getApLock(uri);

	try {
		const note = await Notes.findOne({ uri });

		if (note == null) {
			logger.warn(`note not found`);
			return
		}

		if (note.userId !== actor.id) {
			logger.warn(`投稿を削除しようとしているユーザーは投稿の作成者ではありません`);
			return;
		}

		await deleteNode(actor, note);
	} finally {
		unlock();
	}
}
