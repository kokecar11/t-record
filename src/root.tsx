import { component$, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import type { Session } from 'supabase-auth-helpers-qwik';
import { AuthSessionContext } from './auth/context/auth.context';
import { GlobalStore, type SiteStore } from './core/context';
import './global.css';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  const authSessionSignal = useSignal<Session | null>();
  const siteStore = useStore<SiteStore>({
    theme: 'auto',
  });
  
  useContextProvider(AuthSessionContext, authSessionSignal)

  useContextProvider(GlobalStore, siteStore);
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
