import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/lib/actions/profile'
import { getConversations } from '@/lib/actions/messages'
import Link from 'next/link'
import clsx from 'clsx'
import { MessageCircle, ArrowLeftRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import DashboardNav from '../components/DashboardNav'


export default async function MessagesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  await getOrCreateProfile(userId, email)

  const conversations = await getConversations(userId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/60 mb-1">Espace client</p>
          <h1 className="font-bold text-lg">Messagerie</h1>
        </div>
      </div>

      <DashboardNav active="/dashboard/messages" clerkUserId={userId} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <MessageCircle size={32} className="text-gray-200 mx-auto mb-3"/>
            <p className="text-gray-400 text-sm font-semibold mb-1">Aucune conversation active</p>
            <p className="text-gray-400 text-xs">
              Les conversations s'ouvrent quand une demande d'échange est acceptée.
            </p>
            <Link
              href="/dashboard/demandes"
              className="inline-block mt-4 text-sm text-[#0D3B66] font-semibold underline underline-offset-2"
            >
              Voir mes demandes →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {conversations.map((conv: any) => {
              const partner = conv.sender_clerk_id === userId ? conv.receiver : conv.sender
              const lastMessage = conv.messages?.sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0]
              const unread = conv.messages?.filter(
                (m: any) => m.sender_clerk_id !== userId
              ).length ?? 0

              return (
                <Link
                  key={conv.id}
                  href={`/dashboard/messages/${conv.id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-base shrink-0">
                    {partner?.company_name?.[0]?.toUpperCase()}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#0D3B66] truncate">
                        {partner?.company_name}
                      </p>
                      {lastMessage && (
                        <span className="text-xs text-gray-400 shrink-0">
                          {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true, locale: fr })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {conv.listings?.title ?? 'Annonce supprimée'}
                    </p>
                    {lastMessage ? (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {lastMessage.sender_clerk_id === userId ? 'Vous : ' : ''}
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-300 mt-1 italic">Aucun message encore</p>
                    )}
                  </div>

                  {/* Badge non lus */}
                  {unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {unread}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}