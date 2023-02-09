import type { IToastMessage } from '$ctypes/global.interface';
import type { UriType } from '$ctypes/spotify.interface';
import errors from '$lib/constants/errors';

/**
 * Handle error
 * @param key Error key
 */
export const handleError = (key: string | undefined | null): IToastMessage => {
	const error = errors.get(key || '');
	return error || { title: 'Unknown Error', message: 'An unknown error occurred.' };
};

/**
 * Load Spotify SDK from browser
 */
export const loadSpotifySDK = (): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		const scriptTag = document.getElementById('spotify-player');

		if (!scriptTag) {
			const script = document.createElement('script');

			script.id = 'spotify-player';
			script.type = 'text/javascript';
			script.async = false;
			script.defer = true;
			script.src = 'https://sdk.scdn.co/spotify-player.js';
			script.onload = (): void => resolve();
			script.onerror = (error: unknown): void => reject(new Error(`LoadScript: ${error}`));

			document.head.appendChild(script);
		} else {
			resolve();
		}
	});
};

/**
 * Destruct Spotify URI
 * @param uri Spotify URI
 */
export const destructUri = (uri: string): { service: 'spotify'; type: UriType; id: string } => {
	const [service, type, id] = uri.split(':');
	return {
		service: service as 'spotify',
		type: type as UriType,
		id
	};
};
