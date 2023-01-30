import type { ITokenCollection } from '$ctypes/auth.interface';
import type { IErrorMessage } from '$ctypes/global.interface';
import errors from '$lib/constants/errors';

export const parseTokens = (value: string): undefined | ITokenCollection => {
	try {
		return JSON.parse(value);
	} catch {
		return undefined;
	}
};

export const handleError = (key: string | undefined | null): IErrorMessage => {
	const error = errors.get(key || '');
	return error || { title: 'Unknown Error', message: 'An unknown error occurred.' };
};
