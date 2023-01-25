import type { IUserProfile } from './auth.interface';

// More about importing types and interfaces on https://kit.svelte.dev/docs/types#app
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			tokens?: string;
			user?: IUserProfile;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
