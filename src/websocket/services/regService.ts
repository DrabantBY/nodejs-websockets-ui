import mapUsers from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import ids from '../db/ids.ts';
import type WebSocket from 'ws';
import type { LoginRequest } from '../types/user.ts';

const regService = (
	ws: WebSocket,
	request: LoginRequest,
	key: string
): void => {
	const { name, password } = request.data;

	const isUserExist = mapUsers.has(name);

	const hasCorrectPassword = mapUsers.get(name)?.password === password;

	let id: string | number = '';

	if (!isUserExist) {
		const user = {
			name,
			password,
			index: key,
			wins: 0,
		};

		mapUsers.set(name, user);

		ids[key] = key;

		id = key;
	}

	if (hasCorrectPassword) {
		const { index } = mapUsers.get(name)!;

		ids[index] = key;

		id = index;
	}

	const data = {
		name,
		index: id,
		error: isUserExist && !hasCorrectPassword,
		errorText:
			'User already exists. Please enter other user name or correct password.',
	};

	const response = stringifyData({ ...request, data });

	ws.send(response);
};

export default regService;
