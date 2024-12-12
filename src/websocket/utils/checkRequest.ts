import type { Common } from '../types/common.ts';
import type { LoginRequest } from '../types/user.ts';
import type { AddToRoomRequest, CreateRoomRequest } from '../types/room.ts';
import type {
	AddShipsRequest,
	AttackRequest,
	RandomAttackRequest,
} from '../types/game.ts';

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

export const isAttackRequest = (
	request: Common<unknown>
): request is AttackRequest => request.type === 'attack';

export const isRandomAttackRequest = (
	request: Common<unknown>
): request is RandomAttackRequest => request.type === 'randomAttack';
