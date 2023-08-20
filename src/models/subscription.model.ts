import type { Plan, TypePlan } from "./plan.model"
import type { Database } from "./schema.model";
export type TypeSubscription = 'yearly' | 'monthly'; 

export interface Subscription {
    id?: string
    fk_user?: string
    fk_plan: Plan
    created_at?: Date | any
    start_date?: Date | any
    expiration_date?: Date | any
    status: string
}
export interface SubscriptionUser {
    plan: TypePlan
    status: string
    start_date?: Date
    expiration_date?: Date
}

export type SubscriptionType = Database['public']['Tables']['subscription']['Row'];