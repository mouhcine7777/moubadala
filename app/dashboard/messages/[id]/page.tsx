import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { getConversation, markConversationAsRead  } from '@/lib/actions/messages'
import ConversationClient from './ConversationClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) redirect('/connexion')
  
    const conversation = await getConversation(id, userId)
    if (!conversation) notFound()

        await markConversationAsRead(id, userId)

  const user = await currentUser()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-[#0D3B66] text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link
            href="/dashboard/messages"
            className="text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18}/>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/60">Conversation</p>
            <p className="font-bold text-sm truncate">
              {conversation.listings?.title ?? 'Annonce'}
            </p>
          </div>
          <div className="text-xs text-white/60 shrink-0">
            {userId === conversation.sender_clerk_id
              ? conversation.receiver?.company_name
              : conversation.sender?.company_name
            }
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-6">
        <ConversationClient
          conversation={conversation}
          currentUserId={userId}
        />
      </div>

    </div>
  )
}