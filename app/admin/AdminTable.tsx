'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateListingStatus } from '@/lib/actions/admin'
import type { ListingWithProfile } from '@/lib/actions/admin'
import { CheckCircle, PauseCircle, Clock, ExternalLink, Building2, MapPin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending:     { label: 'En attente',     color: 'bg-amber-100 text-amber-800',   icon: <Clock size={12}/> },
    approved:    { label: 'Approuvée',      color: 'bg-blue-100 text-blue-800',     icon: <CheckCircle size={12}/> },
    published:   { label: 'Publiée',        color: 'bg-green-100 text-green-800',   icon: <CheckCircle size={12}/> },
    paused:      { label: 'En pause',       color: 'bg-gray-100 text-gray-500',     icon: <PauseCircle size={12}/> },
    negotiating: { label: 'En négociation', color: 'bg-purple-100 text-purple-800', icon: <Clock size={12}/> },
    expired:     { label: 'Expirée',        color: 'bg-red-100 text-red-600',       icon: <PauseCircle size={12}/> },
  }

const FILTERS = ['Toutes', 'En attente', 'Publiées', 'En pause'] as const
type Filter = typeof FILTERS[number]

const FILTER_STATUS: Record<Filter, string | null> = {
  'Toutes':     null,
  'En attente': 'pending',
  'Publiées':   'published',
  'En pause':   'paused',
}

export default function AdminTable({ listings }: { listings: ListingWithProfile[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<Filter>('Toutes')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = filter === 'Toutes'
    ? listings
    : listings.filter(l => l.status === FILTER_STATUS[filter])

  async function handleStatus(id: string, status: 'published' | 'paused' | 'pending') {
    setLoadingId(id)
    await updateListingStatus(id, status)
    setLoadingId(null)
    startTransition(() => router.refresh())
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Filtres */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'text-xs font-semibold px-4 py-2 rounded-full transition-colors border',
              filter === f
                ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            )}
          >
            {f}
            {f === 'En attente' && listings.filter(l => l.status === 'pending').length > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {listings.filter(l => l.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          Aucune annonce dans cette catégorie.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(listing => {
            const sc = STATUS_CONFIG[listing.status]
            const isLoading = loadingId === listing.id

            return (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                {/* Infos annonce */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1', sc.color)}>
                      {sc.icon}{sc.label}
                    </span>
                    {listing.category && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                        {listing.category}
                      </span>
                    )}
                    {listing.listing_type && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                        {listing.listing_type === 'offer' ? 'Offre' : 'Demande'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-[#0D3B66] truncate">{listing.title}</p>

                  {listing.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap mt-1">
                    {listing.profiles?.company_name && (
                      <span className="flex items-center gap-1">
                        <Building2 size={11}/>{listing.profiles.company_name}
                      </span>
                    )}
                    {listing.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11}/>{listing.city}
                      </span>
                    )}
                    {listing.value_mad && (
                      <span className="font-semibold text-[#F5A623]">
                        {listing.value_mad.toLocaleString()} MAD
                      </span>
                    )}
                    <span>
                      {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">

                  {listing.status === 'published' && (
                    <Link
                      href={`/moubaplace/${listing.id}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0D3B66] border border-gray-200 px-3 py-2 rounded-lg transition-colors"
                    >
                      <ExternalLink size={12}/> Voir
                    </Link>
                  )}

                  {listing.status !== 'published' && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatus(listing.id, 'published')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <CheckCircle size={13}/>
                      {isLoading ? '...' : 'Publier'}
                    </button>
                  )}

                  {listing.status !== 'paused' && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatus(listing.id, 'paused')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <PauseCircle size={13}/>
                      {isLoading ? '...' : 'Mettre en pause'}
                    </button>
                  )}

                  {listing.status !== 'pending' && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatus(listing.id, 'pending')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <Clock size={13}/>
                      {isLoading ? '...' : 'Remettre en attente'}
                    </button>
                  )}

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}