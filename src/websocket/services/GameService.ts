import StateService from './StateService.ts';
import sendResponse from '../utils/sendResponse.ts';
import getRandom from '../utils/getRandom.ts';
import { MAX_SIZE } from '../const/size.ts';

import type {
	Attack,
	Status,
	Player,
	Position,
	Ship,
	Room,
} from '../types/game.ts';

export default class GameService extends StateService {
	private static games: Record<string | number, Player[]> = {};

	private static checkIsAttackSuccess(
		attackPosition: Position,
		{ direction, position, length }: Ship
	): boolean {
		return direction
			? attackPosition.x === position.x &&
					attackPosition.y >= position.y &&
					attackPosition.y < position.y + length
			: attackPosition.y === position.y &&
					attackPosition.x >= position.x &&
					attackPosition.x < position.x + length;
	}

	private static turnGame(ids: (string | number)[]): void {
		ids.forEach((id) => {
			sendResponse('turn', { currentPlayer: ids[1] }, [id]);
		});
	}

	private static finishGame(
		winPlayer: string | number,
		losePlayer: string | number,
		gameId: string | number
	): boolean {
		const isFinish = this.checkShipListBroken(winPlayer);

		if (isFinish) {
			delete this.games[gameId];
			sendResponse('finish', { winPlayer }, [winPlayer, losePlayer]);
		}

		return isFinish;
	}

	private static getAttackStatus(
		currentPlayer: string | number,
		ships: Ship[],
		position: Position
	): Status[] {
		for (let i = 0; i < ships.length; i++) {
			const isAttackSuccess = this.checkIsAttackSuccess(position, ships[i]);

			if (isAttackSuccess) {
				return this.updateState(currentPlayer, position, ships[i], i);
			}
		}

		return [
			{
				position,
				currentPlayer,
				status: 'miss',
			},
		];
	}

	static createGame({ roomId, roomUsers }: Room): void {
		if (roomUsers.length < 2) {
			return;
		}

		this.games[roomId] = [];

		roomUsers.forEach(({ index }) => {
			const data = {
				idGame: roomId,
				idPlayer: index,
			};

			sendResponse('create_game', data, [index]);
		});
	}

	static startGame(player: Player): void {
		const { gameId, indexPlayer } = player;

		this.games[gameId].push(player);

		this.createState(indexPlayer);

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

		this.turnGame(ids);
	}

	static attack({
		gameId,
		indexPlayer,
		x = getRandom(MAX_SIZE),
		y = getRandom(MAX_SIZE),
	}: Attack): boolean {
		const players = this.games[gameId];

		const { ships, indexPlayer: opponentId } = players.find(
			(player) => player.indexPlayer !== indexPlayer
		)!;

		const position = { x, y };

		const dataList = this.getAttackStatus(indexPlayer, ships, position);

		players.forEach(({ indexPlayer }) => {
			dataList.forEach((data) => {
				sendResponse('attack', data, [indexPlayer]);
			});
		});

		const ids =
			dataList[0].status === 'miss'
				? [indexPlayer, opponentId]
				: [opponentId, indexPlayer];

		this.turnGame(ids);
		return this.finishGame(indexPlayer, opponentId, gameId);
	}
}
