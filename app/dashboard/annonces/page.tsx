import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile, getListings } from '@/lib/actions/profile'
import MesAnnoncesClient from './MesAnnoncesClient'
import Link from 'next/link'
import clsx from 'clsx'
import DashboardNav from '../components/DashboardNav'

export default async function MesAnnoncesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  await getOrCreateProfile(userId, email)
  const listings = await getListings(userId)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Mes offres d'échange</h1>
        </div>
      </div>

      <DashboardNav active="/dashboard/annonces" clerkUserId={userId} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <MesAnnoncesClient listings={listings} clerkUserId={userId} />
      </div>
    </div>
  )
}