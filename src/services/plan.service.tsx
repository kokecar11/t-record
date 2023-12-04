import { server$ } from '@builder.io/qwik-city';
import { plansAdapter } from '~/adapters';
import { db } from '~/db';


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