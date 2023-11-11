import { server$ } from '@builder.io/qwik-city'
import { db } from '~/db'



export const getSubcriptionByUserPrisma = server$(async (userId: string) => { 
  const mySubcription = await db.subscription.findFirst({
    where: { userId },
    include: {
      plan: true
    }
  })
  
  return mySubcription?.plan
})