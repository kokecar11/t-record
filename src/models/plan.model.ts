import type { Database } from "./schema.model";
import type { TypeSubscription } from "./subscription.model";

export type TypePlan = 'PLUS' | 'STARTER' | 'PRO';

export interface Plan {
    id: string
    title: string
    name: TypePlan
    price_monthly: number
    price_yearly: number
    popular: boolean
    link_monthly: string
    link_yearly: string
    type: TypeSubscription
    features: string[]
}

export interface PlanAdapter {
    id: string
    title: string
    name: TypePlan
    price: number
    popular: boolean
    link: string
    type: TypeSubscription
    features: string[]
}

export type PlanType = Database['public']['Tables']['plan']['Row'];