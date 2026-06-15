import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sendPurchaseEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const productId = session.metadata?.productId;
    const productName = session.metadata?.productName || "Ahead AI Guide";
    const amountTotal = session.amount_total || 0;
    const currency = session.currency || "usd";

    if (customerEmail && productId) {
      // Generate download token
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const downloadToken = Buffer.from(
        JSON.stringify({
          email: customerEmail,
          productId,
          timestamp: Date.now(),
        })
      ).toString("base64url");

      const downloadUrl = `${appUrl}/api/download?token=${downloadToken}`;

      // Store purchase in DB
      let purchase;
      try {
        purchase = await prisma.purchase.upsert({
          where: { stripeSessionId: session.id },
          update: {},
          create: {
            email: customerEmail,
            productId,
            productName,
            amountPaid: amountTotal,
            currency,
            stripeSessionId: session.id,
            downloadToken,
            emailSent: false,
            emailAttempts: 0,
          },
        });
      } catch (dbError) {
        console.error("DB error saving purchase:", dbError);
        // Don't fail the webhook — Stripe will retry
      }

      // Attempt to send email
      const { sent, error } = await sendPurchaseEmail({
        to: customerEmail,
        productName,
        downloadUrl,
      });

      // Update email status in DB
      if (purchase) {
        try {
          await prisma.purchase.update({
            where: { id: purchase.id },
            data: {
              emailSent: sent,
              emailAttempts: 1,
              emailError: error || null,
            },
          });
        } catch (dbError) {
          console.error("DB error updating email status:", dbError);
        }
      }

      console.log(
        `Purchase completed: ${productName} by ${customerEmail} | email=${sent ? "sent" : "pending"}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
