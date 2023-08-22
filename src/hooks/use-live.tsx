import { useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import type { UserSession, StatusLive, TwitchProvider } from "~/models";


export const useLiveStream = () => {
    const userProviderToken = useSignal('');

    const getStatusStream = server$( async function(){
        const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
        const urlApiTwitch = 'https://api.twitch.tv/helix/streams';
        const providerToken: TwitchProvider = this.cookie.get('_provider')!.json();
        const userSession: UserSession = this.cookie.get('_user')!.json();
        const headers = {
            'Authorization':"Bearer " + providerToken.providerToken,
            'Client-Id': TWITCH_CLIENT_ID
        };
        const resp = await fetch(`${urlApiTwitch}?user_id=${userSession.providerId}`, {
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