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

	static updateWinners(index: string | number): void {
		const user = Object.values(users).find((user) => user.index === index);

		if (!user) {
			return;
		}

		const winner = this.#winners.find(({ name }) => name === user.name);

		if (winner) {
			winner.wins++;
		} else {
			this.#winners.push({ name: user.name, wins: 1 });
		}

		this.sendWinners();
	}
}
