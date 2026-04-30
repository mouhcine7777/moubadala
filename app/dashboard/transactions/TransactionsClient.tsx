'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateTransactionStatus } from '@/lib/actions/transactions'
import { ArrowLeftRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ongoing: { label: 'En cours',              color: 'bg-blue-100 text-blue-800',   icon: <Clock size={12}/>         },
  partial: { label: 'Partiellement réalisée',color: 'bg-amber-100 text-amber-800', icon: <AlertCircle size={12}/>   },
  closed:  { label: 'Clôturée',              color: 'bg-green-100 text-green-800', icon: <CheckCircle size={12}/>   },
}

export default function TransactionsClient({
  transactions,
  currentUserId,
}: {
  transactions: any[]
  currentUserId: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.status === filter)

  async function handleStatus(id: string, status: 'ongoing' | 'partial' | 'closed') {
    setLoadingId(id)
    await updateTransactionStatus(id, currentUserId, status)
    setLoadingId(null)
    startTransition(() => router.refresh())
  }

  const totalValue = transactions.reduce((sum, t) => {
    const isA = t.party_a_clerk_id === currentUserId
    return sum + (isA ? t.party_a_value_mad : t.party_b_value_mad)
  }, 0)

  return (
    <div className="flex flex-col gap-5">

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#0D3B66]">{transactions.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total transactions</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-700">
            {transactions.filter(t => t.status === 'closed').length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Clôturées</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#F5A623]">
            {totalValue.toLocaleString()} MAD
          </p>
          <p className="text-xs text-gray-400 mt-1">Valeur totale</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all',     label: 'Toutes'                },
          { value: 'ongoing', label: 'En cours'              },
          { value: 'partial', label: 'Partiellement réalisée'},
          { value: 'closed',  label: 'Clôturées'             },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'text-xs font-semibold px-4 py-2 rounded-full border transition-colors',
              filter === f.value
                ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <ArrowLeftRight size={28} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm font-semibold mb-1">Aucune transaction</p>
          <p className="text-gray-400 text-xs">
            Les transactions sont créées quand un échange est finalisé.
          </p>
          <Link
            href="/dashboard/demandes"
            className="inline-block mt-4 text-sm text-[#0D3B66] font-semibold underline underline-offset-2"
          >
            Voir mes demandes →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((tx: any) => {
            const sc = STATUS_CONFIG[tx.status]
            const isA = tx.party_a_clerk_id === currentUserId
            const me = isA ? tx.party_a : tx.party_b
            const partner = isA ? tx.party_b : tx.party_a
            const myOffering = isA ? tx.party_a_offering : tx.party_b_offering
            const partnerOffering = isA ? tx.party_b_offering : tx.party_a_offering
            const myValue = isA ? tx.party_a_value_mad : tx.party_b_value_mad
            const partnerValue = isA ? tx.party_b_value_mad : tx.party_a_value_mad
            const isLoading = loadingId === tx.id

            return (
              <div key={tx.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between gap-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1', sc.color)}>
                      {sc.icon}{sc.label}
                    </span>
                    {tx.requests?.listings?.title && (
                      <p className="text-xs text-gray-400 truncate max-w-xs">
                        {tx.requests.listings.title}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {format(new Date(tx.concluded_at), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </div>

                {/* Échange */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                  {/* Moi */}
                  <div className="flex flex-col gap-2 bg-[#EEF3F8] rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {partner?.company_name?.[0]?.toUpperCase()}
                      </div>
                      <p className="text-xs font-bold text-[#0D3B66] truncate">{partner?.company_name}</p>
                    </div>
                    <p className="text-sm text-[#0D3B66] leading-snug">{partnerOffering}</p>
                    <p className="text-xs font-bold text-[#F5A623]">{partnerValue.toLocaleString()} MAD</p>
                  </div>

                  {/* Flèche */}
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <ArrowLeftRight size={16} className="text-gray-400"/>
                    </div>
                  </div>

                  {/* Partenaire */}
                  <div className="flex flex-col gap-2 bg-[#EEF3F8] rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0D3B66] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        Moi
                      </div>
                      <p className="text-xs font-bold text-[#0D3B66] truncate">Vous</p>
                    </div>
                    <p className="text-sm text-[#0D3B66] leading-snug">{myOffering}</p>
                    <p className="text-xs font-bold text-[#F5A623]">{myValue.toLocaleString()} MAD</p>
                  </div>
                </div>

                {/* Notes */}
                {tx.notes && (
                  <div className="px-5 pb-4">
                    <p className="text-xs text-gray-400 italic">"{tx.notes}"</p>
                  </div>
                )}

                {/* Actions statut */}
                {tx.status !== 'closed' && (
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-gray-400 mr-2">Mettre à jour :</p>
                    {tx.status !== 'partial' && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleStatus(tx.id, 'partial')}
                        className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                      >
                        {isLoading ? '...' : 'Partiellement réalisée'}
                      </button>
                    )}
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatus(tx.id, 'closed')}
                      className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                    >
                      {isLoading ? '...' : 'Clôturer'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}