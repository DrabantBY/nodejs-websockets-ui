import websockets from '../db/websockets.ts';
import pointers from '../db/pointers.ts';
import users from '../db/users.ts';

import type { Common } from '../types/requests.ts';

export default class ResponseService {
	private stringifyData = (response: Common<unknown, unknown>): string => {
		const json = JSON.stringify(response, (key, value) =>
			key === 'data' ? JSON.stringify(value) : value
		);

		return json;
	};

	sendById(type: string, data: unknown, id: string | number) {
		const res = this.stringifyData({ id: 0, type, data });
		websockets[pointers[id]].send(res);
	}

	sendAll(type: string, data: unknown) {
		const res = this.stringifyData({ id: 0, type, data });

		Object.values(users).forEach(({ index }) => {
			websockets[pointers[index]]?.send(res);
		});
	}

	sendByKey(type: string, data: unknown, key: string) {
		const res = this.stringifyData({ id: 0, type, data });
		websockets[key].send(res);
	}
}
