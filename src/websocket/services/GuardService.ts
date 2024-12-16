import type {
	Common,
	LoginRequest,
	AddToRoomRequest,
	CreateRoomRequest,
	AddShipsRequest,
	AttackRequest,
	SinglePlayRequest,
} from '../types/requests.ts';
import { TYPE } from '../types/requests.ts';

export default class GuardService {
	static isRegRequest(
		request: Common<unknown, unknown>
	): request is LoginRequest {
		return request.type === TYPE.REG_USER;
	}

	static isCreateRoomRequest(
		request: Common<unknown, unknown>
	): request is CreateRoomRequest {
		return request.type === TYPE.ADD_ROOM;
	}

	static isAddToRoomRequest(
		request: Common<unknown, unknown>
	): request is AddToRoomRequest {
		return request.type === TYPE.ADD_USER;
	}

	static isAddShipsRequest(
		request: Common<unknown, unknown>
	): request is AddShipsRequest {
		return request.type === TYPE.ADD_SHIP;
	}

	static isAttackRequest(
		request: Common<unknown, unknown>
	): request is AttackRequest {
		return request.type === TYPE.ATTACK || request.type === TYPE.RANDOM;
	}

	static isSinglePlayRequest(
		request: Common<unknown, unknown>
	): request is SinglePlayRequest {
		return request.type === TYPE.SINGLE;
	}
}
