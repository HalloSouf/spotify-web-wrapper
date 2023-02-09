// More about importing types and interfaces on https://kit.svelte.dev/docs/types#app
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface Window {
		onSpotifyWebPlaybackSDKReady?: () => void;
		Spotify: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			Player: any;
		};
	}
}

export {};
