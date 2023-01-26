<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ parent }) => {
		const { user } = await parent();

		if (!user) return goto('/?error=unauthorized');
		return { user };
	};
</script>

<slot />
