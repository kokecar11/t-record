import type { Subscription } from "~/models";


export const subscriptionUserAdapter = (subs: Subscription) => ({
    start_date: subs.start_date,
    expiration_date: subs.expiration_date,
    plan: subs.fk_plan.name,
    status: subs.status
})

// export const subscriptionPlanAdapter = (subs: Subscription) => ({
//     id: subs.id,
//     plan: subs.plan,
//     link: subs.link,
//     popular: subs.popular,
//     price: subs.price,
//     title: subs.title,
//     type: subs.type,
//     feauter: subs.features
// })