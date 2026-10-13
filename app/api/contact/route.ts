import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const resendTo = process.env.RESEND_TO_EMAIL || "rythmenagrani@gmail.com";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      hasApiKey: Boolean(resendApiKey),
      fromConfigured: Boolean(resendFrom),
      toConfigured: Boolean(resendTo),
    });
  } catch (err: any) {
    console.error("[contact][GET] error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Unexpected error" }, { status: 500 });
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Email send timed out")), ms);
    promise
      .then((val) => {
        clearTimeout(t);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(t);
        reject(err);
      });
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      subject,
      message,
    }: {
      firstName?: string;
      lastName?: string;
      email?: string;
      subject?: string;
      message?: string;
    } = body || {};

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY on server" },
        { status: 500 }
      );
    }

    // Basic validation
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "firstName, email and message are required" },
        { status: 400 }
      );
    }

    const resend = new Resend(resendApiKey);

    const textLines = [
      `Name: ${firstName}${lastName ? ` ${lastName}` : ""}`,
      `Email: ${email}`,
      subject ? `Subject: ${subject}` : undefined,
      "",
      message,
    ].filter(Boolean) as string[];

    const { error }: any = await withTimeout(
      resend.emails.send({
        from: resendFrom,
        to: resendTo,
        reply_to: email,
        subject: subject || `New message from ${firstName}`,
        text: textLines.join("\n"),
      }),
      15000
    );

    if (error) {
      console.error("[contact][POST] resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[contact][POST] unexpected error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}


