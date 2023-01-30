import type { IErrorMessage } from '$ctypes/global.interface';

const errors: Map<string, IErrorMessage> = new Map<string, IErrorMessage>();
errors.set('unauthorized', { title: 'Unauthorized', message: 'Sorry, you\'re not authorized for this location...' });

export default errors;
