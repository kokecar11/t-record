import { component$, useStore } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { CardPricing, type CardPricingProps } from '~/components/card-pricing/Card-pricing';

export default component$(() => {

  const plans = useStore<CardPricingProps[]>([{
    type_subs:'Monthly',
    plan:'Starter',
    price: 0,
    title: 'Starter plan',
    popular: false,
    link:'/dashboard',
    features:[
      '20 Markers monthly.',
      '10 Instant Markers per day.'
    ],
  },
  {
    type_subs:'Monthly',
    plan:'Plus',
    price: 5.99,
    title: 'Plus plan',
    popular: false,
    features:[
      '40 Markers monthly.',
      'Unlimited instant markers.',
      'Early access to new features.',
      'Download the video (coming soon).',
    ],
  },
  {
    type_subs:'Monthly',
    plan:'Pro',
    price: 9.99,
    title: 'Pro plan',
    popular: true,
    features:[
      'Unlimited Markers.',
      'Unlimited Instant Markers',
      'Early access to new features.',
      'Download the video (coming soon).',
      'Reminder to close marker (coming soon).',
      'Keep your videos for up to 15 days (coming soon).'      
    ],
  }
]);

  return (
    <div class="flex flex-col m-10 sm:h-screen">
        <h1 class="text-white text-5xl md:text-7xl font-bold my-6 text-center animate-fade-down">Choose your plan</h1>
        <p class="font-light lg:mx-80 lg:text-lg text-white text-center animate-fade-down">Select your plan and create epic moments live. Stand out with markers, and take your content to the next level. <br></br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-secondary font-semibold">Join the revolution of interactive experiences on Twitch!</span></p>
        <div class="grid gap-6 sm:flex sm:space-x-10 justify-center mt-10 animate-fade-up delay-300 animate-duration-1000">
          {
            plans.filter((plan) => plan.type_subs === 'Monthly').map((plan) => (
              <CardPricing key={plan.title} {...plan}  />  
            ))
          }            
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
  