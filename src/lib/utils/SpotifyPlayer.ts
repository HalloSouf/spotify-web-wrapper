import type { ISpotifyPlayerOptions, IWebPlaybackPlayer, IWebPlaybackState, WebPlaybackErrorEvents } from '$ctypes/utils.interface';
import EventEmitter from 'events';

declare interface SpotifyPlayer {
  (event: 'player_state_changed', cb: (d: IWebPlaybackState | null) => void): boolean;
  (event: 'ready' | 'not_ready', cb: (device_id: string) => void): boolean;
  (event: 'error', cb: (d: { type: WebPlaybackErrorEvents; message: string }) => void): boolean;
}

class SpotifyPlayer extends EventEmitter {
  private player: IWebPlaybackPlayer;

  /**
   * @param instance Spotify Playback SDK 
   * @param options Spotify player options
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(instance: any, options: ISpotifyPlayerOptions) {
    super();
    this.player = new instance({ ...options });
    this.patch();
  }

  /**
   * Patch Spotify player
   */
  private patch(): void {
    this.player.addListener('ready', ({ device_id }) => this.emit('ready', device_id));
    this.player.addListener('not_ready', ({ device_id }) => this.emit('not_ready', device_id));
    this.player.addListener('player_state_changed', (payload) => this.emit('player_state_changed', payload));
    this.player.addListener('account_error', ({ message }) => this.emit('error', { type: 'account_error', message }));
    this.player.addListener('authentication_error', ({ message }) => this.emit('error', { type: 'authentication_error', message }));
    this.player.addListener('initialization_error', ({ message }) => this.emit('error', { type: 'initialization_error', message }));
    this.player.addListener('playback_error', ({ message }) => this.emit('error', { type: 'playback_error', message }));

    this.player.connect();
  }

  /**
   * Disconnect player
   */
  public disconnect(): void {
    return this.player.disconnect();
  }
}

export default SpotifyPlayer;
