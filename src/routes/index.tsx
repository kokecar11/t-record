import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { useAuth } from '~/auth/hooks/use-auth';
import Button from '~/components/button/Button';



export default component$(() => {
  // const { deleteAuthCookies } = useAuth();
  // const d = deleteAuthCookies();
  return (
      <div class="grid h-screen place-items-center">
          <h1 class="text-2xl font-bold text-violet-900 dark:text-white">
            Crea marcadores fácilmente, controla tus clips y potencia tu contenido como nunca antes

          </h1>
          <Button class="btn-violet" >out</Button>
      </div>
  );
});

export const head: DocumentHead = {
  title: 'T-Record App',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
