import parseRawData from './utils/parseRawData.ts';
import regService from './services/regService.ts';
import guard from './utils/guard.ts';
import winService from './services/winService.ts';
import type WebSocket from 'ws';

const dispatch = (ws: WebSocket) => {
	ws.on('message', (rawData) => {
		const request = parseRawData(rawData);

		switch (true) {
			case guard(request):
				regService(ws, request);
				winService(ws);
				break;
		}
	});
};

export default dispatch;
