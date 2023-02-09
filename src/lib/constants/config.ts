import type { IConfig } from '$ctypes/global.interface';

const config: IConfig = {
	spotify: {
		scopes: [
			'user-read-private',
			'user-read-email',
			'user-read-playback-position',
			'user-top-read',
			'user-read-recently-played',
			'streaming',
			'app-remote-control',
			'user-read-playback-state',
			'user-modify-playback-state',
			'user-read-currently-playing'
		]
	}
};

export default config;
