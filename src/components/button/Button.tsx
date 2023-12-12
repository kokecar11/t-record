import { component$, Slot } from '@builder.io/qwik'
import type { ButtonHTMLAttributes } from '@builder.io/qwik'
import cn from 'classnames'


export enum ButtonSize {
  xs = 'xs',
  sm = 'sm',
  base = 'base',
  lg = 'lg',
}

const Sizes: Record<ButtonSize, string> = {
  [ButtonSize.xs]: 'py-1 px-2 text-xs font-semibold h-6',
  [ButtonSize.sm]: 'py-1.5 px-3 text-sm font-semibold h-8',
  [ButtonSize.base]: 'py-2 px-4 text-md font-semibold h-10',
  [ButtonSize.lg]: 'py-3 px-5 text-base font-semibold h-12',
};

const SizesOnlyIcon: Record<ButtonSize, string> = {
  [ButtonSize.xs]: 'w-6 h-6',
  [ButtonSize.sm]: 'w-8 h-8',
  [ButtonSize.base]: 'w-10 h-10 text-lg',
  [ButtonSize.lg]: 'w-12 h-12',
};

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  accent = 'accent',
  ghost = 'ghost',
  live = 'live',
  pro = 'pro',
  plus = 'plus',
  'outlined-primary' = 'outlined-primary',
  'outlined-secondary' = 'outlined-secondary'
}

const Variants: Record<ButtonVariant, string> = {
  [ButtonVariant.primary]: 'bg-primary border border-slate-600 hover:border hover:border-slate-500 text-white',
  [ButtonVariant.secondary]: 'bg-secondary hover:bg-opacity-90 text-white',
  [ButtonVariant.accent]: 'bg-accent hover:bg-opacity-90 text-white',
  [ButtonVariant.ghost]: 'bg-transparent hover:bg-slate-100 hover:text-primary text-white',
  [ButtonVariant.live]: 'bg-transparent hover:bg-live hover:text-primary text-white',
  [ButtonVariant.plus]: 'text-white bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800 hover:bg-gradient-to-br transition duration-300 ease-in-out shadow-lg',
  [ButtonVariant.pro]: 'text-white bg-gradient-to-r from-violet-600 via-violet-700 to-violet-800 hover:bg-gradient-to-br transition duration-300 ease-in-out shadow-lg',
  [ButtonVariant['outlined-primary']]: 'bg-transparent hover:bg-primary text-white border-solid border border-primary',
  [ButtonVariant['outlined-secondary']]: 'bg-transparent hover:bg-secondary text-white border-solid border border-secondary'
};


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  size?: ButtonSize
  variant?: ButtonVariant
  isActive?: boolean
  isOnlyIcon?: boolean
  isSquare?: boolean
  isFullWidth?: boolean
  isDisabled?: boolean
  classNames?: string
}


export default component$( ({
  size = ButtonSize.base,
  variant = ButtonVariant.primary,
  isDisabled = false,
  isOnlyIcon = false,
  isFullWidth,
  isSquare,
  classNames,
  ...props}: ButtonProps) => {
  const setSizes = () => {
    if (isOnlyIcon) return SizesOnlyIcon[size];
    return Sizes[size];
  };
  const clasess = {
    button: cn(
      'flex items-center justify-center relative overflow-hidden',
      'text-center whitespace-nowrap',
      'transition duration-100 ease-out',
      'disabled:opacity-50 disabled:cursor-default',
      Variants[variant],
      setSizes(),
      {
        'rounded-lg': !isSquare,
        'w-full': isFullWidth,
        'cursor-default opacity-30': isDisabled,
      },
      classNames
    )
  }
    return (
      <button class={clasess.button}  {...props}>
        <Slot />
      </button>
    );
  }
);