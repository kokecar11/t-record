import { component$, Slot, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik'
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city'

import { 
  UserSessionContext,
  TwitchProviderContext,
  SubscriptionUserContext,
  GlobalStore } from '~/context'


import { getColorPreference, useAuthUser, useToggleTheme } from '~/hooks'
import type { NavMenuI } from '~/models'

import { Navbar } from '~/components/navbar/Navbar'
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar'

import { Footer } from '~/components/footer/Footer'
import { Live } from '~/components/live/Live'
import { supabase } from '~/supabase/supabase-browser'
import Button from '~/components/button/Button'
import { Tag } from '~/components/tag/Tag'
import { Icon, IconCatalog } from '~/components/icon/icon'
import type { AuthChangeEvent } from '@supabase/supabase-js'
import { getSubscriptionByUser } from '~/services'



export default component$(() => {
  const pathname = useLocation().url.pathname;
  const nav = useNavigate()


  const userSession = useContext(UserSessionContext)
  const twitchProvider = useContext(TwitchProviderContext)
  const subscriptionUser = useContext(SubscriptionUserContext)
  const state = useContext(GlobalStore)

  const { setPreference } = useToggleTheme()
  const { handleRefreshTokenTwitch } = useAuthUser();
  const navItems = useStore<NavMenuI>({
    navs:[]
  })
  
  useVisibleTask$(async () => {
    const { data: authListener } = await supabase.auth.onAuthStateChange(async (event:AuthChangeEvent, session:any) => {
      if (session){
        userSession.userId = session?.user?.id;
        userSession.isLoggedIn = true;
        userSession.avatarUrl = session?.user?.user_metadata.avatar_url;
        userSession.nickname = session?.user?.user_metadata.nickname;
        userSession.providerId = session?.user?.user_metadata.provider_id;
        userSession.email = session?.user?.email;
        await handleRefreshTokenTwitch()
      }
      if (event === 'SIGNED_OUT'){
        userSession.userId = "";
        userSession.isLoggedIn = false;
        userSession.avatarUrl = "";
        userSession.nickname = "";
        userSession.providerId = "";
        userSession.email = "";
      }
    }
    )
    return () => {
      authListener.subscription.unsubscribe();
    };
  })
  useVisibleTask$(async({track}) => {
    const syb = await getSubscriptionByUser(userSession.userId)
    if (syb){
      subscriptionUser.status = syb.status
      subscriptionUser.plan = syb.plan
    }
    state.theme = getColorPreference()
    await handleRefreshTokenTwitch()
    setPreference(state.theme)
    track(() => [state.theme, userSession, twitchProvider, subscriptionUser])
  })
  

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
        {
          userSession.isLoggedIn && <AvatarNavbar altText='avatar-user' imageSrc={userSession.avatarUrl} />
        }
      </div>
    </Navbar>
    <main class="flex items-stretch min-h-screen">
      <Slot />
    </main>
    <Footer/>
    </div>);
});
