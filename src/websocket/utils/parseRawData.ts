import type { RawData } from 'ws';

const parseRawData = (rawData: RawData) => {
	const text = rawData.toString();

	const data = JSON.parse(text, (key, value) =>
		key === 'data' ? JSON.parse(value) : value
	);

	return data;
};

export default parseRawData;
