import { useSignal, useContextProvider, useStore } from '@builder.io/qwik';

import { TypeSubscriptionContext } from '~/context';
import type { Plan, TypeSubscription } from "~/models";

export const useTogglePricing = () => {
    const typeSubscription = useSignal<TypeSubscription>('monthly');
    const planStore= useStore<{plans: Plan[]}>(
        { 
          plans:[{
            id: 'starter',
            name: 'STARTER',
            price: 0,
            title: 'Starter plan',
            popular: false,
            link: '/dashboard',
            type: 'monthly',
            features: ['20 Markers monthly.', '10 Instant Markers per day.'],
          },
          {
            id: 'starter',
            name: 'STARTER',
            price: 0,
            title: 'Starter plan',
            popular: false,
            link: '/dashboard',
            type: 'yearly',
            features: ['20 Markers monthly.', '10 Instant Markers per day.'],
          }],
        }
    );
    useContextProvider(TypeSubscriptionContext, typeSubscription);

    return {
        typeSubscription,
        planStore
    }
};
