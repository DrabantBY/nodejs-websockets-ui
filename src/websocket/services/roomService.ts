import { v4 } from 'uuid';
import mapRooms from '../db/rooms.ts';
import users from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import sendAll from '../utils/sendAll.ts';

export const sendRoom = (): void => {
	const response = stringifyData({
		id: 0,
		type: 'update_room',
		data: [...mapRooms.values()],
	});

	sendAll(response);
};

export const createRoom = (name: string): void => {
	const roomId = v4();
	const { index } = users[name];
	const roomUser = { name, index };
	const room = { roomId, roomUsers: [roomUser] };
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

	const { index } = users[name];
	const roomUser = { name, index };
	room.roomUsers.push(roomUser);
	mapRooms.set(indexRoom, room);
};
