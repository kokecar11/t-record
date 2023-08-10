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
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.25534 5.04837L12.9014 0H26.2235V11.7795H35.619V30.0097L31.4121 35.3386H0V17.1084L4.20697 11.7795H9.25534V5.04837Z" fill="#9147FF"/>
            <path d="M15.1451 1.6828H24.494V14.8647L19.8196 20.8946L15.1451 14.8647V1.6828Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.88977 13.4623H12.9014V14.8646C12.9014 15.3623 13.0669 15.8459 13.3718 16.2393L18.0462 22.2693C18.4712 22.8175 19.1259 23.1384 19.8195 23.1384C20.5132 23.1384 21.1678 22.8175 21.5928 22.2693L26.2672 16.2393C26.5722 15.8459 26.7377 15.3623 26.7377 14.8646V13.4623H33.9363V28.0465H5.88977V13.4623Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6209 25.5223V20.7544H14.8646V25.5223H12.6209Z" fill="#9147FF"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M25.8027 25.5223V20.7544H28.0465V25.5223H25.8027Z" fill="#9147FF"/>
          </svg>
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
