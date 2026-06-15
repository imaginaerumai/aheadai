import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const emailFrom = process.env.EMAIL_FROM || "hello@aheadai.dev";

/** Returns true if email was sent, false otherwise. Throws on unexpected errors. */
export async function sendPurchaseEmail({
  to,
  productName,
  downloadUrl,
}: {
  to: string;
  productName: string;
  downloadUrl: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set. Skipping email send.");
    console.log(
      `Would have sent email to ${to} with download link: ${downloadUrl}`
    );
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to,
      subject: `Your Ahead AI Guide: ${productName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1D1D1F;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 24px; font-weight: 700;">Ahead <span style="background: linear-gradient(135deg, #0071E3, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI</span></h1>
            </div>
            
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Thank you for your purchase!</h2>
            
            <p style="color: #86868B; line-height: 1.6; margin-bottom: 24px;">
              You've purchased <strong style="color: #1D1D1F;">${productName}</strong>. 
              Your guide is ready for download.
            </p>
            
            <a href="${downloadUrl}" style="display: inline-block; background: #0071E3; color: white; text-decoration: none; padding: 14px 32px; border-radius: 99px; font-weight: 500; font-size: 16px; margin-bottom: 24px;">
              Download Your Guide
            </a>
            
            <p style="color: #86868B; font-size: 14px; line-height: 1.6; margin-top: 32px;">
              This download link expires in 7 days. If you need a new link, 
              contact us at <a href="mailto:contact@synairo.com" style="color: #0071E3;">contact@synairo.com</a>.
            </p>
            
            <hr style="border: none; border-top: 1px solid #E5E5E7; margin: 32px 0;" />
            
            <p style="color: #86868B; font-size: 12px; text-align: center;">
              &copy; ${new Date().getFullYear()} Synairo. All rights reserved.
            </p>
          </body>
        </html>
      `,
    });
    console.log(`Purchase email sent to ${to}`);
    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send purchase email:", message);
    return { sent: false, error: message };
  }
}
