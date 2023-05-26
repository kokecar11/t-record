import { $, useSignal } from "@builder.io/qwik";

const PUBLIC_TWITCH_CLIENT_ID = import.meta.env.PUBLIC_TWITCH_CLIENT_ID;

export const useStatusStream = () => {
    const userProviderToken = useSignal('');
    // const urlApiTwitch = 'https://api.twitch.tv/helix/streams/key'
    // const urlApiTwitch = 'https://api.twitch.tv/helix/channels'
    const urlApiTwitch = 'https://api.twitch.tv/helix/streams'
    const getStatusStream = $( async(provider_token: string)=>{

        const headers = {
            'Authorization':"Bearer " + provider_token,
            'Client-Id': PUBLIC_TWITCH_CLIENT_ID
        };
        // const resp = await fetch(`${urlApiTwitch}?broadcaster_id=827109068&description=markertest2`, {
        //     headers
        // });
        const resp = await fetch(`${urlApiTwitch}?user_id=827109068`, {
            headers
        });
        const data = resp.json();
        return data
    })

    return {
        getStatusStream,
        userProviderToken
    }
}