import type { Reg } from './login.ts';

export interface Room {
	roomId: number | string;
	roomUsers: Reg[];
}
