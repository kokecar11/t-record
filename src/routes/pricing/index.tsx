import { component$, useContextProvider, useTask$} from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

import { TypeSubscriptionContext } from '~/context';
import { getSubscriptionsPlan } from '~/services';
import { useTogglePricing } from '~/hooks';

import { CardPricing } from '~/components/card-pricing/Card-pricing'
import { TogglePricing } from '~/components/toggle-pricing/Toggle-pricing'


export default component$(() => {
  const { typeSubscription, SubscriptionPlanStore } = useTogglePricing();
  useContextProvider(TypeSubscriptionContext, typeSubscription);  
  
  useTask$(async ({track}) => {
    track(() => SubscriptionPlanStore.plans)
    SubscriptionPlanStore.plans.push(...await getSubscriptionsPlan());
  });


  return (
    <div class="flex flex-col m-10 h-full">
      <h1 class="text-white text-5xl md:text-7xl font-bold my-6 text-center animate-fade-down text-fluid-base">
        Choose your plan
      </h1>
      <p class="font-light lg:text-2xl text-lg md:text-xl text-white text-center animate-fade-down max-w-[50ch] m-auto">
        Select your plan and create epic moments live. Stand out with markers,
        and take your content to the next level. <br></br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-secondary font-semibold">
          Join the revolution of interactive experiences on Twitch!
        </span>
      </p>
      
      <div class="flex flex-row justify-center items-center gap-2 mt-4">
        <TogglePricing/>
      </div>

      <div class="gap-6 flex flex-wrap items-start justify-center mt-10 animate-fade-up delay-300 animate-duration-1000 md:items-stretch">
          {
                SubscriptionPlanStore.plans
                .filter((plan) => plan.type === typeSubscription.value)
                .map((plan) => (
                  <CardPricing key={plan.id} {...plan} />  
                ))
          }
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Pricing | T-Record',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
}
