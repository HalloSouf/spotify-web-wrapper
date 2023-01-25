import type { ITokenCollection } from '$ctypes/auth.interface';

export const parseTokens = (value: string): undefined | ITokenCollection => {
	try {
		return JSON.parse(value);
	} catch {
		return undefined;
	}
};
