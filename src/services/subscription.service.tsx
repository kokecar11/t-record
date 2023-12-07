import { server$ } from '@builder.io/qwik-city'
import type { TypeSubscription } from '@prisma/client'
import { subscriptionBillingUserAdapter } from '~/adapters'
import { db } from '~/db'
import { getPlanByProductId, getPlanByType } from './plan.service'
import type { PaymentData } from '~/routes/(app)/api/payment'

export const getSubcriptionByUser = server$(async (userId: string) => { 
  const mySubcription = await db.subscription.findFirst({
    where: { userId },
    include: {
      plan: true
    }
  })
  return mySubcription?.plan
})

export const getSubcriptionPlanByUser = server$(async (userId: string) => {
  const mySubcription = await db.subscription.findFirst({
    where: { userId },
    include: {
      plan: true
    }
  })
  return subscriptionBillingUserAdapter(mySubcription)
})

export const getUserByEmail = server$(async (email: string) => { 
  const mySubcription = await db.user.findFirst({
    where: { email },
  })
  return mySubcription
})

export const getLsSubscriptionIdByUserId = server$(async (userId:string) => {
  const subscription = await db.subscription.findFirst({
    where: { userId }
  })
  return subscription?.ls_subsId
})

export const setPaymentSubscriptionByUser = server$(async (data: PaymentData) => { 
  const user = await getUserByEmail(data.user_email)
  const plan = await getPlanByProductId(data.product_id as string)
  await db.subscription.update({
    where: {
      userId: user?.id
    },
    data: {
        renews_at: data.renews_at,
        ends_at: data.ends_at,
        variant_id: data.variant_id,
        type: data.variant_name as TypeSubscription,
        planId: plan?.id,
        ls_subsId: data.ls_subsId,
    }
  })
})

export const cancelSubscription = server$(async function(userId: string) {
  const urlApiLemonSqueezy = 'https://api.lemonsqueezy.com/v1/subscriptions/';
  const LS_API_KEY = this.env.get('LS_API_KEY')

  const lsSubscriptionId = await getLsSubscriptionIdByUserId(userId)
  const headers = {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization':"Bearer " + LS_API_KEY,
  };
  const respCancelSubscription = await fetch(`${urlApiLemonSqueezy}${lsSubscriptionId}`, {
      method:'DELETE',
      headers
  });
  const respCancelSubscriptionJson = await respCancelSubscription.json()

  const planStarter = await getPlanByType('STARTER')

  if (respCancelSubscriptionJson.data.attributes.cancelled) {
    await db.subscription.update({
      where: { userId },
      data: {
        renews_at: respCancelSubscriptionJson.data.attributes.renews_at,
        ends_at: respCancelSubscriptionJson.data.attributes.ends_at,
        variant_id: null,
        type: 'monthly',
        planId: planStarter?.id,
        ls_subsId: null,
      }
    })
    return {
      message: 'Subscription cancelled, you will be able to enjoy the service until the end of the current billing period.'
    }
  }
  return {
    message: 'Subscription could not be cancelled'
  }

})