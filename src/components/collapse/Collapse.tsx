import { component$, useTask$ } from "@builder.io/qwik";
import { Icon, IconCatalog } from "../icon/icon";
import { Link } from "@builder.io/qwik-city";
import { useCollapse } from "./hooks/use-collapse";

export interface CollapseProps {
    title: string
    description: string
    isOpen?: boolean
}

export const Collapse = component$(({title, description, isOpen}:CollapseProps) => {
    const {isOpenCollapse, showCollapse} = useCollapse();
    useTask$(() => {
        if(isOpen) isOpenCollapse.value = true;
    })
    return (
        <div class="cursor-pointer border border-secondary border-opacity-30 bg-accent max-w-full p-4 rounded-lg hover:bg-opacity-50 focus:bg-opacity-50" onClick$={showCollapse}>
            <div class="text-left text-2xl font-bold flex">
                <span class="flex-1">{title}</span>
                <Link class="flex-none rounded-lg hover:bg-primary p-1 cursor-pointer transition duration-150 ease-in-out">
                    <Icon name={IconCatalog.feArrowDown} class={`flex-none ${isOpenCollapse.value ? 'rotate-180 transition-all animate-duration-300 delay-75': 'rotate-0 transition-all animate-duration-300 delay-75'}`} />
                </Link>
            </div>
            <div class={`${isOpenCollapse.value ? 'block':'hidden'} mt-1 p-3 text-left`}>
                <p class="transition-all animate-duration-500 animate-fade-down">{description}</p>
            </div>
        </div>
    );
});