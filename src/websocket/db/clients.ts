import type WebSocket from 'ws';

const mapClients = new Map<string | number, WebSocket>();

export default mapClients;
