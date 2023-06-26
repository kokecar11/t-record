import { $ } from "@builder.io/qwik";
import { type CookieOptions, server$, useNavigate, useLocation } from "@builder.io/qwik-city";
import type { Session, Provider } from "@supabase/supabase-js";
import { supabase } from "~/core/supabase/supabase";


const cookieSession = "_session";
const cookieUser = "_user";
const cookieProvider = "_provider";

const options: CookieOptions = {
    httpOnly: true,
    maxAge: 610000,
    path: "/",
    sameSite: "strict",
};

export const LOCAL_STORAGE_NAME = import.meta.env.VITE_LOCAL_STORAGE
const TWITCH_CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET
const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID
export const useAuth = () => {
    const nav = useNavigate();
    const path = useLocation();

    const getAuthSession = $(() => {
        const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)!)
        return data;
    });
    
    const handleSignInWithOAuth = $(async (provider:Provider = 'twitch') => { 
        const redirectTo = `${path.url.host}/dashboard/`;
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                scopes:'channel:manage:broadcast user:read:broadcast channel_read channel:manage:extensions',
                redirectTo:redirectTo
            }
        });
    });

    const handleSignOut = $( async () => {
        await supabase.auth.signOut();
        nav('/logout/');
    });
    
    const updateAuthCookies = server$(async function(session:Session) {
        if(session){
            const sessionSBCookie = {
                'access_token':session.access_token,
                'expires_in':session.expires_in,
                'refresh_token':session.refresh_token,
            }
            this.cookie.set(cookieSession, sessionSBCookie, options);
            this.cookie.set(cookieUser, session.user, options);
    
            if (session.provider_token || session.provider_refresh_token){
    
                const providerCookie = {
                    'provider_token':session.provider_token ? session.provider_token : null,
                    'provider_refresh_token':session.provider_refresh_token ? session.provider_refresh_token : null,
                }
                this.cookie.set(cookieProvider, providerCookie, options);    
    
            }
        }

    });

    const handleRefreshTokenTwitch = server$( async function() {
        const provider:any = this.cookie.get('_provider')?.json();
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        if(provider){
            const validateTwitchAcessToken = await fetch(`https://id.twitch.tv/oauth2/validate`, {headers:{
                'Authorization': `OAuth ${provider.provider_token}`
            }});
    
            if (validateTwitchAcessToken.status !== 200){
                const response = await fetch(
                    `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${provider.provider_refresh_token}&client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}`,
                {
                    method:'POST', 
                    headers
                })
                const data = await response.json();
                const providerCookie = {
                    'provider_token':data.access_token,
                    'provider_refresh_token':data.refresh_token,
                } 
                this.cookie.set(cookieProvider, providerCookie, options);
            }            
        }
        
    });

    return {
        handleSignInWithOAuth,
        handleSignOut,
        getAuthSession,
        updateAuthCookies,
        handleRefreshTokenTwitch
    }
}