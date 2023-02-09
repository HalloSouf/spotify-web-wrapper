import type { ISpotifyStore } from '$ctypes/store.interface';
import { Status } from '$lib/constants/enums';
import { writable } from 'svelte/store';

const spotifyStore = writable<ISpotifyStore>({
  deviceId: '',
  error: '',
  errorType: '',
  isActive: false,
  isInitializing: false,
  isPlaying: false,
  status: Status.Idle,
  token: ''
});

export default spotifyStore;
