import { v4 as uuid } from 'uuid';
import mapRooms from '../db/rooms.ts';
import mapGames from '../db/games.ts';
import mapKeys from '../db/keys.ts';
import mapClients from '../db/clients.ts';
import stringifyData from '../utils/stringifyData.ts';
import checkAttack from '../utils/checkAttack.ts';
import type { AttackRequest, Player } from '../types/game.ts';

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

export const turn = (
	gameId: string | number,
	indexPlayer: string | number
): void => {
	const players = mapGames
		.get(gameId)
		?.players.map(({ indexPlayer }) => indexPlayer);

	if (!players) {
		return;
	}

	players.forEach((currentPlayer) => {
		const client = mapClients.get(mapKeys[currentPlayer]);

		if (!client) {
			return;
		}

		const data = { currentPlayer: indexPlayer };

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

	const [player1, player2] = game.players;

	const client1 = mapClients.get(mapKeys[player1.indexPlayer]);
	const client2 = mapClients.get(mapKeys[player2.indexPlayer]);

	const data1 = {
		ships: player1.ships,
		currentPlayerIndex: player1.indexPlayer,
	};

	const data2 = {
		ships: player2.ships,
		currentPlayerIndex: player2.indexPlayer,
	};

	const response1 = stringifyData({
		id: 0,
		type: 'start_game',
		data: data1,
	});

	const response2 = stringifyData({
		id: 0,
		type: 'start_game',
		data: data2,
	});

	client1?.send(response1);
	client2?.send(response2);

	turn(gameId, player.indexPlayer);
};

export const attack = (request: AttackRequest): void => {
	const { gameId, indexPlayer, ...position } = request.data;

	const { ships } = mapGames
		.get(gameId)
		?.players?.find((player) => player.indexPlayer === indexPlayer)!;

	const status = checkAttack(ships, position);

	const data = {
		position,
		currentPlayer: indexPlayer,
		status,
	};

	const response = stringifyData({
		...request,
		data,
	});

	mapGames.get(gameId)?.players.forEach(({ indexPlayer }) => {
		const client = mapClients.get(mapKeys[indexPlayer]);

		if (!client) {
			return;
		}

		client.send(response);
	});

	turn(gameId, indexPlayer);
};
