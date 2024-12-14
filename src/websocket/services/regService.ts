import { v4 } from 'uuid';
import users from '../db/users.ts';
import websockets from '../db/websockets.ts';
import pointers from '../db/pointers.ts';
import stringifyData from '../utils/stringifyData.ts';
import type { Login, Reg } from '../types/login.ts';

export default class RegService {
	static #relayData(data: Reg, key: string): void {
		const res = stringifyData({ id: 0, type: 'reg', data });
		websockets[key].send(res);
	}

	static #createUser(name: string, password: string, key: string): void {
		const index = v4();

		users[name] = {
			name,
			password,
			index,
		};

		pointers[index] = key;

		const data: Reg = {
			name,
			index,
			error: false,
			errorText: '',
		};

		this.#relayData(data, key);
	}

	static #checkActiveUser(name: string, key: string): void {
		const { index } = users[name];

		const isActive = pointers[index] in websockets;

		if (!isActive) {
			pointers[index] = key;
		}

		const data: Reg = {
			name,
			index,
			error: isActive,
			errorText: isActive
				? 'User is already active on another page. Please close that page first.'
				: '',
		};

		this.#relayData(data, key);
	}

	static login(login: Login, key: string): void {
		const { name, password } = login;

		const isUserExist = name in users;

		if (!isUserExist) {
			this.#createUser(name, password, key);
			return;
		}

		const correctLogin = users[name]?.password === password;

		if (correctLogin) {
			this.#checkActiveUser(name, key);
			return;
		}

		const data: Reg = {
			name,
			index: '',
			error: isUserExist,
			errorText:
				'User already exists. Please enter other user name or correct password.',
		};

		this.#relayData(data, key);
	}
}
