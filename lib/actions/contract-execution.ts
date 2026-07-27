import { supabase } from '@/lib/supabase'
import { assertContractInExecution } from '@/lib/contract-utils'
import { logContractEvent } from '@/lib/actions/contracts'
import {
  notifyContractServiceDeclared, notifyContractReserveRaised, notifyContractReserveResolved,
} from '@/lib/actions/notifications'

async function getContractForExecution(contractId: string) {
  const { data, error } = await supabase
    .from('contracts')
    .select('id, status, party_a_clerk_id, party_b_clerk_id')
    .eq('id', contractId)
    .single()
  if (error) throw new Error(error.message)
  return data
}

function otherParty(contract: { party_a_clerk_id: string; party_b_clerk_id: string | null }, clerkUserId: string) {
  return contract.party_a_clerk_id === clerkUserId ? contract.party_b_clerk_id : contract.party_a_clerk_id
}

export async function declareServiceDone(
  serviceId: string,
  contractId: string,
  clerkUserId: string,
  comment?: string
) {
  const contract = await getContractForExecution(contractId)
  assertContractInExecution(contract.status)

  const { data: service, error } = await supabase
    .from('contract_services')
    .update({
      exec_status: 'realisee',
      declared_done_at: new Date().toISOString(),
      declared_done_by: clerkUserId,
      declared_comment: comment ?? null,
    })
    .eq('id', serviceId)
    .eq('contract_id', contractId)
    .select('label')
    .single()

  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'service_declared_done', { service_id: serviceId })

  const receiver = otherParty(contract, clerkUserId)
  if (receiver) await notifyContractServiceDeclared(receiver, contractId, service.label)
}

export async function validateService(serviceId: string, contractId: string, clerkUserId: string) {
  const contract = await getContractForExecution(contractId)
  assertContractInExecution(contract.status)

  const { error } = await supabase
    .from('contract_services')
    .update({ exec_status: 'validee', validated_at: new Date().toISOString(), validated_by: clerkUserId })
    .eq('id', serviceId)
    .eq('contract_id', contractId)

  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'service_validated', { service_id: serviceId })
}

export async function raiseReserve(
  serviceId: string,
  contractId: string,
  clerkUserId: string,
  subject: string,
  description: string
) {
  const contract = await getContractForExecution(contractId)
  assertContractInExecution(contract.status)

  const { error: insertError } = await supabase
    .from('contract_reserves')
    .insert({ contract_id: contractId, contract_service_id: serviceId, raised_by_clerk_id: clerkUserId, subject, description })

  if (insertError) throw new Error(insertError.message)

  const { error: updateError } = await supabase
    .from('contract_services')
    .update({ exec_status: 'contestee' })
    .eq('id', serviceId)
    .eq('contract_id', contractId)

  if (updateError) throw new Error(updateError.message)
  await logContractEvent(contractId, clerkUserId, 'reserve_raised', { service_id: serviceId, subject })

  const receiver = otherParty(contract, clerkUserId)
  if (receiver) await notifyContractReserveRaised(receiver, contractId, subject)
}

export async function resolveReserve(
  reserveId: string,
  contractId: string,
  clerkUserId: string,
  resolutionComment: string,
  newServiceStatus: 'en_cours' | 'validee' = 'en_cours'
) {
  const contract = await getContractForExecution(contractId)
  assertContractInExecution(contract.status)

  const { data: reserve, error } = await supabase
    .from('contract_reserves')
    .update({ status: 'resolue', resolved_at: new Date().toISOString(), resolved_by: clerkUserId, resolution_comment: resolutionComment })
    .eq('id', reserveId)
    .eq('contract_id', contractId)
    .select('contract_service_id, subject, raised_by_clerk_id')
    .single()

  if (error) throw new Error(error.message)

  await supabase
    .from('contract_services')
    .update({ exec_status: newServiceStatus })
    .eq('id', reserve.contract_service_id)
    .eq('contract_id', contractId)

  await logContractEvent(contractId, clerkUserId, 'reserve_resolved', { reserve_id: reserveId })
  await notifyContractReserveResolved(reserve.raised_by_clerk_id, contractId, reserve.subject)
}

export async function getReserves(contractId: string) {
  const { data, error } = await supabase
    .from('contract_reserves')
    .select('*')
    .eq('contract_id', contractId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getExecutionProgress(contractId: string): Promise<{ total: number; validated: number; percent: number }> {
  const { data, error } = await supabase
    .from('contract_services')
    .select('exec_status')
    .eq('contract_id', contractId)

  if (error) throw new Error(error.message)
  const total = data?.length ?? 0
  const validated = data?.filter(s => s.exec_status === 'validee').length ?? 0
  return { total, validated, percent: total === 0 ? 0 : Math.round((validated / total) * 100) }
}
