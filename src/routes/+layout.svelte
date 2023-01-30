<script lang="ts">
	import '../css/app.css';
	import 'iconify-icon';
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<main class="min-h-screen w-full bg-black">
	<SvelteToast options={{ pausable: true, duration: 3000 }} />
	<slot />
</main>
