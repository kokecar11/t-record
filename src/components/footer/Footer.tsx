import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Icon, IconCatalog } from '../icon/icon';


export const Footer = component$( () => {
    return ( 
        <footer class="bg-primary text-center text-white border-secondary border-t-4">
            <div class="p-4 flex space-x-6 items-center justify-between container mx-auto">
                <div class="flex justify-center items-center space-x-6">
                    <Link href="https://github.com/kokecar11" class="icon hover:animate-jump hover:animate-once hover:animate-duration-1000 hover:animate-delay-300" target='_blank'>
                        <Icon name={IconCatalog.feGithub}class={"text-2xl"} />
                    </Link>
                    <Link href="https://twitter.com/Kokecar11" class="icon hover:animate-shake hover:animate-once hover:animate-duration-1000 hover:animate-delay-300" target='_blank'>
                        <Icon name={IconCatalog.feTwitter}class={"text-2xl"} />
                    </Link>
                    <Link href="https://www.instagram.com/koke_car11/" class="icon hover:animate-wiggle hover:animate-once hover:animate-duration-1000 hover:animate-delay-300" target='_blank'>
                        <Icon name={IconCatalog.feInstagram}class={"text-2xl"} />
                    </Link>
                </div>
                <p class="text-white font-semibold flex">Made with<Icon name={IconCatalog.feHeart} class="text-xl text-rose-600 mx-1" /> by <Link href='https://twitter.com/Kokecar11' class="pl-1 underline" target="_blank">Koke</Link></p>
            </div>
        </footer>
    );
})