import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { submitForValidation, logContractEvent } from '@/lib/actions/contracts'
import { notifyContractSignedPartial, notifyContractSignedComplete } from '@/lib/actions/notifications'
import { generateAndStoreContractPdf } from '@/lib/pdf/generateAndStoreContractPdf'

export const runtime = 'nodejs'

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'inconnue'
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })

  const { id } = await params

  // 1. Valide la complétude des données et fait passer le contrat en "en_attente_signature".
  try {
    await submitForValidation(id, userId)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  const { data: contract, error } = await supabase
    .from('contracts')
    .select('party_a_clerk_id, party_b_clerk_id, signed_at_a, signed_at_b, status')
    .eq('id', id)
    .single()

  if (error || !contract) return NextResponse.json({ error: 'Contrat introuvable.' }, { status: 404 })

  const isA = contract.party_a_clerk_id === userId
  const isB = contract.party_b_clerk_id === userId
  if (!isA && !isB) return NextResponse.json({ error: "Vous n'êtes pas partie à ce contrat." }, { status: 403 })

  if ((isA && contract.signed_at_a) || (isB && contract.signed_at_b)) {
    return NextResponse.json({ error: 'Vous avez déjà signé ce contrat.' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const ip = getClientIp(req)
  const prefix = isA ? 'a' : 'b'

  const { error: signError } = await supabase
    .from('contracts')
    .update({ [`signed_at_${prefix}`]: now, [`signature_ip_${prefix}`]: ip })
    .eq('id', id)

  if (signError) return NextResponse.json({ error: signError.message }, { status: 400 })
  await logContractEvent(id, userId, `signed_${prefix}`, { ip })

  const bothSigned = isA ? !!contract.signed_at_b : !!contract.signed_at_a

  if (bothSigned) {
    // Le cahier des charges (§8.2) prévoit un passage direct en "En exécution" dès la double signature.
    const { error: statusError } = await supabase.from('contracts').update({ status: 'en_execution' }).eq('id', id)
    if (statusError) return NextResponse.json({ error: statusError.message }, { status: 400 })
    await logContractEvent(id, userId, 'signed_complete')

    try {
      await generateAndStoreContractPdf(id, userId)
    } catch (e: any) {
      // Le contrat reste signé même si la génération du PDF échoue — elle est rejouable.
      await logContractEvent(id, userId, 'pdf_generation_failed', { error: e.message })
    }

    await Promise.all([
      notifyContractSignedComplete(contract.party_a_clerk_id, id),
      notifyContractSignedComplete(contract.party_b_clerk_id!, id),
    ])
  } else {
    const otherPartyId = isA ? contract.party_b_clerk_id! : contract.party_a_clerk_id
    const { data: mySignatory } = await supabase
      .from('profiles').select('company_name').eq('clerk_user_id', userId).single()
    await notifyContractSignedPartial(otherPartyId, id, mySignatory?.company_name ?? 'Votre partenaire')
  }

  return NextResponse.json({ success: true, bothSigned })
}
