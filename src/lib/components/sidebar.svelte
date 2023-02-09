<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SidebarItem from './sidebar-item.svelte';
</script>

<div class="bg-black w-96 relative">
  
  <div class="p-10 flex items-center gap-x-4">
    <img src="/images/spotify_logo.png" alt="Spotify logo" class="w-10" />
    <span class="text-2xl font-medium text-green-400">SpotiWeb</span>
  </div>

  <div class="flex flex-col gap-y-5 mt-10">
    <SidebarItem
      label="Dashboard"
      icon="tabler:layout-dashboard"
      active={$page.route.id === '/dashboard'}
    />

    <SidebarItem
      label="Signout"
      icon="tabler:logout"
      onMouseDown={() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiringToken');
        localStorage.removeItem('refreshToken');
        goto('/');
      }}
    />
  </div>

</div>
