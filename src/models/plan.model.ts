
import type { TypeSubscription } from "./subscription.model";

export type TypePlan = 'PLUS' | 'STARTER' | 'PRO';

export interface Plan {
    id: string
    title: string
    type: TypePlan
    price_monthly: string 
    price_yearly: string
    popular: boolean
    link_monthly: string
    link_yearly: string
    features: string[]
}
export interface PlanAdapter {
    id: string
    title: string
    price: number | string
    link: string
    popular: boolean
    features: string[]
    typePlan: string
    typeSubscription: TypeSubscription
}