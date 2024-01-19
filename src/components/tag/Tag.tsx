import { component$ } from '@builder.io/qwik'
import cn from 'classnames'


export enum TagSize {
    xs = 'xs',
    sm = 'sm',
    base = 'base',
    lg = 'lg',
}

const Sizes: Record<TagSize, string> = {
    [TagSize.xs]: 'py-1 px-2 text-xs',
    [TagSize.sm]: 'py-1.5 px-3 text-sm',
    [TagSize.base]: 'py-2 px-4 text-md',
    [TagSize.lg]: 'py-3 px-5 text-base',
}

export enum TagVariant {
    primary = 'primary',
    secondary = 'secondary',
    danger = 'danger',
    warning = 'warning',
    info = 'info',
    success = 'success',
    plus = 'plus',
    pro = 'pro',
    'primary-outlined' = 'primary-outlined',
    'secondary-outlined' = 'secondary-outlined',
    'danger-outlined' = 'danger-outlined',
    'warning-outlined' = 'warning-outlined',
    // 'info-outlined' = 'info-outlined',
    'success-outlined' = 'success-outlined',
}

const Variants: Record<TagVariant, string> = {
    [TagVariant.primary]: 'bg-primary text-white',
    [TagVariant['primary-outlined']]: 'bg-transparent border border-primary text-white',
    [TagVariant.secondary]: 'bg-secondary hover:bg-opacity-90 text-white',
    [TagVariant['secondary-outlined']]: 'bg-secondary bg-opacity-20 border border-secondary text-white',
    [TagVariant.danger]: 'bg-red-500 hover:bg-opacity-90 text-white',
    [TagVariant['danger-outlined']]: 'bg-red-500 bg-opacity-20 border border-red-500 text-red-500',
    [TagVariant.warning]: 'bg-yellow-500 hover:bg-opacity-90 text-white',
    [TagVariant['warning-outlined']]: 'bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-500',
    [TagVariant.info]: 'bg-blue-500 hover:bg-opacity-90 text-white',
    [TagVariant.success]: 'bg-green-500 hover:bg-opacity-90 text-white',
    [TagVariant['success-outlined']]: 'bg-green-500 bg-opacity-20 border border-green-500 text-green-500',
    [TagVariant.plus]: 'text-white bg-gradient-to-br from-pink-300 via-pink-600 to-pink-900',
    [TagVariant.pro]: 'text-white bg-gradient-to-br from-violet-300 via-violet-600 to-violet-900',
};

export interface TagProps {
    size?: TagSize;
    variant?: TagVariant;
    text?: string;
    classNames?: string
}

export const Tag = component$(({
    text,
    size = TagSize.base,
    variant = TagVariant.secondary,
    classNames
}:TagProps) => {

    const clasess = {
        tag: cn(
            'inline-block px-2 py-1 rounded-lg font-normal capitalize',
            Sizes[size],
            Variants[variant],
            classNames
        )
    }

    return(
        <span class={clasess.tag}>
            {text?.toLowerCase()}
        </span>
    );
})