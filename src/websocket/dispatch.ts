import * as roomService from './services/roomService.ts';
import * as gameService from './services/gameService.ts';
import * as checkRequest from './utils/checkRequest.ts';
import WinnerService from './services/WinnerService.ts';
import RegService from './services/RegService.ts';
import parseRawData from './utils/parseRawData.ts';
import websockets from './db/websockets.ts';
import type { IncomingMessage } from 'node:http';
import type WebSocket from 'ws';

export default function dispatch(ws: WebSocket, req: IncomingMessage): void {
	let currentUser: string;

	const key = req.headers['sec-websocket-key']!;

	websockets[key] = ws;

	ws.on('message', (rawData) => {
		const request = parseRawData(rawData);

		switch (true) {
			case checkRequest.isRegRequest(request):
				RegService.login(request.data, key);
				currentUser = request.data.name;
				roomService.sendRoom();
				WinnerService.sendWinners();
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
				const isWin = gameService.attack(request.data);
				if (isWin) {
					WinnerService.updateWinners(currentUser);
				}
				break;
		}
	});

	ws.on('close', () => {
		delete websockets[key];
	});
}
