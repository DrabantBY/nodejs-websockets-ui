import mapRooms from '../db/rooms.ts';
import mapClients from '../db/clients.ts';
import stringifyData from '../utils/stringifyData.ts';
import ids from '../db/ids.ts';

export const createGame = (indexRoom: string | number) => {
	const { roomUsers } = mapRooms.get(indexRoom)!;

	if (roomUsers.length !== 2) {
		return;
	}

	const idGame = `${roomUsers[0].index}&${roomUsers[1].index}`;

	roomUsers.forEach(({ index }) => {
		const data = {
			idGame,
			idPlayer: index,
		};

		const response = stringifyData({
			type: 'create_game',
			data,
			id: 0,
		});

		mapClients.get(ids[index])?.send(response);
	});

	mapRooms.delete(indexRoom);
};
