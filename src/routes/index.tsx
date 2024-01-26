import { component$ } from '@builder.io/qwik'
import { type DocumentHead, type RequestHandler } from '@builder.io/qwik-city'
import { useAuthSession, useAuthSignin } from './plugin@auth'

import Button, { ButtonSize, ButtonVariant } from '~/components/button/Button'
import type { Session } from '@prisma/client'

export const onRequest: RequestHandler = async(event) => {
  const session: Session | null = event.sharedMap.get('session')
  if (session) {
    throw event.redirect(302, `/dashboard`)
  }
}

export default component$(() => {
  const session = useAuthSession();
  const signIn = useAuthSignin();

  return (
    <div class="flex flex-col m-10">
      <div class="container mx-auto px-4">
        <h1 class="font-bold text-center text-7xl leading-[1.1] max-w-[20ch] mx-auto animate-fade-down">
          Discover the power of <span class="text-transparent bg-clip-text bg-gradient-to-r from-live via-violet-900 to-secondary animate-hero-title">organization on Twitch</span>
        </h1>
        <h2 class="text-lg text-gray-300 my-4 text-center max-w-[60ch] mx-auto animate-fade-down">
          We optimize your markers and turn them into chapters, allowing you to
          explore your most exciting moments with ease and speed.
        </h2>
        {
          !session.value?.userId &&
          <div class="w-full mx-auto animate-fade-down my-4">
            <Button classNames='mx-auto' variant={ButtonVariant.plus} size={ButtonSize.lg} onClick$={() => signIn.submit({ providerId: 'twitch' })}>Try T-Record for free</Button>
          </div>
        }

        <div class="flex items-center place-content-center animate-fade-down my-4">
            <video
            width={1080}
              class="rounded-lg"
              loop
              src="https://res.cloudinary.com/dlcx4lubg/video/upload/f_auto:video,q_auto/s8uqnjezzoudl3b3euss"
            ></video>
        </div>
        <div class="my-6">
          <h2 class="text-5xl font-bold text-center animate-fade-down">Features</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2 p-4 rounded-lg bg-gradient-to-br from- via-secondary to-back backdrop-blur-lg">
            <div class="p-6 rounded-lg col-span-1 sm:col-span-2 shadow-lg bg-transparent backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-right">
              <h3 class="text-xl font-medium text-white">Link to go to the marker on VOD highlighter.</h3>
              <p class="mt-2 text-sm text-white">T-Record revolutionizes the viewing experience with its standout VOD Highlighter feature. This innovative system allows users to access key moments in their videos through personalized links, streamlining navigation and providing an efficient way to review meaningful content in seconds.</p>
            </div>
            <div class="p-6 rounded-lg shadow-lg bg-transparent backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-left">
                <h3 class="text-xl font-medium text-white">Manage your markers.</h3>
                <p class="mt-2 text-sm text-white">Effortlessly manage your markers with T-Record's dashboard. Streamline your experience and organize key points efficiently.</p>
            </div>
            <div class="p-6 rounded-lg shadow-lg bg-transparent backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-right">
                <h3 class="text-xl font-medium text-white">Notification of marker closing in the chat (coming soon).</h3>
                <p class="mt-2 text-sm text-white">Reminder notification to close the marker in the chat: Receive instant alerts to ensure you don't forget to close your markers."</p>
            </div>
            <div class="p-6 col-span-1 sm:col-span-2 rounded-lg shadow-lg bg-transparent backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-left">
                <h3 class="text-xl font-medium text-white">Team manage your markers (coming soon).</h3>
                <p class="mt-2 text-sm text-white">Your team effortlessly manages your markers with T-Record. Simplify collaboration and streamline your workflow with this intuitive feature."</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'T-Record',
  meta: [
    {
      name: 'description',
      content: "Unlock the power of T-Record's real-time markers for your lives. Organize, customize, and engage like never before. Boost your Twitch presence with T-Record today!",
    },
  ],
}
