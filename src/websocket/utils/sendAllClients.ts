import mapClients from '../db/clients.ts';

const sendAllClients = (response: string) => {
	const clients = mapClients.values();

	for (const client of clients) {
		client.send(response);
	}
};

export default sendAllClients;
