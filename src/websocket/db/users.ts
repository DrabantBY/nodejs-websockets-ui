import type { User } from '../types/user.ts';

const users: Record<string, User> = {
	bot: {
		name: 'bot',
		password: 'bot',
		index: 'bot',
	},
};

export default users;
