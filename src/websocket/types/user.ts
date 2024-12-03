export type User = {
	name: string;
	password: string;
};

export type UserResponse = {
	name: string;
	index: string | number;
	error: boolean;
	errorText: string;
};
