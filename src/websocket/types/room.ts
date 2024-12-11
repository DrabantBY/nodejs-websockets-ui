import type { Common } from './common.ts';

type RoomUser = {
	name: string;
	index: string | number;
	wsId: string;
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

export type AddToRoomRequest = {
	type: 'add_user_to_room';
	data: {
		indexRoom: number | string;
	};
	id: 0;
};

export type RoomResponse = Common<Room[]>;
