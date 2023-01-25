import type { IRefreshResponse } from '$ctypes/auth.interface';
import { SpotifyAuthApi } from '$lib/utils/Axios';
import JsonResponse from '$lib/utils/JsonResponse';
import { parseTokens } from '$lib/utils/Utils';
import { AxiosError } from 'axios';
import queryString from 'query-string';
import type { RequestHandler } from '../$types';

/**
 * Refresh the Spotify access token
 * @param event Request event
 */
export const POST: RequestHandler = async ({ cookies }) => {
	const extractedTokens = cookies.get('tokens');
	const tokens = extractedTokens ? parseTokens(extractedTokens) : undefined;

	if (!tokens)
		return new Response(JSON.stringify({ message: 'There is no token to refresh...' }), {
			status: 400
		});

	try {
		const { data } = await SpotifyAuthApi.post<IRefreshResponse>(
			'/api/token',
			queryString.stringify({
				grant_type: 'refresh_token',
				refresh_token: tokens.refreshToken
			})
		);

		cookies.set(
			'tokens',
			JSON.stringify({
				accessToken: data.access_token,
				refreshToken: tokens.refreshToken,
				expiresAt: Date.now() + data.expires_in * 1000
			}),
			{
				path: '/',
				httpOnly: true,
				secure: true
			}
		);

		return new JsonResponse({
			accessToken: data.access_token,
			expiresAt: Date.now() + data.expires_in * 1000
		});
	} catch (e: unknown) {
		cookies.delete('tokens');

		if (e instanceof AxiosError) {
			if (e.response?.status === 400)
				return new JsonResponse(
					{
						message: `Error occurred while making request: ${e.response.data.error_description} (${e.response.data.error})`
					},
					400
				);
		}

		return new JsonResponse(
			{ message: 'Unknown error has occurred while processing your request.' },
			400
		);
	}
};
