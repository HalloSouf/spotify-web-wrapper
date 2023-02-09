import type { Status } from '$lib/constants/enums';
import type { IUserProfile } from './auth.interface';
import type { WebPlaybackErrorEvents } from './utils.interface';

export interface IAuthStore {
  user: null | IUserProfile;
}

export interface ISpotifyStore {
  deviceId: string;
  error: string;
  errorType: WebPlaybackErrorEvents | '';
  isActive: boolean;
  isInitializing: boolean;
  isPlaying: boolean;
  status: Status;
  token: string;
}
