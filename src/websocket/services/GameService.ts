import { MAX_SIZE } from '../const/size.ts';
import getRandom from '../utils/getRandom.ts';
import StateService from './StateService.ts';
import ResponseService from './ResponseService.ts';
import type { Attack, Player } from '../types/game.ts';
import type { Room } from '../types/room.ts';

export default class GameService {
	private static readonly games: Record<string | number, Player[]> = {};
	private static readonly gamers: Record<string | number, string> = {};
	private static readonly stateService = new StateService();
	private static readonly respService = new ResponseService();

	static createGame({ roomId, roomUsers }: Room): void {
		if (roomUsers.length < 2) {
			return;
		}

		this.games[roomId] = [];

		roomUsers.forEach(({ name, index }) => {
			this.gamers[index] = name;

			const data = {
				idGame: roomId,
				idPlayer: index,
			};

			this.respService.sendById('create_game', data, index);
		});
	}

	static startGame(player: Player): void {
		const { gameId, indexPlayer: currentPlayer, ships } = player;

		this.stateService.createStateShip(currentPlayer, ships);

		const players = this.games[gameId];

		players.push(player);

		if (players.length < 2) {
			return;
		}

		players.forEach(({ ships, indexPlayer: currentPlayerIndex }) => {
			const data = {
				ships,
				currentPlayerIndex,
			};
			this.respService.sendById('start_game', data, currentPlayerIndex);
		});

		players.forEach(({ indexPlayer }) => {
			const data = { currentPlayer };
			this.respService.sendById('turn', data, indexPlayer);
		});
	}

	static attack({
		gameId,
		indexPlayer: currentPlayer,
		x = getRandom(MAX_SIZE),
		y = getRandom(MAX_SIZE),
	}: Attack): null | string {
		const players = this.games[gameId];

		const { ships: enemyShips, indexPlayer: enemyId } = players.find(
			({ indexPlayer }) => indexPlayer !== currentPlayer
		)!;

		const position = { x, y };

		const { success, point, attack } = this.stateService.getAttackResult(
			position,
			enemyShips
		);

		if (!success) {
			const attackData = { position, currentPlayer, status: 'miss' };

			players.forEach(({ indexPlayer }) => {
				this.respService.sendById('attack', attackData, indexPlayer);
			});

			const turnData = { currentPlayer: enemyId };

			players.forEach(({ indexPlayer }) => {
				this.respService.sendById('turn', turnData, indexPlayer);
			});

			return null;
		}

		this.stateService.updateStateShip(enemyId, point, attack);

		const { broken, damage, direction } = this.stateService.getStateShip(
			enemyId,
			point
		);

		if (!broken) {
			const attackData = { position, currentPlayer, status: 'shot' };

			players.forEach(({ indexPlayer }) => {
				this.respService.sendById('attack', attackData, indexPlayer);
			});

			const turnData = { currentPlayer };

			players.forEach(({ indexPlayer }) => {
				this.respService.sendById('turn', turnData, indexPlayer);
			});

			return null;
		}

		const dataList = this.stateService.getBrokenData(
			currentPlayer,
			damage,
			direction,
			position
		);

		players.forEach(({ indexPlayer }) => {
			dataList.forEach((data) => {
				this.respService.sendById('attack', data, indexPlayer);
			});
		});

		const isWin = this.stateService.checkWinState(enemyId);

		if (!isWin) {
			const turnData = { currentPlayer };

			players.forEach(({ indexPlayer }) => {
				this.respService.sendById('turn', turnData, indexPlayer);
			});

			return null;
		}

		delete this.games[gameId];

		const winData = { winPlayer: currentPlayer };

		players.forEach(({ indexPlayer }) => {
			this.respService.sendById('finish', winData, indexPlayer);
		});

		return this.gamers[currentPlayer];
	}
}
