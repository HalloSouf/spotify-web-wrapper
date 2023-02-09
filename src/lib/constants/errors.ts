import type { IToastMessage } from '$ctypes/global.interface';

const errors: Map<string, IToastMessage> = new Map<string, IToastMessage>();
errors.set('unauthorized', { title: 'Unauthorized', message: 'Sorry, you\'re not authorized for this location...' });

export default errors;
