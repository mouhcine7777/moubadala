import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { getContractMessages } from '@/lib/actions/contract-messages'
import ContractConversationClient from './ContractConversationClient'
import DashboardNav from '../../../components/DashboardNav'

export default async function ContractMessagesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const { id } = await params

  let contract
  try {
    contract = await getContractMessages(id, userId)
  } catch {
    notFound()
  }
  if (!contract) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/60 mb-1">{contract.contract_number}</p>
          <h1 className="font-bold text-lg">Messagerie contractuelle</h1>
        </div>
      </div>
      <DashboardNav active="/dashboard/contracts" clerkUserId={userId} />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <ContractConversationClient contract={contract} currentUserId={userId} />
      </div>
    </div>
  )
}
