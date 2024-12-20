import { MAX_SIZE } from '../const/size.ts';
import sendResponse from '../utils/sendResponse.ts';
import getRandom from '../utils/getRandom.ts';
import StateService from './StateService.ts';
import type { Attack, Player, Room } from '../types/game.ts';

export default class GameService {
	private static games: Record<string | number, Player[]> = {};
	private static gamers: Record<string | number, string> = {};
	private static stateService = new StateService();

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

			sendResponse('create_game', data, [index]);
		});
	}

	static startGame(player: Player): void {
		const { gameId, indexPlayer, ships } = player;

		this.stateService.createState(indexPlayer, ships);

		this.games[gameId].push(player);

		if (this.games[gameId].length < 2) {
			return;
		}

		const ids: (string | number)[] = [];

		this.games[gameId].forEach(({ ships, indexPlayer }) => {
			ids.push(indexPlayer);

			const data = {
				ships,
				currentPlayerIndex: indexPlayer,
			};

			sendResponse('start_game', data, [indexPlayer]);
		});

		ids.forEach((id) => {
			sendResponse('turn', { currentPlayer: ids[1] }, [id]);
		});
	}

	static attack({
		gameId,
		indexPlayer: currentPlayer,
		x = getRandom(MAX_SIZE),
		y = getRandom(MAX_SIZE),
	}: Attack): null | string {
		const players = this.games[gameId];

		const { ships: opponentShips, indexPlayer: opponentId } = players.find(
			({ indexPlayer }) => indexPlayer !== currentPlayer
		)!;

		const position = { x, y };

		const { success, point, attack } = this.stateService.getAttackResult(
			position,
			opponentShips
		);

		if (!success) {
			const data = { position, currentPlayer, status: 'miss' };

			players.forEach(({ indexPlayer }) => {
				sendResponse('attack', data, [indexPlayer]);
			});

			sendResponse('turn', { currentPlayer: opponentId }, [currentPlayer]);
			sendResponse('turn', { currentPlayer: opponentId }, [opponentId]);

			return null;
		}

		this.stateService.updateStateShip(opponentId, point, attack);

		const { broken, damage, direction } = this.stateService.getStateShip(
			opponentId,
			point
		);

		if (!broken) {
			const data = { position, currentPlayer, status: 'shot' };

			players.forEach(({ indexPlayer }) => {
				sendResponse('attack', data, [indexPlayer]);
			});

			sendResponse('turn', { currentPlayer }, [currentPlayer]);
			sendResponse('turn', { currentPlayer }, [opponentId]);

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
				sendResponse('attack', data, [indexPlayer]);
			});
		});

		sendResponse('turn', { currentPlayer }, [currentPlayer]);
		sendResponse('turn', { currentPlayer }, [opponentId]);

		const isWin = this.stateService.checkWinState(opponentId);

		if (isWin) {
			delete this.games[gameId];

			sendResponse('finish', { winPlayer: currentPlayer }, [currentPlayer]);
			sendResponse('finish', { winPlayer: currentPlayer }, [opponentId]);
			return this.gamers[currentPlayer];
		}
		return null;
	}
}
