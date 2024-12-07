import users from '../db/users.ts';
import checkLogin from '../utils/checkLogin.ts';
import stringifyData from '../utils/stringifyData.ts';
import type WebSocket from 'ws';
import type { LoginRequest } from '../types/user.ts';

const regService = (request: LoginRequest, ws: WebSocket) => {
	const isUserExist = checkLogin(request.data);

	const { name, password } = request.data;

	if (!isUserExist) {
		users.set(name, password);
	}

	const data = {
		name,
		index: `${name}-${password}`,
		error: isUserExist,
		errorText:
			'User already exists. Please enter other user name or correct password.',
	};

	const response = stringifyData({ ...request, data });

	ws.send(response);
};

export default regService;
