import httpServer from './src/http/index.ts';
import webSocketServer from './src/websocket/index.ts';

const HTTP_PORT = 8181;
const WSS_PORT = 3000;

httpServer(HTTP_PORT);

webSocketServer(WSS_PORT);
