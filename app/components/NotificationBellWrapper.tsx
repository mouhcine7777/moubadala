import { currentUser } from '@clerk/nextjs/server'
import { getNotifications, getUnreadNotifCount } from '@/lib/actions/notifications'
import { getOrCreateProfile } from '@/lib/actions/profile'
import NotificationBell from './NotificationBell'

export default async function NotificationBellWrapper() {
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress ?? ''

  // Ne montre pas la cloche à l'admin
  if (email === process.env.ADMIN_EMAIL) return null

  try {
    await getOrCreateProfile(user.id, email)
    const [notifs, unread] = await Promise.all([
      getNotifications(user.id),
      getUnreadNotifCount(user.id),
    ])
    return <NotificationBell initialNotifs={notifs} initialUnread={unread} />
  } catch {
    return null
  }
}