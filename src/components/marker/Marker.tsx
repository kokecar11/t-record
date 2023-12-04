import { type PropFunction, component$, useStore, useVisibleTask$ } from '@builder.io/qwik'
import { format } from 'date-fns'

import { useAuthSession } from '~/routes/plugin@auth'
import { setMarkerInStream } from '~/services'
import { validateMarker } from '~/utilities'

import type { Live } from '~/models'

import { Tag, TagSize, TagVariant } from '../tag/Tag'
import Button, { ButtonSize, ButtonVariant } from '../button/Button'
import { Icon, IconCatalog } from '../icon/icon'
import { useMenuDropdown } from '../menu-dropdown/hooks/use-menu-dropdown'
import { MenuDropdown, type  MenuDropdownOptions } from '../menu-dropdown/Menu-dropdown'
import { type Marker  as MarkerType} from '@prisma/client'


export type MarkerProps = {
    onDelete?: PropFunction<() => void>;
    marker: MarkerType,
    live: Live,
}

interface BtnMarkerI {
    title: 'Start' | 'Finish'
    isInit: boolean
}

export const Marker = component$(({marker, live}: MarkerProps) => {
    const session = useAuthSession()
    const {isVisibleMenuDropdown, showMenuDropdown} = useMenuDropdown()
    const btnMarker = useStore<BtnMarkerI>({
        title: 'Start',
        isInit: true
    })
    const streamDate = format(new Date(marker.stream_date), "yyyy-MM-dd")

    const toTimeString = (totalSeconds:number) => {
        const totalMs = totalSeconds * 1000;
        return new Date(totalMs).toISOString().slice(11, 19)
    }    
    
    const formatSecondsToTime = (seconds:number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}h${minutes}m${remainingSeconds}s`
    }
    
    const linkToHighlightTwitch = () => `https://dashboard.twitch.tv/u/${session.value?.user?.name?.toLowerCase()}/content/video-producer/highlighter/${marker.videoIdStream}?t=${formatSecondsToTime(marker.starts_at as number)}`
    
    const status: { [key: string]: any } = {
        RECORDED: 'success',
        RECORDING: 'warning',
        UNRECORDED: TagVariant.danger
    }
    const markerMenuOptions: MenuDropdownOptions[] = [
        {name: 'Go to VOD', icon: IconCatalog.feLinkExternal, route: linkToHighlightTwitch(), target:'_blank', plan:true},
        // {name: 'Delete', icon:IconCatalog.feTrash}
    ]
    useVisibleTask$(({track})=>{
        track(()=>[btnMarker.isInit, btnMarker.title])
        if (marker.status === 'RECORDING'){ 
            btnMarker.title = 'Finish'
            btnMarker.isInit = false
        }
    })

    return (
    <div class={`max-w-2xl bg-primary shadow-lg rounded-lg overflow-hidden`}>
        <div class="p-4 relative">
            <div class="flex mb-2">
                <div class="flex-1 space-x-2">
                    <Tag text={marker.status} size={TagSize.xs} variant={status[marker.status]} />
                    <Tag text={streamDate} size={TagSize.xs}/>
                </div>
                
                <Button variant={ButtonVariant.ghost} onClick$={showMenuDropdown} isOnlyIcon> 
                    <Icon name={IconCatalog.feElipsisH} class='text-xl' /> 
                </Button>
            </div>
                <MenuDropdown isVisible={isVisibleMenuDropdown.value} onClose={showMenuDropdown} options={markerMenuOptions}/>
            
            <h2 class="text-white capitalize font-bold text-lg">{marker.title}</h2>

            
            <div class="my-2 text-sm text-white text-opacity-90">
                <div class="mt-4">
                    <span class="flex text-sm text-white dark:text-opacity-70">{`Starts at ${toTimeString(marker.starts_at as number)}`}</span>
                </div>

                <div class="mt-4">
                    <span class="flex text-sm text-white text-opacity-70">{`Ends at ${toTimeString(marker.ends_at as number)}`}</span>
                </div>                            
            </div>
            
        </div>

        <div class="flex place-content-center px-4 pb-3">
            <Button variant={ButtonVariant.secondary} isFullWidth size={ButtonSize.sm}
                    onClick$={async () => { 
                        const response = await setMarkerInStream(btnMarker.isInit, marker, session.value?.userId as string)
                        live.isLoading = true
                        if(response.markerUpdated){
                            marker.status = response.markerUpdated?.status
                            if (response.markerUpdated?.status === 'RECORDING'){ 
                                btnMarker.title = 'Finish'
                                btnMarker.isInit = false
                            }
                        }
                        
                    }}
                    disabled={validateMarker(marker.status, live, marker.stream_date, btnMarker.isInit)}
                >
                    {btnMarker.title}
            </Button>
        </div>
    </div>
    )
})