import { supabase } from '@/lib/supabase'

export type Document = {
  id: string
  clerk_user_id: string
  name: string
  type: string
  url: string
  size: number | null
  created_at: string
}

export async function getMyDocuments(clerkUserId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function deleteDocument(id: string, clerkUserId: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)

  if (error) throw new Error(error.message)
}