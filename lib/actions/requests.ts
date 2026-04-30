import { supabase } from '@/lib/supabase'
import { createNotification } from './notifications'


export async function sendRequest(
  listingId: string,
  senderClerkId: string,
  receiverClerkId: string,
  message: string | null
) {
  // Vérifie si une demande existe déjà
  const { data: existing } = await supabase
    .from('requests')
    .select('id')
    .eq('listing_id', listingId)
    .eq('sender_clerk_id', senderClerkId)
    .single()

  if (existing) throw new Error('Vous avez déjà envoyé une demande pour cette annonce.')

  const { error } = await supabase
    .from('requests')
    .insert({
      listing_id:        listingId,
      sender_clerk_id:   senderClerkId,
      receiver_clerk_id: receiverClerkId,
      message,
    })

  if (error) throw new Error(error.message)
    // Notifie le receveur
  const { data: listing } = await supabase
  .from('listings')
  .select('title')
  .eq('id', listingId)
  .single()

await createNotification({
  clerk_user_id: receiverClerkId,
  type:  'new_request',
  title: 'Nouvelle demande d\'échange',
  body:  `Une entreprise est intéressée par votre annonce "${listing?.title}"`,
  link:  '/dashboard/demandes',
})

}

export async function getReceivedRequests(clerkUserId: string) {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      listings(id, title, value_mad, city, exchange_type, listing_type),
      sender:profiles!requests_sender_clerk_id_fkey(company_name, sector, city, email, phone)
    `)
    .eq('receiver_clerk_id', clerkUserId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getSentRequests(clerkUserId: string) {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      listings(id, title, value_mad, city, exchange_type, listing_type),
      receiver:profiles!requests_receiver_clerk_id_fkey(company_name, sector, city, email, phone)
    `)
    .eq('sender_clerk_id', clerkUserId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateRequestStatus(
  id: string,
  clerkUserId: string,
  status: 'accepted' | 'refused' | 'finalizing'
) {
  const { error } = await supabase
    .from('requests')
    .update({ status })
    .eq('id', id)
    .eq('receiver_clerk_id', clerkUserId)

  if (error) throw new Error(error.message)
}