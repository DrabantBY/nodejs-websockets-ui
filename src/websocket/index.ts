import { WebSocketServer } from 'ws';

const webSocketServer = (port: number) => {
	const wss = new WebSocketServer({ port });

	wss
		.on('connection', () => {
			console.log('connect emitted');
		})
		.on('error', () => {
			console.log('error emitted');
		})
		.on('listening', () => {
			console.log(`Start websocket server on the ${port} port!`);
		});
};

export default webSocketServer;
