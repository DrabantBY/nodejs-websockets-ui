import { users } from './db/users.ts';
import parseRawData from './utils/parseRawData.ts';
import stringifyData from './utils/stringifyData.ts';
import checkLogin from './utils/checkLogin.ts';
import type { Login } from './types/user.ts';
import type WebSocket from 'ws';

const dispatch = (ws: WebSocket) => {
	ws.on('message', (rawData) => {
		const request = parseRawData(rawData);

		switch (request.type) {
			case 'reg':
				const isUserExist = checkLogin(request.data as Login);

				const { name, password } = request.data;

				if (!isUserExist) {
					users.set(name, password);
				}

				const data = {
					name,
					index: 0,
					error: isUserExist,
					errorText:
						'User already exists. Please enter other user name or correct password.',
				};

				const response = stringifyData({ ...request, data });

				ws.send(response);

				break;
		}
	});
};

export default dispatch;
