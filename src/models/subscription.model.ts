import type { SubscriptionPlan, TypePlan } from "./subscription-plan.model"

export interface Subscription {
    id?: string
    fk_user?: string
    fk_subscription_plan: SubscriptionPlan
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