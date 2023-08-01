import { $, component$, useOnDocument, useSignal, useStyles$ } from '@builder.io/qwik';

import { useAuth } from '~/auth/hooks/use-auth';
import { useMenuDropdown } from '../menu-dropdown/hooks/use-menu-dropdown';

import { MenuDropdown, type MenuDropdownOptions } from '../menu-dropdown/Menu-dropdown';
import { IconCatalog } from '../icon/icon';



import stylesAvatarNavbar from './Avatar-navbar.css?inline'

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
      {name: 'Dashboard', icon: IconCatalog.feBarChart, route: '/dashboard'},
      {name: 'Pricing', icon: IconCatalog.feMoney, route: '/pricing'},
      {name: 'Feature Request', icon: IconCatalog.feMagic, route: 'https://t-record.canny.io/feature-requests', target:'_blank'},
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