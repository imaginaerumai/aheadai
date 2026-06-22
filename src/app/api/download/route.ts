import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";

// Map product IDs to PDF files in guides-private/
const PRODUCT_FILES: Record<string, string[]> = {
  "beginner-starter": ["essentials.pdf"],
  "principal-starter": ["frontier.pdf"],
};

const GUIDES_DIR = join(process.cwd(), "guides-private");

function errorPage(title: string, message: string, status: number) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Ahead AI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #000; color: #f5f5f7;
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 480px; width: 100%; text-align: center;
      background: #1c1c1e; border: 1px solid #2c2c2e; border-radius: 20px;
      padding: 48px 32px;
    }
    .icon { font-size: 48px; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
    p { color: #86868b; font-size: 15px; line-height: 1.7; margin-bottom: 24px; }
    .contact {
      display: inline-block; background: #0071e3; color: #fff;
      text-decoration: none; padding: 12px 28px; border-radius: 99px;
      font-weight: 500; font-size: 15px; transition: background 0.2s;
    }
    .contact:hover { background: #0077ed; }
    .note { color: #6e6e73; font-size: 13px; margin-top: 20px; line-height: 1.6; }
    .back {
      display: inline-block; color: #0071e3; text-decoration: none;
      font-size: 14px; font-weight: 500; margin-top: 24px;
      transition: color 0.2s;
    }
    .back:hover { color: #0077ed; }
    .logo { color: #86868b; font-size: 13px; margin-top: 24px; }
    .logo span { color: #0071e3; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${status === 410 ? "⏰" : status === 429 ? "🔒" : "⚠️"}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="mailto:contact@synairo.com" class="contact">Contact Support</a>
    <p class="note">
      Make sure to use the email address you used for payment,
      or include it in your message. Our team is here to help you!
    </p>
    <a href="/" class="back">← Back to Home</a>
    <p class="logo">Ahead <span>AI</span></p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return errorPage("Invalid Link", "This download link is not valid.", 400);
  }

  // Look up purchase by UUID token
  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
  });

  if (!purchase) {
    return errorPage(
      "Link Not Found",
      "This download link doesn't exist or has been revoked.",
      404
    );
  }

  // Check expiry (90 days)
  if (purchase.downloadExpiresAt && new Date() > purchase.downloadExpiresAt) {
    return errorPage(
      "Link Expired",
      "This download link has expired. Contact us and we'll send you a new one.",
      410
    );
  }

  // Check download limit (env var, default 15)
  const limit = purchase.downloadLimit;
  if (purchase.downloadCount >= limit) {
    return errorPage(
      "Download Limit Reached",
      "This download link has reached its maximum number of uses. Contact us and we'll sort it out.",
      429
    );
  }

  const files = PRODUCT_FILES[purchase.productId];
  if (!files || files.length === 0) {
    return errorPage(
      "File Not Available",
      "The guide files for this product are not yet available. Contact us for assistance.",
      404
    );
  }

  // Verify all files exist
  for (const file of files) {
    try {
      await access(join(GUIDES_DIR, file));
    } catch {
      return errorPage(
        "File Not Available",
        "The guide file could not be found on our server. Contact us and we'll resolve this.",
        404
      );
    }
  }

  // Increment download counter
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { downloadCount: { increment: 1 } },
  });

  const remaining = limit - purchase.downloadCount - 1;
  console.log(
    `Download: ${purchase.productId} by ${purchase.email} (${remaining} remaining)`
  );

  // Single file → serve PDF directly
  if (files.length === 1) {
    const fileBuffer = await readFile(join(GUIDES_DIR, files[0]));
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AheadAI-${purchase.productId}.pdf"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  }

  // Multiple files (bundle) → serve as zip
  const zip = new JSZip();
  for (const file of files) {
    const buffer = await readFile(join(GUIDES_DIR, file));
    zip.file(file, buffer);
  }

  const zipBuffer = await zip.generateAsync({ type: "uint8array" });

  return new NextResponse(zipBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="AheadAI-${purchase.productId}.zip"`,
      "Content-Length": zipBuffer.length.toString(),
    },
  });
}
