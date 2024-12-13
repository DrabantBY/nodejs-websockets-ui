import type { Position } from '../types/game.ts';

const getMissPositions = (
	hits: number[],
	{ x, y }: Position,
	direction: boolean
) => {
	const positions: Position[] = [];

	const sortedHits = hits.toSorted();

	for (let i = 0; i < sortedHits.length; i++) {
		if (direction) {
			positions.push({ x: x - 1, y: sortedHits[i] });
			positions.push({ x: x + 1, y: sortedHits[i] });

			if (i === 0) {
				positions.push({ x, y: sortedHits[i] - 1 });
				positions.push({ x: x - 1, y: sortedHits[i] - 1 });
				positions.push({ x: x + 1, y: sortedHits[i] - 1 });
			}

			if (i === sortedHits.length - 1) {
				positions.push({ x, y: sortedHits[i] + 1 });
				positions.push({ x: x - 1, y: sortedHits[i] + 1 });
				positions.push({ x: x + 1, y: sortedHits[i] + 1 });
			}
		} else {
			positions.push({ x: sortedHits[i], y: y - 1 });
			positions.push({ x: sortedHits[i], y: y + 1 });

			if (i === 0) {
				positions.push({ x: sortedHits[i] - 1, y });
				positions.push({ x: sortedHits[i] - 1, y: y - 1 });
				positions.push({ x: sortedHits[i] - 1, y: y + 1 });
			}

			if (i === sortedHits.length - 1) {
				positions.push({ x: sortedHits[i] + 1, y });
				positions.push({ x: sortedHits[i] + 1, y: y - 1 });
				positions.push({ x: sortedHits[i] + 1, y: y + 1 });
			}
		}
	}

	return positions.filter(({ x, y }) => x >= 0 && x < 10 && y >= 0 && y < 10);
};

export default getMissPositions;
