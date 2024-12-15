import users from '../db/users.ts';
import stringifyData from '../utils/stringifyData.ts';
import sendAll from '../utils/sendAll.ts';

interface Winner {
	name: string;
	wins: number;
}

export default class WinnerService {
	static #winners: Winner[] = [];

	static sendWinners(): void {
		const response = stringifyData({
			type: 'update_winners',
			data: this.#winners,
			id: 0,
		});

		sendAll(response);
	}

	static updateWinners(name: string): void {
		const winner = this.#winners.find((w) => w.name === name);

		if (winner) {
			winner.wins++;
		} else {
			this.#winners.push({ name, wins: 1 });
		}

		this.sendWinners();
	}
}
