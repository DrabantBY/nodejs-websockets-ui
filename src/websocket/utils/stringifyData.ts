import { Common } from '../types/common.ts';

const stringifyData = <T>(response: Common<T>) => {
	const json = JSON.stringify(response, (key, value) =>
		key === 'data' ? JSON.stringify(value) : value
	);

	return json;
};

export default stringifyData;
