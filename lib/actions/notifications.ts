import { supabase } from '@/lib/supabase'

export type Notification = {
  id: string
  clerk_user_id: string
  type: 'new_request' | 'message' | 'listing_expiring' | 'new_matching' | 'platform'
  title: string
  body: string | null
  link: string | null
  read: boolean
  created_at: string
}

export async function getNotifications(clerkUserId: string): Promise<Notification[]> {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('created_at', { ascending: false })
    .limit(30)
  return data ?? []
}

export async function markAllRead(clerkUserId: string) {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('clerk_user_id', clerkUserId)
    .eq('read', false)
}

export async function markOneRead(id: string) {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
}

export async function createNotification(data: {
  clerk_user_id: string
  type: Notification['type']
  title: string
  body?: string
  link?: string
}) {
  await supabase.from('notifications').insert(data)
}

export async function getUnreadNotifCount(clerkUserId: string): Promise<number> {
  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('clerk_user_id', clerkUserId)
    .eq('read', false)
  return count ?? 0
}
export async function notifyProfileApproved(clerkUserId: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'platform',
    title: 'Profil approuvé !',
    body:  'Votre profil a été validé. Vous pouvez maintenant publier des annonces sur Moubadala.',
    link:  '/publier',
  })
}

export async function notifyProfileRejected(clerkUserId: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'platform',
    title: 'Profil non validé',
    body:  'Votre profil nécessite des corrections. Veuillez le compléter et le soumettre à nouveau.',
    link:  '/dashboard/profil',
  })
}