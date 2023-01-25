import { SECRET_SPOTIFY_KEY } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT } from '$env/static/public';
import axios, { AxiosError } from 'axios';

export const SpotifyAuthApi = axios.create({
	baseURL: 'https://accounts.spotify.com',
	headers: {
		Authorization: `Basic ${Buffer.from(`${PUBLIC_SPOTIFY_CLIENT}:${SECRET_SPOTIFY_KEY}`).toString(
			'base64'
		)}`,
		'Content-Type': 'application/x-www-form-urlencoded'
	}
});

export const SpotifyApi = axios.create({
	baseURL: 'https://api.spotify.com/v1'
});

SpotifyApi.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		if (error.response?.status === 401) {
			const { status } = await axios.post('http://localhost:5173/api/oauth/refresh');
			if (status === 200 && error.config) return axios(error.config);
		}

		return error;
	}
);
