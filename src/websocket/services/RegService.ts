import { v4 } from 'uuid';
import users from '../db/users.ts';
import websockets from '../db/websockets.ts';
import pointers from '../db/pointers.ts';
import ResponseService from './ResponseService.ts';
import type { Reg, Login } from '../types/login.ts';

export default class RegService {
	private static readonly respService = new ResponseService();

	private static createUser(name: string, password: string, key: string): Reg {
		const index = v4();

		users[name] = {
			name,
			password,
			index,
		};

		pointers[index] = key;

		const data = {
			name,
			index,
			error: false,
			errorText: '',
		};

		this.respService.sendById('reg', data, index);

		return { name, index };
	}

	private static checkActiveUser(name: string, key: string): Reg {
		const { index } = users[name];

		const isActive = pointers[index] in websockets;

		if (!isActive) {
			pointers[index] = key;
		}

		const data = {
			name,
			index,
			error: isActive,
			errorText: isActive
				? 'User is already active on another page. Please close that page first.'
				: '',
		};

		this.respService.sendByKey('reg', data, key);

		return { name, index };
	}

	static login(login: Login, key: string): Reg {
		const { name, password } = login;

		const isUserExist = name in users;

		if (!isUserExist) {
			return this.createUser(name, password, key);
		}

		const correctLogin = users[name]?.password === password;

		if (correctLogin) {
			return this.checkActiveUser(name, key);
		}

		const data = {
			name,
			index: '',
			error: isUserExist,
			errorText:
				'User already exists. Please enter other user name or correct password.',
		};

		this.respService.sendByKey('reg', data, key);

		return { name, index: '' };
	}
}
