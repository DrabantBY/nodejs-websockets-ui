import stringifyData from '../utils/stringifyData.ts';
import mapRooms from '../db/rooms.ts';
import mapUsers from '../db/users.ts';
import WebSocket from 'ws';

export const sendRoom = (wss: WebSocket.Server): void => {
	const data = [...mapRooms.values()];

	const response = stringifyData({
		type: 'update_room',
		data,
		id: 0,
	});

	wss.clients.forEach((client) => {
		//@ts-ignore
		if (client.id) {
			client.send(response);
		}
	});
};

export const createRoom = (name: string): void => {
	const roomId = mapRooms.size + 1;
	const { index } = mapUsers.get(name)!;
	const user = { name, index };
	const room = { roomId, roomUsers: [user] };
	mapRooms.set(roomId, room);
};

export const updateRoom = (indexRoom: string | number, name: string): void => {
	const room = mapRooms.get(indexRoom)!;

	if (
		room.roomUsers.some((user) => user.name === name) ||
		room.roomUsers.length > 2
	) {
		return;
	}

	const { index } = mapUsers.get(name)!;
	const user = { name, index };
	room.roomUsers.push(user);
	mapRooms.set(indexRoom, room);
};
