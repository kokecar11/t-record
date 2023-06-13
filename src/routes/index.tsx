import { component$, useContext } from '@builder.io/qwik';
import { useNavigate, type DocumentHead } from '@builder.io/qwik-city';
import { AuthSessionContext } from '~/auth/context/auth.context';
import Button from '~/components/button/Button';



export default component$(() => {
  const nav = useNavigate();
  const authSession = useContext(AuthSessionContext);

  return (
      <div class="h-screen dark:bg-gradient-to-b dark:from-slate-900 dark:to-violet-900">
          <div class="grid items-center justify-items-center h-screen mx-10">
            <div class="p-6 mx-2 text-center">
              <h1 class="text-7xl font-bold text-violet-900 dark:text-white">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-violet-700">Organize your markers on Twitch.</span> 
              </h1>
              <p class="text-xl text-slate-900 dark:text-white ml-2 my-6">Unleash the potential of Twitch markers with smart organization.</p>
              {authSession.value ?
                <Button class={"btn-violet-to-blue text-xl"} onClick$={()=> nav('/dashboard/')}>Go to Dashboard</Button>:
                <Button class={"btn-violet-to-blue text-xl"} onClick$={()=> nav('/login/')}>Get started</Button>
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
