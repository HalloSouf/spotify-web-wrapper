import JsonResponse from '$lib/utils/JsonResponse';
import type { RequestHandler } from '../$types';

/**
 * Handle signout with post request
 * @param event Request event
 */
export const POST: RequestHandler = ({ cookies }) => {
	cookies.delete('tokens', { path: '/' });
	return new JsonResponse({ message: 'You have been signout.' });
};
