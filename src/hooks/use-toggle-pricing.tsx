import { useSignal, useContextProvider, useStore } from '@builder.io/qwik';

import { TypeSubscriptionContext } from '~/context';
import type { PlanAdapter, TypeSubscription } from "~/models";

export const useTogglePricing = () => {
    const typeSubscription = useSignal<TypeSubscription>('monthly');
    const planStore= useStore<{plans: PlanAdapter[]}>(
        { 
            plans:[],
        }
    );
    useContextProvider(TypeSubscriptionContext, typeSubscription);

    return {
        typeSubscription,
        planStore
    }
};
