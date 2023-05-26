import { component$, Slot, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city';

import { GlobalStore } from '~/core/context';
import { AuthSessionContext } from '~/auth/context/auth.context';

import { getColorPreference, useToggleTheme } from '~/toggle-theme/hooks/use-toggle-theme';

import { Navbar } from '~/components/navbar/Navbar';
import { IcOutlineDarkMode, IcOutlineLightMode } from '~/components/icons/icons';
import Button from '~/components/button/Button';
import { Footer } from '~/components/footer/Footer';
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar';
import {type NavItemsMenuI } from '~/core/interfaces/menu';
import { useAuth } from '~/auth/hooks/use-auth';


export const useCheckAuth = routeLoader$(({cookie, redirect}) => {
  const authCookie = cookie.get('user_provider_token');
  if (authCookie){
    return;
  }
  redirect(302,'/login')
})

export default component$(() => {
  const pathname = useLocation().url.pathname;
  const nav = useNavigate();

  const siteState = useContext(GlobalStore);
  const authSession = useContext(AuthSessionContext)

  const {setPreference, handleTheme} = useToggleTheme();
  const { getAuthSession } = useAuth()
  const navItems: NavItemsMenuI[] = [
    {name: 'Dashboard', route:'/dashboard/'},
  ]
  useVisibleTask$(async () => {
    siteState.theme = getColorPreference();
    setPreference(siteState.theme);
    authSession.value = await getAuthSession();
  });

  useVisibleTask$(async ({track}) => {
    track( () => [siteState.theme, authSession.value])
    setPreference(siteState.theme);
    // authSession.value = await getAuthSession();
  });

  return(     
  <div class="bg-white dark:bg-slate-900">
    <Navbar>
      <div q:slot='navLogo' class={""}>
        <Link href='/' class={"font-bold text-lg text-violet-900 dark:text-white"}>T-Record 🟣</Link>
      </div>
      <div q:slot='navItemsStart' class={"flex flex-none items-center justify-center"}>
          {
            navItems.map( (navItem) => 
            <Link key={navItem.route} href={navItem.route} class={{'nav-link':true, 'active-nav-item': pathname.startsWith(navItem.route)}}>{navItem.name}</Link>
            )
          }
      </div>
      <div q:slot='navItemsEnd' class={"flex flex-none items-center justify-center"}>
        {authSession.value !== null ? 
          <AvatarNavbar altText={authSession.value?.user.user_metadata.nickname} imageSrc={authSession.value?.user.user_metadata.avatar_url}>
            <div q:slot='avatar-options'>
            </div>
          </AvatarNavbar>
        :<Button class={"btn-violet"} onClick$={()=> nav('/login')}>Comenzar</Button>}

        <button class={"mx-2"} onClick$={handleTheme}>
          <span class="p-2">
            {
              siteState.theme === 'light' ? <IcOutlineDarkMode class="text-violet-900 text-2xl" /> : <IcOutlineLightMode class="text-white text-2xl" />
            }
          </span>
        </button>       
      </div>
    </Navbar>
    <main class={"dark:bg-slate-900 bg-white"}>
      <Slot />
    </main>
    <Footer></Footer>
    </div>);
});
