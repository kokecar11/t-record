import {
    type CookieOptions,
    type RequestEventCommon,
  } from "@builder.io/qwik-city";
  import type { Session } from "@supabase/supabase-js";
import { supabase } from "~/core/supabase/supabase";

  
  const cookieSession = "_session";
  const cookieUser = "_user";
  const cookieProvider = "_provider";
  
  const options: CookieOptions = {
    httpOnly: true,
    maxAge: 610000,
    path: "/",
    sameSite: "lax",
  };
  
  export const updateAuthCookies = (
    event: RequestEventCommon,
    session: Pick<Session, "refresh_token" | "expires_in" | "access_token">
  ) => {
    event.cookie.set(cookieSession, session, options);
  };
  
  export const removeAuthCookies = async (event: RequestEventCommon) => {
      
      event.cookie.delete(cookieSession, options);
      event.cookie.delete(cookieUser, options);
      event.cookie.delete(cookieProvider, options);
      
  };
  
//   export const getUserByCookie = async (event: RequestEventCommon) => {
//     const value = event.cookie.get(cookieName)?.json();
  
//     const parsed = z
//       .object({ access_token: z.string(), refresh_token: z.string() })
//       .safeParse(value);
  
//     if (!parsed.success) {
//       return null;
//     }
  
//     const supabase = createSupabase(event);
  
//     const userResponse = await supabase.auth.getUser(parsed.data.access_token);
  
//     if (userResponse.data.user) {
//       return userResponse.data.user;
//     }
  
//     const refreshResponse = await supabase.auth.refreshSession({
//       refresh_token: parsed.data.refresh_token,
//     });
  
//     if (!refreshResponse.data.session) {
//       removeAuthCookies(event);
//       return null;
//     }
  
//     const session = refreshResponse.data.session;
//     updateAuthCookies(event, session);
  
//     return session.user;
//   };
  
//   export const getUserFromEvent = (
//     event: RequestEventCommon
//   ): Promise<User | null> => {
//     const cachedPromise = event.sharedMap.get("user");
//     if (cachedPromise) {
//       return cachedPromise;
//     }
  
//     const promise = getUserByCookie(event);
//     event.sharedMap.set("user", promise);
  
//     return promise;
//   };