import type { Common } from './common.ts';

type RoomUser = {
	name: string;
	index: string | number;
};

export type Room = {
	roomId: number | string;
	roomUsers: RoomUser[];
};

export type CreateRoomRequest = {
	type: 'create_room';
	data: '';
	id: 0;
};

export type RoomResponse = Common<Room[]>;
