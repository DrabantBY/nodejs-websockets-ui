import * as checkRequest from './utils/checkRequest.ts';
import GameService from './services/GameService.ts';
import RoomService from './services/RoomService.ts';
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
				RoomService.sendRooms();
				WinnerService.sendWinners();
				break;

			case checkRequest.isCreateRoomRequest(request):
				RoomService.createRoom(currentUser);
				break;

			case checkRequest.isAddToRoomRequest(request):
				const { indexRoom } = request.data;
				RoomService.updateRoom(indexRoom, currentUser);
				const room = RoomService.getRoomById(indexRoom);
				GameService.createGame(room);
				RoomService.deleteRoom(indexRoom);
				break;

			case checkRequest.isAddShipsRequest(request):
				GameService.startGame(request.data);
				break;

			case checkRequest.isAttackRequest(request):
				const isWin = GameService.attack(request.data);
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
