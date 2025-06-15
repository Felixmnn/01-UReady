import { stripe } from "../../stripe-server"

export async function POST (req:Request) {
    const amount = await req.json();
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer : customer.id},
        { apiVersion: "2025-05-28.basil"}
    );

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount ? amount : 1000,
        currency: "usd",
        customer: customer.id,
        automatic_payment_methods: {
            enabled:true
        },
    })

    return Response.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLIC_KEY,
    })
}