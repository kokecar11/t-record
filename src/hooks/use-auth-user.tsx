
import { $ } from "@builder.io/qwik";
import { server$, } from "@builder.io/qwik-city";
import { supabase } from "~/supabase/supabase-browser";
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, cookieProvider, cookieUserSession, cookiesOptions } from "~/utilities";
import { type Provider } from "@supabase/supabase-js";
import type { TwitchProvider, UserSession } from "~/models";



export const useAuthUser = () => {

    const handleSignInWithOAuth = $(async (provider:Provider = 'twitch') => { 
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                scopes:'channel:manage:broadcast user:read:broadcast channel_read',
            }
        });
    });

    const authUserCookies = server$(async function(provider:TwitchProvider, userSession:UserSession) {
        if(provider){
            const providerCookie = {
                'providerToken': provider.providerToken,
                'providerRefreshToken': provider.providerRefreshToken,
            }
            this.cookie.set(cookieProvider, providerCookie, cookiesOptions);
        } 
        if (userSession){
            const userSessionCookie = {
                'userId': userSession.userId,
                'providerId': userSession.providerId,
            }
            this.cookie.set(cookieUserSession, userSessionCookie, cookiesOptions);   
        }
    });

    const handleRefreshTokenTwitch = server$( async function() {
        const provider:TwitchProvider = this.cookie.get(cookieProvider)!.json();
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        if(provider){
            const validateTwitchAcessToken = await fetch(`https://id.twitch.tv/oauth2/validate`, {headers:{
                'Authorization': `OAuth ${provider.providerToken}`
            }});
    
            if (validateTwitchAcessToken.status !== 200){
                const response = await fetch(
                    `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${provider.providerRefreshToken}&client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}`,
                {
                    method:'POST', 
                    headers
                })
                const data = await response.json();
                const providerCookie = {
                    'providerToken':data.access_token,
                    'providerRefreshToken':data.refresh_token,
                } 
                this.cookie.set(cookieProvider, providerCookie, cookiesOptions);
            }            
        }
        
    });

    return {
        authUserCookies,
        handleRefreshTokenTwitch,
        handleSignInWithOAuth,
    }
}