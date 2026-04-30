import { supabase } from '@/lib/supabase'

export async function getMyPartners(clerkUserId: string) {
    const { data: requests } = await supabase
      .from('requests')
      .select(`
        id, status, created_at,
        sender_clerk_id,
        receiver_clerk_id,
        sender:profiles!requests_sender_clerk_id_fkey(clerk_user_id, company_name, sector, city, email, phone, description),
        receiver:profiles!requests_receiver_clerk_id_fkey(clerk_user_id, company_name, sector, city, email, phone, description)
      `)
      .or(`sender_clerk_id.eq.${clerkUserId},receiver_clerk_id.eq.${clerkUserId}`)
      .in('status', ['accepted', 'finalizing'])
      .order('created_at', { ascending: false })
  
    if (!requests) return []
  
    const seen = new Set<string>()
    const partners: any[] = []
  
    for (const req of requests) {
      const isSender = req.sender_clerk_id === clerkUserId
      const partnerProfile = isSender
        ? (Array.isArray(req.receiver) ? req.receiver[0] : req.receiver)
        : (Array.isArray(req.sender)   ? req.sender[0]   : req.sender)
  
      if (!partnerProfile || seen.has(partnerProfile.clerk_user_id)) continue
      seen.add(partnerProfile.clerk_user_id)
      partners.push({
        ...partnerProfile,
        request_status:  req.status,
        connected_since: req.created_at,
      })
    }
  
    return partners
  }

export async function getAllMembers(clerkUserId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('clerk_user_id, company_name, sector, city, description, created_at')
    .not('company_name', 'is', null)
    .neq('clerk_user_id', clerkUserId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}