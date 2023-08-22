import { server$ } from "@builder.io/qwik-city";
import type { User } from "supabase-auth-helpers-qwik";
import type{ MarkerType, TwitchProvider, UserSession } from "~/models";
import { supabase } from "~/supabase/supabase-browser";


export const getMarkers = server$(async (fkUser:string, orderBy:any, orderMarkerByStatus:any) => {
    
    const { data, error } = await supabase.from('task')
    .select('*')
    .eq('fk_user', fkUser)
    .in('status', orderMarkerByStatus.byStatus)
    .order(orderBy, {ascending:false})

    if (error){
        return [];
    }else{
        return [...data] as MarkerType[];
    }
});

export const deleteMarker = server$(async (idMarker:number) => {
    await supabase.from('task')
    .delete()
    .eq('id', idMarker)
});

export const markerInStream = server$(async (provider:TwitchProvider, user:User, markerDesc: string) => {
    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const urlApiTwitch = 'https://api.twitch.tv/helix/streams/markers';

    const headers = {
        'Authorization':"Bearer " + provider.providerToken,
        'Client-Id': TWITCH_CLIENT_ID
    };
  
    const respStream = await fetch(`${urlApiTwitch}?user_id=${user.user_metadata.provider_id}&description=${markerDesc}`, {
        method:'POST',
        headers
    });
    
    return await respStream.json();
});

export const setMarkerInStream = server$(async function(isStartMarker: boolean = true, markerId:number, markerTitle:string) {
    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const urlApiTwitch = 'https://api.twitch.tv/helix/streams/markers';
    
    const provider:TwitchProvider = this.cookie.get('_provider')!.json();
    const user:UserSession = this.cookie.get('_user')!.json();

    const headers = {
        'Authorization':"Bearer " + provider.providerToken,
        'Client-Id': TWITCH_CLIENT_ID
    };
  
    const respStream = await fetch(`${urlApiTwitch}?user_id=${user.providerId}&description=${markerTitle}`, {
        method:'POST',
        headers
    });
    
    const data = await respStream.json();
    const live = data.status;
    
    const position_seconds = data.data[0].position_seconds;
    if (live !== 404){
      if(isStartMarker){
        const { data } = await supabase.from('task')
        .update({ status: 'RECORDING', starts_at: position_seconds })
        .eq('fk_user', user.userId)
        .eq('id', markerId).select()
        return { data }
      }else{
        const { data } = await supabase.from('task')
        .update({ status: 'RECORDED', ends_at: position_seconds })
        .eq('fk_user', user.userId)
        .eq('id', markerId).select()
        return { data }
      }
    }
    return {data}
});
