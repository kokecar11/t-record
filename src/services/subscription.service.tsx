import { server$ } from '@builder.io/qwik-city'
import { subscriptionBillingUserAdapter } from '~/adapters'
import { db } from '~/db'

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
