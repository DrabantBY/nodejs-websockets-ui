import { MAX_SIZE } from './size.ts';

const FIELD = Array.from({ length: MAX_SIZE ** 2 }, (_, i) => {
	return { x: i % MAX_SIZE, y: Math.trunc(i / MAX_SIZE) };
});

export default FIELD;
