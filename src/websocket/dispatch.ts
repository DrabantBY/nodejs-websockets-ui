import * as roomService from './services/roomService.ts';
import * as gameService from './services/gameService.ts';
import * as guard from './utils/guard.ts';
import winService from './services/winService.ts';
import regService from './services/regService.ts';
import parseRawData from './utils/parseRawData.ts';
import mapClients from './db/clients.ts';
import type { IncomingMessage } from 'node:http';
import type WebSocket from 'ws';

export default function dispatch(ws: WebSocket, req: IncomingMessage): void {
	let currentUser!: string;

	const key = req.headers['sec-websocket-key']!;

	mapClients.set(key, ws);

	ws.on('message', (rawData) => {
		const request = parseRawData(rawData);

		switch (true) {
			case guard.isRegRequest(request):
				regService(ws, request, key);
				currentUser = request.data.name;
				roomService.sendRoom();
				winService();
				break;

			case guard.isCreateRoomRequest(request):
				roomService.createRoom(currentUser);
				roomService.sendRoom();
				break;

			case guard.isAddToRoomRequest(request):
				const { indexRoom } = request.data;
				roomService.updateRoom(indexRoom, currentUser);
				roomService.sendRoom();
				gameService.createGame(indexRoom);
				break;
		}
	});

	ws.on('close', () => {
		mapClients.delete(key);
	});
}
