import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { inviteNonMemberPartyB, getContract } from '@/lib/actions/contracts'

const resend = new Resend(process.env.RESEND_API_KEY) // no NEXT_PUBLIC_

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export async function POST(req: Request) {
  const { contractId, clerkUserId, email, companyName } = await req.json()

  if (!contractId || !clerkUserId || !email) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
  }

  let token: string
  try {
    const result = await inviteNonMemberPartyB(contractId, clerkUserId, email, companyName || undefined)
    token = result.token
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  const contract = await getContract(contractId, clerkUserId)
  const inviterName = contract?.party_a?.company_name ?? 'Une entreprise partenaire'

  const origin = req.headers.get('origin') || 'https://moubadala.ma'
  const inviteUrl = `${origin}/inscription?contract_invite=${token}`

  const { error } = await resend.emails.send({
    from: 'Moubadala <noreply@moubadala.ma>',
    to: email,
    subject: `${inviterName} vous invite à finaliser un échange sur Moubadala`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #0D3B66; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Invitation à contractualiser — Moubadala</h1>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
          <p style="line-height: 1.6;">
            <strong>${escapeHtml(inviterName)}</strong> souhaite conclure un échange avec votre entreprise
            ${companyName ? `(${escapeHtml(companyName)})` : ''} directement sur la plateforme Moubadala.
          </p>
          <p style="line-height: 1.6;">
            Rejoignez Moubadala pour consulter et compléter le contrat d'échange proposé.
          </p>
          <a href="${inviteUrl}" style="display: inline-block; margin-top: 16px; background: #F5A623; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
            Rejoindre Moubadala et poursuivre
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            Si vous ne connaissez pas cette entreprise, vous pouvez ignorer cet e-mail.
          </p>
        </div>
      </div>
    `,
  })

  if (error) return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
