import mapUsers from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import { v4 as uuid } from 'uuid';
import type WebSocket from 'ws';
import type { LoginRequest, LoginError } from '../types/user.ts';
import mapClients from '../db/clients.ts';

const regService = (
	ws: WebSocket,
	request: LoginRequest,
	wsId: string
): void => {
	const { name, password } = request.data;

	let data: LoginError;

	const isUserExist = mapUsers.has(name);

	if (!isUserExist) {
		const index = uuid();

		const user = {
			name,
			password,
			index,
			wins: 0,
			wsId,
		};

		mapUsers.set(name, user);

		data = {
			name,
			index,
			error: isUserExist,
			errorText: '',
		};

		const response = stringifyData({ ...request, data });

		ws.send(response);

		return;
	}

	const hasCorrectPassword = mapUsers.get(name)?.password === password;

	if (hasCorrectPassword) {
		const { index, wsId } = mapUsers.get(name)!;

		const isAlreadyActive = mapClients.has(wsId);

		data = {
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

	data = {
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
