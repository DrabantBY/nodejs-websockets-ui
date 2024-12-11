import type { Common } from './common.ts';

export type Login = {
	name: string;
	password: string;
};

export type LoginRequest = Common<Login>;

export type User = Login & {
	index: string | number;
	wins: number;
};
