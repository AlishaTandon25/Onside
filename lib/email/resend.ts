import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent:", { to, subject });
    return { success: false, error: "API key missing" };
  }

  try {
    const data = await resend.emails.send({
      from: "notifications@yourdomain.com", // Ensure this domain is verified in Resend
      to,
      subject,
      text: text || "",
      html: html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
