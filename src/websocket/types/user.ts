import type { Common } from './common.ts';

export type Login = {
	name: string;
	password: string;
};

export type LoginError = {
	name: string;
	index: string | number;
	error: boolean;
	errorText: string;
};

export type LoginResponse = Common<LoginError>;
export type LoginRequest = Common<Login>;
export type User = Login & {
	index: string | number;
	wins: number;
	wsId: string;
};
