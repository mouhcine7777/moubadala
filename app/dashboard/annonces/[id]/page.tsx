import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getOrCreateProfile } from '@/lib/actions/profile'
import EditListingForm from './EditListingForm'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''

  // Vérifie que l'annonce appartient bien à cet utilisateur
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('clerk_user_id', userId)
    .single()

  if (!listing) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Modifier l'annonce</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <EditListingForm listing={listing} clerkUserId={userId} />
      </div>
    </div>
  )
}