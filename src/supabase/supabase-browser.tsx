import { createBrowserClient } from "supabase-auth-helpers-qwik";
import type { Database } from "~/models";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "~/utilities";

  
export const supabase = createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
  