import mapUsers from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import sendAllClients from '../utils/sendAllClients.ts';

const winService = (name?: string): void => {
	if (name) {
		const winner = mapUsers.get(name)!;
		winner.wins += 1;
		mapUsers.set(name, winner);
	}

	const winners = [...mapUsers.values()]
		.map(({ name, wins }) => ({
			name,
			wins,
		}))
		.filter(({ wins }) => wins > 0);

	const response = stringifyData({
		type: 'update_winners',
		data: winners,
		id: 0,
	});

	sendAllClients(response);
};

export default winService;
