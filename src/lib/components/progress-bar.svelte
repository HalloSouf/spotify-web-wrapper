<script lang="ts">
	export let percentage: number = 0;
</script>

<div class="w-full h-2 bg-green-200/50 rounded-md">
	<div class="h-2 bg-green-400 rounded-md" style="width: {percentage}%" />
</div>
