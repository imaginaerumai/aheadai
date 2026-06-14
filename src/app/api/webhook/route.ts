import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sendPurchaseEmail } from "@/lib/resend";

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

    if (customerEmail && productId) {
      // Generate a download URL
      // In production, this would be a signed URL to a file in S3/R2
      // For now, we use a placeholder that you'll replace with real file hosting
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const downloadToken = Buffer.from(
        JSON.stringify({
          email: customerEmail,
          productId,
          timestamp: Date.now(),
        })
      ).toString("base64url");

      const downloadUrl = `${appUrl}/api/download?token=${downloadToken}`;

      await sendPurchaseEmail({
        to: customerEmail,
        productName,
        downloadUrl,
      });

      console.log(
        `✅ Purchase completed: ${productName} by ${customerEmail}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
