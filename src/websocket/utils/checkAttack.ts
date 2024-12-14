import mapStates from '../db/states.ts';
import type { AttackResult, Position, Ship } from '../types/game.ts';

const checkAttack = (
	playerId: string | number,
	ships: Ship[],
	{ x, y }: Position
): AttackResult => {
	const result: AttackResult = {
		killed: false,
		shot: false,
		index: 0,
		currentPlayer: playerId,
		direction: false,
	};

	for (let i = 0; i < ships.length; i++) {
		const { position, direction, length } = ships[i];

		result.index = i;
		result.direction = direction;

		if (direction) {
			result.shot =
				x === position.x && y >= position.y && y < position.y + length;
		} else {
			result.shot =
				y === position.y && x >= position.x && x < position.x + length;
		}

		if (result.shot) {
			const hit = direction ? y : x;
			const hasHit = mapStates[playerId][i].hits.includes(hit);

			if (!hasHit) {
				mapStates[playerId][i].hits.push(hit);
			}

			result.killed = mapStates[playerId][i].hits.length === length;
			mapStates[playerId][i].broken = result.killed;

			break;
		}
	}

	return result;
};

export default checkAttack;
