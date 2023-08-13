import { component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import {
  type DocumentHead,
  routeLoader$,
  useNavigate,
} from '@builder.io/qwik-city';
import { AuthSessionContext } from '~/auth/context/auth.context';

import { Collapse } from '~/components/collapse/Collapse';


export const useCheckAuth = routeLoader$(async ({ cookie, redirect }) => {
  const providerCookie = cookie.get('_provider')
  if (providerCookie) {
    throw redirect(302, '/dashboard/')
  }
  return
})

export default component$(() => {
  const authSession = useContext(AuthSessionContext)
  const nav = useNavigate()


  useVisibleTask$(async ({ track }) => {
    track(() => authSession.value)
    setTimeout(() => nav('/dashboard/'), 100)
  })

  return (
    <div class="flex flex-col m-10">
      <div class="container mx-auto">
        <h1 class="font-bold text-center animate-fade-down text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-secondary max-w-[20ch] text-fluid-base leading-[1.3] mx-auto">
          Discover the power of organization on Twitch
        </h1>
        <p class="lg:text-2xl text-lg md:text-xl font-light text-accent dark:text-white my-4 text-center animate-fade-down max-w-[60ch] mx-auto">
          We optimize your markers and turn them into chapters, allowing you to
          explore your most exciting moments with ease and speed.
        </p>

        <div class="grid md:flex mb-10 gap-8 items-start mt-20">
          <div class="space-y-4 animate-fade-right w-full md:w-2/5">
            <Collapse
              title="Organize Your Content"
              description="The web application offers an intuitive TODO-style interface that allows you to organize your markers and give them descriptive titles. This way, you can quickly access specific moments from your broadcasts."
              isOpen
            />
            <Collapse
              title="Instant Marker Creation"
              description="With T-Record, you no longer have to worry about missing exciting moments during your stream. You can create markers with just one click, ensuring that those epic moments never slip away again."
            />
            <Collapse
              title="Streamlined Content Creation"
              description="Spend less time editing and post-processing your streams with T-Record's ability to mark and save highlights during your live broadcasts, streamlining your content creation process."
            />
            <Collapse
              title="Download and Share"
              description="Once you've finished your stream, you can easily download the video with all the created markers. You can also share the links to these markers with your followers, so they can relive the most thrilling moments of your streams."
            />
          </div>
          <div class="flex items-center animate-fade-left w-full md:w-3/5">
            <video
              class="rounded-lg border border-secondary border-opacity-30"
              autoPlay
              loop
              src="https://res.cloudinary.com/dlcx4lubg/video/upload/f_auto:video,q_auto/s8uqnjezzoudl3b3euss"
            ></video>
          </div>
        </div>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Discover the power of organization on Twitch | T-Record',
  meta: [
    {
      name: 'description',
      content: "Unlock the power of T-Record's real-time markers for your lives. Organize, customize, and engage like never before. Boost your Twitch presence with T-Record today!",
    },
  ],
}
