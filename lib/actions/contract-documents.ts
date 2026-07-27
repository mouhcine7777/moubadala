import { supabase } from '@/lib/supabase'
import type { ContractDocument } from '@/lib/types'
import { assertContractMutable } from '@/lib/contract-utils'
import { logContractEvent } from '@/lib/actions/contracts'

async function getContractStatus(contractId: string) {
  const { data, error } = await supabase.from('contracts').select('status').eq('id', contractId).single()
  if (error) throw new Error(error.message)
  return data.status
}

export async function getContractDocuments(contractId: string): Promise<ContractDocument[]> {
  const { data, error } = await supabase
    .from('contract_documents')
    .select('*')
    .eq('contract_id', contractId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

/** Le fichier est déjà uploadé côté client vers le bucket "contract-documents" (même
 *  convention que DocumentsClient.tsx) — cette action n'enregistre que les métadonnées. */
export async function uploadContractDocument(
  contractId: string,
  clerkUserId: string,
  data: {
    category: ContractDocument['category']
    title: string
    file_url: string
    file_name: string
    file_size: number
    service_id?: string | null
    comment?: string | null
  }
): Promise<{ id: string }> {
  const status = await getContractStatus(contractId)
  assertContractMutable(status)

  const { data: created, error } = await supabase
    .from('contract_documents')
    .insert({ contract_id: contractId, uploaded_by_clerk_id: clerkUserId, ...data })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'document_added', { document_id: created.id, category: data.category })
  return created
}

export async function deleteContractDocument(id: string, contractId: string, clerkUserId: string) {
  const status = await getContractStatus(contractId)
  assertContractMutable(status)

  const { error } = await supabase.from('contract_documents').delete().eq('id', id).eq('contract_id', contractId)
  if (error) throw new Error(error.message)
  await logContractEvent(contractId, clerkUserId, 'document_deleted', { document_id: id })
}
