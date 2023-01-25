export interface ITokenCollection {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
}

export interface IAccessResponse extends IRefreshResponse {
	refresh_token: string;
}

export interface IRefreshResponse {
	access_token: string;
	token_type: 'Bearer';
	expires_in: number;
	scope: string;
}

export interface IAuthSigninResponse {
	user: IUserProfile;
	expiresAt: number;
	accessToken: string;
	refreshToken: string;
}

export interface IUserProfile {
	country: string;
	display_name: string;
	email: string;
	explicit_content: {
		filter_enabled: boolean;
		filter_locked: boolean;
	};
	external_urls: {
		spotify: string;
	};
	followers: {
		href: null | string;
		total: number;
	};
	href: string;
	id: string;
	images: {
		heigth: number | null;
		url: string;
		width: number | null;
	}[];
	product: 'premium' | 'open' | 'free';
	type: 'user';
	uri: string;
}
