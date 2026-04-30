import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/lib/actions/profile'
import { getMyDocuments } from '@/lib/actions/documents'
import DocumentsClient from './DocumentsClient'
import DashboardNav from '../components/DashboardNav'

export default async function DocumentsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  await getOrCreateProfile(userId, email)

  const documents = await getMyDocuments(userId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Documents et contrats</h1>
        </div>
      </div>
      <DashboardNav active="/dashboard/documents" clerkUserId={userId} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DocumentsClient documents={documents} clerkUserId={userId} />
      </div>
    </div>
  )
}