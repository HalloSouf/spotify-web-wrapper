import type { IErrorMessage } from '$ctypes/global.interface';
import type { UriType } from '$ctypes/utils.interface';
import errors from '$lib/constants/errors';

export const handleError = (key: string | undefined | null): IErrorMessage => {
	const error = errors.get(key || '');
	return error || { title: 'Unknown Error', message: 'An unknown error occurred.' };
};

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

export const destructUri = (uri: string): { service: 'spotify'; type: UriType; id: string } => {
	const [service, type, id] = uri.split(':');
	return { 
		service: service as 'spotify', 
		type: type as UriType, 
		id
	};
};
