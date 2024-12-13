import { v4 } from 'uuid';
import mapRooms from '../db/rooms.ts';
import mapGames from '../db/games.ts';
import mapKeys from '../db/keys.ts';
import mapClients from '../db/clients.ts';
import stringifyData from '../utils/stringifyData.ts';
import checkAttack from '../utils/checkAttack.ts';
import getRandom from '../utils/getRandom.ts';
import createStatus from '../utils/createStatus.ts';
import getAttackResponse from '../utils/getAttackResponse.ts';
import type { Attack, Player } from '../types/game.ts';

export const createGame = (indexRoom: string | number): void => {
	const { roomUsers } = mapRooms.get(indexRoom)!;

	if (roomUsers.length !== 2) {
		return;
	}

	const idGame = v4();
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

		mapClients.get(mapKeys[index])?.send(response);
	});

	mapRooms.delete(indexRoom);
};

export const turn = (gameId: string | number): void => {
	mapGames.get(gameId)?.players.forEach(({ indexPlayer }) => {
		const response = stringifyData({
			id: 0,
			type: 'turn',
			data: { currentPlayer: indexPlayer },
		});

		mapClients.get(mapKeys[indexPlayer])?.send(response);
	});
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

	game.players.forEach(({ ships, indexPlayer }) => {
		const response = stringifyData({
			id: 0,
			type: 'start_game',
			data: {
				ships,
				currentPlayerIndex: indexPlayer,
			},
		});

		mapClients.get(mapKeys[indexPlayer])?.send(response);
	});

	turn(gameId);
};

export const attack = ({
	gameId,
	indexPlayer,
	x = getRandom(),
	y = getRandom(),
}: Attack): void => {
	const { players } = mapGames.get(gameId)!;

	const { ships } = players.find(
		(player) => player.indexPlayer !== indexPlayer
	)!;

	const position = { x, y };

	const attackResult = checkAttack(indexPlayer, ships, position);

	const responses = getAttackResponse(attackResult, position);

	players.forEach(({ indexPlayer }) => {
		const client = mapClients.get(mapKeys[indexPlayer])!;
		responses.forEach((response) => {
			client.send(response);
		});
	});

	turn(gameId);
};
