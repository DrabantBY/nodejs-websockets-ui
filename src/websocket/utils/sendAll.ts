import websockets from '../db/websockets.ts';
import pointers from '../db/pointers.ts';
import users from '../db/users.ts';

const sendAll = (response: string) => {
	Object.values(users).forEach(({ index }) => {
		websockets[pointers[index]]?.send(response);
	});
};

export default sendAll;
