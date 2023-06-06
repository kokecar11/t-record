import { component$ } from '@builder.io/qwik';
import { type DocumentHead, useNavigate } from '@builder.io/qwik-city';
import Button from '~/components/button/Button';



export default component$(() => {
  const nav = useNavigate();
  return (
      <div class="h-screen">
          <div class="grid items-center justify-items-center h-screen mx-10">
            <div class="p-6 mx-2 text-center">
              <h1 class="text-6xl text-white">
                <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-900 to-violet-500">Organize your markers on Twitch.</span>
              </h1>
              <p class="text-violet-900 dark:text-white ml-2 my-6">Makes creating markers a simple and organized task. Keep detailed control of your clips and make the most out of your Twitch streams.</p>
              {
                <Button class={"btn-violet"} onClick$={()=> nav('/dashboard/')}>Go to Dashboard</Button>
              }
            </div>
            

          </div>
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
