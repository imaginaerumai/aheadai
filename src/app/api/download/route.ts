import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

// Map product IDs to PDF files
// For now, all products serve the same test PDF
// Replace with individual files per product when content is ready
const PRODUCT_FILES: Record<string, string> = {
  "beginner-starter": "aheadai-sample.pdf",
  "beginner-growth": "aheadai-sample.pdf",
  "beginner-complete": "aheadai-sample.pdf",
  "principal-starter": "aheadai-sample.pdf",
  "principal-growth": "aheadai-sample.pdf",
  "principal-complete": "aheadai-sample.pdf",
  "complete-bundle": "aheadai-sample.pdf",
};

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Download token is required" },
      { status: 400 }
    );
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8")
    );

    const { email, productId, timestamp } = decoded;

    // Check if token is expired (7 days)
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > SEVEN_DAYS) {
      return NextResponse.json(
        {
          error:
            "Download link has expired. Please contact support for a new link.",
        },
        { status: 410 }
      );
    }

    const filename = PRODUCT_FILES[productId];
    if (!filename) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const filePath = join(process.cwd(), "public", "guides", filename);

    try {
      const fileBuffer = await readFile(filePath);

      console.log(`Download: ${productId} by ${email}`);

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="AheadAI-${productId}.pdf"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    } catch {
      return NextResponse.json(
        {
          error: "Guide file not found. Please contact support.",
        },
        { status: 404 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid download token" },
      { status: 400 }
    );
  }
}
