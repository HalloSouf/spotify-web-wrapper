import axios, { type AxiosInstance } from 'axios';

export const SpotifyApi = (token: string): AxiosInstance => {
	return axios.create({
		baseURL: 'https://api.spotify.com/v1',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
};
