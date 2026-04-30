import { supabase } from '@/lib/supabase'

export async function getMyStats(clerkUserId: string) {
  const [
    { data: listings },
    { data: requestsReceived },
    { data: requestsSent },
    { data: transactions },
    { data: messages },
  ] = await Promise.all([
    supabase
      .from('listings')
      .select('id, status, views, value_mad, created_at, archived')
      .eq('clerk_user_id', clerkUserId),
    supabase
      .from('requests')
      .select('id, status, created_at')
      .eq('receiver_clerk_id', clerkUserId),
    supabase
      .from('requests')
      .select('id, status, created_at')
      .eq('sender_clerk_id', clerkUserId),
    supabase
      .from('transactions')
      .select('id, status, party_a_clerk_id, party_a_value_mad, party_b_value_mad, concluded_at')
      .or(`party_a_clerk_id.eq.${clerkUserId},party_b_clerk_id.eq.${clerkUserId}`),
    supabase
      .from('messages')
      .select('id, created_at')
      .eq('sender_clerk_id', clerkUserId),
  ])

  const safeListings      = listings        ?? []
  const safeReceived      = requestsReceived ?? []
  const safeSent          = requestsSent     ?? []
  const safeTransactions  = transactions     ?? []
  const safeMessages      = messages         ?? []

  const totalViews        = safeListings.reduce((sum, l) => sum + (l.views ?? 0), 0)
  const publishedListings = safeListings.filter(l => l.status === 'published' && !l.archived)
  const totalValueOffered = safeListings.reduce((sum, l) => sum + (l.value_mad ?? 0), 0)

  const acceptedReceived  = safeReceived.filter(r => ['accepted', 'finalizing'].includes(r.status)).length
  const totalReceived     = safeReceived.length
  const conversionRate    = totalReceived > 0 ? Math.round((acceptedReceived / totalReceived) * 100) : 0

  const closedTransactions = safeTransactions.filter(t => t.status === 'closed')
  const totalExchangeValue = safeTransactions.reduce((sum, t) => {
    const isA = t.party_a_clerk_id === clerkUserId
    return sum + (isA ? (t.party_a_value_mad ?? 0) : (t.party_b_value_mad ?? 0))
  }, 0)

  // Évolution sur 6 mois
  const now = new Date()
  const chart = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      label:    d.toLocaleDateString('fr-FR', { month: 'short' }),
      month:    d.getMonth(),
      year:     d.getFullYear(),
      listings: 0,
      requests: 0,
    }
  })

  safeListings.forEach(l => {
    const d = new Date(l.created_at)
    const m = chart.find(c => c.month === d.getMonth() && c.year === d.getFullYear())
    if (m) m.listings++
  })

  safeReceived.forEach(r => {
    const d = new Date(r.created_at)
    const m = chart.find(c => c.month === d.getMonth() && c.year === d.getFullYear())
    if (m) m.requests++
  })

  return {
    listings: {
      total:             safeListings.length,
      published:         publishedListings.length,
      totalViews,
      totalValueOffered,
    },
    requests: {
      received:     totalReceived,
      sent:         safeSent.length,
      acceptedRate: conversionRate,
      accepted:     acceptedReceived,
    },
    transactions: {
      total:      safeTransactions.length,
      closed:     closedTransactions.length,
      totalValue: totalExchangeValue,
    },
    messages: {
      sent: safeMessages.length,
    },
    chart,
  }
}