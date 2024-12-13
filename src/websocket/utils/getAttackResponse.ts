import states from '../db/states.ts';
import stringifyData from './stringifyData.ts';
import type { AttackResult, Position } from '../types/game.ts';

const getAttackResponse = (
	{ killed, shot, index, currentPlayer, direction }: AttackResult,
	position: Position
): string[] => {
	if (killed) {
		const { hits } = states[currentPlayer][index];

		return hits.map((hit) =>
			stringifyData({
				id: 0,
				type: 'attack',
				data: {
					position: {
						x: direction ? position.x : hit,
						y: direction ? hit : position.y,
					},
					currentPlayer,
					status: 'killed',
				},
			})
		);
	}

	return [
		stringifyData({
			id: 0,
			type: 'attack',
			data: {
				position,
				currentPlayer,
				status: shot ? 'shot' : 'miss',
			},
		}),
	];
};

export default getAttackResponse;
