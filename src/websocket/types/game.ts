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

export type RandomAttack = {
	gameId: number | string;
	indexPlayer: number | string;
};

export type Attack = RandomAttack & Position;

export type RandomAttackRequest = {
	id: 0;
	type: 'randomAttack';
	data: RandomAttack;
};

export type AttackRequest = { id: 0; type: 'attack'; data: Attack };

export type Player = RandomAttack & {
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
