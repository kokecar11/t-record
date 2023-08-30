import type { RequestEvent } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";
import type { Database } from "~/models";
import { 
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  cookieProvider,
  cookieUserSession,
  cookiesOptions } from "~/utilities";


export const onGet = async (request: RequestEvent) => {
  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, request)
  await supabase.auth.signOut()
  request.cookie.delete(cookieUserSession, cookiesOptions)
  request.cookie.delete(cookieProvider, cookiesOptions)
  request.cookie.delete('sb-access-token', cookiesOptions)
  request.cookie.delete('sb-refresh-token', cookiesOptions)
  throw request.redirect(302, '/')
};