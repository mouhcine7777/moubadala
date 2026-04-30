import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/lib/actions/profile'
import ProfileForm from './ProfileForm'
import Link from 'next/link'
import clsx from 'clsx'
import DashboardNav from '../components/DashboardNav'


export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const { from } = await searchParams

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  const profile = await getOrCreateProfile(userId, email)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Profil entreprise</h1>
        </div>
      </div>

      <DashboardNav active="/dashboard/profil" clerkUserId={userId} />

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4">

        {/* Bandeau si redirigé depuis /publier */}
        {from === 'publier' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
            Complétez votre profil entreprise avant de publier une annonce.
          </div>
        )}

        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}