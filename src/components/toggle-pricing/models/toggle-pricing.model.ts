export type TypeSubscription = 'yearly' | 'monthly'; 

export interface PlansSubscription {
    id: string
    title: string
    plan: 'PLUS' | 'STARTER' | 'PRO'
    price: number
    popular: boolean
    link: string
    type: TypeSubscription
    features: string[]
  }
  