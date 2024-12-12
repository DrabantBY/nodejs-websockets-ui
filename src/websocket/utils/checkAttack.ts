import type { Position, Ship } from '../types/game.ts';

const checkAttack = (ships: Ship[], { x, y }: Position) => {
	let result = false;

	for (const ship of ships) {
		const { position, direction, length } = ship;

		if (result) {
			break;
		}

		if (direction) {
			result = x === position.x && y >= position.y && y < position.y + length;
		} else {
			result = y === position.y && x >= position.x && x < position.x + length;
		}
	}

	return result ? 'shot' : 'miss';
};

export default checkAttack;
