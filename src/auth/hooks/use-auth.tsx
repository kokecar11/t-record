import { $ } from "@builder.io/qwik";
import { server$, useLocation, useNavigate } from "@builder.io/qwik-city";
import type { Session, Provider } from "@supabase/supabase-js";
import { supabase } from "~/core/supabase/supabase";



export const useAuth = () => {
    const loc = useLocation();
    const nav = useNavigate();

    const getAuthSession = $(() => {
        const data = JSON.parse(localStorage.getItem('sb-lsncoytitkdmnhvkbtrg-auth-token')!)
        return data;
    });
    

    const handleSignInWithOAuth = $(async (provider:Provider = 'twitch') => { 
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                // redirectTo,
                scopes:'channel:manage:broadcast user:read:broadcast channel_read'
            }
        });
    });

    const handleSignOut =$(async () => {
        const { error } = await supabase.auth.signOut();
        document.cookie = 'user_provider_token' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'fk_user' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 't_user' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        nav('/login');
    });

    const setCookies = $( (session: Session) => {
        document.cookie=`fk_user=${session.user.id}; secure; SameSite=Strict; path/`;
        document.cookie=`user_provider_token=${session.provider_token}; secure; SameSite=Strict; path/`;
    })

    const testSetCookiesServer = server$(async function(session:Session) {
        if(this.cookie.get('user_provider_token') && this.cookie.get('fk_user') && this.cookie.get('t_user')){
            return { 
                success: false
            }
        }
        if(session){
            this.cookie.set('user_provider_token',session.provider_token!, {
                 sameSite: 'strict',
                 path: '/',
                 secure: true
            })
            this.cookie.set('fk_user',session.user.id, {
                sameSite: 'strict',
                path: '/',
                secure: true
           })
            this.cookie.set('t_user',session?.user.user_metadata.provider_id, {
                sameSite: 'strict',
                path: '/',
                secure: true,
           })
        }
        return {
            success: true
        }
    })

    return {
        handleSignInWithOAuth,
        handleSignOut,
        setCookies,
        getAuthSession,
        testSetCookiesServer,
    }
}