import { supabase } from '@/lib/supabase'
import type { Contract, ContractStatus } from '@/lib/types'
import { assertContractMutable, deriveExchangeCategory } from '@/lib/contract-utils'
import { createNotification, notifyContractInvited, notifyContractReadyToSign } from '@/lib/actions/notifications'

const CONTRACT_SELECT = `
  *,
  party_a:profiles!contracts_party_a_clerk_id_fkey(
    clerk_user_id, company_name, sector, city, logo_url, phone, email, address,
    ice, rc, if_number, legal_form, capital_social,
    rep_prenom, rep_nom, rep_fonction, rep_email, rep_phone, status
  ),
  party_b:profiles!contracts_party_b_clerk_id_fkey(
    clerk_user_id, company_name, sector, city, logo_url, phone, email, address,
    ice, rc, if_number, legal_form, capital_social,
    rep_prenom, rep_nom, rep_fonction, rep_email, rep_phone, status
  ),
  requests(id, listings(id, title))
`

/** Insertion append-only dans le Journal du Contrat. Ne jamais update()/delete() cette table. */
export async function logContractEvent(
  contractId: string,
  actorClerkId: string | null,
  eventType: string,
  metadata?: Record<string, unknown>
) {
  const { error } = await supabase
    .from('contract_events')
    .insert({ contract_id: contractId, actor_clerk_id: actorClerkId, event_type: eventType, metadata: metadata ?? null })

  if (error) throw new Error(error.message)
}

