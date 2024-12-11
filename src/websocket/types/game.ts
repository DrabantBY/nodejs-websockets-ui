type Ship = {
	position: {
		x: number;
		y: number;
	};
	direction: boolean;
	length: number;
	type: 'small' | 'medium' | 'large' | 'huge';
};

export type Player = {
	gameId: number | string;
	indexPlayer: number | string;
	ships: Ship[];
};

export type AddShipsRequest = {
	type: 'add_ships';
	data: Player;
	id: 0;
};

export type Game = {
	gameId: number | string;
	players: Player[];
};
