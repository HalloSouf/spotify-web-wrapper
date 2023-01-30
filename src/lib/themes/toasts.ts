import { toast } from '@zerodevx/svelte-toast';

export const toastError = (title: string, message?: string) => {
  return toast.push(`
    <div class="flex items-center gap-x-3">
      <div>
        <iconify-icon icon="material-symbols:error-circle-rounded-outline" width="32px" class="text-red-400" />
      </div>
      <div>
        <span class="text-neutral-100 text-sm">${title}</span>
        <br>
        <p class="text-sm font-semibold text-red-400">${message}</p>
      </div>
    </div>
  `);
};
