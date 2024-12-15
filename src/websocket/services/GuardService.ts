import type {
	Common,
	LoginRequest,
	AddToRoomRequest,
	CreateRoomRequest,
	AddShipsRequest,
	AttackRequest,
} from '../types/requests.ts';

export default class GuardService {
	static isRegRequest(
		request: Common<unknown, unknown>
	): request is LoginRequest {
		return request.type === 'reg';
	}

	static isCreateRoomRequest(
		request: Common<unknown, unknown>
	): request is CreateRoomRequest {
		return request.type === 'create_room';
	}

	static isAddToRoomRequest(
		request: Common<unknown, unknown>
	): request is AddToRoomRequest {
		return request.type === 'add_user_to_room';
	}

	static isAddShipsRequest(
		request: Common<unknown, unknown>
	): request is AddShipsRequest {
		return request.type === 'add_ships';
	}

	static isAttackRequest(
		request: Common<unknown, unknown>
	): request is AttackRequest {
		return request.type === 'attack' || request.type === 'randomAttack';
	}
}
