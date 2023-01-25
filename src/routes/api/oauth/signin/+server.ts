import { SpotifyApi, SpotifyAuthApi } from '$lib/utils/Axios';
import queryString from 'query-string';
import type { RequestHandler } from '../$types';
import { PUBLIC_SPOTIFY_REDIRECT } from '$env/static/public';
import type { IAccessResponse, IUserProfile } from '$ctypes/auth.interface';
import { AxiosError } from 'axios';
import JsonResponse from '$lib/utils/JsonResponse';

/**
 * Handle last step authentication for OAuth 2.0
 * @param event Request event
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = request.body !== null ? await request.json() : {};
		if (!body.state || body.state === null) throw new Error('STATE_MISMATCH');

		const { data: tokenData } = await SpotifyAuthApi.post<IAccessResponse>(
			'/api/token',
			queryString.stringify({
				grant_type: 'authorization_code',
				code: body.code,
				redirect_uri: PUBLIC_SPOTIFY_REDIRECT
			})
		);

		const { data: userData } = await SpotifyApi.get<IUserProfile>('/me', {
			headers: { Authorization: `Bearer ${tokenData.access_token}` }
		});

		cookies.set(
			'tokens',
			JSON.stringify({
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				expiresAt: Date.now() + tokenData.expires_in * 1000
			}),
			{
				path: '/',
				httpOnly: true,
				secure: true
			}
		);

		return new JsonResponse({
			user: userData,
			accessToken: tokenData.access_token,
			refreshToken: tokenData.refresh_token,
			expiresAt: Date.now() + tokenData.expires_in * 1000
		});
	} catch (e: unknown) {
		if (e instanceof AxiosError) {
			if (e.response?.status === 400)
				return new JsonResponse(
					{
						message: `Error occurred while making request: ${e.response?.data.error_description} (${e.response?.data.error})`
					},
					400
				);
		}

		if (e instanceof Error) {
			if (e.message === 'STATE_MISMATCH')
				return new JsonResponse(
					{ message: 'State mismatching occurred while processing your authorization.' },
					400
				);
			if (e.message === 'Unexpected end of JSON input')
				return new JsonResponse({ message: 'Received invalid body with your request.' }, 400);
		}

		return new JsonResponse(
			{ message: 'Unknown error has occurred while processing your request.' },
			400
		);
	}
};
