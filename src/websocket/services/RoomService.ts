import { v4 } from 'uuid';
import users from '../db/users.ts';
import sendResponse from '../utils/sendResponse.ts';
import type { Room } from '../types/game.ts';

export default class RoomService {
	private static rooms: Record<string | number, Room> = {};

	static sendRooms(): void {
		const data = Object.values(this.rooms);

		sendResponse('update_room', data);
	}

	static createRoom(name: string): void {
		const roomId = v4();
		const { index } = users[name];
		const roomUsers = [{ name, index }];
		const room = { roomId, roomUsers };
		this.rooms[roomId] = room;
		this.sendRooms();
	}

	static updateRoom(roomId: string | number, name: string): void {
		const { roomUsers } = this.rooms[roomId];

		if (roomUsers.some((user) => user.name === name)) {
			return;
		}

		const { index } = users[name];

		roomUsers.push({ name, index });
	}

	static deleteRoom(roomId: string | number) {
		if (this.rooms[roomId].roomUsers.length < 2) {
			return;
		}

		delete this.rooms[roomId];
		this.sendRooms();
	}

	static getRoomById(roomId: string | number): Room {
		return this.rooms[roomId];
	}
}
