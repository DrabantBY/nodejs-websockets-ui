import users from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import sendAll from '../utils/sendAll.ts';

const winService = (index?: string | number): void => {
	const userList = Object.values(users);

	if (index) {
		for (const user of userList) {
			if (user.index === index) {
				user.wins++;
			}
		}
	}

	const data = userList
		.map(({ name, wins }) => ({
			name,
			wins,
		}))
		.filter(({ wins }) => wins > 0);

	const response = stringifyData({
		type: 'update_winners',
		data,
		id: 0,
	});

	sendAll(response);
};

export default winService;
