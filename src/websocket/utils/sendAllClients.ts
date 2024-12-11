import mapClients from '../db/clients.ts';
import mapKeys from '../db/keys.ts';
import mapUsers from '../db/users.ts';

const sendAllClients = (response: string) => {
	const users = mapUsers.values();

	for (const user of users) {
		const client = mapClients.get(mapKeys[user.index]);
		client?.send(response);
	}
};

export default sendAllClients;
