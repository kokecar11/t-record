import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { CardPricing } from '~/components/card-pricing/Card-pricing';

export default component$(() => {
  return (
    <div class="flex flex-col mx-10 h-screen">
        <h1 class="text-white text-5xl font-bold my-6 text-center animate-fade-down">Choose your plan</h1>
        <p class="font-light lg:mx-80 lg:text-lg text-white text-center animate-fade-down">Select your plan and create epic moments live. Stand out with markers, and take your content to the next level. <span class="underline text-secondary">Join the revolution of interactive experiences on Twitch!</span></p>
        
        <div class="grid sm:grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mt-8 animate-fade-up delay-300 animate-duration-1000">

            <CardPricing title='Starter plan' price='$0' />
            <CardPricing title='Plus plan' price='$5.99' special popular />
            <CardPricing title='Pro plan' price='$9.99' />
            
        </div>
    </div>
  );
});

export const head: DocumentHead = {
    title: 'Pricing | T-Record',
    meta: [
      {
        name: 'description',
        content: 'Qwik site description',
      },
    ],
  };
  