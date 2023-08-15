import { component$, Slot, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city';

import { type NavMenuI } from '~/core/interfaces/menu';

import { supabase } from '~/core/supabase/supabase';
import { GlobalStore } from '~/core/context';
import { AuthSessionContext } from '~/auth/context/auth.context';
import { useAuth } from '~/auth/hooks/use-auth';
import { getColorPreference, useToggleTheme } from '~/toggle-theme/hooks/use-toggle-theme';

import { Navbar } from '~/components/navbar/Navbar';
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar';
import { FooterTag } from '~/components/footer-tag/Footer-tag';
import { Live } from '~/components/live/Live';
import Button from '~/components/button/Button';
import { Icon, IconCatalog } from '~/components/icon/icon';
import { SubscriptionUserContext } from '~/context';
import { getSubscriptionByUser } from '~/services';
import { Tag } from '~/components/tag/Tag';

export const useCheckAuth = routeLoader$(async ({cookie, redirect}) => {
  const providerCookie = cookie.get('_provider');
  if(!providerCookie){
    await supabase.auth.signOut();
    throw redirect(302, '/');
  }
  return;
});

export default component$(() => {
  const pathname = useLocation().url.pathname;
  const nav = useNavigate()

  const authSession = useContext(AuthSessionContext);
  const subscriptionUser = useContext(SubscriptionUserContext);
  const state = useContext(GlobalStore);

  const { setPreference } = useToggleTheme();
  const { updateAuthCookies, handleRefreshTokenTwitch } = useAuth();
  const navItems = useStore<NavMenuI>({
    navs:[]
  }) ;
  
  

  useVisibleTask$( async () => {
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

    await handleRefreshTokenTwitch(); 
    return () => {
      authListener?.unsubscribe();
    };
  });


  useVisibleTask$(async({track}) => {
    const syb = await getSubscriptionByUser(authSession.value?.user.id);
    if (syb){
      subscriptionUser.status = syb.status
      subscriptionUser.plan = syb.plan
    }
    track(() => [state.theme, authSession.value]);
    await updateAuthCookies(authSession.value);
    setPreference(state.theme);
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
          //TODO:Modificar el ocultamiento de botón
          subscriptionUser.plan === 'STARTER' ? <Button class="btn-outlined-secondary flex items-center justify-center w-full md:w-auto shadow-lg" onClick$={() => nav('/pricing')}> <Icon name={IconCatalog.feBolt} class="mr-1" />Upgrade now</Button> :
          (<Tag variant={subscriptionUser.plan === 'PRO' ? 'pro': 'plus'} size='sm' text={subscriptionUser.plan} />)
        }
        <Live />
        {authSession.value !== null && 
          <AvatarNavbar altText={authSession.value?.user.user_metadata.nickname} imageSrc={authSession.value?.user.user_metadata.avatar_url}>
          </AvatarNavbar> }
      </div>
    </Navbar>
    <main class="flex items-stretch min-h-screen">
      <Slot />
    </main>
    <FooterTag/>
    </div>);
});
