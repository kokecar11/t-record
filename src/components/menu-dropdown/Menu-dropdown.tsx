import { type PropFunction, $, component$, useOnDocument, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { MenuDropdownOptios } from "~/core/interfaces/menu";
import styleMenuDropdown from "./Menu-dropdown.css?inline"

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
                <Link class="menu-option" key={opt.name} onClick$={opt.action}>{opt.name}</Link> : 
                <Link class="menu-option" key={opt.name} href={opt.route}>{opt.name}</Link>
            ))}
        </div>
    );
});