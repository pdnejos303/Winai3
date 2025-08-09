import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma"; // ← มีอยู่แล้ว
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const sig = headers().get("stripe-signature")!;
  const buf = await req.arrayBuffer(); // ต้องได้ raw body

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e) {
    return new NextResponse(`Webhook Error: ${(e as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.payment.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: "SUCCEEDED" },
    });
  }

  return new NextResponse("ok", { status: 200 });
}
