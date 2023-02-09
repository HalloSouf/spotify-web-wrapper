import type { IUserProfile } from './auth.interface';
import type { WebPlaybackErrorEvents } from './spotify.interface';

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
  token: string;
  timestampPosition: number;
}
