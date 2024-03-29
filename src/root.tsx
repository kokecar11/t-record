import { component$, useContextProvider, useStore } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { QwikPartytown } from './components/partytown/partytown';
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
