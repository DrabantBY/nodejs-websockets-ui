import stringifyData from '../utils/stringifyData.ts';
import winners from '../db/winners.ts';
import type WebSocket from 'ws';

const winService = (name: string, ws: WebSocket) => {
	const winner = winners.find((w) => w.name === name);

	if (winner) {
		winner.wins += 1;
	} else {
		winners.push({ name, wins: 0 });
	}

	const response = stringifyData({
		type: 'update_winners',
		data: winners,
		id: 0,
	});

	ws.send(response);
};

export default winService;
