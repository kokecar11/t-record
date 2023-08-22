import { component$, useContextProvider, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { type AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from './supabase/supabase-browser';
import { RouterHead } from './components/router-head/router-head';
import { QwikPartytown } from './components/partytown/partytown';
import { useAuthUser } from './hooks';
import { 
  UserSessionContext,
  TwitchProviderContext,
  SubscriptionUserContext,
  LiveStreamContext,
  GlobalStore } from './context';
import type{ UserSession, SubscriptionUser, TwitchProvider, Live, SiteStore } from './models';
import './global.css';


export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  const userSessionStore = useStore<UserSession>({
    userId: '',
    isLoggedIn: false,
    providerId: '',
    email:'',
  });
  const subscriptionUserStore = useStore<SubscriptionUser>({
    status: 'on_trial',
    plan: 'STARTER'
  });
  const siteStore = useStore<SiteStore>({
    theme: 'dark',
  });
  const liveStreamStore = useStore<Live>({
    status: 'offline'
  });
  const twitchProviderStore = useStore<TwitchProvider>({
    providerToken: '',
    providerRefreshToken: '' 
  });  

  useContextProvider(GlobalStore, siteStore);
  useContextProvider(LiveStreamContext, liveStreamStore);
  useContextProvider(SubscriptionUserContext, subscriptionUserStore);

  useContextProvider(UserSessionContext, userSessionStore);
  useContextProvider(TwitchProviderContext, twitchProviderStore);

  const analyticsScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'GTM-MLT5XFTT');
  `;
  const gTagManagerScript = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MLT5XFTT');
  `;
  const { authUserCookies } = useAuthUser()

  useVisibleTask$(async() => {
    
    const { data: authListener } = await supabase.auth.onAuthStateChange(async (event:AuthChangeEvent, session:any) => {
      if (event === 'SIGNED_IN' && session){
        userSessionStore.userId = session?.user?.id;
        userSessionStore.isLoggedIn = true;
        userSessionStore.avatarUrl = session?.user?.user_metadata.avatar_url;
        userSessionStore.nickname = session?.user?.user_metadata.nickname;
        userSessionStore.providerId = session?.user?.user_metadata.provider_id;
        userSessionStore.email = session?.user?.email;
        if(session.provider_token){
          twitchProviderStore.providerToken = session?.provider_token;
          twitchProviderStore.providerRefreshToken = session?.provider_refresh_token;
          await authUserCookies(twitchProviderStore, userSessionStore);
        }
      }
      if (event === 'SIGNED_OUT'){
        userSessionStore.userId = "";
        userSessionStore.isLoggedIn = false;
        userSessionStore.avatarUrl = "";
        userSessionStore.nickname = "";
        userSessionStore.providerId = "";
        userSessionStore.email = "";
        twitchProviderStore.providerToken = "";
        twitchProviderStore.providerRefreshToken = "";
      }
    }
    
    )
    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <QwikPartytown  forward={['dataLayer.push']}/>
        <script defer async dangerouslySetInnerHTML={analyticsScript}></script>
        <script defer async type="text/partytown"  dangerouslySetInnerHTML={gTagManagerScript} ></script>
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
