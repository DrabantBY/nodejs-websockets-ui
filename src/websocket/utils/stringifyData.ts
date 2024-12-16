import type { Common } from '../types/requests.ts';

const stringifyData = (response: Common<unknown, unknown>): string => {
	const json = JSON.stringify(response, (key, value) =>
		key === 'data' ? JSON.stringify(value) : value
	);

	return json;
};

export default stringifyData;
