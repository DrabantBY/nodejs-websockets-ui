export type Common<T> = {
	type: QueryTypes;
	data: T;
	id: 0;
};

export type QueryTypes =
	| 'reg'
	| 'update_winners'
	| 'create_room'
	| 'update_room'
	| 'add_user_to_room'
	| 'add_ships'
	| 'create_game'
	| 'start_game'
	| 'attack'
	| 'randomAttack'
	| 'turn'
	| 'finish';
