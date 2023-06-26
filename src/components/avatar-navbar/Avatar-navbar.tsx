import { $, component$, useOnDocument, useSignal, useStyles$ } from '@builder.io/qwik';
import { useAuth } from '~/auth/hooks/use-auth';

import { MenuDropdown } from '../menu-dropdown/Menu-dropdown';

import stylesAvatarNavbar from './Avatar-navbar.css?inline'
import { type MenuDropdownOptios } from '~/core/interfaces/menu';
import { useMenuDropdown } from '~/core/hooks/use-menu-dropdown';

export type ToggleAvatarProps = {
    imageSrc?: string;
    altText: string;
}

export default component$( ({imageSrc, altText}:ToggleAvatarProps) => {
    useStyles$(stylesAvatarNavbar);

    const isOpenDropdown = useSignal(false);
    const onCloseDropdown = $( () => !isOpenDropdown.value)
    const { handleSignOut }= useAuth();
    const { showMenuDropdown } = useMenuDropdown()
    const menuOptions: MenuDropdownOptios[] = [
      {name: 'Sign Out', action: handleSignOut},
  ]
    useOnDocument('keyup', $((event)=>{
      const key = event as KeyboardEvent
      if(key.code === 'Escape') onCloseDropdown()
    }));
    
    return (
        <div class="relative">
          <div class="avatar-navbar-new">
          <img
            onClick$={() => isOpenDropdown.value = !isOpenDropdown.value}
                width="40"
                height="40"
                class="w-10 h-10 rounded-full cursor-pointer"
                src={imageSrc}
                alt={altText}
              />
            {/* <button class="flex items-center text-sm" onClick$={() => isOpenDropdown.value = !isOpenDropdown.value}>

            </button> */}
          </div>
          <MenuDropdown  onClose={showMenuDropdown} isVisible={isOpenDropdown.value} options={menuOptions}/>
        </div>
    )
})