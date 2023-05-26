import { component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { AuthSessionContext } from '~/auth/context/auth.context';
import { SessionStore, UserStore } from '~/core/context';



export default component$(() => {
  // const sessionSignal = useContext(SessionStore)
  // const userSignal = useContext(UserStore)
  return (
   
      <div class="grid h-screen place-items-center">
          <h1 class="text-2xl font-bold text-violet-900 dark:text-white">
            Crea marcadores fácilmente, controla tus clips y potencia tu contenido como nunca antes
          </h1>
      </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
