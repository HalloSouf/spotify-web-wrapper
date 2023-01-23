<script lang="ts">

  let loading: boolean = false; 
  let error: string | undefined = undefined;

  // onMount(async () => {
  //   const params = new URLSearchParams(window.location.search);

  //   try {
  //     const { data } = await Axios.post<IAccessResponse>(
  //       'https://accounts.spotify.com/api/token',
  //       querystring.stringify({
  //         grant_type: 'authorization_code',
  //         code: params.get('code'),
  //         redirect_uri: PUBLIC_SPOTIFY_REDIRECT
  //       }),
  //       {
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           'Authorization': `Basic ${params.get('token')}`
  //         }
  //       }
  //     );

  //     localStorage.setItem('auth_token', data.access_token);
  //     localStorage.setItem('refresh_token', data.refresh_token);

  //     // setTimeout(() => goto('/dashboard'), 5000);
  //   } catch (e: unknown) {
  //     if (e instanceof AxiosError) {
  //       return error = e.response?.data.error_description;
  //     }

  //     error = 'Unknown error';
  //   } finally {
  //     loading = false;
  //   }
  // });
</script>

<div class="min-h-screen w-full flex justify-center items-center">
  <div class="text-white text-center w-1/2">
    {#if loading}
      <h1 class="text-3xl font-medium flex items-center gap-x-2 justify-center">
        <iconify-icon icon="fluent:spinner-ios-20-filled" height="36" />
        Processing account data
        <span class="animate-pulse">. . .</span>
      </h1>
      <p class="mt-2 text-neutral-300">
        Give us a moment! We are trying to fetch your account data.
      </p>
    {:else}
      {#if error}
        <h1 class="text-3xl font-medium flex items-center gap-x-2 justify-center">
          <iconify-icon icon="icon-park-outline:email-fail" height="44" class="text-red-500" />
          Authentication failed. . .
        </h1>
        <p class="mt-2 text-neutral-300">
          Something went wrong during the authentication process: <span class="bg-zinc-800 px-2 rounded-md font-medium text-white">{ error }</span>
        </p>
      {:else}
        <h1 class="text-3xl font-medium flex items-center gap-x-2 justify-center">
          <iconify-icon icon="material-symbols:check" height="44" class="text-green-500" />
          Account data verified!
        </h1>
        <p class="mt-2 text-neutral-300">
          Your authorization has been succeed. We will redirect you automatically in <span class="text-white font-medium">5 seconds</span>.
        </p>
      {/if}
    {/if}
  </div>
</div>
