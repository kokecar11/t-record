import { server$ } from '@builder.io/qwik-city';
import { supabase } from '~/supabase/supabase-browser';

import { getPlans } from './plan.service';
import { subscriptionUserAdapter } from '~/adapters';

import type { Subscription } from '~/models';
import { PrismaClient } from '@prisma/client';

//TODO: Deprecated this func
export const getSubscriptionByUser = server$(async (fkUser:string) => {
  const { data } = await supabase.from('subscription')
  .select(`start_date, expiration_date, status, fk_plan (name)`)
  .eq('fk_user', fkUser);
  if (data){
    if (data.length === 0){
      return null
    } 
    const subscription = data[0] as unknown as Subscription;
    const result = subscriptionUserAdapter(subscription);
    return result;
  }
});

//TODO: Deprecated this func
export const setSubscriptionByUser = async (fkUser:string) => {
  const subscriptionByUser = await getSubscriptionByUser(fkUser)
  if (subscriptionByUser === null){
    const plans = await getPlans();
    const starterPlan = plans.filter((plan) => plan.name === 'STARTER')[0]
    await supabase.from('subscription').insert({fk_user: fkUser, fk_plan:starterPlan.id, status:'active'});
  }
};


export const getSubcriptionByUserPrisma = server$(async (userId: string) => { 
  const prisma = new PrismaClient()
  const mySubcription = await prisma.subscription.findFirst({
    where: { userId },
    include: {
      plan: true
    }
  })
  
  return mySubcription?.plan
})