<script lang="ts">
	import type { IDevice } from '$ctypes/spotify.interface';
	import { DeviceType } from '$lib/constants/enums';


  export let device: IDevice;
  export let onSelectDevice: (deviceId: string) => void;
</script>

<div 
  class="flex items-center gap-x-4 cursor-pointer mt-2"
  on:mousedown={() => onSelectDevice(device.id)}
>
  <iconify-icon icon="tabler:{DeviceType[device.type]}" height="40" class="text-neutral-300" />
  <span>{device.name}</span>
</div>
