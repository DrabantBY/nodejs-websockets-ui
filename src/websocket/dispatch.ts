import * as roomService from './services/roomService.ts';
import * as gameService from './services/gameService.ts';
import * as checkRequest from './utils/checkRequest.ts';
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
			case checkRequest.isRegRequest(request):
				regService(ws, request, key);
				currentUser = request.data.name;
				roomService.sendRoom();
				winService();
				break;

			case checkRequest.isCreateRoomRequest(request):
				roomService.createRoom(currentUser);
				roomService.sendRoom();
				break;

			case checkRequest.isAddToRoomRequest(request):
				const { indexRoom } = request.data;
				roomService.updateRoom(indexRoom, currentUser);
				gameService.createGame(indexRoom);
				roomService.sendRoom();
				break;

			case checkRequest.isAddShipsRequest(request):
				gameService.startGame(request.data);
				break;

			case checkRequest.isAttackRequest(request):
				const winner = gameService.attack(request.data);
				if (winner) {
					winService(winner);
				}
				break;
		}
	});

	ws.on('close', () => {
		mapClients.delete(key);
	});
}
