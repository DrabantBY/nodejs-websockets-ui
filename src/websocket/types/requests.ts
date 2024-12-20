import type { Attack, Player } from './game.ts';
import type { Login } from './login.ts';

export enum TYPE {
	REG_USER = 'reg',
	ADD_ROOM = 'create_room',
	ADD_SHIP = 'add_ships',
	ADD_USER = 'add_user_to_room',
	ATTACK = 'attack',
	RANDOM = 'randomAttack',
	SINGLE = 'single_play',
}

export interface Common<T, D> {
	id: 0;
	type: T;
	data: D;
}

interface ID {
	indexRoom: number | string;
}

export type LoginRequest = Common<TYPE.REG_USER, Login>;
export type CreateRoomRequest = Common<TYPE.ADD_ROOM, ''>;
export type SinglePlayRequest = Common<TYPE.SINGLE, ''>;
export type AddShipsRequest = Common<TYPE.ADD_SHIP, Player>;
export type AttackRequest = Common<TYPE.ATTACK | TYPE.RANDOM, Attack>;
export type AddToRoomRequest = Common<TYPE.ADD_USER, ID>;
