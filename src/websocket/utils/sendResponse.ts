import websockets from '../db/websockets.ts';
import stringifyData from './stringifyData.ts';
import pointers from '../db/pointers.ts';
import users from '../db/users.ts';
import type { QueryTypes } from '../types/requests.ts';

const sendResponse = (
	type: QueryTypes,
	data: unknown,
	ids?: (string | number)[]
): void => {
	const response = stringifyData({
		id: 0,
		type,
		data,
	});

	if (!ids || !ids.length) {
		Object.values(users).forEach(({ index }) => {
			websockets[pointers[index]]?.send(response);
		});
	} else {
		ids.forEach((id) => {
			websockets[pointers[id]]?.send(response);
		});
	}
};

export default sendResponse;
