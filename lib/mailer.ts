

// lib/mailer.ts
import nodemailer from "nodemailer";
import VerifyEmailPage from "@/app/auth/verify-email/page";
export type SendResult =
  | { ok: true; provider: "env"; info: nodemailer.SentMessageInfo }
  | { ok: true; provider: "ethereal"; info: nodemailer.SentMessageInfo; previewUrl?: string | false }
  | { ok: false; provider: "console"; error?: string };

export async function sendOtpEmail(to: string, otp: string): Promise<SendResult> {
  const host = process.env.SMTP_HOST ?? process.env.EMAIL_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? process.env.EMAIL_PORT ?? 587);
  const user = process.env.SMTP_USER ?? process.env.EMAIL_USER;
  const passRaw = process.env.SMTP_PASS ?? process.env.EMAIL_PASS ?? "";
  const pass = passRaw.replace(/\s+/g, ""); // remove accidental spaces

  const subject = "Your FoodCart verification code";
  const text = `Your verification code is ${otp}. It expires in ${process.env.OTP_TTL_MINUTES ?? 5} minutes.`;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      
      await transporter.verify();

      const info = await transporter.sendMail({
        from: `"FoodCart" <${user}>`,
        to,
        subject,
        text,
      });

      return { ok: true, provider: "env", info };
    } catch (err: unknown) {
      
      const code = typeof err === "object" && err !== null && "code" in err ? (err).code : "SMTP_ERROR";
      
      console.warn(`SMTP (env) send failed — code: ${code}`);
    
    }
  }


  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: `"FoodCart (test)" <${testAccount.user}>`,
      to,
      subject,
      text,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    return { ok: true, provider: "ethereal", info, previewUrl: previewUrl ?? false };
  } catch (err: unknown) {
    
    
    console.error("All email providers failed — OTP printed to server console for local testing.");
  
    console.log(`OTP for ${to}: ${otp}`);
    return { ok: false, provider: "console", error: "all-email-failed" };
  }
}

