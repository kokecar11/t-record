import { type PropFunction, $, component$, useOnDocument, useStyles$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styleMenuDropdown from "./Menu-dropdown.css?inline"
import { Icon, type IconCatalog } from "../icon/icon";
import { Tag, TagSize, TagVariant } from "../tag/Tag";
import { type Plan } from "@prisma/client";
import { getSubcriptionByUser } from "~/services";
import { useAuthSession } from "~/routes/plugin@auth";
import { useMenuDropdown } from "./hooks/use-menu-dropdown";

export interface MenuDropdownProps {
    options: MenuDropdownOptions[],
    isVisible: boolean,
}

export interface MenuDropdownOptions {
    name: string
    route?: string
    icon?: IconCatalog
    action?: PropFunction<() => void> | PropFunction
    target?: '_blank' | '_parent' | '_top' | '_self'
    plan?: boolean
    disabled?: boolean
}

export const MenuDropdown = component$( ({options, isVisible}:MenuDropdownProps) => {
    useStyles$(styleMenuDropdown)
    const session = useAuthSession()
    const { showMenuDropdown } = useMenuDropdown()
    useOnDocument('keydown', $((event)=>{
        const key = event as KeyboardEvent
        if(key.code === 'Escape' && isVisible) showMenuDropdown
    }));
    const subscriptionUser = useSignal<Plan>()
    useTask$(async () => {
        subscriptionUser.value = await getSubcriptionByUser(session.value?.userId as string)
    })
    return (
        <div class={`menu ${isVisible ? 'block':'hidden'} transition duration-300 ease-in-out`} id='wrapper-menu-dropdown' >
            {options.map(( opt ) => (
                opt.action ? 
                <Link class="menu-option" key={opt.name} onClick$={opt.action}> 
                    {opt.icon && <Icon class="text-lg mr-1" name={opt.icon}></Icon>} 
                    {opt.name} 
                    {opt.plan && (subscriptionUser.value?.type === 'STARTER') ? <Tag variant={TagVariant.pro} size={TagSize.xs} text='PRO' /> : <></>}
                </Link> : 
                <Link class="menu-option" key={opt.name} href={opt.plan && (subscriptionUser.value?.type === 'STARTER') ? '/billing' : opt.route } target={opt.target ? opt.target : '_self' }>
                    {opt.icon && <Icon class="text-lg mr-1" name={opt.icon}></Icon>}
                    <span class='mr-1'>{opt.name}</span>
                    {opt.plan && (subscriptionUser.value?.type === 'STARTER') ? <Tag variant={TagVariant.pro} classNames="justify-end" size={TagSize.xs} text='PRO' /> : <></>}
                </Link>
            ))}
        </div>
    );
});