'use client'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowLeftRight, MapPin, ExternalLink, Building2 } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'En attente',            color: 'bg-amber-100 text-amber-800'   },
  accepted:   { label: 'Acceptée',              color: 'bg-green-100 text-green-800'   },
  refused:    { label: 'Refusée',               color: 'bg-red-100 text-red-600'       },
  finalizing: { label: 'En finalisation',       color: 'bg-purple-100 text-purple-800' },
}

const EXCHANGE_LABEL: Record<string, string> = {
  service_service: 'Service ↔ Service',
  product_service: 'Produit ↔ Service',
  product_product: 'Produit ↔ Produit',
}

const FILTERS = ['Toutes', 'En attente', 'Acceptées', 'En finalisation', 'Refusées'] as const
type Filter = typeof FILTERS[number]

const FILTER_STATUS: Record<Filter, string | null> = {
  'Toutes':           null,
  'En attente':       'pending',
  'Acceptées':        'accepted',
  'En finalisation':  'finalizing',
  'Refusées':         'refused',
}

export default function AdminRequests({ requests }: { requests: any[] }) {
  const [filter, setFilter] = useState<Filter>('Toutes')

  const filtered = filter === 'Toutes'
    ? requests
    : requests.filter(r => r.status === FILTER_STATUS[filter])

  return (
    <div className="flex flex-col gap-4">

      {/* Filtres */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'text-xs font-semibold px-4 py-2 rounded-full border transition-colors',
              filter === f
                ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            )}
          >
            {f}
            {(() => {
              const count = f === 'Toutes'
                ? requests.length
                : requests.filter(r => r.status === FILTER_STATUS[f]).length
              return count > 0 ? (
                <span className={clsx(
                  'ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                )}>
                  {count}
                </span>
              ) : null
            })()}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          Aucune demande dans cette catégorie.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((req: any) => {
            const sc = STATUS_CONFIG[req.status]
            const listing = req.listings
            const sender = req.sender
            const receiver = req.receiver

            return (
              <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">

                {/* Header : statut + date */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full', sc.color)}>
                    {sc.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: fr })}
                  </span>
                </div>

                {/* Annonce */}
                {listing && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5">
                    <p className="text-xs text-gray-400 shrink-0">Annonce :</p>
                    <Link
                      href={`/moubaplace/${listing.id}`}
                      target="_blank"
                      className="text-sm font-bold text-[#0D3B66] hover:underline flex items-center gap-1 truncate"
                    >
                      {listing.title}
                      <ExternalLink size={11} className="shrink-0"/>
                    </Link>
                    {listing.value_mad && (
                      <span className="ml-auto text-xs font-bold text-[#F5A623] shrink-0">
                        {listing.value_mad.toLocaleString()} MAD
                      </span>
                    )}
                  </div>
                )}

                {/* Parties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {/* Demandeur */}
                  <div className="flex items-start gap-3 border border-gray-100 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {sender?.company_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Demandeur</p>
                      <p className="text-sm font-bold text-[#0D3B66] truncate">{sender?.company_name}</p>
                      <p className="text-xs text-gray-400">{sender?.sector}</p>
                      {sender?.city && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={10}/>{sender.city}
                        </p>
                      )}
                      {sender?.email && (
                        <a href={`mailto:${sender.email}`} className="text-xs text-[#0D3B66] hover:underline truncate">
                          {sender.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Receveur */}
                  <div className="flex items-start gap-3 border border-gray-100 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-full bg-[#0D3B66] flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {receiver?.company_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Propriétaire annonce</p>
                      <p className="text-sm font-bold text-[#0D3B66] truncate">{receiver?.company_name}</p>
                      <p className="text-xs text-gray-400">{receiver?.sector}</p>
                      {receiver?.city && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={10}/>{receiver.city}
                        </p>
                      )}
                      {receiver?.email && (
                        <a href={`mailto:${receiver.email}`} className="text-xs text-[#0D3B66] hover:underline truncate">
                          {receiver.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                {req.message && (
                  <div className="bg-gray-50 rounded-lg px-4 py-3 border-l-2 border-[#0D3B66]/20">
                    <p className="text-xs text-gray-400 mb-1">Message initial :</p>
                    <p className="text-sm text-gray-600 italic">"{req.message}"</p>
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