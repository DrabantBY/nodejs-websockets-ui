import type { Common } from './common.ts';

export interface Login {
	name: string;
	password: string;
}

export interface Reg {
	name: string;
	index: string | number;
	error: boolean;
	errorText: string;
}

export type LoginRequest = Common<Login>;
