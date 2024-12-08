import { WebSocketServer } from 'ws';
import dispatch from './dispatch.ts';

const webSocketServer = (port: number): void => {
	const wss = new WebSocketServer({ port });

	wss.on('connection', dispatch);

	wss.on('listening', () => {
		console.log(`Start web socket server on the ${port} port!`);
	});
};

export default webSocketServer;
