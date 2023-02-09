export interface IWebPlaybackPlayer {
  _options: {
    getOauthToken: (cb: (token: string) => void) => void;
    name: string;
    volume: number;
  };
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: {
    (event: 'player_state_changed', cb: (d: IWebPlaybackState | null) => void): boolean;
    (event: 'ready' | 'not_ready', cb: (d: { device_id: string }) => void): boolean;
    (event: WebPlaybackErrorEvents, cb: (d: { message: string }) => void): boolean;
  };
  removeListener: (event: WebPlaybackEvents) => boolean;
  getCurrentState: () => Promise<IWebPlaybackState>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

export type WebPlaybackEvents =
  | 'player_state_changed'
  | 'ready'
  | 'not_ready'
  & WebPlaybackErrorEvents;

export type WebPlaybackErrorEvents =
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error';

export interface ISpotifyPlayerOptions {
  name: string;
  getOauthToken: (cb: (token: string) => void) => void;
  volume: number;
}

export interface IWebPlaybackState {
  context: {
    uri: string;
    metadata: {
      name: string;
      uri: string;
      url: string;
      current_item: ICurrentSong;
    };
  };
  disallows: {
    pushing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  duration: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_Track: IWebPlaybackTrack;
    previous_tracks: IWebPlaybackTrack[];
    next_tracks: IWebPlaybackTrack[];
  }
}

export interface ICurrentSong {
  name: string;
  uri: string;
  url: string;
  uid: string;
  contet_type: 'TRACK';
  artists: { name: string; uri: string; url: string }[];
  images: { url: string; heigth: number; width: number }[];
  estimated_duration: number;
  group: {
    name: string;
    uri: string;
    url: string;
  };
}

export interface IWebPlaybackTrack {
  uri: string;
  id: string | null;
  type: 
    | 'track'
    | 'episode'
    | 'ad';
  media_type: 'audio' | 'video';
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: { url: string }[];
  };
  artists: { uri: string, name: string }[];
}

export type TrackType =
  | 'track'
  | 'episode'
  | 'ad';

export type UriType = TrackType & 'artist';

export interface IDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}
