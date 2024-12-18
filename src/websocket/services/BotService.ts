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
	private readonly name: string;
	private readonly botShips: Ship[] = SHIPS[getRandom(SHIPS.length)];
	private readonly positions = new Set<string>();
	private userShips: Ship[] = [];

	constructor(name: string, ws: WebSocket) {
		super();
		this.name = name;
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

	private finish(winPlayer: string | number) {
		this.send('finish', { winPlayer });
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
	}: Attack): null | string {
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
			return null;
		}

		this.updateStateShip('bot', point, attack);

		const { broken, damage, direction } = this.state.bot[point];

		if (!broken) {
			const data = { position, currentPlayer, status: 'shot' };
			this.send('attack', data);
			this.turn(currentPlayer);
			return null;
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

		const isWin = this.checkWinState('bot');

		if (isWin) {
			this.finish(currentPlayer);
			return this.name;
		}
		return null;
	}

	private botAttack(): null | string {
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
			return null;
		}

		this.updateStateShip(this.userId, point, attack);

		const { broken, damage, direction } = this.state[this.userId][point];

		if (!broken) {
			const data = { position, currentPlayer, status: 'shot' };
			this.send('attack', data);
			this.turn(currentPlayer);
			setTimeout(() => {
				this.botAttack();
			}, DELAY);
			return null;
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

		const isWinner = this.checkWinState(this.userId);

		if (isWinner) {
			this.finish(currentPlayer);
			return 'bot';
		}

		setTimeout(() => {
			this.botAttack();
		}, DELAY);
		return null;
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
