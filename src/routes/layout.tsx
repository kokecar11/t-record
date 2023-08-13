import { component$, Slot, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

import { supabase } from '~/core/supabase/supabase';

import { GlobalStore } from '~/core/context';
import { AuthSessionContext } from '~/auth/context/auth.context';
import { useAuth } from '~/auth/hooks/use-auth';
import { getColorPreference, useToggleTheme } from '~/toggle-theme/hooks/use-toggle-theme';

import { type NavMenuI } from '~/core/interfaces/menu';

import { Navbar } from '~/components/navbar/Navbar';
import { Footer } from '~/components/footer/Footer';
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar';
import Button from '~/components/button/Button';


export default component$(() => {
  const pathname = useLocation().url.pathname;

  const authSession = useContext(AuthSessionContext);
  const state = useContext(GlobalStore);

  const { setPreference } = useToggleTheme();
  const { updateAuthCookies, handleSignInWithOAuth, handleRefreshTokenTwitch } = useAuth();
  const navItems = useStore<NavMenuI>({
    navs:[
      {name:'Pricing', route:'/pricing'},
    ]
  }) ;


  useVisibleTask$ (async () => {
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session;
      authSession.value = currentUser ?? null;
    });
    await handleRefreshTokenTwitch();
    return () => {
      authListener?.unsubscribe();
    };
  });


  useVisibleTask$(async({track}) => {
    state.theme = getColorPreference();
    track( () => [state.theme, authSession.value])
    await updateAuthCookies(authSession.value);
    await handleRefreshTokenTwitch();
    setPreference(state.theme);
  });

  


  return(     
  <div class="bg-back dark:bg-back">
    <Navbar>
      <div q:slot='navLogo'>
      <Link href='/' class={"font-bold text-xl text-white flex place-items-center space-x-2"}>
          <img class="rounded-md" src='/images/logo.png' width={56} height={56} alt='Logo T-Record'/>
          <span>T-Record</span>
        </Link>
      </div>
      <div q:slot='navItemsStart' class={"flex flex-none items-center justify-center"}>
          {
            navItems.navs.map((navItem) => 
            <Link key={navItem.route} href={navItem.route} class={{'nav-link':true, 'active-nav-item': pathname.startsWith(navItem.route)}}>{navItem.name}</Link>
            )
          }
      </div>
      <div q:slot='navItemsEnd' class={"flex flex-none items-center justify-center space-x-2"}>            

        {
          authSession.value !== null ? 
          <AvatarNavbar 
          altText={authSession.value?.user.user_metadata.nickname}
          imageSrc={authSession.value?.user.user_metadata.avatar_url} />
          :
          <Button class={"btn-secondary"} onClick$={()=>handleSignInWithOAuth('twitch')}>Sign in with Twitch</Button> 
          }
      </div>
    </Navbar>
    <main class="text-white">
      <Slot />
    </main>
    <Footer />
    </div>);
});
