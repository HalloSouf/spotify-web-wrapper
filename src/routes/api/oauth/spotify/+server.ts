import { PUBLIC_SPOTIFY_CLIENT, PUBLIC_SPOTIFY_REDIRECT } from '$env/static/public';
import config from '$lib/constants/config';
import JsonResponse from '$lib/utils/JsonResponse';
import queryString from 'query-string';
import type { RequestHandler } from './$types';

/**
 * Redirecting to Spotify OAuth Client
 */
export const GET: RequestHandler = () => {
	const authorizationURL =
		'https://accounts.spotify.com/authorize?' +
		queryString.stringify({
			response_type: 'code',
			client_id: PUBLIC_SPOTIFY_CLIENT,
			scope: config.spotify.scopes.join(' '),
			redirect_uri: PUBLIC_SPOTIFY_REDIRECT,
			state: Math.random().toString().substring(2, 15)
		});

	return new JsonResponse({}, 302, {
		headers: { Location: authorizationURL }
	});
};
