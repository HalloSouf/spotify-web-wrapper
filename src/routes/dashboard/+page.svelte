<script lang="ts">
	import type {
		ICurrentSong,
		IDevice,
		IWebPlaybackState,
		OAuthCallback
	} from '$ctypes/spotify.interface';
	import AvailableDevice from '$lib/components/available-device.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import MediaControls from '$lib/components/media-controls.svelte';
	import ProgressBar from '$lib/components/progress-bar.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import spotifyStore from '$lib/stores/spotify';
	import { toastError, toastSuccess } from '$lib/themes/toasts';
	import { SpotifyApi } from '$lib/utils/Axios';
	import SpotifyPlayer from '$lib/utils/SpotifyPlayer';
	import { destructUri, handleError, loadSpotifySDK } from '$lib/utils/Utils';
	import { onDestroy, onMount } from 'svelte';

	let interval: NodeJS.Timer;
	let player: SpotifyPlayer;
	let playbackState: IWebPlaybackState;
	let displayDevices: boolean = false;
	let devices: IDevice[] = [];
	let currentSong: ICurrentSong | undefined;
	let availableMetaData: boolean;
	let activeDevice: IDevice | undefined;
	$: currentSong = playbackState?.context.uri
		? playbackState.context.metadata.current_item
		: undefined;
	$: availableMetaData = !!playbackState?.context.metadata.uri;
	$: activeDevice = devices.find((val) => val.is_active) || undefined;

	const initPlayer = (): void => {
		$spotifyStore.isInitializing = true;
		$spotifyStore.token = localStorage.getItem('accessToken') || '';

		player = new SpotifyPlayer(window.Spotify.Player, {
			token: $spotifyStore.token,
			name: `SpotiWeb-${Math.random().toString(36).substring(2, 8)}`,
			volume: 0.7
		});

		player.on('ready', (deviceId: string) => {
			$spotifyStore.deviceId = deviceId;
		});

		player.on('player_state_changed', (state: IWebPlaybackState) => {
			playbackState = state;
			clearInterval(interval);

			if (state) {
				$spotifyStore = { ...$spotifyStore, isActive: true, timestampPosition: state.position };
				if (!state.paused) {
					interval = setInterval(() => {
						$spotifyStore = {
							...$spotifyStore,
							timestampPosition: $spotifyStore.timestampPosition + 1000
						};
					}, 1000);
				}
			} else {
				$spotifyStore = {
					...$spotifyStore,
					isPlaying: false,
					isActive: false,
					timestampPosition: 0
				};
			}
		});
	};

	const enableDisplayDevices = async (state: boolean): Promise<void> => {
		try {
			if (state) {
				const { data } = await SpotifyApi($spotifyStore.token).get<{ devices: IDevice[] }>(
					'/me/player/devices'
				);
				devices = [...data.devices];
			}

			displayDevices = state;
		} catch (e: unknown) {
			const error = handleError('unknown');
			toastError(error);
		}
	};

	onMount(async () => {
		if (!window.onSpotifyWebPlaybackSDKReady) {
			window.onSpotifyWebPlaybackSDKReady = initPlayer;
		} else {
			initPlayer();
		}

		await loadSpotifySDK();
	});

	onDestroy(() => {
		if (player) player.client.disconnect();
	});
</script>

