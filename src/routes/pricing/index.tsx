import { component$, useContextProvider, useTask$ } from '@builder.io/qwik'
import { type DocumentHead } from '@builder.io/qwik-city'

import { TypeSubscriptionContext } from '~/context'
import { getPlans } from '~/services'
import { useTogglePricing } from '~/hooks'

import { CardPricing } from '~/components/card-pricing/Card-pricing'
import { TogglePricing } from '~/components/toggle-pricing/Toggle-pricing'
import { Collapse } from '~/components/collapse/Collapse'


export default component$(() => {
  const { typeSubscription } = useTogglePricing()
  useContextProvider(TypeSubscriptionContext, typeSubscription)

  return (
    <div class="flex flex-col m-10 h-full">
      <div class="container mx-auto px-4">
        <h1 class="text-5xl md:text-7xl my-6 text-center text-fluid-base text-transparent bg-clip-text bg-gradient-to-r from-live via-violet-900 to-secondary font-bold animate-hero-title">
          Join the revolution of interactive experiences on Twitch!
        </h1>
        <h2 class="text-lg text-gray-300 text-center animate-fade-down max-w-[50ch] m-auto">
          Choose your plan and create epic moments live. Stand out with markers,
          and take your content to the next level.
        </h2>
        <div class="flex flex-row justify-center items-center gap-2 my-4">
          <TogglePricing/>
        </div>
        <PrincingList typeSubscription={typeSubscription.value}/>
        <FaqsList/>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Pricing | T-Record',
  meta: [
    {
      name: 'description',
      content: 'Discover T-Record Pricing Plans: Elevate Your Content, Maximize Your Impact.',
    },
  ],
}

export const PrincingList = component$(({typeSubscription}:{typeSubscription:any}) => {
  const { planStore } = useTogglePricing()

  useTask$(async () => {
    planStore.plans = await getPlans()    
  })

  return (
    <div class="gap-6 flex flex-wrap items-start justify-center mt-10 animate-fade-up delay-300 animate-duration-1000 md:items-stretch">
    {
      planStore.plans
      .filter((plan) => plan.typeSubscription === typeSubscription)
      .map((plan) => (
        <CardPricing key={plan.id} {...plan} /> 
      ))
    }
</div>
  )
})

export const FaqsList = component$(() => {
  const Faqs = [
    {
      title: 'What are the differences between the starter plan and the T-Record Plus plan?', 
      description: 'The starter plan offers all the basic features for creating markers at any time. On the other hand, the Plus plan not only includes these functionalities but also provides the ability to directly access VOD links from the highlight timeline.'
    },
    {
      title: 'How can I subscribe to the T-Record Plus plan?', 
      description: 'You can upgrade your account to the Plus subscription directly from the platform. Select the Plus plan, follow the indicated steps, and enjoy the additional features, such as direct access to VOD links.'
    },
    {
      title: 'Can I switch between plans at any time?', 
      description: 'Yes, you can switch between the free plan and the Plus plan at any time according to your needs. Simply adjust your plan from your account settings.'
    },
    {
      title: 'How are payments processed for the Plus plan?', 
      description: 'Payments for the Plus plan are securely processed through our platform. You can choose your preferred payment option and manage billing details from your account.'
    },
  ]

  return (
  <div class="grid md:flex mb-10 gap-8 items-start mt-10">
    <div class="animate-fade-right w-full md:w-2/5">
      <h2 class="text-5xl font-bold text-center">Pricing FAQs</h2>
    </div>
    <div class="grid items-center space-y-4 animate-fade-left w-full md:w-3/5">
      { Faqs.map((faq, index) => (
          <Collapse key={index} title={faq.title} description={faq.description}/>
        )
      )}
    </div>
      {/* <h2 class="text-5xl font-bold text-center w-full md:w-2/5">Pricing FAQs</h2>
      <div class="space-y-6 my-2 w-full md:w-3/5">
        { Faqs.map((faq, index) => (
          <Collapse key={index} title={faq.title} description={faq.description}/>
        )
        )}
      </div> */}
  </div>
    
  )
})