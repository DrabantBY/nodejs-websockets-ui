import { v4 } from 'uuid';
import { MAX_SIZE, DELAY } from '../const/size.ts';
import SHIPS from '../const/ships.ts';
import getRandom from '../utils/getRandom.ts';
import StateService from './StateService.ts';
import ResponseService from './ResponseService.ts';
import type { Attack, Player, Position, Ship } from '../types/game.ts';
import FIELD from '../const/field.ts';

export default class BotService extends StateService {
	private readonly gameId: string | number;
	private readonly userId: string | number;
	private readonly indexes: Set<number>;
	private readonly botShips: Ship[];
	private readonly userName: string;
	private readonly respService: ResponseService;
	private userShips: Ship[] = [];

	constructor(userName: string, userId: string | number) {
		super();
		this.gameId = v4();
		this.userId = userId;
		this.userName = userName;
		this.botShips = SHIPS[getRandom(SHIPS.length)];
		this.indexes = new Set();
		this.respService = new ResponseService();
		this.createStateShip('bot', this.botShips);
	}

	private getRandomPosition(): Position {
		const index = getRandom(MAX_SIZE ** 2);
		try {
			if (this.indexes.has(index)) {
				return this.getRandomPosition();
			} else {
				this.indexes.add(index);
				return FIELD[index]!;
			}
		} catch {
			return this.getRandomPosition();
		}
	}

	private addMissPosition({ x, y }: Position) {
		const index = FIELD.findIndex(
			(position) => position.x === x && position.y === y
		);

		this.indexes.add(index);
	}

	createGame() {
		const data = { idGame: this.gameId, idPlayer: this.userId };
		this.respService.sendById('create_game', data, this.userId);
	}

	startGame({ ships, indexPlayer }: Player) {
		this.userShips = ships;
		this.createStateShip(indexPlayer, ships);

		const startGameData = {
			ships,
			currentPlayerIndex: indexPlayer,
		};

		this.respService.sendById('start_game', startGameData, indexPlayer);

		const turnData = { currentPlayer: indexPlayer };

		this.respService.sendById('turn', turnData, indexPlayer);
	}

	attack({
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
			const attackData = { position, currentPlayer, status: 'miss' };
			this.respService.sendById('attack', attackData, currentPlayer);
			this.respService.sendById(
				'turn',
				{ currentPlayer: 'bot' },
				currentPlayer
			);

			return this.botAttack();
		}

		this.updateStateShip('bot', point, attack);

		const { broken, damage, direction } = this.getStateShip('bot', point);

		if (!broken) {
			const attackData = { position, currentPlayer, status: 'shot' };
			this.respService.sendById('attack', attackData, currentPlayer);
			this.respService.sendById('turn', { currentPlayer }, currentPlayer);
			return null;
		}

		const dataList = this.getBrokenData(
			currentPlayer,
			damage,
			direction,
			position
		);

		dataList.forEach((data) => {
			this.respService.sendById('attack', data, currentPlayer);
		});

		const isWin = this.checkWinState('bot');

		if (!isWin) {
			this.respService.sendById('turn', { currentPlayer }, currentPlayer);
			return null;
		}
		this.respService.sendById(
			'finish',
			{ winPlayer: currentPlayer },
			currentPlayer
		);
		return this.userName;
	}

	private botAttack(): null | string {
		const position = this.getRandomPosition();
		const currentPlayer = 'bot';

		const { success, point, attack } = this.getAttackResult(
			position,
			this.userShips
		);

		if (!success) {
			const attackData = { position, currentPlayer, status: 'miss' };
			this.respService.sendById('attack', attackData, this.userId);
			this.respService.sendById(
				'turn',
				{ currentPlayer: this.userId },
				this.userId
			);
			return null;
		}

		this.updateStateShip(this.userId, point, attack);

		const { broken, damage, direction } = this.getStateShip(this.userId, point);

		if (!broken) {
			const attackData = { position, currentPlayer, status: 'shot' };
			this.respService.sendById('attack', attackData, this.userId);
			this.respService.sendById('turn', { currentPlayer }, this.userId);
			return this.botAttack();
		}

		const dataList = this.getBrokenData(
			currentPlayer,
			damage,
			direction,
			position
		);

		dataList.forEach((data) => {
			this.respService.sendById('attack', data, this.userId);
		});

		dataList.forEach(({ status, position }) => {
			if (status === 'miss') {
				this.addMissPosition(position);
			}
		});

		const isWin = this.checkWinState(this.userId);

		if (!isWin) {
			this.respService.sendById('turn', { currentPlayer }, this.userId);
			return this.botAttack();
		}

		this.respService.sendById(
			'finish',
			{ winPlayer: currentPlayer },
			this.userId
		);

		return currentPlayer;
	}
}
