import type { Common } from '../types/common.ts';
import type { CreateRoomRequest } from '../types/room.ts';
import type { LoginRequest } from '../types/user.ts';

export const isRegRequest = (
	request: Common<unknown>
): request is LoginRequest => request.type === 'reg';

export const isCreateRoomRequest = (
	request: Common<unknown>
): request is CreateRoomRequest => request.type === 'create_room';
