import websockets from '../db/websockets.ts';
import pointers from '../db/pointers.ts';
import mapUsers from '../db/users.ts';

const sendAllClients = (response: string) => {
	const userIterator = mapUsers.values();

	for (const user of userIterator) {
		websockets[pointers[user.index]]?.send(response);
	}
};

export default sendAllClients;
