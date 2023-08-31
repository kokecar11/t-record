import { component$, Slot, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { supabase } from '~/supabase/supabase-browser';

import { UserSessionContext, GlobalStore } from '~/context';
import { getColorPreference, useAuthUser, useToggleTheme } from '~/hooks';


import { Navbar } from '~/components/navbar/Navbar';
import { Footer } from '~/components/footer/Footer';
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar';
import Button from '~/components/button/Button';

import type { NavMenuI } from '~/models';


export default component$(() => {
  const pathname = useLocation().url.pathname;
  const { handleSignInWithOAuth } = useAuthUser();
  
  const userSession = useContext(UserSessionContext);
  const state = useContext(GlobalStore);

  const { setPreference } = useToggleTheme();
  const navItems = useStore<NavMenuI>({
    navs:[
      {name:'Pricing', route:'/pricing'},
    ]
  }) ;


  useVisibleTask$(async({track}) => {
    state.theme = getColorPreference();
    const {data , error } = await supabase.auth.getUser()
    
    if(data?.user?.id && !error){
      userSession.userId = data.user.id;
      userSession.isLoggedIn = true;
      userSession.providerId = data.user.user_metadata.provider_id
      userSession.nickname = data.user.user_metadata.nickname
      userSession.avatarUrl = data.user.user_metadata.avatar_url
      userSession.email = data.user.email
    }
    track( () => [state.theme])
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
          userSession.isLoggedIn ? 
          <AvatarNavbar 
          altText='avatar-user'
          imageSrc={userSession.avatarUrl} />
          :
          <Button class={"btn-secondary"} onClick$={ () => handleSignInWithOAuth('twitch')}>Sign in with Twitch</Button> 
          }
      </div>
    </Navbar>
    <main class="text-white">
      <Slot />
    </main>
    <Footer />
    </div>);
});
