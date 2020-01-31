import deleteNote from './note';
import { IRemoteUser } from '../../../../models/entities/user';
import { IDelete, getApId, validPost, IObject, isTombstone, validActor } from '../../type';
import { apLogger } from '../../logger';

/**
 * 削除アクティビティを捌きます
 */
export default async (actor: IRemoteUser, activity: IDelete): Promise<void> => {
	if ('actor' in activity && actor.uri !== activity.actor) {
		throw new Error('invalid actor');
	}

	// 削除対象objectのtype
	let formarType: string | undefined;

	if (typeof activity.object === 'string') {
		// typeが不明だけど、どうせ消えてるのでremote resolveしない
		formarType = undefined;
	} else {
		const object = activity.object as IObject;
		if (isTombstone(object)) {
			formarType = object.formerType;
		} else {
			formarType = object.type;
		}
	}

	const uri = getApId(activity.object);

	// type不明でもactorとobjectが同じならばそれはPersonに違いない
	if (!formarType && actor.uri === uri) {
		formarType = 'Person';
	}

	// それでもなかったらおそらくNote
	if (!formarType) {
		formarType = 'Note';
	}

	if (validPost.includes(formarType)) {
		return await deleteNote(actor, uri);
	} else if (validActor.includes(formarType)) {
		apLogger.warn(`Delete Actor is not implanted`);
		return;
	} else {
		apLogger.warn(`Unknown type: ${formarType}`);
		return;
	}
};
