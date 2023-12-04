import { component$, useSignal, useTask$, $, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

import { useAuthSession } from '~/routes/plugin@auth';
import { cancelSubscription, getPlans, getSubcriptionPlanByUser, invoices } from '~/services';

import { Tag, TagSize, TagVariant } from '~/components/tag/Tag';
import Button, { ButtonVariant } from '~/components/button/Button';
import { type SubscriptionBillingUser } from '~/adapters';
import { useTogglePricing } from '~/hooks';
import { PrincingList } from '~/routes/pricing';

// export const onRequest: RequestHandler = (event) => {
//   throw event.redirect(302, `/dashboard`)
// }
export default component$(() => {
  const showPlan = useSignal<boolean>(false)
  const subscription = useSignal<SubscriptionBillingUser>()
  const { planStore } = useTogglePricing()
  const session = useAuthSession()
  // getSubcriptionByUser
  const toggleShowPlan = $(() => showPlan.value = !showPlan.value)
  useVisibleTask$(async () => {
    await invoices(session.value?.user?.email as string)
    const plans = await getPlans()    
    subscription.value = await getSubcriptionPlanByUser(session.value?.userId as string)
    planStore.plans = plans
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
              <div class="grid">
                <span class='text-sm text-gray-400'>Renews at</span>
                <span class='text-xl text-white'>{subscription.value?.renews_at.toLocaleDateString()}</span>
              </div>
            }
            
            <div class="grid gap-y-4 sm:flex sm:space-x-4 my-auto">
              <Button variant={ButtonVariant['primary']} onClick$={async()=>{
                await cancelSubscription()
              }} >
                Cancel sub
              </Button>
              <Button variant={ButtonVariant['pro']} onClick$={toggleShowPlan}>
                Change plan
              </Button>
            </div>
          </div>
        </div>

        {showPlan.value && (<PrincingList/>)}
        
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg my-2">
          <table class="w-full text-sm text-left rtl:text-right text-gray-400">
              <thead class="text-xs text-gray-400 capitalize bg-gray-700">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                        Date
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Amount due
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Invoice number
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Status
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                  </tr>
              </thead>
              <tbody>
                  <tr class="bg-white border-b dark:bg-accent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white">
                    <th class="px-6 py-4">
                        21/10/2023, 18:22:05
                    </th>
                    <td class="px-6 py-4">
                        $5.99
                    </td>
                    <td class="px-6 py-4">
                        12342-3dsd-232
                    </td>
                    <td class="px-6 py-4">
                        <Tag text='Paid' size={TagSize.xs} variant={TagVariant['success-outlined']}/>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                  </tr>
        
              </tbody>
          </table>
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