import { component$, useSignal, useTask$, useContextProvider } from '@builder.io/qwik'
import { type RequestHandler, type DocumentHead } from '@builder.io/qwik-city'

import { useAuthSession } from '~/routes/plugin@auth'
import { getSubcriptionPlanByUser } from '~/services'

import { useTogglePricing } from '~/hooks'
import { TypeSubscriptionContext } from '~/context'

// import Button, { ButtonVariant } from '~/components/button/Button'

import { type SubscriptionBillingUser } from '~/adapters'
import { type Session } from '@prisma/client/edge'

export const onRequest: RequestHandler = async(event) => {
  const session: Session | null = event.sharedMap.get('session')
  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(302, `/`)
  }
}

export default component$(() => {
  // const nav = useNavigate()
  const subscription = useSignal<SubscriptionBillingUser>()
  const session = useAuthSession()
  // const handlePricing = $(() => nav('/pricing'))
  const { typeSubscription } = useTogglePricing()
  useContextProvider(TypeSubscriptionContext, typeSubscription)

  useTask$(async () => {
    subscription.value = await getSubcriptionPlanByUser(session.value?.userId as string)
  })

  
  return (
    <>
      <div class='w-full container mx-auto h-full px-4'>
        <h1 class='text-white text-3xl font-bold'>Plan & Billing</h1>
        <div class='bg-secondary bg-opacity-10 my-2 rounded-lg shadow-lg border border-secondary'>
          <div class='flex sm:space-x-16 p-4'>
            <div class="grid sm:flex-1">
                <span class='text-sm text-gray-400'>Plan</span>
                <span class='text-xl text-white capitalize'>{subscription.value?.typePlan.toLocaleLowerCase()}</span>
            </div>
            <div class="grid sm:flex-1">
                <span class='text-sm text-gray-400'>Payment</span>
                {subscription.value?.typePlan === 'STARTER' ? <span class='text-xl text-white'>FREE</span> : <span class='text-xl text-white'>${subscription.value?.price} <span class='text-xs text-gray-300'> per month</span></span> }
            </div>
            { subscription.value?.renews_at &&
              <div class="grid sm:flex-1">
                <span class='text-sm text-gray-400'>Renews at</span>
                <span class='text-xl text-white'>{subscription.value?.renews_at.toLocaleDateString()}</span>
              </div>
            }
            { subscription.value?.ends_at &&
              <div class="grid sm:flex-1">
                <span class='text-sm text-gray-400'>Ends at</span>
                <span class='text-xl text-white'>{subscription.value?.ends_at.toLocaleDateString()}</span>
              </div>
            }
            
            {/* <div class="grid gap-y-4 sm:flex sm:space-x-4 my-auto">
              <Button variant={ButtonVariant['primary']} onClick$={async()=>{
                await cancelSubscription(session.value?.userId as string)
              }} >
                Cancel sub
              </Button>
              <Button variant={ButtonVariant['pro']} onClick$={handlePricing}>
                Change plan
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
})

export const head: DocumentHead = {
  title: 'Plan & Billing | T-Record',
  meta: [
    {
      name: 'description',
      content: 'Dashboard T-Record',
    },
  ],
}