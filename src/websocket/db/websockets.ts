import type WebSocket from 'ws';

const websockets: Record<string | number, WebSocket> = {};

export default websockets;
