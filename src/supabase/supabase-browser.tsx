import { createBrowserClient } from "supabase-auth-helpers-qwik";
import type { Database } from "~/models";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  
export const supabase = createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
  