import { supabase } from '@/lib/supabase'
import type { Profile, Listing } from '@/lib/types'

export async function getOrCreateProfile(clerkUserId: string, email: string): Promise<Profile> {
  // Cherche le profil existant
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (existing) return existing

  // Crée le profil si premier login
  const { data: created, error } = await supabase
    .from('profiles')
    .insert({ clerk_user_id: clerkUserId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return created
}

export async function getListings(clerkUserId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createListing(
    clerkUserId: string,
    data: Omit<Listing, 'id' | 'clerk_user_id' | 'cash_percent' | 'status' | 'featured' | 'views' | 'archived' | 'created_at'>
  ): Promise<{ id: string }> {
    const { data: created, error } = await supabase
      .from('listings')
      .insert({ ...data, clerk_user_id: clerkUserId })
      .select('id')
      .single()
  
    if (error) throw new Error(error.message)
    return created
  }

  export async function updateListing(
    id: string,
    clerkUserId: string,
    data: Partial<Omit<Listing, 'id' | 'clerk_user_id' | 'cash_percent' | 'created_at'>>
  ): Promise<void> {
    const { error } = await supabase
      .from('listings')
      .update(data)
      .eq('id', id)
      .eq('clerk_user_id', clerkUserId) // sécurité : seul l'auteur peut modifier
  
    if (error) throw new Error(error.message)
  }
