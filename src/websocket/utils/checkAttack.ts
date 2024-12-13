import states from '../db/states.ts';
import type { Position, Ship } from '../types/game.ts';

const checkAttack = (
	playerId: string | number,
	ships: Ship[],
	{ x, y }: Position
): string => {
	let result = false;
	let killed = false;

	for (let i = 0; i < ships.length; i++) {
		const { position, direction, length } = ships[i];

		if (direction) {
			result = x === position.x && y >= position.y && y < position.y + length;
		} else {
			result = y === position.y && x >= position.x && x < position.x + length;
		}

		if (result) {
			const hit = direction ? y : x;
			const hasHit = states[playerId][i].hits.includes(hit);

			if (!hasHit) {
				states[playerId][i].hits.push(hit);
			}

			killed = states[playerId][i].hits.length === length;
			states[playerId][i].broken = killed;

			break;
		}
	}

	return killed ? 'killed' : result ? 'shot' : 'miss';
};

export default checkAttack;
