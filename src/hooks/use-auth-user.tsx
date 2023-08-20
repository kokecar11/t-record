
import { type CookieOptions, server$ } from "@builder.io/qwik-city";
import type { TwitchProvider, UserSession } from "~/models";

const cookieUserSession = '_user';
const cookieProvider = '_provider';

const options: CookieOptions = {
    httpOnly: true,
    maxAge: 14400,
    path: '/',
    sameSite: 'strict',
};

const TWITCH_CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET
const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID
export const useAuthUser = () => {
 
    const authUserCookies = server$(async function(provider:TwitchProvider, userSession:UserSession) {
        if(provider){
            const providerCookie = {
                'providerToken':provider.providerToken,
                'providerRefreshToken':provider.providerRefreshToken,
            }
            this.cookie.set(cookieProvider, providerCookie, options);
        } 
        if (userSession){
            const userSessionCookie = {
                'userId': userSession.userId,
                'providerId': userSession.providerId,
            }
            this.cookie.set(cookieUserSession, userSessionCookie, options);   
        }
    });

    const handleRefreshTokenTwitch = server$( async function() {
        const provider:TwitchProvider = this.cookie.get('_provider')!.json();
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
                this.cookie.set(cookieProvider, providerCookie, options);
            }            
        }
        
    });

    return {
        authUserCookies,
        handleRefreshTokenTwitch,
    }
}