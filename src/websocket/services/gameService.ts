import { v4 as uuid } from 'uuid';
import mapRooms from '../db/rooms.ts';
import mapUsers from '../db/users.ts';
import mapGames from '../db/games.ts';
import mapKeys from '../db/keys.ts';
import mapClients from '../db/clients.ts';
import stringifyData from '../utils/stringifyData.ts';
import type { Player } from '../types/game.ts';

export const createGame = (indexRoom: string | number): void => {
	const { roomUsers } = mapRooms.get(indexRoom)!;

	if (roomUsers.length !== 2) {
		return;
	}

	const idGame = uuid();
	const gameId = idGame;
	const players: Player[] = [];

	mapRooms.delete(indexRoom);
	mapGames.set(idGame, { gameId, players });

	roomUsers.forEach(({ index: idPlayer }) => {
		const data = {
			idGame,
			idPlayer,
		};

		const response = stringifyData({
			type: 'create_game',
			data,
			id: 0,
		});

		mapClients.get(mapKeys[idPlayer])?.send(response);
	});
};

export const turn = (players: (string | number)[]): void => {
	players.forEach((currentPlayer) => {
		const client = mapClients.get(mapKeys[currentPlayer]);

		if (!client) {
			return;
		}

		const data = { currentPlayer };

		const response = stringifyData({ type: 'turn', data, id: 0 });

		client.send(response);
	});
};

export const startGame = (player: Player): void => {
	const { gameId } = player;

	const game = mapGames.get(gameId)!;

	game.players.push(player);

	mapGames.set(gameId, game);

	if (game.players.length !== 2) {
		return;
	}

	game.players.forEach(({ ships, indexPlayer: currentPlayerIndex }) => {
		const client = mapClients.get(mapKeys[currentPlayerIndex]);

		if (!client) {
			return;
		}

		const data = {
			ships,
			currentPlayerIndex,
		};

		const response = stringifyData({
			type: 'start_game',
			data,
			id: 0,
		});

		client.send(response);
	});

	const players = game.players.map(({ indexPlayer }) => indexPlayer);

	turn(players);
};
