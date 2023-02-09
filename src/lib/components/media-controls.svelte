<script lang="ts">
  export let onPrevious: () => void = () => {};
  export let onPause: () => void = () => {};
  export let onNext: () => void = () => {};
  export let onShuffle: () => void = () => {};

  export let shuffle: boolean = false;
</script>

<div class="flex items-center gap-x-4">
  <iconify-icon 
    icon="tabler:arrows-shuffle" 
    height="30" 
    class="{shuffle ? 'text-green-400' : 'text-neutral-300'} cursor-pointer"
    on:mousedown={() => onShuffle()}
  />
	<iconify-icon 
    icon="mdi:skip-previous-circle-outline" 
    height="33" 
    class="text-neutral-300 cursor-pointer"
    on:mousedown={() => onPrevious()}
  />
	<iconify-icon 
    icon="material-symbols:pause-circle-outline" 
    height="44" 
    class="cursor-pointer"
    on:mousedown={() => onPause()}
  />
	<iconify-icon 
    icon="mdi:skip-next-circle-outline" 
    height="33" 
    class="text-neutral-300 cursor-pointer"
    on:mousedown={() => onNext()}
  />
</div>
