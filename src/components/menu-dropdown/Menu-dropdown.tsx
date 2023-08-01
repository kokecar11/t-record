import { type PropFunction, $, component$, useOnDocument, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styleMenuDropdown from "./Menu-dropdown.css?inline"
import { Icon, type IconCatalog } from "../icon/icon";

export interface MenuDropdownProps {
    options: MenuDropdownOptions[],
    isVisible: boolean,
    onClose: PropFunction<() => boolean >
}

export interface MenuDropdownOptions {
    name: string;
    route?: string;
    icon?: IconCatalog;
    action?: PropFunction<() => void>
    target?: '_blank' | '_parent' | '_top' | '_self'
}

export const MenuDropdown = component$( ({options, isVisible, onClose}:MenuDropdownProps) => {
    useStyles$(styleMenuDropdown);

    useOnDocument('keydown', $((event)=>{
        const key = event as KeyboardEvent
        if(key.code === 'Escape' && isVisible) onClose()
    }));

    return (
        <div class={`menu ${isVisible ? 'block':'hidden'} transition duration-300 ease-in-out`} id='wrapper-menu-dropdown' >
            {options.map(( opt ) => (
                opt.action ? 
                <Link class="menu-option" key={opt.name} onClick$={opt.action}> {opt.icon && <Icon class="text-lg mr-1" name={opt.icon}></Icon>} {opt.name}</Link> : 
                <Link class="menu-option" key={opt.name} href={opt.route} target={opt.target ? opt.target : '_self' }>{opt.icon && <Icon class="text-lg mr-1" name={opt.icon}></Icon>}  {opt.name}</Link>
            ))}
        </div>
    );
});