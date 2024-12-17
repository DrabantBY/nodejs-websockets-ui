import { v4 } from 'uuid';
import { MAX_SIZE } from '../const/size.ts';
import users from '../db/users.ts';
import getRandom from '../utils/getRandom.ts';
import sendResponse from '../utils/sendResponse.ts';
import SHIPS from '../const/ships.ts';
import type { Attack, Player, Ship } from '../types/game.ts';

interface State {
	broken: boolean;
	hits: number[];
}

export default class BotService {
	private gameId: string | number = v4();
	private userId: string | number;
	private bot: Player = {
		gameId: this.gameId,
		indexPlayer: 'bot',
		ships: SHIPS[getRandom(SHIPS.length)],
	};
	private game: Player[] = [this.bot];
	private gameState: Record<string | number, State[]> = {
		bot: this.bot.ships.map(() => ({ broken: false, hits: [] })),
	};

	constructor(name: string | number) {
		this.userId = users[name].index;
	}

	private turn(id?: string | number) {
		const currentPlayer = id ?? 'bot';
		sendResponse('turn', { currentPlayer }, [this.userId]);
	}

	createGame() {
		const data = { idGame: this.gameId, idPlayer: this.userId };
		sendResponse('create_game', data, [this.userId]);
	}

	startGame(player: Player) {
		this.game.push(player);

		const { ships, indexPlayer: currentPlayerIndex } = player;

		const data = {
			ships,
			currentPlayerIndex,
		};

		sendResponse('start_game', data, [currentPlayerIndex]);

		this.turn(currentPlayerIndex);
	}

	attack({
		indexPlayer,
		x = getRandom(MAX_SIZE),
		y = getRandom(MAX_SIZE),
	}: Attack): void {
		console.log(indexPlayer);

		const position = { x, y };

		// const dataList = this.getAttackStatus(indexPlayer, ships, position);
	}
}
