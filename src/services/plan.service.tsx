import { server$ } from '@builder.io/qwik-city'
import { plansAdapter } from '~/adapters'
import { db } from '~/db'
import type { TypePlan } from '@prisma/client/edge'


export const getPlans = server$( async () => {
  const plans = await db.plan.findMany({
    orderBy:{
      price_monthly:'asc',
    }
  })

  return plansAdapter(plans)
})

export const getPlanByProductId = server$( async (product_id:string) => {
  const plan = await db.plan.findFirst({
    where: {
      product_id
    }
  })

  return plan
})

export const getPlanByType = server$( async (type:TypePlan) => {
  const plan = await db.plan.findFirst({
    where: {
      type
    }
  })

  return plan
})