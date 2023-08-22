import { type PropFunction, component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from "@builder.io/qwik-city";

import { setMarkerInStream } from '~/services';
import { validateMarker } from '~/utilities';

import type{ Live, MarkerType } from '~/models';

import { Tag } from "../tag/Tag";
import Button from "../button/Button";
import { Icon, IconCatalog } from '../icon/icon';



export type MarkerProps = {
    onDelete: PropFunction<() => void>;
    marker: MarkerType,
    live: Live,
}


interface BtnMarkerI {
    title: 'Start' | 'Finish'
    isInit: boolean
}

export const Marker = component$(({onDelete, marker, live}: MarkerProps) => {
    const btnMarker = useStore<BtnMarkerI>({
        title: 'Start',
        isInit: true
    })
    const streamDate = new Date(marker.stream_date).toISOString().slice(0,10);

    const toTimeString = (totalSeconds:number) => {
        const totalMs = totalSeconds * 1000;
        return new Date(totalMs).toISOString().slice(11, 19);
    }

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
    <div class={`max-w-2xl bg-white bg-opacity-20 dark:bg-accent shadow-lg rounded-lg overflow-hidden`}>
        <div class="p-4 relative">
            <div class="flex mb-2">
                <div class="flex-1 space-x-2">
                    <Tag text={marker.status} size='xs' variant={status[marker.status]} />
                    <Tag text={streamDate} size='xs' variant='secondary'/>
                </div>
                
                {/* <Link class="flex-none rounded-sm hover:bg-slate-500 p-1 cursor-pointer transition duration-150 ease-in-out" onClick$={showMenuDropdown}>
                    <FePencil class="text-accent text-xl dark:text-white" />
                </Link> */}
                <Link class="flex-none rounded-lg hover:bg-primary p-1 cursor-pointer transition duration-150 ease-in-out" onClick$={onDelete}>
                    <Icon name={IconCatalog.feTrash} class="text-accent text-xl dark:text-white" />
                </Link>
            </div>
            {/* <MenuDropdown isVisible={isVisibleMenuDropdown.value} onClose={showMenuDropdown} options={menuOptions}/> */}
            
            <h2 class="text-accent dark:text-white capitalize font-bold text-lg">{marker.title}</h2>

            
            <div class="my-2 text-accent text-sm dark:text-white dark:text-opacity-90">
                <div class="mt-4">
                    <span class="flex text-sm text-accent dark:text-white dark:text-opacity-70">{`Starts at ${toTimeString(marker.starts_at)}`}</span>
                </div>

                <div class="mt-4">
                    <span class="flex text-sm text-accent dark:text-white dark:text-opacity-70">{`Ends at ${toTimeString(marker.ends_at)}`}</span>
                </div>                            
            </div>
            
        </div>

        <div class="flex place-content-center px-4 pb-3">
            <Button class={`w-full text-sm ${btnMarker.isInit ? 'btn-primary': 'btn-live'}`}
                    onClick$={async () => { 
                        const desc = marker.title;
                        const response = await setMarkerInStream(btnMarker.isInit, marker.id, desc);
                        if (response.data.error){
                            live.status = 'offline'
                        }
                        live.isLoading = true;
                        marker.status = response.data[0].status;
                        if (marker.status === 'RECORDING'){ 
                            btnMarker.title = 'Finish';
                            btnMarker.isInit = false;
                        }
                    }}
                  disabled={validateMarker(marker.status, live, marker.stream_date, btnMarker.isInit)}
                >
                    {btnMarker.title}
            </Button>
        </div>
    </div>
  );
});