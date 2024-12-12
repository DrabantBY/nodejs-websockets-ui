export type Position = {
	x: number;
	y: number;
};

type ShipSize = 'small' | 'medium' | 'large' | 'huge';

export type Ship = {
	position: Position;
	direction: boolean;
	length: number;
	type: ShipSize;
};

export type Attack = {
	gameId: number | string;
	indexPlayer: number | string;
} & Partial<Position>;

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
