import GuardService from './services/GuardService.ts';
import GameService from './services/GameService.ts';
import RoomService from './services/RoomService.ts';
import BotService from './services/BotService.ts';
import WinnerService from './services/WinnerService.ts';
import RegService from './services/RegService.ts';
import parseRawData from './utils/parseRawData.ts';
import websockets from './db/websockets.ts';
import type { IncomingMessage } from 'node:http';
import type WebSocket from 'ws';

export default function dispatch(ws: WebSocket, req: IncomingMessage): void {
	let currentUser: string = '';
	let Bot: BotService | null = null;
	let winner: string | null = null;

	const key = req.headers['sec-websocket-key']!;

	websockets[key] = ws;

	ws.on('message', (rawData) => {
		const request = parseRawData(rawData);

		switch (true) {
			case GuardService.isRegRequest(request):
				RegService.login(request.data, key);
				currentUser = request.data.name;
				RoomService.sendRooms();
				WinnerService.sendWinners();
				break;

			case GuardService.isCreateRoomRequest(request):
				RoomService.createRoom(currentUser);
				break;

			case GuardService.isAddToRoomRequest(request):
				const { indexRoom } = request.data;
				RoomService.updateRoom(indexRoom, currentUser);
				const room = RoomService.getRoomById(indexRoom);
				GameService.createGame(room);
				RoomService.deleteRoom(indexRoom);
				break;

			case GuardService.isAddShipsRequest(request) && Bot === null:
				GameService.startGame(request.data);
				break;

			case GuardService.isAddShipsRequest(request) && Bot !== null:
				Bot.startGame(request.data);
				break;

			case GuardService.isAttackRequest(request):
				winner = Bot
					? Bot.userAttack(request.data)
					: GameService.attack(request.data);
				if (winner) {
					WinnerService.updateWinners(winner);
					Bot = null;
				}
				break;

			case GuardService.isSinglePlayRequest(request):
				Bot = new BotService(currentUser, ws);
				Bot.createGame();
				break;
		}
	});

	ws.on('close', () => {
		delete websockets[key];
	});
}
