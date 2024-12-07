import type { RawData } from 'ws';
import type { Common } from '../types/common.ts';

const parseRawData = <T>(rawData: RawData): Common<T> => {
	const text = rawData.toString();

	const data = JSON.parse(text, (key, value) =>
		key === 'data' && value ? JSON.parse(value) : value
	);

	return data;
};

export default parseRawData;
