import { component$, Slot, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';

import { type NavMenuI } from '~/core/interfaces/menu';

import { supabase } from '~/core/supabase/supabase';
import { GlobalStore } from '~/core/context';
import { AuthSessionContext } from '~/auth/context/auth.context';
import { useAuth } from '~/auth/hooks/use-auth';
import { getColorPreference, useToggleTheme } from '~/toggle-theme/hooks/use-toggle-theme';

import { Navbar } from '~/components/navbar/Navbar';
import Button from '~/components/button/Button';
import { Footer } from '~/components/footer/Footer';
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar';
import { IcOutlineDarkMode, IcOutlineLightMode } from '~/components/icons/icons';



export default component$(() => {
  const pathname = useLocation().url.pathname;
  const nav = useNavigate();

  const authSession = useContext(AuthSessionContext);
  const state = useContext(GlobalStore);

  const { setPreference, handleTheme } = useToggleTheme();
  const { updateAuthCookies } = useAuth();
  const navItems = useStore<NavMenuI>({
    navs:[]
  }) ;


  useVisibleTask$ (async () => {
    state.theme = getColorPreference();
    setPreference(state.theme);
    supabase.auth.getSession().then(({ data : { session } }) => {
      authSession.value = session ?? null;
    });
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const currentUser = session;
      authSession.value = currentUser ?? null;
    });

    return () => {
      authListener?.unsubscribe();
    };
  });


  useVisibleTask$(async({track}) => {
    track( () => [state.theme, authSession.value])
    await updateAuthCookies(authSession.value)
    setPreference(state.theme);
  });




  return(     
  <div class="bg-white dark:bg-slate-900">
    <Navbar>
      <div q:slot='navLogo' class={""}>
        <Link href='/' class={"font-bold text-lg text-violet-900 dark:text-white"}>T-Record 🟣</Link>
      </div>
      <div q:slot='navItemsStart' class={"flex flex-none items-center justify-center"}>
          {
            navItems.navs.map( (navItem) => 
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
              state.theme === 'light' ? <IcOutlineDarkMode class="text-violet-900 text-2xl" /> : <IcOutlineLightMode class="text-white text-2xl" />
            }
          </span>
        </button>       
      </div>
    </Navbar>
    <main class={"dark:bg-slate-900 bg-white h-screen"}>
      <Slot />
    </main>
    <Footer></Footer>
    </div>);
});
