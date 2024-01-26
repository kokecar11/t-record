import { component$, Slot, useStore, useTask$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

import { useAuthSignin,useAuthSession } from './plugin@auth';


import { Navbar } from '~/components/navbar/Navbar';
import { Footer } from '~/components/footer/Footer';
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar';
import Button, { ButtonVariant } from '~/components/button/Button';

import type { NavMenuI } from '~/models';



export default component$(() => {
  const pathname = useLocation().url.pathname;
  const signIn = useAuthSignin();
  const session = useAuthSession();

  const navItems = useStore<NavMenuI>({
    navs:[
      {name:'Pricing', route:'/pricing'},
      {name:'Feedback', route: 'https://trecord.featurebase.app/?b=65aef3148a898e7dd20aae96'},
      {name:'Roadmap', route: 'https://trecord.featurebase.app/roadmap'},
      {name:'Changelog', route: 'https://trecord.featurebase.app/changelog'},
    ]
  }) ;


  useTask$(async() => {
    if (session.value?.error === "RefreshAccessTokenError") signIn.submit({ providerId: 'twitch' })
  });
  


  return(     
  <div class="bg-gradient-to-b from-back to-primary">
    <Navbar>
      <div q:slot='navLogo'>
        <Link href='/' class={"font-bold text-xl text-white flex place-items-center space-x-2"}>
          <img class="rounded-md" src='/images/logo.png' width={56} height={56} alt='Logo T-Record'/>
          <span>T-Record</span>
        </Link>
      </div>
      <div q:slot='navItemsStart' class={"flex flex-none items-center justify-center"}>
          {
            navItems.navs.map((navItem) => 
            <Link key={navItem.route} href={navItem.route} class={{'nav-link':true, 'active-nav-item': pathname.startsWith(navItem.route)}}>{navItem.name}</Link>
            )
          }
      </div>
      <div q:slot='navItemsEnd' class={"flex flex-none items-center justify-center space-x-2"}>            

        {
          session.value?.user ? 
          <AvatarNavbar 
          altText='avatar-user'
          imageSrc={session.value.user.image as string} />
          :
          <Button variant={ButtonVariant.secondary} onClick$={() => signIn.submit({ providerId: 'twitch' })}>Sign in with Twitch</Button> 
          }

      </div>
    </Navbar>
    <main class="text-white">
      <Slot />
    </main>
    <Footer />
    </div>);
});
