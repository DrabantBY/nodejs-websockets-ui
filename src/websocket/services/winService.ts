import mapUsers from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import sendAllClients from '../utils/sendAllClients.ts';

const winService = (index?: string | number): void => {
	if (index) {
		const users = mapUsers.values();

		for (const user of users) {
			if (user.index === index) {
				user.wins += 1;
				mapUsers.set(user.name, user);
				break;
			}
		}
	}

	const data = [...mapUsers.values()]
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

	sendAllClients(response);
};

export default winService;
