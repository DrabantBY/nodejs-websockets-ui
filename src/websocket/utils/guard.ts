import { AddShipsRequest } from '../types/game.ts';
import type { Common } from '../types/common.ts';
import type { AddToRoomRequest, CreateRoomRequest } from '../types/room.ts';
import type { LoginRequest } from '../types/user.ts';

export const isRegRequest = (
	request: Common<unknown>
): request is LoginRequest => request.type === 'reg';

export const isCreateRoomRequest = (
	request: Common<unknown>
): request is CreateRoomRequest => request.type === 'create_room';

export const isAddToRoomRequest = (
	request: Common<unknown>
): request is AddToRoomRequest => request.type === 'add_user_to_room';

export const isAddShipsRequest = (
	request: Common<unknown>
): request is AddShipsRequest => request.type === 'add_ships';
