import { supabase } from '@/lib/supabase'
import { assertContractInExecution } from '@/lib/contract-utils'
import { logContractEvent } from '@/lib/actions/contracts'
import { getExecutionProgress } from '@/lib/actions/contract-execution'
import { createNotification } from '@/lib/actions/notifications'

/** Étape 1/2 de la clôture — une Partie demande la clôture une fois toutes les prestations validées.
 *  La génération du PV et le passage au statut "clôturé" se font côté serveur (voir confirmClosure). */
export async function requestClosure(contractId: string, clerkUserId: string) {
  const { data: contract, error } = await supabase
    .from('contracts')
    .select('status, party_a_clerk_id, party_b_clerk_id, closure_requested_at')
    .eq('id', contractId)
    .single()
  if (error) throw new Error(error.message)
  assertContractInExecution(contract.status)

  if (contract.closure_requested_at) throw new Error('La clôture a déjà été demandée pour ce contrat.')

  const progress = await getExecutionProgress(contractId)
  if (progress.total === 0 || progress.validated !== progress.total) {
    throw new Error("Toutes les prestations doivent être validées avant de demander la clôture.")
  }

  const { error: updateError } = await supabase
    .from('contracts')
    .update({ closure_requested_by: clerkUserId, closure_requested_at: new Date().toISOString() })
    .eq('id', contractId)
  if (updateError) throw new Error(updateError.message)

  await logContractEvent(contractId, clerkUserId, 'closure_requested')

  const otherParty = contract.party_a_clerk_id === clerkUserId ? contract.party_b_clerk_id : contract.party_a_clerk_id
  if (otherParty) {
    await createNotification({
      clerk_user_id: otherParty,
      type: 'platform',
      title: 'Clôture de votre échange demandée',
      body: "Votre partenaire a demandé la clôture de l'échange — votre confirmation est nécessaire.",
      link: `/dashboard/contracts/${contractId}`,
    })
  }
}

/** Étape 2/2 — confirmation par l'autre Partie : déclenche la génération du PV et le passage à "clôturé".
 *  Passe par une route API car la génération du PDF doit s'exécuter côté serveur (Node). */
export async function confirmClosure(contractId: string, clerkUserId: string) {
  const res = await fetch(`/api/contracts/${contractId}/close`, { method: 'POST' })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la clôture.')
  return json
}
