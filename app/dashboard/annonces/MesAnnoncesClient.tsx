'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Listing } from '@/lib/types'
import {
  Pencil, Eye, Archive, RotateCcw, Trash2,
  Plus, MapPin, TrendingUp, ArrowLeftRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:     { label: 'En attente',      color: 'bg-amber-100 text-amber-800'  },
  approved:    { label: 'Approuvée',       color: 'bg-blue-100 text-blue-800'    },
  published:   { label: 'Publiée',         color: 'bg-green-100 text-green-800'  },
  paused:      { label: 'En pause',        color: 'bg-gray-100 text-gray-500'    },
  negotiating: { label: 'En négociation',  color: 'bg-purple-100 text-purple-800'},
  expired:     { label: 'Expirée',         color: 'bg-red-100 text-red-600'      },
}

const EXCHANGE_LABEL: Record<string, string> = {
  service_service: 'Service ↔ Service',
  product_service: 'Produit ↔ Service',
  product_product: 'Produit ↔ Produit',
}

const TABS = ['Actives', 'En attente', 'En pause', 'Archivées', 'Toutes'] as const
type Tab = typeof TABS[number]

export default function MesAnnoncesClient({
  listings,
  clerkUserId,
}: {
  listings: Listing[]
  clerkUserId: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState<Tab>('Actives')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = listings.filter(l => {
    if (tab === 'Actives')     return !l.archived && ['published', 'negotiating'].includes(l.status)
    if (tab === 'En attente')  return !l.archived && ['pending', 'approved'].includes(l.status)
    if (tab === 'En pause')    return !l.archived && l.status === 'paused'
    if (tab === 'Archivées')   return l.archived
    return true
  })

  const counts = {
    'Actives':    listings.filter(l => !l.archived && ['published', 'negotiating'].includes(l.status)).length,
    'En attente': listings.filter(l => !l.archived && ['pending', 'approved'].includes(l.status)).length,
    'En pause':   listings.filter(l => !l.archived && l.status === 'paused').length,
    'Archivées':  listings.filter(l => l.archived).length,
    'Toutes':     listings.length,
  }

  async function updateListing(id: string, data: Partial<Listing>) {
    setLoadingId(id)
    await supabase.from('listings').update(data).eq('id', id).eq('clerk_user_id', clerkUserId)
    setLoadingId(null)
    startTransition(() => router.refresh())
  }

  async function deleteListing(id: string) {
    setLoadingId(id)
    await supabase.from('listings').delete().eq('id', id).eq('clerk_user_id', clerkUserId)
    setLoadingId(null)
    setConfirmDeleteId(null)
    startTransition(() => router.refresh())
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-black">
          <span className="font-semibold text-[#0D3B66]">{listings.length}</span> annonce{listings.length !== 1 ? 's' : ''} au total
        </p>
        <Link
          href="/publier"
          className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15}/> Nouvelle annonce
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'text-sm font-semibold px-5 py-2.5 rounded-full border transition-colors',
              tab === t
                ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                : 'bg-white text-black border-gray-200 hover:border-gray-300'
            )}
          >
            {t}
            {counts[t] > 0 && (
              <span className={clsx(
                'ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full',
                tab === t ? 'bg-white/20 text-white' : 'bg-gray-100 text-black'
              )}>
                {counts[t]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-black text-base">Aucune annonce dans cette catégorie.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(listing => {
            const sc = STATUS_CONFIG[listing.status]
            const isLoading = loadingId === listing.id

            return (
              <div
                key={listing.id}
                className={clsx(
                  'bg-white rounded-xl border shadow-sm overflow-hidden',
                  listing.archived ? 'border-gray-100 opacity-70' : 'border-gray-100'
                )}
              >
                <div className="px-5 py-5 flex flex-col md:flex-row md:items-center gap-4">

                  {/* Image thumbnail */}
                  {listing.images?.[0] && (
                    <div className="w-18 h-18 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img src={listing.images[0]} className="w-full h-full object-cover" alt=""/>
                    </div>
                  )}

                  {/* Infos */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={clsx('text-sm font-semibold px-3 py-1 rounded-full', sc.color)}>
                        {sc.label}
                      </span>
                      {listing.listing_type && (
                        <span className="text-sm text-black bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {listing.listing_type === 'offer' ? 'Offre' : 'Demande'}
                        </span>
                      )}
                      {listing.category && (
                        <span className="text-sm text-black bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {listing.category}
                        </span>
                      )}
                    </div>

                    <p className="text-base font-bold text-[#0D3B66] truncate">{listing.title}</p>

                    <div className="flex items-center gap-3 text-sm text-black flex-wrap">
                      {listing.city && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12}/>{listing.city}
                        </span>
                      )}
                      {listing.value_mad && (
                        <span className="font-semibold text-[#F5A623]">
                          {listing.value_mad.toLocaleString()} MAD
                        </span>
                      )}
                      {listing.exchange_type && (
                        <span className="flex items-center gap-1">
                          <ArrowLeftRight size={12}/>{EXCHANGE_LABEL[listing.exchange_type]}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12}/>{listing.views ?? 0} vue{(listing.views ?? 0) !== 1 ? 's' : ''}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">

                    {listing.status === 'published' && !listing.archived && (
                      <Link
                        href={`/moubaplace/${listing.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 text-sm text-black hover:text-[#0D3B66] border border-gray-200 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Eye size={13}/> Voir
                      </Link>
                    )}

                    {!listing.archived && (
                      <Link
                        href={`/dashboard/annonces/${listing.id}`}
                        className="flex items-center gap-1.5 text-sm text-[#0D3B66] border border-[#0D3B66]/20 hover:border-[#0D3B66] px-3 py-2 rounded-lg transition-colors"
                      >
                        <Pencil size={13}/> Modifier
                      </Link>
                    )}

                    {!listing.archived ? (
                      <button
                        disabled={isLoading}
                        onClick={() => updateListing(listing.id, { archived: true })}
                        className="flex items-center gap-1.5 text-sm text-black hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Archive size={13}/> {isLoading ? '...' : 'Archiver'}
                      </button>
                    ) : (
                      <button
                        disabled={isLoading}
                        onClick={() => updateListing(listing.id, { archived: false })}
                        className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 border border-amber-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <RotateCcw size={13}/> {isLoading ? '...' : 'Réactiver'}
                      </button>
                    )}

                    {confirmDeleteId === listing.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => deleteListing(listing.id)}
                          disabled={isLoading}
                          className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                        >
                          {isLoading ? '...' : 'Confirmer'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-sm text-black border border-gray-200 px-3 py-2 rounded-lg"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(listing.id)}
                        className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={13}/>
                      </button>
                    )}
                  </div>
                </div>

                {/* Barre expiration */}
                {listing.expires_at && !listing.archived && (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm text-black">
                    <span>Expire {formatDistanceToNow(new Date(listing.expires_at), { addSuffix: true, locale: fr })}</span>
                    <button
                      onClick={() => {
                        const d = new Date()
                        d.setDate(d.getDate() + 30)
                        updateListing(listing.id, { expires_at: d.toISOString() })
                      }}
                      className="text-[#0D3B66] font-semibold hover:underline"
                    >
                      Renouveler 30j
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