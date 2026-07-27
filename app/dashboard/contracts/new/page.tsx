import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/lib/actions/profile'
import { createContract } from '@/lib/actions/contracts'

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  await getOrCreateProfile(userId, email)

  const { request: requestId } = await searchParams

  const { id } = await createContract(userId, { requestId })

  redirect(`/dashboard/contracts/${id}`)
}
