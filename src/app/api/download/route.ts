import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";

// Map product IDs to PDF files in guides-private/
// For now all products use the same test PDF — replace with real files
const PRODUCT_FILES: Record<string, string[]> = {
  "beginner-starter": ["aheadai-sample.pdf"],
  "beginner-growth": ["aheadai-sample.pdf"],
  "beginner-complete": ["aheadai-sample.pdf"],
  "principal-starter": ["aheadai-sample.pdf"],
  "principal-growth": ["aheadai-sample.pdf"],
  "principal-complete": ["aheadai-sample.pdf"],
  // Bundle gets all files — when real PDFs exist, list them all here
  "complete-bundle": ["aheadai-sample.pdf"],
};

const GUIDES_DIR = join(process.cwd(), "guides-private");

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Download token is required" },
      { status: 400 }
    );
  }

  // Look up purchase by UUID token
  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
  });

  if (!purchase) {
    return NextResponse.json(
      { error: "Invalid download link." },
      { status: 404 }
    );
  }

  // Check expiry (90 days)
  if (purchase.downloadExpiresAt && new Date() > purchase.downloadExpiresAt) {
    return NextResponse.json(
      {
        error:
          "Download link has expired. Contact us at contact@synairo.com with your purchase email and we'll send you a new link.",
      },
      { status: 410 }
    );
  }

  // Check download limit
  if (purchase.downloadCount >= purchase.downloadLimit) {
    return NextResponse.json(
      {
        error:
          "Download limit reached. Contact us at contact@synairo.com with your purchase email for assistance.",
      },
      { status: 429 }
    );
  }

  const files = PRODUCT_FILES[purchase.productId];
  if (!files || files.length === 0) {
    return NextResponse.json(
      { error: "Product files not found. Contact support." },
      { status: 404 }
    );
  }

  // Verify all files exist
  for (const file of files) {
    try {
      await access(join(GUIDES_DIR, file));
    } catch {
      return NextResponse.json(
        { error: "Guide file not available. Contact support." },
        { status: 404 }
      );
    }
  }

  // Increment download counter
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { downloadCount: { increment: 1 } },
  });

  const remaining = purchase.downloadLimit - purchase.downloadCount - 1;
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
