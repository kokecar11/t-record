import { createClient } from "@supabase/supabase-js";
import { BrowserCookieAuthStorageAdapter, type CookieOptions } from "@supabase/auth-helpers-shared";

import type { Database } from "~/models";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "~/utilities";

export const options: CookieOptions = {
    secure: true,
    sameSite: "lax",
    maxAge: 14400,
    domain:'',
    path:'/',
    
}
  
export const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            storage: new BrowserCookieAuthStorageAdapter(options), storageKey:'sb-access-token',persistSession:true
        },
    }
)