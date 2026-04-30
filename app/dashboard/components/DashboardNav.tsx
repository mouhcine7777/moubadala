import Link from 'next/link'
import clsx from 'clsx'
import { supabase } from '@/lib/supabase'
import { getUnreadCounts } from '@/lib/actions/messages'
import DashboardNavClient from './DashboardNavClient'

const mainLinks = [
  { label: 'Dashboard',    href: '/dashboard'              },
  { label: 'Annonces',     href: '/dashboard/annonces'     },
  { label: 'Demandes',     href: '/dashboard/demandes'     },
  { label: 'Messages',     href: '/dashboard/messages'     },
  { label: 'Transactions', href: '/dashboard/transactions' },
]

const moreLinks = [
  { label: 'Mon réseau',   href: '/dashboard/reseau' },
  { label: 'Statistiques', href: '/dashboard/stats'  },
  { label: 'Documents',    href: '/dashboard/documents'},
  { label: 'Mon profil',   href: '/dashboard/profil' },
]

async function getBadges(clerkUserId: string) {
  const [unreadCounts, { count: pendingDemandes }] = await Promise.all([
    getUnreadCounts(clerkUserId),
    supabase
      .from('requests')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_clerk_id', clerkUserId)
      .eq('status', 'pending'),
  ])

  return {
    messages: Object.values(unreadCounts).reduce((sum, n) => sum + n, 0),
    demandes: pendingDemandes ?? 0,
  }
}

export default async function DashboardNav({
  active,
  clerkUserId,
}: {
  active: string
  clerkUserId: string
}) {
  const badges = await getBadges(clerkUserId)

  return (
    <DashboardNavClient
      active={active}
      mainLinks={mainLinks}
      moreLinks={moreLinks}
      badges={badges}
    />
  )
}