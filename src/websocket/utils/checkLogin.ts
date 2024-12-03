import { users } from '../db/users.ts';
import type { Login } from '../types/user.ts';

const checkLogin = ({ name, password }: Login) => {
	const isUserExist = users.has(name);

	if (!isUserExist) {
		return isUserExist;
	}

	return users.get(name) !== password;
};

export default checkLogin;
