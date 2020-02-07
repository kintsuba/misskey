import $ from 'cafy';
import create from '../../../../../services/drive/add-file';
import define from '../../../define';
import { apiLogger } from '../../../logger';
import { ApiError } from '../../../error';
import { DriveFiles } from '../../../../../models';

export const meta = {
	desc: {
		'ja-JP': 'ユーザーに紐付かないファイルをアップロードします。',
	},

	tags: ['admin'],

	requireCredential: true,
	requireModerator: true,

	requireFile: true,

	params: {
		name: {
			validator: $.optional.nullable.str,
			default: null as any,
			desc: {
				'ja-JP': 'ファイル名（拡張子があるなら含めて）'
			}
		},
	},

	res: {
		type: 'object' as const,
		optional: false as const, nullable: false as const,
		ref: 'DriveFile',
	},
};

//@ts-ignore
export default define(meta, async (ps, user, app, file, cleanup) => {
	try {
		// Create file
		const driveFile = await create(null, file.path, ps.name, null, null, false, false, null, null, false);
		return await DriveFiles.pack(driveFile, { self: true });
	} catch (e) {
		apiLogger.error(e);
		throw new ApiError();
	} finally {
		cleanup!();
	}
});
