import { v4 as uuid } from 'uuid';
import mapRooms from '../db/rooms.ts';
import mapClients from '../db/clients.ts';
import stringifyData from '../utils/stringifyData.ts';

export const createGame = (indexRoom: string | number) => {
	const { roomUsers } = mapRooms.get(indexRoom)!;

	if (roomUsers.length !== 2) {
		return;
	}

	const idGame = uuid();

	roomUsers.forEach(({ index, wsId }) => {
		const data = {
			idGame,
			idPlayer: index,
		};

		const response = stringifyData({
			type: 'create_game',
			data,
			id: 0,
		});

		mapClients.get(wsId)?.send(response);
	});

	mapRooms.delete(indexRoom);
};
