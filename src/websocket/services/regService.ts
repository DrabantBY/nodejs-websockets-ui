import { v4 as uuid } from 'uuid';
import mapUsers from '../db/users.ts';
import mapClients from '../db/clients.ts';
import stringifyData from '../utils/stringifyData.ts';
import type WebSocket from 'ws';
import type { LoginRequest } from '../types/user.ts';

const regService = (
	ws: WebSocket,
	request: LoginRequest,
	wsId: string
): void => {
	const { name, password } = request.data;

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

	const hasCorrectPassword = mapUsers.get(name)?.password === password;

	if (hasCorrectPassword) {
		const user = mapUsers.get(name)!;

		const { index, wsId: oldWsId } = user;

		const isAlreadyActive = mapClients.has(oldWsId);

		if (!isAlreadyActive) {
			user.wsId = wsId;
			mapUsers.set(name, user);
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
