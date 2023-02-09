<script lang="ts">
	import { goto } from '$app/navigation';
	import { concurrent } from 'svelte-typewriter';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { toastError } from '$lib/themes/toasts';
	import { handleError } from '$lib/utils/Utils';

	let loading: boolean = false;
	let showFirstLandingPart: boolean = false;
	let showSecondLandingPart: boolean = false;

	onMount(() => {
		loading = true;

		const params = new URLSearchParams(window.location.search);
		if (params.has('error')) {
			const error = handleError(params.get('error'));
			toastError(error);
		}

		setTimeout(() => {
			loading = false;
		}, 500);
	});
</script>

<svelte:head>
	<title>SpotiWeb - Home</title>
</svelte:head>

<div class="min-h-screen w-full">
	{#if loading}
		<div
			transition:fade
			on:outroend={() => (showFirstLandingPart = true)}
			class="min-h-screen w-full flex items-center justify-center flex-col"
		>
			<div class="relative flex items-center justify-center">
				<img
					src="/images/spotify-logo.svg"
					class="h-20 bg-black rounded-full z-50"
					alt="Spotify logo"
				/>
				<div
					class="bg-gradient-to-r absolute from-pink-500 via-red-500 to-yellow-500 rounded-full p-2 h-24 w-24 animate-spin z-0"
				/>
			</div>

			<div class="mt-10">
				<h1 class="text-2xl animate-pulse font-semibold">Loading data...</h1>
			</div>
		</div>
	{/if}

	{#if showFirstLandingPart}
		<div class="min-h-screen w-full flex items-center justify-center">
			<div class="w-1/2 text-center">
				<h1
					use:concurrent={{ interval: 80 }}
					transition:fade
					on:introend={() => (showSecondLandingPart = true)}
					class="text-4xl font-bold"
				>
					Control your music 🎶
				</h1>
				<p
					transition:fade={{ delay: 500, duration: 1500 }}
					class="text-xl font-medium mt-4 text-neutral-300"
				>
					We deliver a simple and full music dashboard for displaying and controlling your <span
						class="underline decoration-indigo-500">music sound</span
					>!
				</p>

				<div
					transition:fade={{ delay: 2000, duration: 1500 }}
					class="w-full flex justify-center mt-10"
				>
					<div
						on:mousedown={() => goto('/api/oauth/spotify')}
						class="cursor-pointer bg-green-500 w-56 rounded-md text-white px-4 py-2 items-center justify-center font-medium flex gap-x-1"
					>
						Start with <img
							src="/images/spotify_white_banner.png"
							class="h-6"
							alt="Spotify white banner"
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
