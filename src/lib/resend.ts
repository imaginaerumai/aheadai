import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@synairo.com";

/**
 * Creates a fresh SMTP transport and verifies auth before returning.
 * Each send gets its own connection to avoid stale/expired sessions.
 */
async function createTransport() {
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      // Allow connections even if server certificate is expired or self-signed
      rejectUnauthorized: false,
    },
  });

  // Verify connection / auth before sending
  await transport.verify();

  return transport;
}

/** Returns true if email was sent, false otherwise. */
export async function sendPurchaseEmail({
  to,
  productName,
  downloadUrl,
}: {
  to: string;
  productName: string;
  downloadUrl: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP not configured. Skipping email send.");
    console.log(
      `Would have sent email to ${to} with download link: ${downloadUrl}`
    );
    return { sent: false, error: "SMTP not configured" };
  }

  try {
    const transport = await createTransport();

    await transport.sendMail({
      from: `"Ahead AI" <${EMAIL_FROM}>`,
      to,
      subject: `Your Ahead AI Guide: ${productName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1D1D1F;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 24px; font-weight: 700;">Ahead <span style="color: #0071E3;">AI</span></h1>
            </div>
            
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Thank you for your purchase!</h2>
            
            <p style="color: #86868B; line-height: 1.6; margin-bottom: 24px;">
              You've purchased <strong style="color: #1D1D1F;">${productName}</strong>. 
              Your guide is ready for download.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${downloadUrl}" style="display: inline-block; background: #0071E3; color: white; text-decoration: none; padding: 14px 32px; border-radius: 99px; font-weight: 500; font-size: 16px;">
                Download Your Guide
              </a>
            </div>
            
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

    transport.close();
    console.log(`Purchase email sent to ${to}`);
    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send purchase email:", message);
    return { sent: false, error: message };
  }
}
