import * as debug from 'debug';
import { createPerson } from '../remote/activitypub/models/person';
import User from '../models/user';

debug.enable('*');

async function main(uri: string): Promise<any> {
	const object = await resolveRelay(uri);
	console.log(object);
}

async function resolveRelay(uri: string) {
	const exist = await User.findOne({ uri });
	if (exist) return exist;

	return await createPerson(uri);
}

const args = process.argv.slice(2);
const url = args[0];

main(url).then(() => {
	console.log('success');
	process.exit(0);
}).catch(e => {
	console.warn(e);
	process.exit(1);
});
