import { component$ } from "@builder.io/qwik";
import Button from "../button/Button";
import { Icon, IconCatalog } from "../icon/icon";
import { Tag } from "../tag/Tag";

export interface CardPricingProps {
    title:string;
    price: string;
    special?: boolean;
    popular?: boolean;
}

export const CardPricing = component$(({ title, price, special, popular }: CardPricingProps) => {
  return (
    <div class={`w-full max-w-sm p-4 mx-auto bg-primary border border-secondary ${!special ? 'border-opacity-30': 'border-opacity-100' } rounded-lg shadow sm:p-8`}>
    {
        popular && (<div class="text-center">
        <Tag text="Most Popular" variant="secondary"/>
    </div>)
    }
    <h5 class="mb-4 text-xl font-medium text-gray-400">{title}</h5>
    <div class="flex items-baseline text-white">
        <span class="text-5xl font-extrabold tracking-tight">{price}</span> <span class="ml-1 text-gray-400">/ Monthly</span>
    </div>
    <ul role="list" class="space-y-5 my-7">
        <li class="flex space-x-3 items-center">
            <Icon name={IconCatalog.feCheckCircle} class="text-secondary" />
            <span class="text-base font-normal leading-tight text-white">20 markers monthly</span>
        </li>
        
        <li class="flex space-x-3 line-through decoration-secondary">
            <Icon name={IconCatalog.feClose} class="text-gray-400" />
            <span class="text-base font-normal leading-tight text-gray-400">Sketch Files</span>
        </li>
        
    </ul>
    <Button class={` ${special ? 'btn-secondary' : 'btn-outlined-secondary'}  w-full`}>Get started</Button>
</div>
  );
});