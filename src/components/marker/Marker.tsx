import { type PropFunction, component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { Link, server$ } from "@builder.io/qwik-city";

import { useMenuDropdown } from "~/core/hooks/use-menu-dropdown";
import { validateMarker } from "~/marker/helper/validators";

import { supabase, type MarkerType } from "~/core/supabase/supabase";
import { type User } from "supabase-auth-helpers-qwik";
import { type ProviderI } from "~/core/interfaces/provider";
import { type MenuDropdownOptios } from "~/core/interfaces/menu";

import { FeCalendar, FeElipsisH, FeTimeline } from "../icons/icons";
import { MenuDropdown } from "../menu-dropdown/Menu-dropdown";
import { Tag } from "../tag/Tag";
import Button from "../button/Button";



export type MarkerProps = {
    onDelete: PropFunction<() => void>;
    marker: MarkerType,
    streamOfStatus: {
        type: string,
        title: string,
        isLoading: boolean
    },
}

export const setMarkerInStream = server$(async function(isStartMarker: boolean = true, markerId:number, markerTitle:string) {
    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const urlApiTwitch = 'https://api.twitch.tv/helix/streams/markers';
    
    const provider:ProviderI = this.cookie.get('_provider')!.json();
    const user:User = this.cookie.get('_user')!.json();

    const headers = {
        'Authorization':"Bearer " + provider.provider_token,
        'Client-Id': TWITCH_CLIENT_ID
    };
  
    const respStream = await fetch(`${urlApiTwitch}?user_id=${user.user_metadata.provider_id}&description=${markerTitle}`, {
        method:'POST',
        headers
    });
    
    const data = await respStream.json();
    const live = data.status;
    
    if (live !== 404){
      if(isStartMarker){
        const { data } = await supabase.from('MarkerTest')
        .update({ status: 'RECORDING' })
        .eq('fk_user', user.id)
        .eq('id', markerId).select()
        return { data }
      }else{
        const { data } = await supabase.from('MarkerTest')
        .update({ status: 'RECORDED' })
        .eq('fk_user', user.id)
        .eq('id', markerId).select()
        return { data }
      }
    }
    return {data}
});

export const setNotifyFinishMarkerInStream = server$(async function() {
    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const text = 'Probando las notificaciones';
    const extensionId = 'y86gonk0jk1yyvi8oda72xxzueqohx';
    const extensionVersion = '0.0.1';
    const provider:ProviderI = this.cookie.get('_provider')!.json();
    const user:User = this.cookie.get('_user')!.json();
    const urlApiTwitch = `https://api.twitch.tv/helix/extensions/chat?broadcaster_id=${user.user_metadata.provider_id}`;
    

    console.log(`${urlApiTwitch}&extension_id=${extensionId}&extension_version=${extensionVersion}&text=${text}`)
    const headers = {
        'Authorization':"Bearer " + provider.provider_token,
        'Client-Id': TWITCH_CLIENT_ID,
        'Content-Type': 'application/json' 
    };
    console.log(headers)
  
    const respStream = await fetch(`${urlApiTwitch}&extension_id=${extensionId}&extension_version=${extensionVersion}&text=${text}`, {
        method:'POST',
        headers
    });
    
    const data = await respStream.json();
    console.log(data)
})

interface BtnMarkerI {
    title: 'Start' | 'Finish'
    isInit: boolean
}

export const Marker = component$(({onDelete, marker, streamOfStatus}: MarkerProps) => {
    const btnMarker = useStore<BtnMarkerI>({
        title: 'Start',
        isInit: true
    })
    const streamDate = new Date(marker.stream_date).toISOString().slice(0,10);
    
    const { isVisibleMenuDropdown, showMenuDropdown } = useMenuDropdown();
    const menuOptions: MenuDropdownOptios[] = [
        {name: 'Delete marker', action: onDelete},
    ]

    const status: { [key: string]: any } = {
        RECORDED: 'success',
        RECORDING: 'warning',
        UNRECORDED: 'danger'
    }
    useVisibleTask$(({track})=>{
        track(()=>[btnMarker.isInit, btnMarker.title])
        if (marker.status === 'RECORDING'){ 
            btnMarker.title = 'Finish';
            btnMarker.isInit = false;
        }
    })

  return (
    <div class={`max-w-lg bg-slate-500 bg-opacity-30 dark:bg-slate-800 shadow-md rounded-lg overflow-hidden`}>
        <div class="p-4 relative">
            <div class="flex">
                <div class="flex-1">
                    <Tag text={marker.status} size='xs' variant={status[marker.status]} />
                </div>
                <p class="flex-none text-xs text-slate-900 text-opacity-90 dark:text-white mr-1 flex items-center align-middle">
                    <FeCalendar class="text-xl mr-1"/> {streamDate}
                </p>
                <Link class="flex-none rounded-sm hover:bg-slate-500 p-1 cursor-pointer transition duration-150 ease-in-out" onClick$={showMenuDropdown}>
                    <FeElipsisH class="text-slate-900 text-xl dark:text-white" />
                </Link>

            </div>
            <MenuDropdown isVisible={isVisibleMenuDropdown.value} onClose={showMenuDropdown} options={menuOptions}/>
            
            <div class="my-2 text-slate-900 text-opacity-70 text-sm dark:text-white dark:text-opacity-90">
                <div class="mt-4">
                    <h4 class="flex text-sm font-medium text-slate-900 dark:text-white"><FeTimeline class="text-xl mr-1 text-green-500" />Initial marker:</h4>
                    <p class="text-slate-900 dark:text-white capitalize ml-1 line-clamp-3">{marker.start_title}</p>
                </div>

                <div class="mt-4">
                    <h4 class="flex text-sm font-medium text-slate-900 dark:text-white"><FeTimeline class="text-xl mr-1 text-red-500" />Final marker:</h4>
                    <p class="text-slate-900 dark:text-white capitalize ml-1 line-clamp-3">{marker.end_title ? marker.end_title : `End -> ${marker.start_title}`}</p>
                </div>                            
            </div>
            
        </div>

        <div class="flex place-content-center px-4 pb-3">
            <Button class={`btn text-sm w-full btn-violet`}
                    onClick$={async () => { 
                        const desc = btnMarker.isInit ? marker.start_title : marker.end_title;
                        const response = await setMarkerInStream(btnMarker.isInit, marker.id, desc);
                        if (response.data.error){
                            streamOfStatus.type = 'offline'
                            streamOfStatus.title= 'Stream not live'
                        }
                        streamOfStatus.isLoading = true;
                        marker.status = response.data[0].status;
                        if (marker.status === 'RECORDING'){ 
                            btnMarker.title = 'Finish';
                            btnMarker.isInit = false;
                        }
                    }}
                  disabled={validateMarker(marker.status, streamOfStatus.type, marker.stream_date, btnMarker.isInit)}
                >
                    {btnMarker.title}
            </Button>

            <Button class={`btn text-sm w-full btn-violet`}
                    onClick$={async () => { 
                        await setNotifyFinishMarkerInStream()
                    }}
                >
                    notify
            </Button>
        </div>
    </div>
  );
});