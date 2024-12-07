import parseRawData from './utils/parseRawData.ts';
import regService from './services/regService.ts';
import * as guard from './utils/guard.ts';
import winService from './services/winService.ts';
import roomService from './services/roomService.ts';
import type WebSocket from 'ws';

const dispatch = (ws: WebSocket) => {
	let currentUser!: string;

	ws.on('message', (rawData) => {
		const request = parseRawData(rawData);

		switch (true) {
			case guard.isRegRequest(request):
				regService(ws, request);
				currentUser = request.data.name;
				winService(ws);
				roomService(ws, currentUser);
				break;

			case guard.isCreateRoomRequest(request):
				roomService(ws, currentUser, 'create');
				break;
		}
	});
};

export default dispatch;
