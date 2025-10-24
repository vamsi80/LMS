import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const headerList = await headers();
    const signature = headerList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET as string

        );

    } catch (error) {
        return new Response("Webhook Error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if(event.type === "checkout.session.completed") {
        const courseId = session.metadata?.courseId;
        const customerId = session.customer as string;
        if(!courseId) {
            throw new Response("Course not found");
        }

        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId
            }
        });
        if(!user) {
            throw new Response("User not found");
        }

        await prisma.enrollment.update({
            where: {
                id: session.metadata?.enrollmentId as string
            },
            data: {
                userId: user.id,
                courseId: courseId,
                amount: session.amount_total as number,
                status: "Active",
            },
        });
    }

    return new Response(null, { status: 200 });
}
