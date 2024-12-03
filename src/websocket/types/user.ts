import type { Common } from './common.ts';

export type Login = {
	name: string;
	password: string;
};

type User = {
	name: string;
	index: string | number;
	error: boolean;
	errorText: string;
};

export type LoginResponse = Common<User>;
export type LoginRequest = Common<Login>;
