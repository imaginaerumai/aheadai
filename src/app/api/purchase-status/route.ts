import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/purchase-status?session_id=cs_xxx
 *
 * Looks up a purchase by Stripe session ID and returns the download URL.
 * Called from the success page after checkout — the download URL is never
 * embedded in server-rendered HTML, so it can't leak via page cache or source.
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 }
    );
  }

  const purchase = await prisma.purchase.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (!purchase) {
    // Webhook may not have fired yet — tell the client to retry
    return NextResponse.json({ ready: false }, { status: 202 });
  }

  if (!purchase.downloadToken) {
    return NextResponse.json({ ready: false }, { status: 202 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const downloadUrl = `${appUrl}/api/download?token=${purchase.downloadToken}`;

  return NextResponse.json({
    ready: true,
    productName: purchase.productName,
    customerEmail: purchase.email,
    downloadUrl,
  });
}
