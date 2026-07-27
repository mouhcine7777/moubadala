import { supabase } from '@/lib/supabase'
import { createNotification } from './notifications'

export async function getContractMessages(contractId: string, clerkUserId: string) {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      id, contract_number, title, party_a_clerk_id, party_b_clerk_id,
      party_a:profiles!contracts_party_a_clerk_id_fkey(company_name, sector),
      party_b:profiles!contracts_party_b_clerk_id_fkey(company_name, sector),
      contract_messages(id, content, sender_clerk_id, created_at, attachment_url, attachment_name, attachment_size)
    `)
    .eq('id', contractId)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function sendContractMessage(
  contractId: string,
  senderClerkId: string,
  content: string,
  attachment?: { url: string; name: string; size: number }
) {
  const { error } = await supabase
    .from('contract_messages')
    .insert({
      contract_id:     contractId,
      sender_clerk_id: senderClerkId,
      content,
      attachment_url:  attachment?.url  ?? null,
      attachment_name: attachment?.name ?? null,
      attachment_size: attachment?.size ?? null,
    })

  if (error) throw new Error(error.message)

  const { data: contract } = await supabase
    .from('contracts')
    .select('party_a_clerk_id, party_b_clerk_id')
    .eq('id', contractId)
    .single()

  if (contract) {
    const receiverId = contract.party_a_clerk_id === senderClerkId
      ? contract.party_b_clerk_id
      : contract.party_a_clerk_id

    if (receiverId) {
      await createNotification({
        clerk_user_id: receiverId,
        type: 'message',
        title: attachment ? '📎 Fichier partagé (contrat)' : 'Nouveau message sur votre contrat',
        body: attachment ? attachment.name : (content.length > 60 ? content.slice(0, 60) + '...' : content),
        link: `/dashboard/contracts/${contractId}/messages`,
      })
    }
  }
}

export async function markContractMessagesAsRead(contractId: string, clerkUserId: string) {
  await supabase
    .from('contract_message_reads')
    .upsert(
      { contract_id: contractId, clerk_user_id: clerkUserId, last_read_at: new Date().toISOString() },
      { onConflict: 'contract_id,clerk_user_id' }
    )
}

export async function getContractUnreadCounts(clerkUserId: string): Promise<Record<string, number>> {
  const { data: contracts } = await supabase
    .from('contracts')
    .select('id, party_a_clerk_id, party_b_clerk_id')
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)

  if (!contracts || contracts.length === 0) return {}

  const { data: reads } = await supabase
    .from('contract_message_reads')
    .select('contract_id, last_read_at')
    .eq('clerk_user_id', clerkUserId)

  const readsMap: Record<string, string> = {}
  reads?.forEach(r => { readsMap[r.contract_id] = r.last_read_at })

  const counts: Record<string, number> = {}
  for (const c of contracts) {
    const lastRead = readsMap[c.id]
    const query = supabase
      .from('contract_messages')
      .select('id', { count: 'exact', head: true })
      .eq('contract_id', c.id)
      .neq('sender_clerk_id', clerkUserId)

    if (lastRead) query.gt('created_at', lastRead)

    const { count } = await query
    if (count && count > 0) counts[c.id] = count
  }

  return counts
}
