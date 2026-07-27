import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { getOrCreateProfile } from '@/lib/actions/profile'
import { getContract, getMilestones } from '@/lib/actions/contracts'
import { getServices } from '@/lib/actions/contract-services'
import { getContractDocuments } from '@/lib/actions/contract-documents'
import { CONTRACT_PRE_SIGNATURE_STATUSES } from '@/lib/types'
import ContractWizard from './ContractWizard'
import ContractTrackingDashboard from './ContractTrackingDashboard'
import DashboardNav from '../../components/DashboardNav'

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  await getOrCreateProfile(userId, email)

  const { id } = await params

  let contract
  try {
    contract = await getContract(id, userId)
  } catch {
    notFound()
  }
  if (!contract) notFound()

  const [services, milestones, documents] = await Promise.all([
    getServices(id),
    getMilestones(id),
    getContractDocuments(id),
  ])

  const isPreSignature = CONTRACT_PRE_SIGNATURE_STATUSES.includes(contract.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-white/60 mb-1">{contract.contract_number}</p>
          <h1 className="font-bold text-lg">{contract.title ?? "Contrat d'échange"}</h1>
        </div>
      </div>
      <DashboardNav active="/dashboard/contracts" clerkUserId={userId} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isPreSignature ? (
          <ContractWizard
            contract={contract} services={services} milestones={milestones} documents={documents}
            currentUserId={userId}
          />
        ) : (
          <ContractTrackingDashboard
            contract={contract} services={services} milestones={milestones} documents={documents}
            currentUserId={userId}
          />
        )}
      </div>
    </div>
  )
}
