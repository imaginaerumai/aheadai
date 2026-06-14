import { NextRequest, NextResponse } from "next/server";

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
        { error: "Download link has expired. Please contact support for a new link." },
        { status: 410 }
      );
    }

    // In production, you would:
    // 1. Look up the file in S3/R2 based on productId
    // 2. Generate a signed URL or stream the file
    // 3. Log the download

    // For v1 placeholder:
    console.log(`📥 Download requested: ${productId} by ${email}`);

    return NextResponse.json({
      message: "Download endpoint ready. PDF files will be served here once content is created.",
      productId,
      email,
      note: "Replace this with actual file serving when PDFs are ready.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid download token" },
      { status: 400 }
    );
  }
}
