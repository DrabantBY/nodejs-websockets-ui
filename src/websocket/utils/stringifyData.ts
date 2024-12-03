import { LoginResponse } from '../types/user.ts';

const stringifyData = (response: LoginResponse) => {
	const json = JSON.stringify(response, (key, value) =>
		key === 'data' ? JSON.stringify(value) : value
	);

	return json;
};

export default stringifyData;