export async function getContractEvents(contractId: string) {
  const { data, error } = await supabase
    .from('contract_events')
    .select('*, actor:profiles!contract_events_actor_clerk_id_fkey(company_name)')
    .eq('contract_id', contractId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createContract(
  clerkUserId: string,
  opts: { requestId?: string } = {}
): Promise<{ id: string; contract_number: string }> {
  let title: string | null = null

  if (opts.requestId) {
    const { data: request } = await supabase
      .from('requests')
      .select('listings(title)')
      .eq('id', opts.requestId)
      .single()
    const listing = Array.isArray(request?.listings) ? request?.listings[0] : request?.listings
    title = listing?.title ?? null
  }

  const { data: created, error } = await supabase
    .from('contracts')
    .insert({
      request_id: opts.requestId ?? null,
      party_a_clerk_id: clerkUserId,
      created_by_clerk_id: clerkUserId,
      title,
    })
    .select('id, contract_number')
    .single()

  if (error) throw new Error(error.message)

  await logContractEvent(created.id, clerkUserId, 'created', { request_id: opts.requestId ?? null })

  return created
}

export async function getContract(id: string, clerkUserId: string) {
  const { data, error } = await supabase
    .from('contracts')
    .select(CONTRACT_SELECT)
    .eq('id', id)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Supprime un contrat encore à l'état de brouillon (avant tout engagement réel de
 *  la Partie B). Passe par une fonction SQL dédiée — voir migration 007. */
export async function deleteContract(id: string, clerkUserId: string) {
  const { error } = await supabase.rpc('delete_draft_contract', {
    p_contract_id: id,
    p_clerk_user_id: clerkUserId,
  })
  if (error) throw new Error(error.message)
}

export async function getMyContracts(clerkUserId: string) {
  const { data, error } = await supabase
    .from('contracts')
    .select(CONTRACT_SELECT)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Admin uniquement — lecture seule, aucune mutation admin sur les données contractuelles.
 *  Inclut les prestations pour permettre un résumé complet dans l'écran d'administration
 *  sans naviguer vers le dossier détaillé (réservé aux Parties du contrat). */
export async function getAllContracts() {
  const { data, error } = await supabase
    .from('contracts')
    .select(`${CONTRACT_SELECT}, contract_services(id, party, valeur_ht, tva_percent, exec_status)`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

async function getContractStatus(id: string): Promise<ContractStatus> {
  const { data, error } = await supabase.from('contracts').select('status').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data.status
}

/** Recherche d'une entreprise membre pour désigner la Partie B (Étape 1, Cas n°1/n°2). */
export async function searchMembersForContract(clerkUserId: string, query: string) {
  if (!query.trim()) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('clerk_user_id, company_name, sector, city, ice, status, contact_name')
    .not('company_name', 'is', null)
    .neq('clerk_user_id', clerkUserId)
    .or(`company_name.ilike.%${query}%,ice.ilike.%${query}%,city.ilike.%${query}%,sector.ilike.%${query}%`)
    .limit(10)

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Cas n°1/n°2 — la Partie B est déjà membre (active ou en attente d'activation). */
export async function attachExistingPartyB(id: string, clerkUserId: string, partyBClerkId: string) {
  const contract = await supabase.from('contracts').select('party_a_clerk_id, status').eq('id', id).single()
  if (contract.error) throw new Error(contract.error.message)
  assertContractMutable(contract.data.status)

  if (partyBClerkId === contract.data.party_a_clerk_id) {
    throw new Error('Les deux entreprises contractantes doivent être différentes.')
  }

  const { error } = await supabase
    .from('contracts')
    .update({
      party_b_clerk_id: partyBClerkId,
      party_b_pending_email: null,
      party_b_pending_name: null,
      party_b_invite_token: null,
      status: 'en_preparation',
    })
    .eq('id', id)
    .eq('party_a_clerk_id', clerkUserId)

  if (error) throw new Error(error.message)
  await logContractEvent(id, clerkUserId, 'party_b_attached', { party_b_clerk_id: partyBClerkId })

  const { data: partyAProfile } = await supabase
    .from('profiles').select('company_name').eq('clerk_user_id', clerkUserId).single()
  await notifyContractInvited(partyBClerkId, id, partyAProfile?.company_name ?? 'Une entreprise')
}

/** Cas n°3 — la Partie B n'est pas encore inscrite : invitation par email.
 *  Simplification MVP : pas de reprise "au milieu" du formulaire pour l'invité,
 *  la section Partie B reste vide jusqu'à ce qu'il rejoigne la plateforme. */
export async function inviteNonMemberPartyB(
  id: string,
  clerkUserId: string,
  email: string,
  companyNameGuess?: string
): Promise<{ token: string }> {
  const contract = await supabase.from('contracts').select('status').eq('id', id).single()
  if (contract.error) throw new Error(contract.error.message)
  assertContractMutable(contract.data.status)

  const token = crypto.randomUUID()

  const { error } = await supabase
    .from('contracts')
    .update({
      party_b_pending_email: email,
      party_b_pending_name: companyNameGuess ?? null,
      party_b_invite_token: token,
      party_b_invited_at: new Date().toISOString(),
      status: 'en_preparation',
    })
    .eq('id', id)
    .eq('party_a_clerk_id', clerkUserId)

  if (error) throw new Error(error.message)
  await logContractEvent(id, clerkUserId, 'party_b_invited', { email })

  return { token }
}

/** Appelé une fois que l'entreprise invitée a rejoint Moubadala avec le token d'invitation. */
export async function acceptContractInvite(token: string, newClerkUserId: string) {
  const { data: contract, error } = await supabase
    .from('contracts')
    .select('id')
    .eq('party_b_invite_token', token)
    .is('party_b_clerk_id', null)
    .single()

  if (error || !contract) return null

  const { error: updateError } = await supabase
    .from('contracts')
    .update({
      party_b_clerk_id: newClerkUserId,
      party_b_pending_email: null,
      party_b_pending_name: null,
      party_b_invite_token: null,
    })
    .eq('id', contract.id)

  if (updateError) throw new Error(updateError.message)
  await logContractEvent(contract.id, newClerkUserId, 'party_b_joined')

  const { data: full } = await supabase.from('contracts').select('party_a_clerk_id').eq('id', contract.id).single()
  if (full) {
    await createNotification({
      clerk_user_id: full.party_a_clerk_id,
      type: 'contract_invited',
      title: 'Votre partenaire a rejoint Moubadala',
      body: "L'entreprise invitée a rejoint la plateforme, vous pouvez poursuivre votre contrat.",
      link: `/dashboard/contracts/${contract.id}`,
    })
  }

  return contract.id
}

/** Étape 1 — désignation du signataire pour la partie de l'utilisateur courant. */
export async function updateSignatory(
  id: string,
  clerkUserId: string,
  data: { nom: string; prenom: string; fonction: string; email: string; phone: string }
) {
  const contract = await supabase
    .from('contracts')
    .select('party_a_clerk_id, party_b_clerk_id, status')
    .eq('id', id)
    .single()
  if (contract.error) throw new Error(contract.error.message)
  assertContractMutable(contract.data.status)

  const isA = contract.data.party_a_clerk_id === clerkUserId
  const isB = contract.data.party_b_clerk_id === clerkUserId
  if (!isA && !isB) throw new Error("Vous n'êtes pas partie à ce contrat.")

  const prefix = isA ? 'signatory_a' : 'signatory_b'
  const { error } = await supabase
    .from('contracts')
    .update({
      [`${prefix}_nom`]: data.nom,
      [`${prefix}_prenom`]: data.prenom,
      [`${prefix}_fonction`]: data.fonction,
      [`${prefix}_email`]: data.email,
      [`${prefix}_phone`]: data.phone,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  await logContractEvent(id, clerkUserId, 'signatory_designated', { party: isA ? 'a' : 'b' })
}

/** Étape 2 — nature et objet de l'échange. */
export async function updateContractStep2(
  id: string,
  clerkUserId: string,
  data: {
    exchange_type: Contract['exchange_type']
    title: string
    objectif: string[]
    description: string
    execution_mode: Contract['execution_mode']
    lieu_execution: Contract['lieu_execution']
    confidentialite: Contract['confidentialite']
  }
) {
  const status = await getContractStatus(id)
  assertContractMutable(status)

  const { error } = await supabase
    .from('contracts')
    .update({ ...data, category_derived: deriveExchangeCategory(data.exchange_type) })
    .eq('id', id)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)

  if (error) throw new Error(error.message)
  await logContractEvent(id, clerkUserId, 'step2_updated')
}

/** Étape 5 — équilibre économique et compensation. */
export async function updateContractStep5(
  id: string,
  clerkUserId: string,
  data: {
    compensation_prevue: boolean
    compensation_montant: number | null
    compensation_devise: string | null
    compensation_mode: string | null
    compensation_echeance: string | null
  }
) {
  const status = await getContractStatus(id)
  assertContractMutable(status)

  const { error } = await supabase
    .from('contracts')
    .update(data)
    .eq('id', id)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)

  if (error) throw new Error(error.message)
  await logContractEvent(id, clerkUserId, 'step5_updated')
}

/** Étape 6 — calendrier d'exécution. */
export async function updateContractStep6(
  id: string,
  clerkUserId: string,
  data: {
    calendar_start_date: string | null
    calendar_end_date: string | null
    calendar_mode: Contract['calendar_mode']
  }
) {
  const status = await getContractStatus(id)
  assertContractMutable(status)

  const { error } = await supabase
    .from('contracts')
    .update(data)
    .eq('id', id)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)

  if (error) throw new Error(error.message)
  await logContractEvent(id, clerkUserId, 'step6_updated')
}

export async function addMilestone(contractId: string, clerkUserId: string, label: string, dueDate: string) {
  const status = await getContractStatus(contractId)
  assertContractMutable(status)

  const { error } = await supabase.from('contract_milestones').insert({ contract_id: contractId, label, due_date: dueDate })
  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'milestone_added', { label, due_date: dueDate })
}

export async function deleteMilestone(milestoneId: string, contractId: string) {
  const status = await getContractStatus(contractId)
  assertContractMutable(status)

  const { error } = await supabase.from('contract_milestones').delete().eq('id', milestoneId).eq('contract_id', contractId)
  if (error) throw new Error(error.message)
}

export async function getMilestones(contractId: string) {
  const { data, error } = await supabase
    .from('contract_milestones')
    .select('*')
    .eq('contract_id', contractId)
    .order('due_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Validation avant signature (Chapitre VII / Étape 8). Simplification MVP :
 * le cahier des charges distingue "en_attente_validation" de "en_attente_signature",
 * mais l'Étape 8 (résumé + 2 cases à cocher + "Valider et signer") remplit déjà
 * exactement le rôle de la validation finale — on ne modélise donc pas une étape
 * de validation séparée. submitForValidation vérifie la complétude des données
 * et fait directement passer le contrat en 'en_attente_signature'.
 */
export async function submitForValidation(id: string, clerkUserId: string) {
  const { data: contract, error } = await supabase
    .from('contracts')
    .select(`
      status, party_a_clerk_id, party_b_clerk_id,
      exchange_type, title, description,
      contract_services(id, party, description, valeur_ht, delai_debut, delai_fin, quantite)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  assertContractMutable(contract.status)

  const problems: string[] = []
  if (!contract.party_b_clerk_id) problems.push("L'entreprise partenaire n'a pas encore rejoint le contrat.")
  if (!contract.exchange_type) problems.push("Le type d'échange n'est pas renseigné.")
  if (!contract.title) problems.push("Le titre de l'échange n'est pas renseigné.")
  if (!contract.description) problems.push("La description de l'échange n'est pas renseignée.")

  const services = contract.contract_services ?? []
  const servicesA = services.filter((s: any) => s.party === 'a')
  const servicesB = services.filter((s: any) => s.party === 'b')
  if (servicesA.length === 0) problems.push("Aucune prestation renseignée pour l'Entreprise A.")
  if (servicesB.length === 0) problems.push("Aucune prestation renseignée pour l'Entreprise B.")
  for (const s of services) {
    if (!s.description) problems.push(`Une prestation (${s.id}) n'a pas de description.`)
    if (s.valeur_ht == null) problems.push(`Une prestation (${s.id}) n'a pas de valeur.`)
    if (s.delai_debut && s.delai_fin && s.delai_fin < s.delai_debut) {
      problems.push(`Une prestation (${s.id}) a une date de fin antérieure à sa date de début.`)
    }
    if (s.quantite != null && s.quantite < 0) problems.push(`Une prestation (${s.id}) a une quantité négative.`)
  }

  if (problems.length > 0) {
    throw new Error(problems.join(' '))
  }

  if (contract.status === 'en_attente_signature') return // déjà prêt, rien à refaire

  const { error: updateError } = await supabase
    .from('contracts')
    .update({ status: 'en_attente_signature' })
    .eq('id', id)

  if (updateError) throw new Error(updateError.message)
  await logContractEvent(id, clerkUserId, 'submitted_for_signature')

  await Promise.all([
    notifyContractReadyToSign(contract.party_a_clerk_id, id),
    notifyContractReadyToSign(contract.party_b_clerk_id!, id),
  ])
}
