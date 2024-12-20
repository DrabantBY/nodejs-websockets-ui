export interface Position {
	x: number;
	y: number;
}

export interface Attack extends Partial<Position> {
	gameId: number | string;
	indexPlayer: number | string;
}
export interface AttackResult {
	success: boolean;
	point: number;
	attack: number;
}

export interface Ship {
	position: Position;
	direction: boolean;
	length: number;
	type: 'small' | 'medium' | 'large' | 'huge';
}

export interface Status {
	position: Position;
	currentPlayer: number | string;
	status: 'miss' | 'shot' | 'killed';
}

export interface Player {
	gameId: number | string;
	indexPlayer: number | string;
	ships: Ship[];
}

export interface Game {
	gameId: number | string;
	players: Player[];
}

export interface Room {
	roomId: number | string;
	roomUsers: {
		name: string;
		index: string | number;
	}[];
}

export interface State {
	broken: boolean;
	damage: number[];
	length: number;
	direction: boolean;
}
