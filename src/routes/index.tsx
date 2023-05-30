import { component$ } from '@builder.io/qwik';
import { type DocumentHead, useNavigate } from '@builder.io/qwik-city';
import Button from '~/components/button/Button';



export default component$(() => {
  // const { getAuthSession } = useAuth();
  const nav = useNavigate();
  return (
      <div class="h-screen">
          <div class="grid sm:grid-cols-2 items-center justify-items-center h-screen mx-10">
            {/* <h1 class="text-5xl text-violet-900 dark:text-white">
            <span class="font-bold text-violet-500">Easily create markers</span>, control your clips, and elevate your content like never before.
            </h1> */}
            <div class="bg-slate-500 bg-opacity-30 dark:bg-slate-800 shadow-md rounded-lg p-6 mx-2">
              <h1 class="text-6xl text-white">
                <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-900">Organize your markers</span> on Twitch.
              </h1>
              <p class="text-white ml-2 mt-6">With T-Record makes creating markers a simple and organized task. Keep detailed control of your clips and make the most out of your Twitch streams.</p>
            </div>
            
            {
            <Button class={"btn-violet"} onClick$={()=> nav('/dashboard/')}>Go to Dashboard</Button>
            }
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
