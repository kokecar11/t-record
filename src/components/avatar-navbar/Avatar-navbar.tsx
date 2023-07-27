import { $, component$, useOnDocument, useSignal, useStyles$ } from '@builder.io/qwik';
import { useAuth } from '~/auth/hooks/use-auth';

import { MenuDropdown } from '../menu-dropdown/Menu-dropdown';

import stylesAvatarNavbar from './Avatar-navbar.css?inline'
import { type MenuDropdownOptions } from '~/core/interfaces/menu';
import { useMenuDropdown } from '~/core/hooks/use-menu-dropdown';
import { IconCatalog } from '../icon/icon';

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
    const menuOptions: MenuDropdownOptions[] = [
      {name: 'Feature Request', icon: IconCatalog.feMagic, route: 'https://t-record.canny.io/feature-requests'},
      {name: 'RoadMap', icon: IconCatalog.feSiteMap, route: 'https://t-record.canny.io/'},
      {name: 'Sign Out', icon:IconCatalog.feLogout, action: handleSignOut},
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
          </div>
          <MenuDropdown  onClose={showMenuDropdown} isVisible={isOpenDropdown.value} options={menuOptions}/>
        </div>
    )
})