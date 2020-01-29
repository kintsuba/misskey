import $ from 'cafy';
import define from '../../../define';
import { ApiError } from '../../../error';
import Emoji from '../../../../../models/emoji';
import { IDriveFile } from '../../../../../models/drive-file';
import ID from '../../../../../misc/cafy-id';
import { uploadFromUrl } from '../../../../../services/drive/upload-from-url';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireModerator: true,

	params: {
		emojiId: {
			validator: $.type(ID)
		},
	},

	errors: {
		noSuchEmoji: {
			message: 'No such emoji.',
			code: 'NO_SUCH_EMOJI',
			id: 'e2785b66-dca3-4087-9cac-b93c541cc425'
		}
	}
};

export default define(meta, async (ps, me) => {
	const emoji = await Emoji.findOne({
		_id: ps.emojiId
	});

	if (emoji == null) {
		throw new ApiError(meta.errors.noSuchEmoji);
	}

	let driveFile: IDriveFile;

	try {
		// Create file
		driveFile = await uploadFromUrl(emoji.url, null, null, null, false, true);
	} catch (e) {
		throw new ApiError();
	}

	const copied = await Emoji.insert({
		updatedAt: new Date(),
		name: emoji.name,
		host: null,
		aliases: [],
		url: driveFile.metadata.url,
		type: driveFile.contentType,
		fileId: driveFile._id,
	});

	return {
		id: copied._id
	};
});
