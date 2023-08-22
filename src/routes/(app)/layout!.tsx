import { component$, Slot, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';

import { supabase } from '~/supabase/supabase-browser';
import { 
  UserSessionContext,
  TwitchProviderContext,
  SubscriptionUserContext,
  GlobalStore } from '~/context';

import { getSubscriptionByUser } from '~/services';
import { getColorPreference, useToggleTheme, useAuthUser } from '~/hooks';
import type { NavMenuI } from '~/models';

import { Navbar } from '~/components/navbar/Navbar';
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar';
import { FooterTag } from '~/components/footer-tag/Footer-tag';
import { Live } from '~/components/live/Live';
import Button from '~/components/button/Button';
import { Icon, IconCatalog } from '~/components/icon/icon';
import { Tag } from '~/components/tag/Tag';


export default component$(() => {
  const pathname = useLocation().url.pathname;
  const nav = useNavigate()

  const userSession = useContext(UserSessionContext);
  const twitchProvider = useContext(TwitchProviderContext);
  const subscriptionUser = useContext(SubscriptionUserContext);
  const state = useContext(GlobalStore);

  const { setPreference } = useToggleTheme();
  const { handleRefreshTokenTwitch } = useAuthUser();
  const navItems = useStore<NavMenuI>({
    navs:[]
  }) ;
  
  
  useVisibleTask$(async({track}) => {
    state.theme = getColorPreference();
    setPreference(state.theme);
    const {data , error } = await supabase.auth.getSession();
    if(data.session?.user?.id && !error){
      const user = data.session?.user;
      userSession.userId = user.id;
      userSession.isLoggedIn = true;
      userSession.providerId = user.user_metadata.provider_id;
      userSession.nickname = user.user_metadata.nickname;
      userSession.avatarUrl = user.user_metadata.avatar_url;
      twitchProvider.providerToken = data.session?.provider_token || '';
      twitchProvider.providerRefreshToken = data.session?.provider_refresh_token || '';
    }else{
      userSession.userId = "";
      userSession.isLoggedIn = false;
      userSession.avatarUrl = "";
      userSession.nickname = "";
      userSession.providerId = "";
      twitchProvider.providerToken = '';
      twitchProvider.providerRefreshToken = ''
    }
    
    await handleRefreshTokenTwitch(); 
    const syb = await getSubscriptionByUser(userSession.userId);
    if (syb){
      subscriptionUser.status = syb.status
      subscriptionUser.plan = syb.plan
    }
    track(() => [state.theme, userSession, twitchProvider, subscriptionUser]);
  });
  

  return(     
  <div class="bg-back dark:bg-back">
    <Navbar>
      <div q:slot='navLogo'>
        <Link href='/' class={"font-bold text-xl text-accent dark:text-white flex place-items-center space-x-2"}>

          <img class="rounded-md" src='/images/logo.png' width={56} height={56} alt='Logo T-Record'/>
          <span>T-Record</span>
        </Link>
      </div>
      <div q:slot='navItemsStart' class={"flex flex-none items-center justify-center"}>
          {
            navItems.navs.map( (navItem) => 
            <Link key={navItem.route} href={navItem.route} class={{'nav-link':true, 'active-nav-item': pathname.startsWith(navItem.route)}}>{navItem.name}</Link>
            )
          }
      </div>
      <div q:slot='navItemsEnd' class={"flex flex-none items-center justify-center space-x-3"}>
        {
          subscriptionUser.plan === 'STARTER' ? <Button class="btn-outlined-secondary flex items-center justify-center w-full md:w-auto shadow-lg" onClick$={() => nav('/pricing')}> <Icon name={IconCatalog.feBolt} class="mr-1" />Upgrade now</Button> :
          (<Tag variant={subscriptionUser.plan === 'PRO' ? 'pro': 'plus'} size='sm' text={subscriptionUser.plan} />)
        }
        <Live />
        {userSession.isLoggedIn && 
          <AvatarNavbar altText='avatar-user' imageSrc={userSession.avatarUrl}>
          </AvatarNavbar> }
      </div>
    </Navbar>
    <main class="flex items-stretch min-h-screen">
      <Slot />
    </main>
    <FooterTag/>
    </div>);
});
