import { useSignal, useContextProvider, useStore } from '@builder.io/qwik';
import type { PlansSubscription, TypeSubscription } from '../models/toggle-pricing.model';
import { TypeSubsContext } from '../context/toggle-pricing.context';




export const useTogglePricing = () => {
    const typeSubscription = useSignal<TypeSubscription>('monthly');
    const plansSubscription = useStore<{plans: PlansSubscription[]}>(
        { 
          plans:[{
            id: 'starter',
            plan: 'STARTER',
            price: 0,
            title: 'Starter plan',
            popular: false,
            link: '/dashboard',
            type: 'monthly',
            features: ['20 Markers monthly.', '10 Instant Markers per day.'],
          },
          {
            id: 'starter',
            plan: 'STARTER',
            price: 0,
            title: 'Starter plan',
            popular: false,
            link: '/dashboard',
            type: 'yearly',
            features: ['20 Markers monthly.', '10 Instant Markers per day.'],
          }],
        }
    );
    useContextProvider(TypeSubsContext, typeSubscription);

    return {
        typeSubscription,
        plansSubscription
    }
};