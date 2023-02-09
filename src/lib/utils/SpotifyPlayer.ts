import type { ISpotifyPlayerOptions, IWebPlaybackPlayer, IWebPlaybackState, OAuthCallback, WebPlaybackErrorEvents } from '$ctypes/spotify.interface';
import EventEmitter from 'events';
import { SpotifyApi } from './Axios';

declare interface SpotifyPlayer {
  (event: 'player_state_changed', cb: (d: IWebPlaybackState | null) => void): boolean;
  (event: 'ready' | 'not_ready', cb: (device_id: string) => void): boolean;
  (event: 'error', cb: (d: { type: WebPlaybackErrorEvents; message: string }) => void): boolean;
}

class SpotifyPlayer extends EventEmitter {
  public client: IWebPlaybackPlayer;
  private token: string;

  /**
   * @param instance Spotify Playback SDK 
   * @param options Spotify player options
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(instance: any, options: ISpotifyPlayerOptions) {
    super();
    this.client = new instance({
      ...options,
      getOauthToken: (cb: OAuthCallback) => cb(options.token)
    });
    this.token = options.token;
    this.patch();
  }

  /**
   * Patch Spotify player
   */
  private patch(): void {
    this.client.addListener('ready', ({ device_id }) => this.emit('ready', device_id));
    this.client.addListener('not_ready', ({ device_id }) => this.emit('not_ready', device_id));
    this.client.addListener('player_state_changed', (payload) => this.emit('player_state_changed', payload));
    this.client.addListener('account_error', ({ message }) => this.emit('error', { type: 'account_error', message }));
    this.client.addListener('authentication_error', ({ message }) => this.emit('error', { type: 'authentication_error', message }));
    this.client.addListener('initialization_error', ({ message }) => this.emit('error', { type: 'initialization_error', message }));
    this.client.addListener('playback_error', ({ message }) => this.emit('error', { type: 'playback_error', message }));

    this.client.connect();
  }

  /**
   * Enable playlist shuffle
   * @param state Shuffle state
   */
  public async enableShuffle(state: boolean): Promise<void> {
    return await SpotifyApi(this.token).put(`/me/player/shuffle?state=${state}`);
  }

  /**
   * Select playback device
   * @param deviceId Device ID
   */
  public async selectDevice(deviceId: string): Promise<void> {
    return await SpotifyApi(this.token).put('/me/player', {
      device_ids: [deviceId]
    });
  }
}

export default SpotifyPlayer;
