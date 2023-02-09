import type { IAccessResponse, IUserProfile } from '$ctypes/auth.interface';
import { SECRET_SPOTIFY_KEY } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT, PUBLIC_SPOTIFY_REDIRECT } from '$env/static/public';
import JsonResponse from '$lib/utils/JsonResponse';
import axios, { AxiosError } from 'axios';
import queryString from 'query-string';
import type { RequestHandler } from '../$types';

/**
 * Handle OAuth 2.0 code authorization
 * @param event Request event
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = request.body !== null ? await request.json() : {};
		if (!body.state || body.state === null) throw new Error('STATE_MISMATCH');

		const { data: tokenData } = await axios.post<IAccessResponse>(
			'https://accounts.spotify.com/api/token',
			queryString.stringify({
				grant_type: 'authorization_code',
				code: body.code,
				redirect_uri: PUBLIC_SPOTIFY_REDIRECT
			}),
			{
				headers: {
					Authorization: `Basic ${Buffer.from(
						`${PUBLIC_SPOTIFY_CLIENT}:${SECRET_SPOTIFY_KEY}`
					).toString('base64')}`
				}
			}
		);

		const { data: userData } = await axios.get<IUserProfile>('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			}
		});

		return new JsonResponse({
			user: userData,
			tokens: {
				access: tokenData.access_token,
				refresh: tokenData.refresh_token
			}
		});
	} catch (e: unknown) {
		if (e instanceof AxiosError) {
			if (e.response?.status === 400)
				return new JsonResponse(
					{
						message: `Error occurred while making request: ${e.response.data.error_description} (${e.response.data.error})`
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
