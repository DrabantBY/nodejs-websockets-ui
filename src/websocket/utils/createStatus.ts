import mapStates from '../db/states.ts';
import type { Player } from '../types/game.ts';

const createStatus = ({ indexPlayer, ships }: Player): void => {
	const states = ships.map((_) => ({ broken: false, hits: [] }));
	mapStates[indexPlayer] = states;
};

export default createStatus;
