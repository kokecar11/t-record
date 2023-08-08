import { server$ } from "@builder.io/qwik-city";
import { supabase } from "~/core/supabase/supabase";

import type { PlansSubscription } from "~/components/toggle-pricing/models/toggle-pricing.model";

export const getPlansSubscriptions = server$(
    async () => {
      const { data, error } = await supabase.from('subscription_plan').select('*').order('price');
      
      if (error){
        return [];
      }else{
        return [ ...data  ] as PlansSubscription[];
      }
  });