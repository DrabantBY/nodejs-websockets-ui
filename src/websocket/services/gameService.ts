import mapGames from '../db/games.ts';
import mapStates from '../db/states.ts';
import pointers from '../db/pointers.ts';
import websockets from '../db/websockets.ts';
import stringifyData from '../utils/stringifyData.ts';
import checkAttack from '../utils/checkAttack.ts';
import getRandom from '../utils/getRandom.ts';
import createStatus from '../utils/createStatus.ts';
import getAttackResponse from '../utils/getAttackResponse.ts';
import type { Attack, Player } from '../types/game.ts';
import type { Room } from '../types/room.ts';

export const createGame = ({ roomId, roomUsers }: Room): void => {
	if (roomUsers.length !== 2) {
		return;
	}

	const idGame = roomId;
	const gameId = idGame;
	const players: Player[] = [];

	mapGames.set(idGame, { gameId, players });

	roomUsers.forEach(({ index }) => {
		const response = stringifyData({
			id: 0,
			type: 'create_game',
			data: {
				idGame,
				idPlayer: index,
			},
		});

		websockets[pointers[index]]?.send(response);
	});
};

export const turn = (...ids: (string | number)[]): void => {
	ids.forEach((currentPlayer) => {
		const response = stringifyData({
			id: 0,
			type: 'turn',
			data: { currentPlayer },
		});

		websockets[pointers[currentPlayer]]?.send(response);
	});
};

export const finish = (
	winPlayer: string | number,
	losePlayer: string | number
): boolean => {
	const isFinish = mapStates[winPlayer].every(({ broken }) => broken);

	if (isFinish) {
		const response = stringifyData({
			id: 0,
			type: 'finish',
			data: {
				winPlayer,
			},
		});

		websockets[pointers[winPlayer]]?.send(response);

		websockets[pointers[losePlayer]]?.send(response);
	}

	return isFinish;
};

export const startGame = (player: Player): void => {
	const { gameId } = player;

	const game = mapGames.get(gameId)!;

	game.players.push(player);

	mapGames.set(gameId, game);

	createStatus(player);

	if (game.players.length !== 2) {
		return;
	}

	const ids: (string | number)[] = [];

	game.players.forEach(({ ships, indexPlayer }) => {
		ids.push(indexPlayer);

		const response = stringifyData({
			id: 0,
			type: 'start_game',
			data: {
				ships,
				currentPlayerIndex: indexPlayer,
			},
		});

		websockets[pointers[indexPlayer]]?.send(response);
	});

	turn(...ids);
};

export const attack = ({
	gameId,
	indexPlayer,
	x = getRandom(),
	y = getRandom(),
}: Attack): boolean => {
	const { players } = mapGames.get(gameId)!;

	const { ships, indexPlayer: opponentId } = players.find(
		(player) => player.indexPlayer !== indexPlayer
	)!;

	const position = { x, y };

	const attackResult = checkAttack(indexPlayer, ships, position);

	const responses = getAttackResponse(attackResult, position);

	players.forEach(({ indexPlayer }) => {
		responses.forEach((response) => {
			websockets[pointers[indexPlayer]].send(response);
		});
	});

	turn(indexPlayer, opponentId);
	return finish(indexPlayer, opponentId);
};
