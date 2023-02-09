<script lang="ts">
	import type { VoidFunction } from '$ctypes/utils.interface';

  export let label: string;
  export let icon: string;
  export let active: boolean = false;

  export let onMouseDown: VoidFunction = () => {};
</script>

<div class="flex justify-end right-0 gap-x-5 pl-10" on:mousedown={() => onMouseDown()}>
  <div class="rounded-xl {active ? 'bg-zinc-900' : ''} px-6 h-16 flex items-center gap-x-4 cursor-pointer w-full">
    <iconify-icon icon={icon} height={26} />
    <p class="font-semibold">{label}</p>
  </div>

  <div class="h-16 w-2 {active ? 'bg-zinc-900' : ''} rounded-xl" />
</div>
