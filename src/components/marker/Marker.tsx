import {type PropFunction, component$ } from "@builder.io/qwik";
import { Link, server$ } from "@builder.io/qwik-city";

import { useMenuDropdown } from "~/core/hooks/use-menu-dropdown";
import { validateInitMarker } from "~/marker/helper/validators";

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

export const Marker = component$(({onDelete, marker, streamOfStatus}: MarkerProps) => {
    const streamDate = new Date(marker.stream_date).toLocaleString().slice(0,9);

    const { isVisibleMenuDropdown, showMenuDropdown } = useMenuDropdown();
    const menuOptions: MenuDropdownOptios[] = [
        {name: 'Delete marker', action: onDelete}
    ]

    const status: { [key: string]: any } = {
        RECORDED: 'success',
        RECORDING: 'warning',
        UNRECORDED: 'danger'
    }

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
                <Link class="flex-none rounded-sm hover:bg-slate-500 p-1 cursor-pointer" onClick$={showMenuDropdown}>
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
            <Button class="btn btn-violet text-sm" 
                    onClick$={async () => { 
                        const t_m = await setMarkerInStream(true, marker.id ,marker.start_title)
                        if (t_m.data.error){
                            streamOfStatus.type = 'offline'
                            streamOfStatus.title= 'Stream not live'
                        }
                        streamOfStatus.isLoading = true;
                        marker.status = t_m.data[0].status;

                    }}
                  disabled={validateInitMarker(marker.status, streamOfStatus.type, marker.stream_date, true)}
                >
                    Start
            </Button>

            <Button class="btn btn-slate text-sm" 
                onClick$={async () => { 
                    const t_m = await setMarkerInStream(false, marker.id, marker.end_title)
                    if (t_m.data.error){
                        streamOfStatus.type = 'offline'
                        streamOfStatus.title= 'Stream not live'
                    }
                    streamOfStatus.isLoading = true;
                    marker.status = t_m.data[0].status;
                }}
                disabled={validateInitMarker(marker.status, streamOfStatus.type, marker.stream_date, false)}
                >
                    Finish
            </Button>
        </div>
        

    </div>
  );
});