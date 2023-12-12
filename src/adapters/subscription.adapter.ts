export interface SubscriptionBillingUser {
    price: string
    typePlan: string,
    renews_at: Date,
    typeSubscription: string,
    ends_at: Date
}

export const subscriptionBillingUserAdapter = (subs: any) => {
    const price = subs.type === 'monthly' ? subs.plan.price_monthly : subs.plan.price_yearly
    return {
        price,
        typePlan: subs.plan.type,
        renews_at: subs.renews_at,
        typeSubscription: subs.type,
        ends_at: subs.ends_at
    } as SubscriptionBillingUser 
}

