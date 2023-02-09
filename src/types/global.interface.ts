export interface IConfig {
	spotify: {
		scopes: string[];
	};
}

export interface IToastMessage {
	title: string;
	message?: string;
}
