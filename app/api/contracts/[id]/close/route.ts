import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { logContractEvent } from '@/lib/actions/contracts'
import { getServices } from '@/lib/actions/contract-services'
import { getReserves, getExecutionProgress } from '@/lib/actions/contract-execution'
import { notifyContractClosed } from '@/lib/actions/notifications'
import { renderClosurePvBuffer } from '@/lib/pdf/renderClosurePvPdf'

export const runtime = 'nodejs'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })

  const { id } = await params

  const { data: contract, error } = await supabase
    .from('contracts')
    .select(`
      *,
      party_a:profiles!contracts_party_a_clerk_id_fkey(company_name),
      party_b:profiles!contracts_party_b_clerk_id_fkey(company_name)
    `)
    .eq('id', id)
    .single()

  if (error || !contract) return NextResponse.json({ error: 'Contrat introuvable.' }, { status: 404 })
  if (contract.party_a_clerk_id !== userId && contract.party_b_clerk_id !== userId) {
    return NextResponse.json({ error: "Vous n'êtes pas partie à ce contrat." }, { status: 403 })
  }
  if (contract.status !== 'en_execution') {
    return NextResponse.json({ error: "Ce contrat n'est pas en cours d'exécution." }, { status: 400 })
  }
  if (!contract.closure_requested_by) {
    return NextResponse.json({ error: "La clôture n'a pas encore été demandée." }, { status: 400 })
  }
  if (contract.closure_requested_by === userId) {
    return NextResponse.json({ error: "La clôture doit être confirmée par l'autre Partie." }, { status: 400 })
  }

  const progress = await getExecutionProgress(id)
  if (progress.total === 0 || progress.validated !== progress.total) {
    return NextResponse.json({ error: 'Toutes les prestations doivent être validées avant la clôture.' }, { status: 400 })
  }

  const [services, reserves] = await Promise.all([getServices(id), getReserves(id)])
  const buffer = await renderClosurePvBuffer(contract, services, reserves)

  const path = `${id}/pv-cloture-${contract.contract_number}.pdf`
  const { error: uploadError } = await supabase.storage
    .from('contract-documents')
    .upload(path, buffer, { contentType: 'application/pdf', upsert: true })
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('contract-documents').getPublicUrl(path)

  const now = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('contracts')
    .update({ status: 'cloture', closed_at: now, closure_pv_url: urlData.publicUrl })
    .eq('id', id)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  await logContractEvent(id, userId, 'closure_confirmed')
  await Promise.all([
    notifyContractClosed(contract.party_a_clerk_id, id),
    notifyContractClosed(contract.party_b_clerk_id, id),
  ])

  return NextResponse.json({ success: true, url: urlData.publicUrl })
}
