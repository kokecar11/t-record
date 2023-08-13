import type { TypeSubscription } from "./subscription.model";

export type TypePlan = 'PLUS' | 'STARTER' | 'PRO';

export interface Plan {
    id: string
    title: string
    name: TypePlan
    price: number
    popular: boolean
    link: string
    type: TypeSubscription
    features: string[]
}
  