import { toUnicode, toASCII } from 'punycode';
import config from '../../config';

// user@hostをパースするが
// hostはローカルと同じならばnullにする
// unicode <=> punycode を同一視する
export default (acct: string) => {
	const splitted = acct.split('@', 2);
	const username = splitted[0];
	let host = normalizeHost(splitted[1]);

	const configHost = normalizeHost(config.host);

	if (host != null && host == configHost) {
		host = null;
	}

	return { username, host };
};

function normalizeHost(host: string) {
	if (host == null) return null;
	const hostAscii = toASCII(host).toLowerCase();
	return toUnicode(hostAscii);
}
