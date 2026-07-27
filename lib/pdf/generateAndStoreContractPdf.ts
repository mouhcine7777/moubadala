import { supabase } from '@/lib/supabase'
import { getContract } from '@/lib/actions/contracts'
import { getServices } from '@/lib/actions/contract-services'
import { getMilestones } from '@/lib/actions/contracts'
import { getContractDocuments } from '@/lib/actions/contract-documents'
import { renderContractPdfBuffer } from './renderContractPdf'

/** Génère le PDF du contrat à partir des données actuelles et le stocke dans le bucket
 *  "contract-documents". Met à jour contracts.pdf_url. Retourne l'URL publique. */
export async function generateAndStoreContractPdf(contractId: string, clerkUserId: string): Promise<string> {
  const contract = await getContract(contractId, clerkUserId)
  const [services, milestones, documents] = await Promise.all([
    getServices(contractId),
    getMilestones(contractId),
    getContractDocuments(contractId),
  ])

  const buffer = await renderContractPdfBuffer(contract, services, milestones, documents)

  const path = `${contractId}/contrat-${contract.contract_number}.pdf`
  const { error: uploadError } = await supabase.storage
    .from('contract-documents')
    .upload(path, buffer, { contentType: 'application/pdf', upsert: true })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from('contract-documents').getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('contracts')
    .update({ pdf_url: data.publicUrl })
    .eq('id', contractId)

  if (updateError) throw new Error(updateError.message)

  return data.publicUrl
}
