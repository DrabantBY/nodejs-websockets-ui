import { v4 } from 'uuid';
import { MAX_SIZE, DELAY } from '../const/size.ts';
import SHIPS from '../const/ships.ts';
import users from '../db/users.ts';
import getRandom from '../utils/getRandom.ts';
import Service from './Service.ts';
import stringifyData from '../utils/stringifyData.ts';
import type {
	Attack,
	Player,
	Position,
	Ship,
	AttackResult,
	Status,
} from '../types/game.ts';
import type WebSocket from 'ws';

export default class BotService extends Service {
	private readonly gameId: string | number = v4();
	private readonly userId: string | number;
	private readonly userWs: WebSocket;
	private readonly botShips: Ship[] = SHIPS[getRandom(SHIPS.length)];
	private readonly positions = new Set<string>();
	private userShips: Ship[] = [];

	constructor(name: string | number, ws: WebSocket) {
		super();
		this.userId = users[name].index;
		this.userWs = ws;
		this.state.bot = this.botShips.map(this.addState);
	}

	private getRandomPosition(): Position {
		const x = getRandom(MAX_SIZE);
		const y = getRandom(MAX_SIZE);

		return this.positions.has(`${x}:${y}`)
			? this.getRandomPosition()
			: { x, y };
	}

	private send(type: string, data: unknown): void {
		const response = stringifyData({
			id: 0,
			type,
			data,
		});

		this.userWs.send(response);
	}

	private turn(currentPlayer: string | number) {
		this.send('turn', { currentPlayer });
	}

	private getAttackResult(
		attackPosition: Position,
		ships: Ship[]
	): AttackResult {
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

	createGame() {
		const data = { idGame: this.gameId, idPlayer: this.userId };
		this.send('create_game', data);
	}

	startGame({ ships, indexPlayer: currentPlayerIndex }: Player) {
		this.userShips = ships;
		this.state[currentPlayerIndex] = ships.map(this.addState);

		const data = {
			ships,
			currentPlayerIndex,
		};

		this.send('start_game', data);
		this.turn(currentPlayerIndex);
	}

	userAttack({
		indexPlayer: currentPlayer,
		x = getRandom(MAX_SIZE),
		y = getRandom(MAX_SIZE),
	}: Attack): void {
		const position = { x, y };

		const { success, point, attack } = this.getAttackResult(
			position,
			this.botShips
		);

		if (!success) {
			const data = { position, currentPlayer, status: 'miss' };
			this.send('attack', data);
			this.turn('bot');
			setTimeout(() => {
				this.botAttack();
			}, DELAY);
			return;
		}

		this.updateStateShip('bot', point, attack);

		const { broken, damage, direction } = this.state.bot[point];

		if (!broken) {
			const data = { position, currentPlayer, status: 'shot' };
			this.send('attack', data);
			this.turn(currentPlayer);
			return;
		}

		const dataList = this.getBrokenData(
			currentPlayer,
			damage,
			direction,
			position
		);

		dataList.forEach((data) => {
			this.send('attack', data);
		});
		this.turn(currentPlayer);
	}

	private botAttack(): void {
		const position = this.getRandomPosition();
		this.positions.add(`${position.x}:${position.y}`);

		const currentPlayer = 'bot';

		const { success, point, attack } = this.getAttackResult(
			position,
			this.userShips
		);

		if (!success) {
			const data = { position, currentPlayer, status: 'miss' };
			this.send('attack', data);
			this.turn(this.userId);
			return;
		}

		this.updateStateShip(this.userId, point, attack);

		const { broken, damage, direction } = this.state[this.userId][point];

		if (broken) {
			const dataList = this.getBrokenData(
				currentPlayer,
				damage,
				direction,
				position
			);

			dataList.forEach((data) => {
				this.send('attack', data);
			});
		} else {
			const data = { position, currentPlayer, status: 'shot' };
			this.send('attack', data);
		}

		this.turn(currentPlayer);
		setTimeout(() => {
			this.botAttack();
		}, DELAY);
	}

	protected getSpaceData(
		currentPlayer: string | number,
		damage: number[],
		direction: boolean,
		attackPosition: Position
	): Status[] {
		const data = super.getSpaceData(
			currentPlayer,
			damage,
			direction,
			attackPosition
		);

		data.forEach(({ position }) =>
			this.positions.add(`${position.x}:${position.y}`)
		);

		return data;
	}
}
