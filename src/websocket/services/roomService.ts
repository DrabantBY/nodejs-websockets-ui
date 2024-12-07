import stringifyData from '../utils/stringifyData.ts';
import rooms from '../db/rooms.ts';
import users from '../db/users.ts';
import type WebSocket from 'ws';

export const sendRoom = (ws: WebSocket): void => {
	const data = [...rooms.values()];

	const response = stringifyData({
		type: 'update_room',
		data,
		id: 0,
	});

	ws.send(response);
};

export const createRoom = (name: string): void => {
	const roomId = rooms.size;
	const { index } = users.get(name)!;
	const user = { name, index };
	const room = { roomId, roomUsers: [user] };
	rooms.set(roomId, room);
};

export const updateRoom = (id: string | number, name: string) => {
	const room = rooms.get(id)!;

	if (room.roomUsers.some((user) => user.name === name)) {
		return;
	}

	const { index } = users.get(name)!;
	const user = { name, index };
	room.roomUsers.push(user);
	rooms.set(id, room);
};
