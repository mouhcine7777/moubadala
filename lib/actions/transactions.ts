import { supabase } from '@/lib/supabase'

export async function getMyTransactions(clerkUserId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      party_a:profiles!transactions_party_a_clerk_id_fkey(company_name, sector, city, email, phone),
      party_b:profiles!transactions_party_b_clerk_id_fkey(company_name, sector, city, email, phone),
      requests(id, listings(id, title))
    `)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createTransaction(data: {
  request_id: string
  party_a_clerk_id: string
  party_b_clerk_id: string
  party_a_offering: string
  party_b_offering: string
  party_a_value_mad: number
  party_b_value_mad: number
  notes: string | null
}) {
  const { error } = await supabase
    .from('transactions')
    .insert(data)

  if (error) throw new Error(error.message)
}

export async function updateTransactionStatus(
  id: string,
  clerkUserId: string,
  status: 'ongoing' | 'partial' | 'closed'
) {
  const { error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id)
    .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`)

  if (error) throw new Error(error.message)
}

export async function getAllTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      party_a:profiles!transactions_party_a_clerk_id_fkey(company_name, sector, city, email),
      party_b:profiles!transactions_party_b_clerk_id_fkey(company_name, sector, city, email),
      requests(id, listings(id, title))
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}