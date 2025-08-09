import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const { amount } = await req.json();                 // หรือดึง priceId คงที่
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user!.email!,
    line_items: [
      { price: process.env.STRIPE_PRICE_ID, quantity: 1 }, // ตัวอย่าง price แบบคงที่
    ],
    success_url: `${req.nextUrl.origin}/payment/success`,
    cancel_url: `${req.nextUrl.origin}/payment/cancel`,
    metadata: { userId: session.user!.id },
  });

  return NextResponse.json({ url: stripeSession.url });
}
