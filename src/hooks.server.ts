import type { IUserProfile } from '$ctypes/auth.interface';
import { SpotifyApi } from '$lib/utils/Axios';
import { parseTokens } from '$lib/utils/Utils';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const extractedTokens = event.cookies.get('tokens');
	const tokens = extractedTokens ? parseTokens(extractedTokens) : undefined;

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!tokens || Date.now() + 10 * 60000 >= tokens.expiresAt)
			return new Response('No tokens available', { headers: { Location: '/' } });

		try {
			const { data } = await SpotifyApi.get<IUserProfile>('/me', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			});

			event.locals.user = data;
		} catch (e) {
			console.log('fut');
		}
	}

	return await resolve(event);
};
