import { component$} from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from '~/auth/hooks/use-auth';
import Button from "~/components/button/Button";

export const useCheckAuth = routeLoader$(({cookie, redirect}) => {
    const authCookie = cookie.get('_session');
    if (authCookie){
      redirect(302,'/dashboard/');
    }
    return;
  })
  

export default component$( () => {
    const { handleSignInWithOAuth } = useAuth();
    return (
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 dark:bg-gradient-to-b dark:from-slate-900 dark:to-violet-900">
            <div class="w-full bg-white rounded-sm shadow-lg border border-violet-950 dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-800">
                <div class="p-6 space-y-4 md:space-y-2 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-violet-900 md:text-2xl dark:text-white">
                        Inicia sesión
                    </h1>
                    <p class="text-violet-900 dark:text-slate-200 text-sm">Crear tus marcadores nunca fue tan fácil, lleva control de tu clip.</p>
                     <Button class={"btn-violet-to-blue w-full"} onClick$={()=>handleSignInWithOAuth('twitch')}>Sign in with Twitch</Button> 
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: 'Login | T-Record',
    meta: [
      {
        name: 'description',
        content: 'Qwik site description',
      },
    ],
  };
  