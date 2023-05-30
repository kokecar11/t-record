import { component$ } from "@builder.io/qwik";

import { FeCheck, FeClose, FeInfo, FeWarning } from "../icons/icons";

export type ToastProps = {
    title: string;
    message: string;
    variant?: ToastVariants;
    isVisible: boolean;
}

export type ToastVariants = 'danger' | 'warning' | 'info' | 'success';

export const Toast = component$(({title, message, variant, isVisible}:ToastProps) => {
  const { variants, icons } ={
    variants:{
        danger: 'bg-red-500',
        warning: 'bg-yellow-500',
        success: 'bg-green-500',
        info: 'bg-blue-500',
    },
    icons: {
      danger: (<FeClose class="text-lg"/>),
      warning: (<FeWarning class="text-lg"/>),
      success: (<FeCheck class="text-lg"/>),
      info: (<FeInfo class="text-lg"/>),
    }
}
  return (
    <div class={`${variant ? variants[variant] : variants.success} ${isVisible ? 'block': 'hidden'} text-white fixed top-0 right-0 m-3 p-3 rounded-lg z-20 max-w-xs`}>
      <div class="flex justify-between">
        <span class="text-white font-semibold flex items-center justify-center gap-1">
          {variant ? icons[variant] : icons.success}
          {title}
        </span>
        <FeClose class="flex-none text-lg" />
      </div>
        
      <div class="flex justify-between my-1">
        <p class="ml-1 text-sm">
          {message}  
        </p>
      </div>
    </div>
  );
});