import users from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import type WebSocket from 'ws';
import type { LoginRequest } from '../types/user.ts';

const regService = (ws: WebSocket, request: LoginRequest): void => {
	const { name, password } = request.data;

	const index = users.size + 1;
	//@ts-ignore
	ws.index = index;

	const isUserExist = users.has(name);
	const hasCorrectPassword =
		isUserExist && users.get(name)?.password === password;

	if (!isUserExist) {
		const user = {
			name,
			password,
			index,
			wins: 0,
		};

		users.set(name, user);
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
