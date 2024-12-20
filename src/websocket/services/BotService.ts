import { v4 } from 'uuid';
import { MAX_SIZE, DELAY } from '../const/size.ts';
import SHIPS from '../const/ships.ts';
import getRandom from '../utils/getRandom.ts';
import StateService from './StateService.ts';
import ResponseService from './ResponseService.ts';
import type { Attack, Player, Position, Ship } from '../types/game.ts';

export default class BotService extends StateService {
	private readonly gameId: string | number = v4();
	private readonly botShips: Ship[] = SHIPS[getRandom(SHIPS.length)];
	private readonly respService = new ResponseService();
	private readonly userId: string | number;
	private readonly userName: string;
	private userShips: Ship[] = [];

	constructor(userName: string, userId: string | number) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.createStateShip('bot', this.botShips);
	}

	private getRandomPosition(): Position {
		const x = getRandom(MAX_SIZE);
		const y = getRandom(MAX_SIZE);

		return { x, y };
	}

	createGame() {
		const data = { idGame: this.gameId, idPlayer: this.userId };
		this.respService.sendById('create_game', data, this.userId);
	}

	startGame({ ships, indexPlayer }: Player) {
		this.userShips = ships;
		this.createStateShip(indexPlayer, ships);
		console.log(ships);

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
		const isBot = currentPlayer === 'bot';

		const position = { x, y };

		const { success, point, attack } = this.getAttackResult(
			position,
			isBot ? this.userShips : this.botShips
		);

		if (!success) {
			const attackData = { position, currentPlayer, status: 'miss' };
			this.respService.sendById('attack', attackData, this.userId);

			const turnData = { currentPlayer: isBot ? this.userName : currentPlayer };
			this.respService.sendById('turn', turnData, this.userId);

			if (!isBot) {
				setTimeout(() => {
					this.attack({ gameId: this.gameId, indexPlayer: 'bot' });
				}, DELAY);
			}

			return null;
		}

		this.updateStateShip(isBot ? this.userId : 'bot', point, attack);

		const { broken, damage, direction } = this.getStateShip(
			isBot ? this.userId : 'bot',
			point
		);

		if (!broken) {
			const attackData = { position, currentPlayer, status: 'shot' };
			this.respService.sendById('attack', attackData, this.userId);

			const turnData = { currentPlayer };
			this.respService.sendById('turn', turnData, this.userId);

			if (isBot) {
				setTimeout(() => {
					this.attack({ gameId: this.gameId, indexPlayer: 'bot' });
				}, DELAY);
			}

			return null;
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

		const isWin = this.checkWinState(isBot ? this.userId : 'bot');

		if (!isWin) {
			const turnData = { currentPlayer };
			this.respService.sendById('turn', turnData, this.userId);

			if (isBot) {
				setTimeout(() => {
					this.attack({ gameId: this.gameId, indexPlayer: 'bot' });
				}, DELAY);
			}

			return null;
		}

		const winData = { winPlayer: currentPlayer };
		this.respService.sendById('finish', winData, this.userId);
		return isBot ? 'bot' : this.userName;
	}
}
