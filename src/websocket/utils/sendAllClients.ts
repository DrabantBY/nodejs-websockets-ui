import mapClients from '../db/clients.ts';
import mapUsers from '../db/users.ts';

const sendAllClients = (response: string) => {
	const users = mapUsers.values();

	for (const user of users) {
		const client = mapClients.get(user.wsId);

		if (client) {
			client.send(response);
		}
	}
};

export default sendAllClients;
