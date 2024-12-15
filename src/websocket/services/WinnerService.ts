import sendResponse from '../utils/sendResponse.ts';

interface Winner {
	name: string;
	wins: number;
}

export default class WinnerService {
	private static winners: Winner[] = [];

	static sendWinners(): void {
		sendResponse('update_winners', this.winners);
	}

	static updateWinners(name: string): void {
		const winner = this.winners.find((w) => w.name === name);

		if (winner) {
			winner.wins++;
		} else {
			this.winners.push({ name, wins: 1 });
		}

		this.sendWinners();
	}
}
