import type { Common } from '../types/common.ts';
import type { LoginRequest } from '../types/user.ts';

const guard = (request: Common<unknown>): request is LoginRequest => {
	return request.type === 'reg';
};

export default guard;
