import { supabase } from '@/lib/supabase'
import { createNotification } from './notifications'


export async function getConversations(clerkUserId: string) {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      listings(id, title, value_mad, city),
      sender:profiles!requests_sender_clerk_id_fkey(company_name, sector, city, email),
      receiver:profiles!requests_receiver_clerk_id_fkey(company_name, sector, city, email),
      messages(id, content, sender_clerk_id, created_at, attachment_url, attachment_name, attachment_size)
    `)
    .or(`sender_clerk_id.eq.${clerkUserId},receiver_clerk_id.eq.${clerkUserId}`)
    .in('status', ['accepted', 'finalizing'])
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getConversation(requestId: string, clerkUserId: string) {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      listings(id, title, value_mad, city, listing_type, exchange_type),
      sender:profiles!requests_sender_clerk_id_fkey(company_name, sector, city, email, phone),
      receiver:profiles!requests_receiver_clerk_id_fkey(company_name, sector, city, email, phone),
      messages(id, content, sender_clerk_id, created_at, attachment_url, attachment_name, attachment_size)
    `)
    .eq('id', requestId)
    .or(`sender_clerk_id.eq.${clerkUserId},receiver_clerk_id.eq.${clerkUserId}`)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function sendMessage(
  requestId: string,
  senderClerkId: string,
  content: string,
  attachment?: { url: string; name: string; size: number }
) {
  const { error } = await supabase
    .from('messages')
    .insert({
      request_id:      requestId,
      sender_clerk_id: senderClerkId,
      content,
      attachment_url:  attachment?.url  ?? null,
      attachment_name: attachment?.name ?? null,
      attachment_size: attachment?.size ?? null,
    })

  if (error) throw new Error(error.message)

  const { data: request } = await supabase
    .from('requests')
    .select('sender_clerk_id, receiver_clerk_id')
    .eq('id', requestId)
    .single()

  if (request) {
    const receiverId = request.sender_clerk_id === senderClerkId
      ? request.receiver_clerk_id
      : request.sender_clerk_id

    await createNotification({
      clerk_user_id: receiverId,
      type:  attachment ? 'message' : 'message',
      title: attachment ? '📎 Fichier partagé' : 'Nouveau message',
      body:  attachment ? attachment.name : (content.length > 60 ? content.slice(0, 60) + '...' : content),
      link:  `/dashboard/messages/${requestId}`,
    })
  }
}

export async function markConversationAsRead(
    requestId: string,
    clerkUserId: string
  ) {
    await supabase
      .from('message_reads')
      .upsert(
        { request_id: requestId, clerk_user_id: clerkUserId, last_read_at: new Date().toISOString() },
        { onConflict: 'request_id,clerk_user_id' }
      )
  }
  
  export async function getUnreadCounts(clerkUserId: string): Promise<Record<string, number>> {
    // Récupère les conversations actives
    const { data: conversations } = await supabase
      .from('requests')
      .select('id, sender_clerk_id, receiver_clerk_id')
      .or(`sender_clerk_id.eq.${clerkUserId},receiver_clerk_id.eq.${clerkUserId}`)
      .in('status', ['accepted', 'finalizing'])
  
    if (!conversations || conversations.length === 0) return {}
  
    // Récupère les last_read_at pour cet utilisateur
    const { data: reads } = await supabase
      .from('message_reads')
      .select('request_id, last_read_at')
      .eq('clerk_user_id', clerkUserId)
  
    const readsMap: Record<string, string> = {}
    reads?.forEach(r => { readsMap[r.request_id] = r.last_read_at })
  
    // Compte les messages non lus par conversation
    const counts: Record<string, number> = {}
  
    for (const conv of conversations) {
      const lastRead = readsMap[conv.id]
      const query = supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('request_id', conv.id)
        .neq('sender_clerk_id', clerkUserId)
  
      if (lastRead) {
        query.gt('created_at', lastRead)
      }
  
      const { count } = await query
      if (count && count > 0) counts[conv.id] = count
    }
  
    return counts
  }