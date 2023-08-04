import { component$, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import type { Session } from 'supabase-auth-helpers-qwik';
import { AuthSessionContext } from './auth/context/auth.context';
import { GlobalStore, type SiteStore } from './core/context';
import { type Live, LiveStreamContext } from './live/context/live.context';
import './global.css';
import { QwikPartytown } from './components/partytown/partytown';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  const authSessionSignal = useSignal<Session | null>();
  const siteStore = useStore<SiteStore>({
    theme: 'dark',
  });
  // const liveStreamSignal = useSignal<Live>('offline');
  const liveStreamStore = useStore<Live>({
    status: 'offline'
  })
  
  useContextProvider(AuthSessionContext, authSessionSignal);
  useContextProvider(GlobalStore, siteStore);
  useContextProvider(LiveStreamContext, liveStreamStore);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <QwikPartytown />

        <script type="text/partytown"  dangerouslySetInnerHTML={`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MLT5XFTT');
        `} ></script>

      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
