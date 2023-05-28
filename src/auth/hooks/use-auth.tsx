import { $ } from "@builder.io/qwik";
import { type CookieOptions, server$, useNavigate } from "@builder.io/qwik-city";
import type { Session, Provider } from "@supabase/supabase-js";
import { supabase } from "~/core/supabase/supabase";


const cookieName = "_session";
const options: CookieOptions = {
    httpOnly: true,
    maxAge: 3600,
    path: "/",
    sameSite: "strict",
  };
  
export const useAuth = () => {
    const nav = useNavigate();

    const getAuthSession = $(() => {
        const data = JSON.parse(localStorage.getItem('sb-lsncoytitkdmnhvkbtrg-auth-token')!)
        return data;
    });
    
    const handleSignInWithOAuth = $(async (provider:Provider = 'twitch') => { 
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                scopes:'channel:manage:broadcast user:read:broadcast channel_read'
            }
        });
    });

    const handleSignOut = $( async () => {
        await supabase.auth.signOut();
        nav('/logout/');
    });
    
    const updateAuthCookies = server$(async function(session:Session) {
        if (session){
            const sessionSBCookie = {
                'access_token':session.access_token,
                'expires_in':session.expires_in,
                'refresh_token':session.refresh_token,
            } 
            const providerCookie = {
                'provider_token':session.provider_token,
                'provider_refresh_token':session.provider_refresh_token,
            } 
            this.cookie.set(cookieName, sessionSBCookie, options);
            this.cookie.set('_provider', providerCookie, options);
            this.cookie.set('_user', session.user, options);
        }
    })

    return {
        handleSignInWithOAuth,
        handleSignOut,
        getAuthSession,
        updateAuthCookies
    }
}