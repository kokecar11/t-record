import { useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { type User } from "supabase-auth-helpers-qwik";
import { type StatusLive } from "../context/live.context";

// const PUBLIC_TWITCH_CLIENT_ID = import.meta.env.PUBLIC_TWITCH_CLIENT_ID;

export const useLiveStream = () => {
    const userProviderToken = useSignal('');

    const getStatusStream = server$( async function(){
        const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
        const urlApiTwitch = 'https://api.twitch.tv/helix/streams';
        const providerToken: { provider_token:string, provider_refresh_token:string } = this.cookie.get('_provider')!.json();
        const user:User = this.cookie.get('_user')!.json();
        const headers = {
            'Authorization':"Bearer " + providerToken.provider_token,
            'Client-Id': TWITCH_CLIENT_ID
        };
        const resp = await fetch(`${urlApiTwitch}?user_id=${user.user_metadata.provider_id}`, {
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