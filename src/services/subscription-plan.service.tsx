import { server$ } from '@builder.io/qwik-city';
import { supabase } from '~/core/supabase/supabase';

import type { SubscriptionPlan } from "~/models";

export const getSubscriptionsPlan = server$(async () => {
  const { data, error } = await supabase.from('subscription_plan').select('*').order('price');
  if (error){
    return [];
  }else{
    return [ ...data  ] as SubscriptionPlan[];
  }
});
