import { type PropFunction, $, component$, useOnDocument, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { MenuDropdownOptios } from "~/core/interfaces/menu";
import styleMenuDropdown from "./Menu-dropdown.css?inline"
import { Icon } from "../icon/icon";
// import { FeLogout, FeMagic, FeMoon, FeSunnyO } from "../icons/icons";

export interface MenuDropdownProps {
    options: MenuDropdownOptios[],
    isVisible: boolean,
    onClose: PropFunction<() => boolean >
}


export const MenuDropdown = component$( ({options, isVisible, onClose}:MenuDropdownProps) => {
    useStyles$(styleMenuDropdown);

    useOnDocument('keydown', $((event)=>{
        const key = event as KeyboardEvent
        if(key.code === 'Escape' && isVisible) onClose()
    }));

    return (
        <div class={`menu ${isVisible ? 'block':'hidden'} transition duration-300 ease-in-out`} id='wrapper-menu-dropdown' onClick$={onClose} >
            {options.map(( opt ) => (
                opt.action ? 
                <Link class="menu-option" key={opt.name} onClick$={opt.action}> {opt.icon && <Icon class="text-lg mr-1" name={opt.icon}></Icon>} {opt.name}</Link> : 
                <Link class="menu-option " key={opt.name} href={opt.route}>{opt.icon && <Icon class="text-lg mr-1" name={opt.icon}></Icon>}  {opt.name}</Link>
            ))}
        </div>
    );
});