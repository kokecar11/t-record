export interface SubscriptionBillingUser {
    price: string
    typePlan: string,
    renews_at: Date,
    typeSubscription: string
}

export const subscriptionBillingUserAdapter = (subs: any) => {

    const price = subs.type === 'monthly' ? subs.plan.price_monthly : subs.plan.price_yearly
    return {
        price,
        typePlan: subs.plan.type,
        renews_at: subs.renews_at,
        typeSubscription: subs.type
    } as SubscriptionBillingUser 
}

