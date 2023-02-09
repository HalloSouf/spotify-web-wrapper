<script lang="ts">
  export let onPrevious: () => void = () => {};
  export let onTogglePlay: () => void = () => {};
  export let onNext: () => void = () => {};
  export let onShuffle: () => void = () => {};

  export let shuffle: boolean = false;
  export let paused: boolean = true;
</script>

<div class="flex items-center gap-x-4">
  <iconify-icon 
    icon="tabler:arrows-shuffle" 
    height="30" 
    class="{shuffle ? 'text-green-400' : 'text-neutral-300'} cursor-pointer"
    on:mousedown={() => onShuffle()}
  />
	<iconify-icon 
    icon="tabler:player-skip-back" 
    height="33" 
    class="text-neutral-300 cursor-pointer"
    on:mousedown={() => onPrevious()}
  />
	<iconify-icon 
    icon="tabler:player-{paused ? 'play' : 'pause'}" 
    height="44" 
    class="cursor-pointer"
    on:mousedown={() => onTogglePlay()}
  />
	<iconify-icon 
    icon="tabler:player-skip-forward" 
    height="33" 
    class="text-neutral-300 cursor-pointer"
    on:mousedown={() => onNext()}
  />
</div>
