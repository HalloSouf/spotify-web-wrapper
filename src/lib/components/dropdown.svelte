<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div class="absolute w-80 bg-zinc-900 right-0 rounded-md p-8" transition:fade={{ duration: 200 }}>
	<slot />
</div>
