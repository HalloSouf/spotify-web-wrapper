import type { IToastMessage } from '$ctypes/global.interface';
import { toast } from '@zerodevx/svelte-toast';

export const toastError = ({ title, message }: IToastMessage) => {
  return toast.push(`
    <div class="flex items-center gap-x-3">
      <div>
        <iconify-icon icon="tabler:exclamation-circle" width="32px" class="text-red-400" />
      </div>
      <div>
        <span class="text-neutral-100 text-sm">${title}</span>
        <br>
        <p class="text-sm font-semibold text-red-400">${message}</p>
      </div>
    </div>
  `, {
    theme: {
      '--toastBarBackground': 'rgb(248 113 113)'
    }
  });
};

export const toastSuccess = ({ title, message }: IToastMessage) => {
  return toast.push(`
    <div class="flex items-center gap-x-3">
      <div>
        <iconify-icon icon="tabler:square-rounded-check" width="32px" class="text-green-400" />
      </div>
      <div>
        <span class="text-neutral-100 text-sm">${title}</span>
        <br>
        <p class="text-sm font-semibold text-green-400">${message}</p>
      </div>
    </div>
  `, {
    theme: {
      '--toastBarBackground': 'rgb(74 222 128)'
    }
  });
};
