import { component$ } from "@builder.io/qwik";

import { Icon, IconCatalog } from "../icon/icon";

export type ToastProps = {
    message?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success' | 'recording' | 'recorded';
}


export const Toast = component$(({message, variant}:ToastProps) => {
  const { variants, icons } ={
    variants:{
        danger: 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
        warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200',
        success: 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
        info: 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200',
        recording: 'text-white bg-yellow-500',
        recorded: 'text-white bg-green-500',
    },
    icons: {
      success: IconCatalog.feCheck,
      warning: IconCatalog.feWarning,
      danger: IconCatalog.feClose,
      info: IconCatalog.feInfo,
      recording: IconCatalog.feVideo,
      recorded: IconCatalog.feVideo,
    }
  }
  return (
    <div class="flex fixed ml-4 right-4 items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow text-white bg-accent z-50 animate-fade-left animate-duration-300 animate-delay-75 overflow-y-visible" role="alert">
      <div class={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${variant ? variants[variant] : variants.success}`}>
        <Icon name={variant ? icons[variant] : icons.success} class="text-lg" />
      </div>
      <div class="ml-3 text-sm font-normal">{message}</div>
    </div> 
  );
});
