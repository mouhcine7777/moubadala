import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/lib/actions/profile'
import { getReceivedRequests, getSentRequests } from '@/lib/actions/requests'
import DemandesClient from './DemandesClient'
import Link from 'next/link'
import clsx from 'clsx'
import DashboardNav from '../components/DashboardNav'



export default async function DemandesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  await getOrCreateProfile(userId, email)

  const [received, sent] = await Promise.all([
    getReceivedRequests(userId),
    getSentRequests(userId),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Mes demandes d'échange</h1>
        </div>
      </div>

      <DashboardNav active="/dashboard/demandes" clerkUserId={userId} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <DemandesClient
          received={received}
          sent={sent}
          clerkUserId={userId}
        />
      </div>
    </div>
  )
}