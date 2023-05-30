import {
    type CookieOptions,
    type RequestEventCommon,
  } from "@builder.io/qwik-city";
  import type { Session } from "@supabase/supabase-js";

  
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
  