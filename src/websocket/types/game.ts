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

export type StatusData = {
	position: Position[];
	currentPlayer: number | string;
	status: 'miss' | 'shot' | 'killed';
};

export type AttackRequest = {
	id: 0;
	type: 'attack' | 'randomAttack';
	data: Attack;
};

export type Player = {
	gameId: number | string;
	indexPlayer: number | string;
	ships: Ship[];
};

export type AddShipsRequest = {
	id: 0;
	type: 'add_ships';
	data: Player;
};

export type Game = {
	gameId: number | string;
	players: Player[];
};
