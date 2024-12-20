import { MAX_SIZE, MIN_SIZE } from '../const/size.ts';
import type {
	AttackResult,
	Position,
	Ship,
	State,
	Status,
} from '../types/game.ts';

export default class StateService {
	private readonly state: Record<string | number, State[]> = {};

	private checkDamage(ship: Ship, { x, y }: Position): boolean {
		const { direction, position, length } = ship;

		return direction
			? x === position.x && y >= position.y && y < position.y + length
			: y === position.y && x >= position.x && x < position.x + length;
	}

	private getDamageData(
		currentPlayer: string | number,
		damage: number[],
		direction: boolean,
		{ x, y }: Position
	): Status[] {
		return damage.map((d) => ({
			position: direction ? { x, y: d } : { x: d, y },
			currentPlayer,
			status: 'killed',
		}));
	}

	private getSpaceData(
		currentPlayer: string | number,
		damage: number[],
		direction: boolean,
		{ x, y }: Position
	): Status[] {
		const positions: Position[] = [];

		const damages = damage.toSorted();

		for (let i = 0; i < damages.length; i++) {
			if (direction) {
				positions.push({ x: x - 1, y: damages[i] });
				positions.push({ x: x + 1, y: damages[i] });

				if (i === 0) {
					positions.push({ x, y: damages[i] - 1 });
					positions.push({ x: x - 1, y: damages[i] - 1 });
					positions.push({ x: x + 1, y: damages[i] - 1 });
				}

				if (i === damages.length - 1) {
					positions.push({ x, y: damages[i] + 1 });
					positions.push({ x: x - 1, y: damages[i] + 1 });
					positions.push({ x: x + 1, y: damages[i] + 1 });
				}
			} else {
				positions.push({ x: damages[i], y: y - 1 });
				positions.push({ x: damages[i], y: y + 1 });

				if (i === 0) {
					positions.push({ x: damages[i] - 1, y });
					positions.push({ x: damages[i] - 1, y: y - 1 });
					positions.push({ x: damages[i] - 1, y: y + 1 });
				}

				if (i === damages.length - 1) {
					positions.push({ x: damages[i] + 1, y });
					positions.push({ x: damages[i] + 1, y: y - 1 });
					positions.push({ x: damages[i] + 1, y: y + 1 });
				}
			}
		}

		const filteredPositions = positions.filter(
			({ x, y }) =>
				x >= MIN_SIZE && x < MAX_SIZE && y >= MIN_SIZE && y < MAX_SIZE
		);

		return filteredPositions.map((position) => ({
			position,
			currentPlayer,
			status: 'miss',
		}));
	}

	createStateShip(id: string | number, ships: Ship[]): void {
		this.state[id] = ships.map(({ length, direction }) => ({
			broken: false,
			damage: [],
			length,
			direction,
		}));
	}

	updateStateShip(id: string | number, point: number, attack: number): void {
		const state = this.state[id][point];

		if (state.damage.includes(attack)) {
			return;
		}

		state.damage.push(attack);
		state.broken = state.damage.length === state.length;
	}

	getStateShip(id: string | number, point: number): State {
		return this.state[id][point];
	}

	checkWinState(id: string | number): boolean {
		return this.state[id].every(({ broken }) => broken);
	}

	getBrokenData(
		currentPlayer: string | number,
		damage: number[],
		direction: boolean,
		position: Position
	): Status[] {
		const damageData = this.getDamageData(
			currentPlayer,
			damage,
			direction,
			position
		);

		const spaceData = this.getSpaceData(
			currentPlayer,
			damage,
			direction,
			position
		);

		return damageData.concat(spaceData);
	}

	getAttackResult(attackPosition: Position, ships: Ship[]): AttackResult {
		let result = { success: false, point: NaN, attack: NaN };

		for (let i = 0; i < ships.length; i++) {
			result.success = this.checkDamage(ships[i], attackPosition);

			if (result.success) {
				result.point = i;
				result.attack = ships[i].direction
					? attackPosition.y
					: attackPosition.x;
				break;
			}
		}

		return result;
	}
}
