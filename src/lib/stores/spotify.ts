import type { ISpotifyStore } from '$ctypes/store.interface';
import { writable } from 'svelte/store';

const spotifyStore = writable<ISpotifyStore>({
	deviceId: '',
	error: '',
	errorType: '',
	isActive: false,
	isInitializing: false,
	isPlaying: false,
	token: '',
	timestampPosition: 0
});

export default spotifyStore;
