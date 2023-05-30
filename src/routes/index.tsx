import { component$ } from '@builder.io/qwik';
import { type DocumentHead, useNavigate } from '@builder.io/qwik-city';
import Button from '~/components/button/Button';



export default component$(() => {
  // const { getAuthSession } = useAuth();
  const nav = useNavigate();
  return (
      <div class="grid h-screen place-items-center">
          <h1 class="text-2xl font-bold text-violet-900 dark:text-white">
            Easily create markers, control your clips, and elevate your content like never before.
          </h1>
          {
            <Button class={"btn-violet"} onClick$={()=> nav('/dashboard/')}>Go to Dashboard</Button>
          }

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
