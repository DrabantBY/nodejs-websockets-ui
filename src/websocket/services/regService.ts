import { v4 } from 'uuid';
import users from '../db/users.ts';
import websockets from '../db/websockets.ts';
import pointers from '../db/pointers.ts';
import stringifyData from '../utils/stringifyData.ts';
import type WebSocket from 'ws';
import type { LoginRequest } from '../types/user.ts';

const regService = (
	ws: WebSocket,
	request: LoginRequest,
	wsId: string
): void => {
	const { name, password } = request.data;

	const isUserExist = name in users;

	if (!isUserExist) {
		const index = v4();

		const user = {
			name,
			password,
			index,
			wins: 0,
		};

		pointers[index] = wsId;

		users[name] = user;

		const data = {
			name,
			index,
			error: isUserExist,
			errorText: '',
		};

		const response = stringifyData({ ...request, data });

		ws.send(response);

		return;
	}

	const hasCorrectPassword = users[name]?.password === password;

	if (hasCorrectPassword) {
		const { index } = users[name];

		const isAlreadyActive = pointers[index] in websockets;

		if (!isAlreadyActive) {
			pointers[index] = wsId;
		}

		const data = {
			name,
			index,
			error: isAlreadyActive,
			errorText: isAlreadyActive
				? 'User is already active on another page. Please close that page first.'
				: '',
		};

		const response = stringifyData({ ...request, data });

		ws.send(response);

		return;
	}

	const data = {
		name,
		index: '',
		error: isUserExist,
		errorText:
			'User already exists. Please enter other user name or correct password.',
	};

	const response = stringifyData({ ...request, data });

	ws.send(response);
};

export default regService;
