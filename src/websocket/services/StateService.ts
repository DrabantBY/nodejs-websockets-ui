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
		attackPosition: Position,
		ship: Ship,
		index: number
	): StatusData {
		const shipState = this.states[currentPlayer][index];

		const hit = ship.direction ? attackPosition.y : attackPosition.x;

		if (!shipState.hits.includes(hit)) {
			shipState.hits.push(hit);
		}

		shipState.broken = shipState.hits.length === ship.length;

		const position: Position[] = shipState.broken
			? shipState.hits.map((hit) =>
					ship.direction
						? { x: attackPosition.x, y: hit }
						: { x: hit, y: attackPosition.y }
			  )
			: [attackPosition];

		const status = shipState.broken ? 'killed' : 'shot';

		return {
			position,
			currentPlayer,
			status,
		};
	}

	protected static checkShipListBroken(id: string | number): boolean {
		return this.states[id].every(({ broken }) => broken);
	}
}
