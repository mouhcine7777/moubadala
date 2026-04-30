import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/lib/actions/profile'
import PublierForm from './PublierForm'

export default async function PublierPage() {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  const profile = await getOrCreateProfile(userId, email)

  if (!profile.company_name || !profile.sector || !profile.city || !profile.email) {
    redirect('/dashboard/profil?from=publier')
  }
  
  // Ajoute ces vérifications après :
  if (profile.status === 'incomplete' || profile.status === null) {
    redirect('/dashboard/profil?from=publier')
  }
  
  if (profile.status === 'pending_review') {
    redirect('/dashboard?status=pending_review')
  }
  
  if (profile.status === 'rejected') {
    redirect('/dashboard?status=rejected')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Publier une annonce</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PublierForm clerkUserId={userId} defaultCity={profile.city ?? ''} />
      </div>
    </div>
  )
}