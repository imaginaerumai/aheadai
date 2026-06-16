import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStripe } from "@/lib/stripe";
import { sendPurchaseEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

// Configurable via env var — change DOWNLOAD_LIMIT in Railway to adjust
const DOWNLOAD_LIMIT = parseInt(process.env.DOWNLOAD_LIMIT || "15", 10);
const EXPIRY_DAYS = parseInt(process.env.DOWNLOAD_EXPIRY_DAYS || "90", 10);

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
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null;
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || null;
    const paymentStatus = session.payment_status || "paid";

    if (customerEmail && productId) {
      // Generate unique download token (UUID)
      const downloadToken = randomUUID();
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const downloadUrl = `${appUrl}/api/download?token=${downloadToken}`;

      // Set expiry to 90 days from now
      const downloadExpiresAt = new Date();
      downloadExpiresAt.setDate(downloadExpiresAt.getDate() + EXPIRY_DAYS);

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
            stripePaymentIntent: paymentIntent,
            stripeCustomerId: customerId,
            paymentStatus,
            downloadToken,
            downloadCount: 0,
            downloadLimit: DOWNLOAD_LIMIT,
            downloadExpiresAt,
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
        `Purchase completed: ${productName} by ${customerEmail} | $${(amountTotal / 100).toFixed(2)} ${currency} | email=${sent ? "sent" : "pending"}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
