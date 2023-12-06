import { server$ } from '@builder.io/qwik-city'
import { db } from '~/db'
import { getUserByEmail } from './subscription.service'

import { type TypeSubscription } from '@prisma/client'

import { getPlanByProductId } from './plan.service'
import { type PaymentData } from '~/routes/(app)/api/payment'


export const setPaymentSubscriptionByUser = server$(async (data: PaymentData) => { 
    const user = await getUserByEmail(data.user_email)
    const plan = await getPlanByProductId(data.product_id as string)
    const mySubcription = await db.subscription.update({
        where: {
            userId: user?.id
        },
        data: {
            renews_at: data.renews_at,
            ends_at: data.ends_at,
            variant_id: data.variant_id,
            type: data.variant_name as TypeSubscription,
            planId: plan?.id
        }
    })
    console.log(mySubcription)
})

