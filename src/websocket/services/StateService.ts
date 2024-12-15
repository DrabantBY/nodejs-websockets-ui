import type { Position, Ship, StatusData } from '../types/game.ts';

interface State {
	broken: boolean;
	hits: number[];
}

export default class StateService {
	private static states: Record<string | number, State[]> = {};

	protected static createState(id: string | number): void {
		const stateShips: State[] = Array.from({ length: 10 }, (_) => ({
			broken: false,
			hits: [],
		}));

		this.states[id] = stateShips;
	}

	protected static updateState(
		currentPlayer: string | number,
		position: Position,
		ship: Ship,
		index: number
	): StatusData[] {
		const shipState = this.states[currentPlayer][index];

		const hit = ship.direction ? position.y : position.x;

		if (!shipState.hits.includes(hit)) {
			shipState.hits.push(hit);
		}

		shipState.broken = shipState.hits.length === ship.length;

		if (shipState.broken) {
			const brokenStatuses = this.getBrokenSpace(
				currentPlayer,
				shipState.hits,
				ship.direction,
				position
			);

			const missedStatuses = this.getMissedSpace(
				currentPlayer,
				shipState.hits,
				ship.direction,
				position
			);

			return brokenStatuses.concat(missedStatuses);
		}

		return [
			{
				position,
				currentPlayer,
				status: 'shot',
			},
		];
	}

	protected static checkShipListBroken(id: string | number): boolean {
		return this.states[id].every(({ broken }) => broken);
	}

	protected static getBrokenSpace(
		currentPlayer: string | number,
		hits: number[],
		direction: boolean,
		position: Position
	): StatusData[] {
		return hits.map((hit) => ({
			position: direction
				? { x: position.x, y: hit }
				: { x: hit, y: position.y },
			currentPlayer,
			status: 'killed',
		}));
	}

	protected static getMissedSpace(
		currentPlayer: string | number,
		hits: number[],
		direction: boolean,
		{ x, y }: Position
	): StatusData[] {
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

		const filteredPositions = positions.filter(
			({ x, y }) => x >= 0 && x < 10 && y >= 0 && y < 10
		);

		return filteredPositions.map((position) => ({
			position,
			currentPlayer,
			status: 'miss',
		}));
	}
}
