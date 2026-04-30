import { supabase } from '@/lib/supabase'
import type { Listing, Profile } from '@/lib/types'

export type ListingWithProfile = Listing & {
  profiles: Pick<Profile, 'company_name' | 'sector' | 'city' | 'email' | 'phone'>
}

export async function getAllListings(): Promise<ListingWithProfile[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(company_name, sector, city, email, phone)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateListingStatus(
  id: string,
  status: 'published' | 'paused' | 'pending'
): Promise<void> {
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
}