import states from '../db/states.ts';
import stringifyData from './stringifyData.ts';
import getMissPositions from './getMissPositions.ts';
import type { AttackResult, Position } from '../types/game.ts';

const getAttackResponse = (
	{ killed, shot, index, currentPlayer, direction }: AttackResult,
	position: Position
): string[] => {
	if (killed) {
		const { hits } = states[currentPlayer][index];

		const requests: string[] = [];

		hits.forEach((hit) => {
			requests.push(
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
		});

		const missPositions = getMissPositions(hits, position, direction);

		missPositions.forEach((missPosition) => {
			requests.push(
				stringifyData({
					id: 0,
					type: 'attack',
					data: {
						position: missPosition,
						currentPlayer,
						status: 'miss',
					},
				})
			);
		});

		return requests;
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
