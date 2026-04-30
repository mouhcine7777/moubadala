import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NewTransactionForm from './NewTransactionForm'
import DashboardNav from '../../components/DashboardNav'

export default async function NewTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const { request: requestId } = await searchParams
  if (!requestId) redirect('/dashboard/demandes')

  // Récupère la demande avec les profils
  const { data: request } = await supabase
    .from('requests')
    .select(`
      *,
      listings(id, title, value_mad, exchange_type),
      sender:profiles!requests_sender_clerk_id_fkey(company_name, sector),
      receiver:profiles!requests_receiver_clerk_id_fkey(company_name, sector)
    `)
    .eq('id', requestId)
    .single()

  if (!request) redirect('/dashboard/demandes')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Nouvelle transaction</h1>
        </div>
      </div>
      <DashboardNav active="/dashboard/demandes" clerkUserId={userId} />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <NewTransactionForm
          request={request}
          currentUserId={userId}
        />
      </div>
    </div>
  )
}