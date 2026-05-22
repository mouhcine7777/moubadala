'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateRequestStatus } from '@/lib/actions/requests'
import {
  MessageCircle, CheckCircle, XCircle, Clock, Handshake,
  MapPin, ArrowLeftRight, ExternalLink, FileText
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'En attente',               color: 'bg-amber-100 text-amber-800'   },
  accepted:   { label: 'Acceptée',                 color: 'bg-green-100 text-green-800'   },
  refused:    { label: 'Refusée',                  color: 'bg-red-100 text-red-600'       },
  finalizing: { label: 'En cours de finalisation', color: 'bg-purple-100 text-purple-800' },
}

const EXCHANGE_LABEL: Record<string, string> = {
  service_service: 'Service ↔ Service',
  product_service: 'Produit ↔ Service',
  product_product: 'Produit ↔ Produit',
}

function RequestCard({
  request,
  mode,
  clerkUserId,
  onStatusChange,
}: {
  request: any
  mode: 'received' | 'sent'
  clerkUserId: string
  onStatusChange: () => void
}) {
  const [loading, setLoading] = useState(false)
  const sc = STATUS_CONFIG[request.status]
  const partner = mode === 'received' ? request.sender : request.receiver
  const listing = request.listings

  async function handleStatus(status: 'accepted' | 'refused' | 'finalizing') {
    setLoading(true)
    await updateRequestStatus(request.id, clerkUserId, status)
    setLoading(false)
    onStatusChange()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-5 py-5 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">

          {/* Statut + timing */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={clsx('text-sm font-semibold px-3 py-1 rounded-full', sc.color)}>
              {sc.label}
            </span>
            <span className="text-sm text-black">
              {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: fr })}
            </span>
          </div>

          {/* Annonce concernée */}
          {listing && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-black">Annonce :</p>
              <Link
                href={`/moubaplace/${listing.id}`}
                target="_blank"
                className="text-base font-bold text-[#0D3B66] hover:underline flex items-center gap-1 truncate"
              >
                {listing.title}
                <ExternalLink size={13} className="shrink-0"/>
              </Link>
            </div>
          )}

          {/* Infos listing */}
          {listing && (
            <div className="flex items-center gap-3 text-sm text-black flex-wrap">
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
              {listing.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={12}/>{listing.city}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Partenaire */}
        {partner && (
          <div className="shrink-0 flex flex-col items-end gap-1.5 text-right">
            <div className="w-11 h-11 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-base">
              {partner.company_name?.[0]?.toUpperCase()}
            </div>
            <p className="text-sm font-semibold text-[#0D3B66]">{partner.company_name}</p>
            <p className="text-sm text-black">{partner.sector}</p>
          </div>
        )}
      </div>

      {/* Message initial */}
      {request.message && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-black italic">"{request.message}"</p>
        </div>
      )}

      {/* Contact + messagerie si acceptée ou en finalisation */}
      {(request.status === 'accepted' || request.status === 'finalizing') && (
        <div className="px-5 py-3 bg-green-50 border-t border-green-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm font-semibold text-green-700">Coordonnées :</p>
            {partner?.email && (
              <a href={`mailto:${partner.email}`} className="text-sm text-green-700 hover:underline">
                {partner.email}
              </a>
            )}
            {partner?.phone && (
              <a href={`tel:${partner.phone}`} className="text-sm text-green-700 hover:underline">
                {partner.phone}
              </a>
            )}
          </div>
          <Link
            href={`/dashboard/messages/${request.id}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2 rounded-lg transition-colors"
          >
            <MessageCircle size={14}/> Messagerie
          </Link>
        </div>
      )}

      {/* Actions — uniquement pour le receveur si pending */}
      {mode === 'received' && request.status === 'pending' && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2.5 flex-wrap">
          <button
            disabled={loading}
            onClick={() => handleStatus('accepted')}
            className="flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
          >
            <CheckCircle size={14}/>{loading ? '...' : 'Accepter'}
          </button>
          <button
            disabled={loading}
            onClick={() => handleStatus('finalizing')}
            className="flex items-center gap-1.5 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
          >
            <Handshake size={14}/>{loading ? '...' : 'En finalisation'}
          </button>
          <button
            disabled={loading}
            onClick={() => handleStatus('refused')}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
          >
            <XCircle size={14}/>{loading ? '...' : 'Refuser'}
          </button>
        </div>
      )}

      {/* Bouton créer transaction si en finalisation et receveur */}
      {request.status === 'finalizing' && mode === 'received' && (
        <div className="px-5 py-3 border-t border-purple-100 bg-purple-50 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-purple-700 font-medium">
            Échange en finalisation — documentez la transaction une fois conclue.
          </p>
          <Link
            href={`/dashboard/transactions/new?request=${request.id}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            <FileText size={14}/> Créer transaction
          </Link>
        </div>
      )}

    </div>
  )
}

export default function DemandesClient({
  received,
  sent,
  clerkUserId,
}: {
  received: any[]
  sent: any[]
  clerkUserId: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [tab, setTab] = useState<'received' | 'sent'>('received')

  function refresh() {
    startTransition(() => router.refresh())
  }

  const pendingCount = received.filter(r => r.status === 'pending').length

  return (
    <div className="flex flex-col gap-5">

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setTab('received')}
          className={clsx(
            'text-sm font-semibold px-5 py-2.5 rounded-full border transition-colors',
            tab === 'received'
              ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
              : 'bg-white text-black border-gray-200 hover:border-gray-300'
          )}
        >
          Reçues
          {pendingCount > 0 && (
            <span className={clsx(
              'ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full',
              tab === 'received' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            )}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('sent')}
          className={clsx(
            'text-sm font-semibold px-5 py-2.5 rounded-full border transition-colors',
            tab === 'sent'
              ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
              : 'bg-white text-black border-gray-200 hover:border-gray-300'
          )}
        >
          Envoyées
          {sent.length > 0 && (
            <span className={clsx(
              'ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full',
              tab === 'sent' ? 'bg-white/20 text-white' : 'bg-gray-100 text-black'
            )}>
              {sent.length}
            </span>
          )}
        </button>
      </div>

      {/* Contenu reçues */}
      {tab === 'received' && (
        <div className="flex flex-col gap-4">
          {received.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Clock size={30} className="text-gray-200 mx-auto mb-3"/>
              <p className="text-black text-base">Aucune demande reçue pour le moment.</p>
            </div>
          ) : (
            received.map(r => (
              <RequestCard
                key={r.id}
                request={r}
                mode="received"
                clerkUserId={clerkUserId}
                onStatusChange={refresh}
              />
            ))
          )}
        </div>
      )}

      {/* Contenu envoyées */}
      {tab === 'sent' && (
        <div className="flex flex-col gap-4">
          {sent.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Handshake size={30} className="text-gray-200 mx-auto mb-3"/>
              <p className="text-black text-base">Vous n'avez pas encore envoyé de demande.</p>
              <Link
                href="/moubaplace"
                className="inline-block mt-3 text-base text-[#0D3B66] font-semibold underline underline-offset-2"
              >
                Explorer les annonces →
              </Link>
            </div>
          ) : (
            sent.map(r => (
              <RequestCard
                key={r.id}
                request={r}
                mode="sent"
                clerkUserId={clerkUserId}
                onStatusChange={refresh}
              />
            ))
          )}
        </div>
      )}

    </div>
  )
}