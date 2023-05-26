import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { MdiGithub, MdiInstagram, MdiTwitter } from '../icons/icons';
// import { GlobalStore } from '~/core/context';


export const Footer = component$( () => {
    // const state = useContext(GlobalStore);
    return ( 
        <footer class="bg-violet-900 text-center text-white">
            <div class="pt-6">
                <div class="mb-6 flex justify-center space-x-6">
                    <Link href="https://github.com/kokecar11" class="icon">
                        <MdiGithub class={"text-2xl text-primary-900"} />
                    </Link>
                    <Link href="https://twitter.com/Kokecar11" class="icon" >
                        <MdiTwitter class={"text-2xl text-primary-900"} />
                    </Link>
                    <Link href="https://www.instagram.com/koke_car11/" class="icon">
                        <MdiInstagram class={"text-2xl text-primary-900"} />
                    </Link>
                </div>
                <p class="text-primary-900 dark:text-white font-bold">Made with 💜 - Kokecar11</p>
            </div>
        </footer>
    );
})