<script lang="ts">
	import { goto } from '$app/navigation';
	import type { IAuthSigninResponse } from '$ctypes/auth.interface';
	import axios, { AxiosError } from 'axios';
	import { onMount } from 'svelte';


	let error: string | undefined;
	let loading: boolean = true;
	let timer: number = 0;

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);

		try {
			const { data } = await axios.post<IAuthSigninResponse>('/api/oauth/signin', {
				code: params.get('code'),
				state: params.get('state')
			});

			localStorage.setItem('accessToken', data.tokens.access);
			localStorage.setItem('refreshToken', data.tokens.access);
			localStorage.setItem('expiringToken', (Date.now() + 1000 * 60 * 60).toString());

			startTimer(5);
		} catch (e: unknown) {
			startTimer(10);
			
			if (e instanceof AxiosError) {
				return (error = e.response?.data.message);
			}

			error = 'Unknown error';
		} finally {
			loading = false;
		}
	});

	const startTimer = (seconds: number): void => {
		timer = seconds;
		setInterval(() => timer--, 1000);
		setTimeout(() => goto(error ? '/' : '/dashboard'), seconds * 1000);
	};
</script>

<div class="min-h-screen w-full flex justify-center items-center">
	<div class="text-center w-1/2">
		{#if loading}
			<h1 class="text-3xl font-medium flex items-center gap-x-2 justify-center">
				<iconify-icon icon="fluent:spinner-ios-20-filled" class="animate-spin" height="36" />
				Processing account data
				<span class="animate-pulse">. . .</span>
			</h1>
			<p class="mt-2 text-neutral-300">
				Give us a moment! We are trying to fetch your account data.
			</p>
		{:else if error}
			<h1 class="text-3xl font-medium flex items-center gap-x-2 justify-center">
				<iconify-icon icon="icon-park-outline:email-fail" height="44" class="text-red-500" />
				Authentication failed. . .
			</h1>
			<p class="mt-2 text-neutral-300">
				Something went wrong during the authentication process: <span
					class="bg-zinc-800 px-2 rounded-md font-medium text-white">{error}</span
				>
			</p>
		{:else}
			<h1 class="text-3xl font-medium flex items-center gap-x-2 justify-center">
				<iconify-icon icon="material-symbols:check" height="44" class="text-green-500" />
				Account data verified!
			</h1>
			<p class="mt-2 text-neutral-300">
				Your authorization has been succeed. We will redirect you automatically in <span
					class="text-white font-medium">5 seconds</span
				>.
			</p>
		{/if}
	</div>

	{#if !loading}
		<div class="absolute bottom-0 pb-5">
			<p class="text-sm">
				You'll be redirected in {timer} seconds... or
				<a class="link" href={error ? '/' : '/dashboard'}>click here!</a>
			</p>
		</div>
	{/if}
</div>
