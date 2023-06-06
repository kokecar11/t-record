import type { User } from "supabase-auth-helpers-qwik";
import type { ProviderI } from "~/core/interfaces/provider";

export const markerStream = async (provider:ProviderI, user:User, markerDesc: string) => {
    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const urlApiTwitch = 'https://api.twitch.tv/helix/streams/markers';

    const headers = {
        'Authorization':"Bearer " + provider.provider_token,
        'Client-Id': TWITCH_CLIENT_ID
    };
  
    const respStream = await fetch(`${urlApiTwitch}?user_id=${user.user_metadata.provider_id}&description=${markerDesc}`, {
        method:'POST',
        headers
    });
    
    return await respStream.json();
}