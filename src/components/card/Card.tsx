import { type QwikIntrinsicElements, Slot, component$, useStyles$, $} from "@builder.io/qwik";
// import { Link } from "@builder.io/qwik-city";

import { supabase } from "~/core/supabase/supabase";
import { useMenuDropdown } from "~/core/hooks/use-menu-dropdown";

import { type MenuDropdownOptions } from "~/core/interfaces/menu";

import { MenuDropdown } from "../menu-dropdown/Menu-dropdown";

import stylesCard from './Card.css?inline'

export type CardProps = QwikIntrinsicElements['div'] & {
    title?:string;
    content?: string;
    newItem?: boolean;
    streamDate: string | Date;
    idMarker ?: number;
}


export default component$(({title, content, idMarker, ...props}: CardProps) => {
    useStyles$(stylesCard);
    const { isVisibleMenuDropdown, showMenuDropdown } = useMenuDropdown();
    const deletMarker =  $( async () => {
        await supabase.from('MarkerTest')
        .delete()
        .eq('id', idMarker)
    })
    const menuOptions: MenuDropdownOptions[] = [
        // {name: 'Edit marker', action: testActionMenu},
        {name: 'Delete marker', action: deletMarker}
    ]
    // const stream = new Date(streamDate).toLocaleString().slice(0,9)
    
    return(
        <div class={`max-w-lg bg-slate-500 bg-opacity-30 dark:bg-slate-800 shadow-md rounded-lg overflow-hidden`}{...props}>
            <div class="p-4 relative">
                <div class="flex">
                    <Slot name="card-tag" />
                    {/* <p class="flex-none text-xs text-slate-900 text-opacity-90 dark:text-white mr-1 flex items-center align-middle">
                        <FeCalendar class="text-xl mr-1"/> {stream}
                    </p>
                    <Link class="flex-none rounded-sm hover:bg-slate-500 p-1 cursor-pointer" onClick$={showMenuDropdown}>
                        <FeElipsisH class="text-slate-900 text-xl dark:text-white" />
                    </Link> */}
                </div>
                <MenuDropdown isVisible={isVisibleMenuDropdown.value} onClose={showMenuDropdown} options={menuOptions}/>
                <div class="mt-2">
                    {
                        title ?
                            <h3 class="text-lg font-medium text-slate-900 dark:text-gray-800">{title}</h3> :
                            <h3 class="text-md font-medium text-slate-900 dark:text-gray-800">
                                <Slot name="card-title"/>
                            </h3>
                    }
                    {
                        content ? 
                            <p class="text-gray-500">{content}</p> :
                            <div class="mb-3 text-slate-900 text-opacity-70 text-sm dark:text-white dark:text-opacity-90">
                                <Slot name="card-content"/>
                                
                            </div>
                    }
                </div>
            </div>

            <div class="flex place-content-center px-4 pb-3">
                <Slot name="card-actions" />
            </div>

      </div>
    );

});