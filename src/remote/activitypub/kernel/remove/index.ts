import { IRemoteUser } from '../../../../models/user';
import { IRemove } from '../../type';
import { resolveNote } from '../../models/note';
import { removePinned } from '../../../../services/i/pin';

export default async (actor: IRemoteUser, activity: IRemove): Promise<string> => {
	if ('actor' in activity && actor.uri !== activity.actor) {
		return `skip: invalid actor`;
	}

	if (activity.target == null) {
		return `skip: target is null`;
	}

	if (activity.target === actor.featured) {
		const note = await resolveNote(activity.object);
		await removePinned(actor, note._id);
		return `ok`;
	}

	return `skip: unknown target: ${activity.target}`;
};
