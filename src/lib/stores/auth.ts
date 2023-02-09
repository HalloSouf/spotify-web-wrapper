import type { IAuthStore } from '$ctypes/store.interface';
import { writable } from 'svelte/store';

const authStore = writable<IAuthStore>({
	user: null
});

export default authStore;
