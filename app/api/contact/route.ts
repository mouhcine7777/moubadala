import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY); // no NEXT_PUBLIC_

export async function POST(req: Request) {
  const { nom, email, telephone, sujet, message } = await req.json();

  const { error } = await resend.emails.send({
    from: "Contact Moubadala <noreply@moubadala.ma>",
    to: "contact@moubadala.ma",
    replyTo: email,
    subject: `[Contact] ${sujet}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #0D3B66; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Nouveau message — Moubadala</h1>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">Nom</td><td style="padding: 8px 0; font-weight: 600;">${nom}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0D3B66;">${email}</a></td></tr>
            ${telephone ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Téléphone</td><td style="padding: 8px 0;">${telephone}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Sujet</td><td style="padding: 8px 0; font-weight: 600;">${sujet}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Message</p>
          <p style="white-space: pre-wrap; line-height: 1.6; margin: 0;">${message}</p>
        </div>
      </div>
    `,
  });

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true });
}