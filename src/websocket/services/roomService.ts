import stringifyData from '../utils/stringifyData.ts';
import rooms from '../db/rooms.ts';
import users from '../db/users.ts';
import type WebSocket from 'ws';

const roomService = (
	ws: WebSocket,
	name: string,
	option?: 'create' | 'update'
): void => {
	if (option === 'create') {
		const roomId = rooms.size;
		const { index } = users.get(name)!;
		const user = { name, index };
		const room = { roomId, roomUsers: [user] };
		rooms.set(roomId, room);
	}

	const data = [...rooms.values()];

	const response = stringifyData({
		type: 'update_room',
		data,
		id: 0,
	});

	ws.send(response);
};

export default roomService;
