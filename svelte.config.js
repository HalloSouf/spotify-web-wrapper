import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(), // More about preprocessors on https://kit.svelte.dev/docs/integrations#preprocessors
	kit: {
		adapter: adapter()
	}
};

export default config;
