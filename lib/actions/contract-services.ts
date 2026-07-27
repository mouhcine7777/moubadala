import { supabase } from '@/lib/supabase'
import type { ContractService, ContractServiceParty } from '@/lib/types'
import { assertContractMutable, sumPartyTotal } from '@/lib/contract-utils'
import { logContractEvent } from '@/lib/actions/contracts'

async function getContractStatus(contractId: string) {
  const { data, error } = await supabase.from('contracts').select('status').eq('id', contractId).single()
  if (error) throw new Error(error.message)
  return data.status
}

export async function getServices(contractId: string): Promise<ContractService[]> {
  const { data, error } = await supabase
    .from('contract_services')
    .select('*')
    .eq('contract_id', contractId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Totaux live (TTC) par partie — alimente l'écran d'équilibre économique (Étape 5). */
export async function getContractTotals(contractId: string): Promise<{ a: number; b: number; difference: number }> {
  const services = await getServices(contractId)
  const a = sumPartyTotal(services, 'a')
  const b = sumPartyTotal(services, 'b')
  return { a, b, difference: Math.round((a - b) * 100) / 100 }
}

export type ServiceInput = {
  nature: ContractService['nature']
  description: string
  quantite: number | null
  unite: string | null
  valeur_ht: number
  tva_percent: number
  delai_debut: string | null
  delai_fin: string | null
  lieu_execution: string | null
  conditions_particulieres: string | null
  garantie: boolean
  garantie_nature: string | null
  garantie_duree: string | null
  garantie_conditions: string | null
}

export async function addService(
  contractId: string,
  clerkUserId: string,
  party: ContractServiceParty,
  data: ServiceInput
): Promise<{ id: string }> {
  const status = await getContractStatus(contractId)
  assertContractMutable(status)

  const { count } = await supabase
    .from('contract_services')
    .select('id', { count: 'exact', head: true })
    .eq('contract_id', contractId)
    .eq('party', party)

  const label = `PREST-${party.toUpperCase()}-${String((count ?? 0) + 1).padStart(3, '0')}`

  const { data: created, error } = await supabase
    .from('contract_services')
    .insert({ contract_id: contractId, party, label, ...data })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'service_added', { service_id: created.id, party, label })
  return created
}

export async function updateService(
  id: string,
  contractId: string,
  clerkUserId: string,
  data: Partial<ServiceInput>
) {
  const status = await getContractStatus(contractId)
  assertContractMutable(status)

  const { error } = await supabase
    .from('contract_services')
    .update(data)
    .eq('id', id)
    .eq('contract_id', contractId)

  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'service_updated', { service_id: id })
}

export async function deleteService(id: string, contractId: string, clerkUserId: string) {
  const status = await getContractStatus(contractId)
  assertContractMutable(status)

  const { error } = await supabase.from('contract_services').delete().eq('id', id).eq('contract_id', contractId)
  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'service_deleted', { service_id: id })
}
