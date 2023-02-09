<script lang="ts">
	import { page } from '$app/stores';
	import MediaControls from '$lib/components/media-controls.svelte';
	import ProgressBar from '$lib/components/progress-bar.svelte';
	import SidebarItem from '$lib/components/sidebar-item.svelte';
	import { destructUri } from '$lib/utils/Utils';
	import type { ICurrentSong, IDevice, IWebPlaybackState } from '$ctypes/utils.interface';
	import spotifyStore from '$lib/stores/spotify';
	import { SpotifyApi } from '$lib/utils/Axios';
	import SpotifyPlayer from '$lib/utils/SpotifyPlayer';
	import { loadSpotifySDK } from '$lib/utils/Utils';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import Dropdown from '$lib/components/dropdown.svelte';


	let player: SpotifyPlayer;
	let playbackState: IWebPlaybackState;
	let currentPosition = writable<number>(0);
	let devices: IDevice[] = [];
	let displayDevices: boolean = false;
	let interval: NodeJS.Timer;

	const initializePlayer = (): void => {
		$spotifyStore.isInitializing = true;
		$spotifyStore.token = localStorage.getItem('accessToken') || '';

		player = new SpotifyPlayer(
			window.Spotify.Player,
			{
				getOauthToken: (cb: (token: string) => void) => {
					cb($spotifyStore.token)
				},
				name: 'SpotiWeb',
				volume: 0.7
			}
		);

		player.on('ready', async (deviceId) => {
			$spotifyStore.deviceId = deviceId;

			// await SpotifyApi($spotifyStore.token).put('/me/player', {
			// 	device_ids: [deviceId]
			// });
		});

		player.on('player_state_changed', (state: IWebPlaybackState) => {
			playbackState = state;
			console.log(state);
			clearInterval(interval);

			if (state) {
				$spotifyStore = { ...$spotifyStore, isActive: true };
				
				$currentPosition = state.position;
				if (!state.paused) {
					interval = setInterval(() => {
						$currentPosition += 1000; 
					}, 1000);
				}
			} else {
				$spotifyStore = { ...$spotifyStore, isPlaying: false, isActive: false };
				$currentPosition = 0;
			}
		});
	};

	const fetchDevices = async () =>{ 
		const { data } = await SpotifyApi($spotifyStore.token).get('/me/player/devices');
		devices = [...data.devices];
	};

	onMount(async () => {
		if (!window.onSpotifyWebPlaybackSDKReady) {
			window.onSpotifyWebPlaybackSDKReady = initializePlayer;
		} else {
			initializePlayer();
		}

		await loadSpotifySDK();
	});

	onDestroy(() => {
		if (player) player.disconnect();
	});

	let currentSong: ICurrentSong | undefined;
	$: currentSong = playbackState?.context.uri ? playbackState.context.metadata.current_item : undefined;
</script>

<div class="min-h-screen w-full bg-[#0C0C0C] flex">
	<div class="bg-black w-96">
		
		<div class="flex items-center gap-x-4 p-10">
			<img src="/images/spotify_logo.png" alt="Spotify logo" class="w-10" />
			<span class="text-2xl font-medium text-green-400">SpotiWeb</span>
		</div>

		<div class="flex flex-col gap-y-5">
			<SidebarItem label="Dashboard" icon="material-symbols:space-dashboard-rounded" active={$page.route.id === '/dashboard'} />
		</div>
	</div>

	<div class="p-20 flex-1">
		{#if playbackState?.context.metadata.uri && currentSong}
			<div class="flex items-center justify-between gap-x-6">
				<div class="w-2/3">
					<h1 class="text-3xl font-medium">
						Currently playing
						"<a class="font-semibold link" href="https://open.spotify.com/track/{destructUri(currentSong.uri).id}" target="_blank" rel="noreferrer">{currentSong.name}</a>"
					</h1>
					<p class="text-neutral-300">By
						{#each currentSong.artists as artist, i}
							{#if i > 0}
								&
							{/if}
							<a
								rel="noreferrer"
								target="_blank"
								class="link"
								href="https://open.spotify.com/artist/{destructUri(artist.uri).id}"
							>
								{artist.name}
							</a>
						{/each}
					</p>

					<div class="mt-10">
						<ProgressBar percentage={Math.floor(($currentPosition / (playbackState?.duration || 100)) * 100)} />
					</div>

					<div class="mt-5">
						<MediaControls 
							onShuffle={() => SpotifyApi($spotifyStore.token).put(`/me/player/shuffle?state=${!playbackState.shuffle}`)}
							shuffle={playbackState.shuffle} 
						/>
					</div>
				</div>
				<div>
					<img src={currentSong.images[0].url} alt="Spotify Cover" class="rounded-md" />
				</div>
			</div>
		{:else}
			<div class="flex items-center justify-between gap-x-6 w-full">
				<div class="w-2/3">
					<h1 class="text-3xl font-medium loading-text animate-pulse">Current playing unknown</h1>
					<p class="text-neutral-300 loading-text animate-pulse">By I Don't Know</p>
					
					<div class="mt-10 animate-pulse">
						<ProgressBar percentage={Math.floor(($currentPosition / (playbackState?.duration || 100)) * 100)} />
					</div>

					<div class="mt-5 flex items-center justify-between">
						<MediaControls />

						<div>
							<div class="relative animate-none">
								<iconify-icon icon="tabler:device-laptop" height="30" class="text-neutral-300 cursor-pointer" on:mousedown={() => {
									fetchDevices();
									displayDevices = !displayDevices;
								}} />
								
								{#if displayDevices}
									<Dropdown>
										<div class="flex items-center gap-x-4">
											<iconify-icon icon="mdi:home-sound-out-outline" height="40" class="text-green-400" />
											{#each devices.filter(val => val.is_active) as device}
												<div>
													<h1 class="text-xl font-semibold">Active device</h1>
													<h2 class="text-green-400">{device.name}</h2>
												</div>
											{/each}
										</div>

										<div class="mt-8">
											<h3 class="text-lg">Available devices</h3>
											<div class="mt-5">
												{#each devices.filter(val => !val.is_active) as device}
													<div class="flex items-center gap-x-4 cursor-pointer mt-2" on:mousedown={() => {
														SpotifyApi($spotifyStore.token).put('/me/player', {
															device_ids: [device.id]
														});
														displayDevices = !displayDevices;
													}}>
														<iconify-icon icon="tabler:device-laptop" height="40" class="text-neutral-300" />
														<span>{device.name}</span>
													</div>
												{/each}
											</div>
										</div>
									</Dropdown>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="w-96 h-96 bg-zinc-900 rounded-md animate-pulse" />
			</div>
		{/if}
	</div>
</div>
