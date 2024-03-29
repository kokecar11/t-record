import { server$ } from '@builder.io/qwik-city'
import { plansAdapter } from '~/adapters'
import { db } from '~/db'
import type { TypePlan } from '@prisma/client'


export const getPlans = server$( async () => {
  const plans = await db.plan.findMany({
    orderBy:{
      price_monthly:'asc',
    }
  }).finally(() => {
    db.$disconnect();
})

  return plansAdapter(plans)
})

export const getPlanByProductId = server$( async (product_id:string) => {
  const plan = await db.plan.findFirst({
    where: {
      product_id
    }
  }).finally(() => {
    db.$disconnect();
})

  return plan
})

export const getPlanByType = server$( async (type:TypePlan) => {
  const plan = await db.plan.findFirst({
    where: {
      type
    }
  }).finally(() => {
    db.$disconnect();
})

  return plan
})