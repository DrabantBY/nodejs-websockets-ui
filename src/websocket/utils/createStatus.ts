import states from '../db/states.ts';
import type { Player } from '../types/game.ts';

const createStatus = ({ indexPlayer, ships }: Player): void => {
	const statuses = ships.map((_) => ({ broken: false, hits: [] }));
	states[indexPlayer] = statuses;
};

export default createStatus;
