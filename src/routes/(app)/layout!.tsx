import { component$, Slot, useSignal, useStore, useTask$ } from '@builder.io/qwik'
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city'


import { useAuthSession, useAuthSignin } from '../plugin@auth'

import type { NavMenuI } from '~/models'
import { type Plan } from '@prisma/client'

import { Navbar } from '~/components/navbar/Navbar'
import AvatarNavbar from '~/components/avatar-navbar/Avatar-navbar'
import { Footer } from '~/components/footer/Footer'
import { Live } from '~/components/live/Live'
import { getSubcriptionByUser } from '~/services'
import Button, { ButtonVariant } from '~/components/button/Button'
import { Tag, TagSize, TagVariant } from '~/components/tag/Tag'
import { Icon, IconCatalog } from '~/components/icon/icon'


export default component$(() => {
  const pathname = useLocation().url.pathname;
  const nav = useNavigate()
  
  const session = useAuthSession()
  const signIn = useAuthSignin()
  
  const navItems = useStore<NavMenuI>({
    navs:[]
  })
  const subscriptionUser = useSignal<Plan>()
  useTask$(async () => {
    subscriptionUser.value = await getSubcriptionByUser(session.value?.userId as string)
  })

  useTask$(async() => {    
    if (session.value?.error === "RefreshAccessTokenError") signIn.submit({ providerId: 'twitch' })
  })
  

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
            navItems.navs.map( (navItem) => 
            <Link key={navItem.route} href={navItem.route} class={{'nav-link':true, 'active-nav-item': pathname.startsWith(navItem.route)}}>{navItem.name}</Link>
            )
          }
      </div>
      <div q:slot='navItemsEnd' class={"flex flex-none items-center justify-center space-x-3"}>
        {
          subscriptionUser.value?.type === 'STARTER' ? <Button variant={ButtonVariant['outlined-secondary']} onClick$={() => nav('/pricing')}> <Icon name={IconCatalog.feBolt} class="mr-1" />Upgrade now</Button> :
          (<Tag variant={subscriptionUser.value?.type === 'PRO' ? TagVariant.pro : TagVariant.plus} size={TagSize.sm} text={subscriptionUser.value?.type} />)
        }
        <Live />
        {
          session.value?.user && <AvatarNavbar altText='avatar-user' imageSrc={session.value.user.image as string} />
        }
      </div>
    </Navbar>
    <main class="flex items-stretch min-h-screen">
      <Slot />
    </main>
    <Footer/>
    </div>);
});
