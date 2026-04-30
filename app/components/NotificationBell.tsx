'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, CheckCheck, ArrowLeftRight, MessageCircle, Clock, Sparkles, Megaphone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { markAllRead, markOneRead } from '@/lib/actions/notifications'
import type { Notification } from '@/lib/actions/notifications'
import Link from 'next/link'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  new_request:     { icon: <ArrowLeftRight size={13}/>, color: 'text-blue-600',   bg: 'bg-blue-50'   },
  message:         { icon: <MessageCircle size={13}/>,  color: 'text-[#0D3B66]', bg: 'bg-[#EEF3F8]' },
  listing_expiring:{ icon: <Clock size={13}/>,          color: 'text-amber-600',  bg: 'bg-amber-50'  },
  new_matching:    { icon: <Sparkles size={13}/>,       color: 'text-purple-600', bg: 'bg-purple-50' },
  platform:        { icon: <Megaphone size={13}/>,      color: 'text-green-600',  bg: 'bg-green-50'  },
}

export default function NotificationBell({
  initialNotifs,
  initialUnread,
}: {
  initialNotifs: Notification[]
  initialUnread: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(initialNotifs)
  const [unread, setUnread] = useState(initialUnread)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleMarkAll() {
    const userId = notifs[0]?.clerk_user_id
    if (!userId) return
    await markAllRead(userId)
    setNotifs(n => n.map(notif => ({ ...notif, read: true })))
    setUnread(0)
    router.refresh()
  }

  async function handleClickNotif(notif: Notification) {
    if (!notif.read) {
      await markOneRead(notif.id)
      setNotifs(n => n.map(no => no.id === notif.id ? { ...no, read: true } : no))
      setUnread(u => Math.max(0, u - 1))
    }
    setOpen(false)
    router.refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors"
      >
        <Bell size={18} className="text-white/80"/>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#F5A623] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#0D3B66]">Notifications</p>
              {unread > 0 && (
                <span className="text-xs font-bold bg-[#F5A623] text-white px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0D3B66] transition-colors"
              >
                <CheckCheck size={13}/> Tout lire
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-96 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={24} className="text-gray-200 mx-auto mb-2"/>
                <p className="text-xs text-gray-400">Aucune notification</p>
              </div>
            ) : (
              notifs.map(notif => {
                const tc = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.platform
                const content = (
                  <div
                    onClick={() => handleClickNotif(notif)}
                    className={clsx(
                      'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0',
                      !notif.read && 'bg-blue-50/30'
                    )}
                  >
                    {/* Icône */}
                    <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5', tc.bg, tc.color)}>
                      {tc.icon}
                    </div>

                    {/* Texte */}
                    <div className="flex-1 min-w-0">
                      <p className={clsx('text-xs leading-snug', notif.read ? 'text-gray-500' : 'text-gray-800 font-semibold')}>
                        {notif.title}
                      </p>
                      {notif.body && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.body}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-300 mt-1">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                      </p>
                    </div>

                    {/* Point non lu */}
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-[#F5A623] shrink-0 mt-1.5"/>
                    )}
                  </div>
                )

                return notif.link ? (
                  <Link key={notif.id} href={notif.link}>
                    {content}
                  </Link>
                ) : (
                  <div key={notif.id}>{content}</div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 text-center">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-xs text-[#0D3B66] font-semibold hover:underline"
              >
                Voir le tableau de bord →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}