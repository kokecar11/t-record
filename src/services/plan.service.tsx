import { server$ } from '@builder.io/qwik-city';
import { supabase } from '~/supabase/supabase-browser';

import type { Plan } from "~/models";

export const getPlans = server$(async () => {
  const { data, error } = await supabase.from('plan').select('*').order('price');
  if (error){
    return [];
  }else{
    return [ ...data  ] as Plan[];
  }
});
