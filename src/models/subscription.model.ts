export interface Subscription {
    id: string
    fk_user: string,
    fk_subscription_plan: string,
    created_at: Date,
    start_date: Date,
    expiration_date: Date,
    status: string
}
  