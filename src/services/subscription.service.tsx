import { server$ } from '@builder.io/qwik-city';
import { supabase } from '~/core/supabase/supabase';

import { getSubscriptionsPlan } from './subscription-plan.service';

import type { Subscription } from '~/models';

export const getSubscriptionByUser = async (fkUser:string) => {
  const { data } = await supabase.from('subscription').select('*').eq('fk_user', fkUser);
  if (data){
    if (data.length === 0){
      return null
    } 
    return data[0] as Subscription;
  }
};

export const setSubscriptionByUser = server$(async (fkUser:string) => {
  const subscriptionByUser = await getSubscriptionByUser(fkUser)
  if (subscriptionByUser === null){
    const plans = await getSubscriptionsPlan();
    const starterPlan = plans.filter((plan) => plan.plan === 'STARTER')[0]
    await supabase.from('subscription').insert({fk_user: fkUser, fk_subscription_plan:starterPlan.id, status:'on_trial'});
  }
});
