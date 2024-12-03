import parseRawData from './utils/parseRawData.ts';
import type WebSocket from 'ws';

const dispatch = (ws: WebSocket) => {
	ws.on('message', (rawData) => {
		console.log(parseRawData(rawData));
	});
};

export default dispatch;
