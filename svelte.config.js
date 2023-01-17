import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(), // More about preprocessors on https://kit.svelte.dev/docs/integrations#preprocessors
	kit: {
		adapter: adapter({ out: 'build' })
	}
};

export default config;
