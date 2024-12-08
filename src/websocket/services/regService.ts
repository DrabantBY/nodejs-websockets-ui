import mapUsers from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import type WebSocket from 'ws';
import type { LoginRequest } from '../types/user.ts';

const regService = (
	ws: WebSocket,
	request: LoginRequest,
	index: string
): void => {
	const { name, password } = request.data;

	//@ts-ignore
	ws.id = index;

	const isUserExist = mapUsers.has(name);
	const hasCorrectPassword =
		isUserExist && mapUsers.get(name)?.password === password;

	if (!isUserExist) {
		const user = {
			name,
			password,
			index,
			wins: 0,
		};

		mapUsers.set(name, user);
	}

	const data = {
		name,
		index,
		error: isUserExist && !hasCorrectPassword,
		errorText:
			'User already exists. Please enter other user name or correct password.',
	};

	const response = stringifyData({ ...request, data });

	ws.send(response);
};

export default regService;
