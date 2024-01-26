import { component$, useSignal, useTask$ } from '@builder.io/qwik'
import { useNavigate } from '@builder.io/qwik-city'

import { useAuthSession, useAuthSignin } from '~/routes/plugin@auth'
import { capitalizeFirstLetter } from '~/utilities'
import { getSubcriptionPlanByUser } from '~/services'
import type { PlanAdapter } from '~/models'

import Button, { ButtonSize, ButtonVariant } from '../button/Button'
import { Icon, IconCatalog } from '../icon/icon'
import { Tag, TagSize, TagVariant } from '../tag/Tag'
import { type SubscriptionBillingUser } from '~/adapters'

export type CardPricingProps = PlanAdapter;

export const CardPricing = component$(
  ({
    title,
    price,
    popular,
    features,
    link,
    typePlan,
    typeSubscription
  }: CardPricingProps) => {
    const session = useAuthSession();
    const signIn = useAuthSignin();
    const nav = useNavigate()
    const subscription = useSignal<SubscriptionBillingUser>()

    useTask$(async () => {
      subscription.value = await getSubcriptionPlanByUser(session.value?.userId as string)
    })

    return (
      <div
        class={`w-full sm:min-w-[20rem] max-w-sm p-0.5 border border-secondary rounded-lg ${
          !popular
            ? 'border-opacity-30 bg-primary'
            : 'border-opacity-100 shadow-2xl shadow-secondary bg-secondary'
        }`}
      >
        {popular && (
          <p class="flex text-white items-center justify-center text-center bg-secondary py-2 font-semibold">
            <Icon name={IconCatalog.feStar} class="text-lg mr-1" /> Most Popular
          </p>
        )}
        <div
          class={`flex flex-col p-4  rounded-lg bg-primary ${
            !popular && 'h-full'
          }`}
        >
          <span class="mb-4 text-xl font-medium text-gray-400">
            {title}{' '}
          </span>
          <hr class="mb-8 border-white opacity-10"></hr>

          <div class="flex items-baseline text-white">
            <span class="text-5xl font-extrabold tracking-tight">${price}</span>
            <span class="ml-1 text-gray-400">/ {capitalizeFirstLetter(typeSubscription)}
              { (typeSubscription === 'yearly' && popular ) && <Tag classNames={'ml-1'} variant={TagVariant.pro} size={TagSize.xs} text={'2 months FREE'}/>}
            </span>
          </div>
          <hr class="mt-8 border-white opacity-10"></hr>
          <ul role="list" class="space-y-5 my-7">
            {features?.map((feature) => (
              <li key={feature} class="flex space-x-3 items-center text-base">
                <Icon
                  name={IconCatalog.feCheckCircle}
                  class="text-secondary "
                />
                <span class="font-normal leading-tight text-white">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div class="flex flex-col mt-auto">
            {typePlan === 'STARTER' ? (
              <Button
                variant={ButtonVariant.secondary}
                size={ButtonSize.sm}
                isFullWidth
                id={`${capitalizeFirstLetter(typePlan.toLowerCase())}-${capitalizeFirstLetter(typePlan.toString())}`} 
                onClick$={() => {
                  if (session.value?.user) {
                    nav(`/billing`)
                  } else {
                    signIn.submit({ providerId: 'twitch', callbackUrl:'/pricing' })
                  }
                }}
              >
                Get started
              </Button>
            ) : (
              <Button 
                variant={ButtonVariant.secondary}
                size={ButtonSize.sm}
                isFullWidth 
                id={`${capitalizeFirstLetter(typePlan.toLowerCase())}-${capitalizeFirstLetter(typePlan.toString())}`} 
                onClick$={() => {
                  if(session.value?.user){
                    if(subscription.value?.typePlan !== 'STARTER'){
                      nav(`/dashboard`)
                    }else{
                      nav(`${link}${session.value?.user?.email}`)
                    }
                  } else {
                    signIn.submit({ providerId: 'twitch', callbackUrl:'/pricing' })
                  }
                }}
                >
                Get started
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  },
)