<div class="min-h-screen w-full bg-[#0C0C0C] flex">
	<Sidebar />

	<div class="p-20 flex-1">
		{#if availableMetaData && currentSong}
			<div class="flex items-center justify-between gap-x-12">
				<div class="w-2/3">
					<div>
						<h1 class="text-3xl font-medium">
							Currently playing "<a
								class="font-semibold link"
								href="https://open.spotify.com/track/{destructUri(currentSong.uri).id}"
								target="_blank"
								rel="noreferrer">{currentSong.name}</a
							>"
						</h1>
						<p class="text-neutral-300">
							By
							{#each currentSong.artists as artist, i}
								{#if i > 0}&{/if}
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
					</div>

					<div class="mt-10">
						<ProgressBar
							percentage={Math.floor(
								($spotifyStore.timestampPosition / (playbackState?.duration || 100)) * 100
							)}
						/>
					</div>

					<div class="mt-5 flex items-center justify-between">
						<MediaControls
							onShuffle={() => player.enableShuffle(!playbackState.shuffle)}
							onPrevious={() => player.client.previousTrack()}
							onNext={() => player.client.nextTrack()}
							onTogglePlay={() => player.client.togglePlay()}
							shuffle={playbackState.shuffle}
							paused={playbackState.paused}
						/>

						<div>
							<div class="relative">
								<iconify-icon
									icon="tabler-device-laptop"
									height="30"
									class="text-neutral-300 cursor-pointer"
									on:mousedown={() => enableDisplayDevices(!displayDevices)}
								/>

								{#if displayDevices}
									<Dropdown>
										{#if activeDevice}
											<div>
												<div class="flex items-center gap-x-4">
													<iconify-icon icon="tabler:sparkles" height="40" class="text-green-400" />
													<div>
														<p class="text-xl font-semibold">Active Device</p>
														<p class="text-green-400">{activeDevice.name}</p>
													</div>
												</div>
											</div>
										{/if}

										<div class="mt-5">
											<h3 class="text-lg">Available devices</h3>
											<div class="mt-3">
												{#each devices.filter((val) => !val.is_active) as device}
													<AvailableDevice
														{device}
														onSelectDevice={async (deviceId) => {
															try {
																await player.selectDevice(deviceId);
																enableDisplayDevices(!displayDevices);
																toastSuccess({
																	title: 'Selected new device',
																	message: `You have selected "${device.name}" as your current play-device.`
																});
															} catch {
																const error = handleError('unknown');
																toastError(error);
															}
														}}
													/>
												{/each}
											</div>
										</div>
									</Dropdown>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="flex-1">
					<img src={currentSong.images[0].url} alt="Spotify Cover" class="rounded-md" />
				</div>
			</div>
		{:else}
			<div class="flex items-center justify-between gap-x-12 w-full">
				<div class="w-2/3">
					<div>
						<h1 class="text-3xl loading-text animate-pulse">Current playing unknown</h1>
						<p class="text-neutral-300 loading-text animate-pulse">By I Don't Know</p>
					</div>

					<div class="mt-10 animate-pulse">
						<ProgressBar percentage={0} />
					</div>

					<div class="mt-5 flex items-center justify-between">
						<MediaControls />

						<div>
							<div class="relative">
								<iconify-icon
									icon="tabler-device-laptop"
									height="30"
									class="text-neutral-300 cursor-pointer"
									on:mousedown={() => enableDisplayDevices(!displayDevices)}
								/>

								{#if displayDevices}
									<Dropdown>
										{#if activeDevice}
											<div>
												<div class="flex items-center gap-x-4">
													<iconify-icon icon="tabler:sparkles" height="40" class="text-green-400" />
													<div>
														<p class="text-xl font-semibold">Active Device</p>
														<p class="text-green-400">{activeDevice.name}</p>
													</div>
												</div>
											</div>
										{/if}

										<div class="mt-5">
											<h3 class="text-lg">Available devices</h3>
											<div class="mt-3">
												{#each devices.filter((val) => !val.is_active) as device}
													<AvailableDevice
														{device}
														onSelectDevice={async (deviceId) => {
															try {
																await SpotifyApi($spotifyStore.token).put('/me/player', {
																	device_ids: [deviceId]
																});

																enableDisplayDevices(!displayDevices);
																toastSuccess({
																	title: 'Selected new device',
																	message: `You have selected "${device.name}" as your current play-device.`
																});
															} catch {
																const error = handleError('unknown');
																toastError(error);
															}
														}}
													/>
												{/each}
											</div>
										</div>
									</Dropdown>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="flex-1">
					<div class="w-96 h-96 bg-zinc-900 rounded-md animate-pulse" />
				</div>
			</div>
		{/if}
	</div>
</div>
