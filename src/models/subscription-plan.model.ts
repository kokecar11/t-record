export type TypeSubscriptionPlan = 'yearly' | 'monthly'; 
export type TypePlan = 'PLUS' | 'STARTER' | 'PRO';

export interface SubscriptionPlan {
    id: string
    title: string
    plan: TypePlan
    price: number
    popular: boolean
    link: string
    type: TypeSubscriptionPlan
    features: string[]
}
  