import { useSignal } from "@builder.io/qwik"
import { server$ } from "@builder.io/qwik-city"
import type { StatusLive, TwitchProvider } from "~/models"
import { supabase } from "~/supabase/supabase-browser"
import { cookieProvider } from "~/utilities"


export const useLiveStream = () => {
    const userProviderToken = useSignal('')

    const getStatusStream = server$( async function(){
        const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID
        const urlApiTwitch = 'https://api.twitch.tv/helix/streams'        
        const { data: users } = await supabase.from('users').select('provider_id')
        const providerId = users as { provider_id:string } []
        const providerToken: TwitchProvider = this.cookie.get(cookieProvider)!.json()
        
        const headers = {
            'Authorization':"Bearer " + providerToken.providerToken,
            'Client-Id': TWITCH_CLIENT_ID
        };
        
        const resp = await fetch(`${urlApiTwitch}?user_id=${providerId[0].provider_id}`, {
            headers
        });
        const { data } = (await resp.json()) as {data: {type:StatusLive}[]};
        
        if (data.length > 0){
          const live = {
            status: data[0].type
          };
          return live;
        }
        
        const status: StatusLive = 'offline';
        return {status};
      });
        

    return {
        getStatusStream,
        userProviderToken
    }
}