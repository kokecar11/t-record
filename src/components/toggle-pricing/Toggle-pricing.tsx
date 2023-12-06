import { component$, useContext, $, useVisibleTask$ } from '@builder.io/qwik';
import cn from 'classnames'

import { TypeSubscriptionContext } from '~/context';
import { capitalizeFirstLetter } from '~/utilities';

export const TogglePricing = component$(() => {
    const typeSubscription = useContext(TypeSubscriptionContext)
    useVisibleTask$(async ({track}) => {
        track(() => [typeSubscription.value])
    })
    const classes = {
        container: cn('relative w-40 h-10 rounded-3xl bg-accent border border-secondary border-opacity-30 flex items-center transition-all duration-300 shadow  justify-between'),
        content: cn('absolute justify-center w-20 items-center py-2 text-white rounded-3xl h-10 bg-secondary transition-all duration-500 transform font-semibold',{
            'translate-x-0': typeSubscription.value === 'monthly',
            'translate-x-full': typeSubscription.value === 'yearly',
        }),
        type: cn('text-gray-400 mx-auto')
    }
    return (
        <button class={classes.container} onClick$={$(() => {
            typeSubscription.value === 'monthly' ? typeSubscription.value = 'yearly' : typeSubscription.value = 'monthly'
        })}>
            <span class={classes.type}>Monthly</span>
            <div class={classes.content}>{capitalizeFirstLetter(typeSubscription.value)}</div>
            <span class={classes.type}>Yearly</span>
        </button>
    );
});