export type Position = {
	x: number;
	y: number;
};

export type Ship = {
	position: Position;
	direction: boolean;
	length: number;
	type: 'small' | 'medium' | 'large' | 'huge';
};

export type Attack = {
	gameId: number | string;
	indexPlayer: number | string;
} & Partial<Position>;

export type Status = {
	position: Position;
	currentPlayer: number | string;
	status: 'miss' | 'shot' | 'killed';
};

export type Player = {
	gameId: number | string;
	indexPlayer: number | string;
	ships: Ship[];
};

export type Game = {
	gameId: number | string;
	players: Player[];
};

export type Room = {
	roomId: number | string;
	roomUsers: {
		name: string;
		index: string | number;
	}[];
};

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

export interface State {
	broken: boolean;
	hits: number[];
}
