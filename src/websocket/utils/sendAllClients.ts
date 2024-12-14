import websockets from '../db/websockets.ts';
import mapKeys from '../db/keys.ts';
import mapUsers from '../db/users.ts';

const sendAllClients = (response: string) => {
	const userIterator = mapUsers.values();

	for (const user of userIterator) {
		websockets[mapKeys[user.index]]?.send(response);
	}
};

export default sendAllClients;
