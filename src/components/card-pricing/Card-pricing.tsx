import { component$, useContext } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { Icon, IconCatalog } from "../icon/icon";
import Button from "../button/Button";
import { useAuth } from "~/auth/hooks/use-auth";
import { AuthSessionContext } from "~/auth/context/auth.context";
import { Tag } from "../tag/Tag";

export interface CardPricingProps {
    type_subs: 'Monthly' | 'Yearly',
    plan: 'Starter' | 'Plus' | 'Pro'
    price: number,
    title: string,
    popular: boolean,
    features: string[],
    link?: string,
}

export const CardPricing = component$(({ title, price, popular, features, link, type_subs, plan}: CardPricingProps) => {
    const authSession = useContext(AuthSessionContext);
    const nav = useNavigate();
    const { handleSignInWithOAuth } = useAuth();
  return (
    <div class={`w-full h-full max-w-sm p-0.5 border border-secondary rounded-lg ${!popular ? 'border-opacity-30 bg-primary': 'border-opacity-100 shadow-2xl shadow-secondary bg-secondary' }`}>
        
        {
            popular && <p class="flex items-center justify-center text-center bg-secondary py-2 font-semibold"><Icon name={IconCatalog.feStar} class="text-lg mr-1" /> Most Popular</p>
        }
        <div class={`flex flex-col p-4 sm:p-8 rounded-lg bg-primary ${!popular && 'h-full'}`}>
            <span class="mb-4 text-xl font-medium text-gray-400">{title} {popular && <Tag text="New" variant="secondary" size="xs" />}</span>
            <hr class="mb-8 border-white opacity-10"></hr>

            <div class="flex items-baseline text-white">
                <span class="text-5xl font-extrabold tracking-tight">${price}</span> <span class="ml-1 text-gray-400">/ {type_subs}</span>
            </div>
            <hr class="mt-8 border-white opacity-10"></hr>
            <ul role="list" class="space-y-5 my-7">
                {
                features?.map((feature)=>(
                    <li key={feature} class="flex space-x-3 items-center text-base">
                        <Icon name={IconCatalog.feCheckCircle} class="text-secondary " />
                        <span class="font-normal leading-tight text-white">{feature}</span>
                    </li>
                ))   
                }        
            </ul>

            <div class="flex flex-col mt-auto">
                {
                    plan === 'Starter' ? <Button class={`sticky bottom-0 btn-secondary`} onClick$={() => {
                        if(authSession.value){
                            nav(link)
                        }else{
                            handleSignInWithOAuth('twitch')
                        } 
                    }}>Get started</Button> : 
                    <Button class={`w-full btn-secondary`} onClick$={()=>nav(link)}>Get started</Button>
                }
            </div>
            
            
        </div>

    </div>
  );
});