import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPurchaseEmail } from "@/lib/resend";

const MAX_ATTEMPTS = 10;

export async function GET(request: NextRequest) {
  // Protect with a secret so only Railway cron can call this
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find purchases where email was not sent and under max attempts
    const pending = await prisma.purchase.findMany({
      where: {
        emailSent: false,
        emailAttempts: { lt: MAX_ATTEMPTS },
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    if (pending.length === 0) {
      return NextResponse.json({
        message: "No pending emails",
        checked: 0,
        sent: 0,
      });
    }

    let sentCount = 0;
    const results: { id: string; email: string; sent: boolean; error?: string }[] = [];

    for (const purchase of pending) {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // Regenerate download token with fresh timestamp if original is missing
      const downloadToken =
        purchase.downloadToken ||
        Buffer.from(
          JSON.stringify({
            email: purchase.email,
            productId: purchase.productId,
            timestamp: Date.now(),
          })
        ).toString("base64url");

      const downloadUrl = `${appUrl}/api/download?token=${downloadToken}`;

      const { sent, error } = await sendPurchaseEmail({
        to: purchase.email,
        productName: purchase.productName || "Ahead AI Guide",
        downloadUrl,
      });

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          emailSent: sent,
          emailAttempts: { increment: 1 },
          emailError: error || null,
          ...(sent && !purchase.downloadToken ? { downloadToken } : {}),
        },
      });

      if (sent) sentCount++;
      results.push({ id: purchase.id, email: purchase.email, sent, error });
    }

    console.log(
      `Cron check-emails: ${pending.length} pending, ${sentCount} sent`
    );

    return NextResponse.json({
      message: `Processed ${pending.length} pending emails`,
      checked: pending.length,
      sent: sentCount,
      results,
    });
  } catch (error) {
    console.error("Cron check-emails error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
