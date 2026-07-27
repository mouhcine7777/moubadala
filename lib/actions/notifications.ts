import { supabase } from '@/lib/supabase'

export type Notification = {
  id: string
  clerk_user_id: string
  type: 'new_request' | 'message' | 'listing_expiring' | 'new_matching' | 'platform'
    | 'contract_invited' | 'contract_ready_to_sign' | 'contract_signed_partial' | 'contract_signed_complete'
    | 'contract_service_declared' | 'contract_reserve_raised' | 'contract_reserve_resolved'
    | 'contract_deadline_reminder' | 'contract_closed'
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

// ── Assistant Intelligent de Contractualisation (AIC) ──────────────────────

export async function notifyContractInvited(clerkUserId: string, contractId: string, companyName: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_invited',
    title: `${companyName} vous propose un contrat d'échange`,
    body:  'Consultez et complétez le contrat directement sur Moubadala.',
    link:  `/dashboard/contracts/${contractId}`,
  })
}

export async function notifyContractReadyToSign(clerkUserId: string, contractId: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_ready_to_sign',
    title: 'Contrat prêt à signer',
    body:  'Toutes les informations ont été validées, votre contrat peut être signé électroniquement.',
    link:  `/dashboard/contracts/${contractId}`,
  })
}

export async function notifyContractSignedPartial(clerkUserId: string, contractId: string, companyName: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_signed_partial',
    title: `${companyName} a signé le contrat`,
    body:  'Il ne manque plus que votre signature pour finaliser le contrat.',
    link:  `/dashboard/contracts/${contractId}`,
  })
}

export async function notifyContractSignedComplete(clerkUserId: string, contractId: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_signed_complete',
    title: 'Contrat signé par les deux Parties',
    body:  "Le contrat est désormais en cours d'exécution. Le PDF signé est disponible dans votre dossier.",
    link:  `/dashboard/contracts/${contractId}`,
  })
}

export async function notifyContractServiceDeclared(clerkUserId: string, contractId: string, label: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_service_declared',
    title: `Prestation déclarée réalisée (${label})`,
    body:  "L'autre Partie a déclaré une prestation réalisée. Merci de la valider ou de formuler une réserve.",
    link:  `/dashboard/contracts/${contractId}`,
  })
}

export async function notifyContractReserveRaised(clerkUserId: string, contractId: string, subject: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_reserve_raised',
    title: `Réserve émise : ${subject}`,
    body:  "Une réserve a été émise sur une prestation de votre contrat.",
    link:  `/dashboard/contracts/${contractId}`,
  })
}

export async function notifyContractReserveResolved(clerkUserId: string, contractId: string, subject: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_reserve_resolved',
    title: `Réserve levée : ${subject}`,
    body:  'La réserve a été levée par votre partenaire.',
    link:  `/dashboard/contracts/${contractId}`,
  })
}

export async function notifyContractClosed(clerkUserId: string, contractId: string) {
  await createNotification({
    clerk_user_id: clerkUserId,
    type:  'contract_closed',
    title: 'Échange clôturé',
    body:  'Le procès-verbal de clôture est disponible dans votre dossier.',
    link:  `/dashboard/contracts/${contractId}`,
  })
}