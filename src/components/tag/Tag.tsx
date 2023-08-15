import { component$ } from '@builder.io/qwik';

export type TagProps = {
    text?: string;
    variant?: TagVariants;
    size?: TagSizes;
}

export type TagSizes = 'xs' | 'sm' | 'md' | 'lg';
export type TagVariants = 'danger' | 'warning' | 'info' | 'success' | 'primary' | 'secondary' | 'plus' | 'pro';


export const Tag = component$(({text, size, variant}:TagProps) => {
    const {sizes, variants} ={
        variants:{
            danger: 'bg-red-500',
            warning: 'bg-yellow-500',
            success: 'bg-green-500',
            info: 'bg-blue-500',
            primary: 'bg-primary',
            secondary: 'bg-secondary',
            plus: 'bg-gradient-to-r from-secondary to-live',
            pro: 'bg-gradient-to-r from-secondary to-slate-800',
        },
        sizes:{
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-md',
            lg: 'text-lg',
        }
    }
    return(
        <span class={`inline-block px-2 py-1 rounded-lg text-white font-normal capitalize ${variant ? variants[variant] : variants.primary} ${size ? sizes[size]: sizes.sm}`}>
            {text?.toLowerCase()}
        </span>
    );
})