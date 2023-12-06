import type { RequestHandler } from '@builder.io/qwik-city';
import { setPaymentSubscriptionByUser } from '~/services';

export interface PaymentResponse {
    data: {
        attributes: PaymentData
    }
}
export interface PaymentData {
    product_id: string,
    user_email: string,
    variant_id: string,
    variant_name: string,
    renews_at: string,
    ends_at: string,
}

export const onPost: RequestHandler = async ({ json, parseBody }) => {
    const body = await parseBody() as PaymentResponse
    const data: PaymentData = {
        product_id: body.data.attributes.product_id.toString(),
        user_email: body.data.attributes.user_email,
        variant_id: body.data.attributes.variant_id.toString(),
        variant_name: body.data.attributes.variant_name.toLowerCase(),
        renews_at: body.data.attributes.renews_at,
        ends_at: body.data.attributes.ends_at,
    }
    console.log(data)
    await setPaymentSubscriptionByUser(data)
    json(200, { hello: 'world' });
}
