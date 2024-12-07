import parseRawData from './utils/parseRawData.ts';
import regService from './services/regService.ts';
import winService from './services/winService.ts';
import * as guard from './utils/guard.ts';
import * as roomService from './services/roomService.ts';
import type WebSocket from 'ws';

const dispatch = (ws: WebSocket) => {
	let currentUser!: string;

	ws.on('message', (rawData) => {
		const request = parseRawData(rawData);

		switch (true) {
			case guard.isRegRequest(request):
				regService(ws, request);
				currentUser = request.data.name;
				roomService.sendRoom(ws);
				winService(ws);
				break;

			case guard.isCreateRoomRequest(request):
				roomService.createRoom(currentUser);
				roomService.sendRoom(ws);
				break;

			case guard.isAddToRoomRequest(request):
				roomService.updateRoom(request.data.indexRoom, currentUser);
				roomService.sendRoom(ws);
				break;
		}
	});
};

export default dispatch;
