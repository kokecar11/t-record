import { component$ } from "@builder.io/qwik";

import { Icon, IconCatalog } from "../icon/icon";

export type ToastProps = {
    message?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
}


export const Toast = component$(({message, variant}:ToastProps) => {
  const { variants, icons } ={
    variants:{
        danger: 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
        warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200',
        success: 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
        info: 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200',
    },
    icons: {
      success: IconCatalog.feCheck,
      warning: IconCatalog.feWarning,
      danger: IconCatalog.feClose,
      info: IconCatalog.feInfo,
    }
  }
  return (
    <div class="flex fixed ml-4 right-4 items-center w-full max-w-xs p-4 mb-4  rounded-lg shadow text-white bg-accent z-50 animate-fade-left animate-duration-300 animate-delay-75" role="alert">
      <div class={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${variant ? variants[variant] : variants.success}`}>
        <Icon name={variant ? icons[variant] : icons.success} class="text-lg" />
      </div>
      <div class="ml-3 text-sm font-normal">{message}</div>
      {/* <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
        <FeClose class="text-xl" />
      </button> */}
    </div> 
  );
});
