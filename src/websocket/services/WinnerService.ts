import ResponseService from './ResponseService.ts';

interface Winner {
	name: string;
	wins: number;
}

export default class WinnerService {
	private static readonly winners: Winner[] = [];
	private static readonly respService = new ResponseService();

	static updateWinners(name: string): void {
		const winner = this.winners.find((w) => w.name === name);

		if (winner) {
			winner.wins++;
		} else {
			this.winners.push({ name, wins: 1 });
		}

		this.respService.sendAll('update_winners', this.winners);
	}

	static sendWinners() {
		this.respService.sendAll('update_winners', this.winners);
	}
}
