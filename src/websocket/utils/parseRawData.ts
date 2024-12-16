import type { RawData } from 'ws';
import type { Common } from '../types/requests.ts';

const parseRawData = (rawData: RawData): Common<unknown, unknown> => {
	const text = rawData.toString();

	const data = JSON.parse(text, (key, value) =>
		key === 'data' && value ? JSON.parse(value) : value
	);

	return data;
};

export default parseRawData;
