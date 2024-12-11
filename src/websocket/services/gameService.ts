import { v4 as uuid } from 'uuid';
import mapRooms from '../db/rooms.ts';
import mapGames from '../db/games.ts';
import mapClients from '../db/clients.ts';
import stringifyData from '../utils/stringifyData.ts';
import type { Player } from '../types/game.ts';

export const createGame = (indexRoom: string | number) => {
	const { roomUsers } = mapRooms.get(indexRoom)!;

	if (roomUsers.length !== 2) {
		return;
	}

	const idGame = uuid();
	const gameId = idGame;
	const players: Player[] = [];

	mapRooms.delete(indexRoom);
	mapGames.set(idGame, { gameId, players });

	roomUsers.forEach(({ index: idPlayer, wsId }) => {
		const data = {
			idGame,
			idPlayer,
		};

		const response = stringifyData({
			type: 'create_game',
			data,
			id: 0,
		});

		mapClients.get(wsId)?.send(response);
	});
};

export const startGame = (player: Player): void => {
	const { gameId } = player;

	const game = mapGames.get(gameId)!;

	game.players.push(player);

	mapGames.set(gameId, game);

	if (game.players.length === 1) {
		return;
	}

	// game.players.forEach((player) => {
	// 	const;
	// });

	// const data = { ships, currentPlayerIndex };

	// const response = stringifyData({
	// 	type: 'start_game',
	// 	data,
	// 	id: 0,
	// });

	// console.log(response);
};
