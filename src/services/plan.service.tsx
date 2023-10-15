import { server$ } from '@builder.io/qwik-city';
import { PrismaClient } from '@prisma/client';

import { plansAdapter } from '~/adapters';



export const getPlans = server$( async () => {
  const prisma = new PrismaClient()
  const plans = await prisma.plan.findMany({
    orderBy:{
      price_monthly:'asc',
    }
  })

  return plansAdapter(plans)
})