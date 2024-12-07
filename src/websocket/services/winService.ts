import users from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import type WebSocket from 'ws';

function winService(wss: WebSocket.Server, name?: string): void {
	if (name) {
		const winner = users.get(name)!;
		winner.wins += 1;
		users.set(name, winner);
	}

	const winners = [...users.values()]
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

	wss.clients.forEach((client) => {
		//@ts-ignore
		if (client.index) {
			client.send(response);
		}
	});
}

export default winService;
