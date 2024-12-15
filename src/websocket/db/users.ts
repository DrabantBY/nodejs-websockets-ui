export interface User {
	name: string;
	password: string;
	index: string | number;
}

const users: Record<string, User> = {
	bot: {
		name: 'bot',
		password: 'bot',
		index: 'bot',
	},
};

export default users;
