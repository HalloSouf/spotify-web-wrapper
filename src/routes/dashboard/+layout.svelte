<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import type { IUserProfile } from '$ctypes/auth.interface';
	import Loading from '$lib/components/screens/loading.svelte';
	import authStore from '$lib/stores/auth';
	import axios, { AxiosError } from 'axios';
	import { onMount } from 'svelte';
	import { SpotifyApi } from '$lib/utils/Axios';

	
	let loading: boolean = true;
	let endLoadingAnimation: boolean = false;

	onMount(async () => {
		try {
			const { data } = await SpotifyApi(localStorage.getItem('accessToken') || '').get<IUserProfile>('/me');			
			authStore.set({ ...authStore, user: data });
			loading = false;
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				if (e.response?.status === 401) return goto('/?error=unauthorized');
			}

			return goto('/?error=unknown');
		}
	});
</script>

{#if loading}
	<div transition:fade={{ duration: 500 }} on:outroend={() => endLoadingAnimation = true}>
		<Loading />
	</div>
{:else if !loading && endLoadingAnimation}
	<div transition:fade={{ duration: 1000 }}>
		<slot />
	</div>
{/if}
