import { v4 } from 'uuid';
import ResponseService from './ResponseService.ts';
import type { Room } from '../types/room.ts';

export default class RoomService {
	private static rooms: Record<string | number, Room> = {};
	private static respService = new ResponseService();

	static sendRooms(): void {
		const data = Object.values(this.rooms);
		this.respService.sendAll('update_room', data);
	}

	static createRoom(name: string, index: string | number): void {
		const roomId = v4();
		const roomUsers = [{ name, index }];
		const room = { roomId, roomUsers };
		this.rooms[roomId] = room;
		this.sendRooms();
	}

	static updateRoom(
		roomId: string | number,
		name: string,
		index: string | number
	): Room {
		const { roomUsers } = this.rooms[roomId];

		if (!roomUsers.some((user) => user.index === index)) {
			roomUsers.push({ name, index });
		}

		return this.rooms[roomId];
	}

	static deleteRoom(roomId: string | number) {
		if (this.rooms[roomId].roomUsers.length < 2) {
			return;
		}
		delete this.rooms[roomId];
		this.sendRooms();
	}
}
