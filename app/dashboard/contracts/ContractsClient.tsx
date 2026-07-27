'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileSignature, Plus, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import Link from 'next/link'
import { CONTRACT_STATUS_LABELS } from '@/lib/contract-utils'
import { deleteContract } from '@/lib/actions/contracts'
import type { ContractStatus } from '@/lib/types'

const DELETABLE_STATUSES: ContractStatus[] = ['brouillon', 'en_preparation']

export default function ContractsClient({
  contracts,
  currentUserId,
}: {
  contracts: any[]
  currentUserId: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [filter, setFilter] = useState<string>('all')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const filtered = filter === 'all' ? contracts : contracts.filter(c => c.status === filter)

  const enCours = contracts.filter(c => c.status === 'en_execution').length
  const clotures = contracts.filter(c => c.status === 'cloture').length

  async function handleDelete(id: string) {
    setDeletingId(id)
    setError('')
    try {
      await deleteContract(id, currentUserId)
      setConfirmDeleteId(null)
      startTransition(() => router.refresh())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header + CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="grid grid-cols-3 gap-4 flex-1">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl font-bold text-[#0D3B66]">{contracts.length}</p>
            <p className="text-sm text-black mt-1">Total contrats</p>
          </div>
          <div className="bg-indigo-50 rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl font-bold text-indigo-700">{enCours}</p>
            <p className="text-sm text-black mt-1">En exécution</p>
          </div>
          <div className="bg-green-50 rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl font-bold text-green-700">{clotures}</p>
            <p className="text-sm text-black mt-1">Clôturés</p>
          </div>
        </div>
        <Link
          href="/dashboard/contracts/new"
          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <Plus size={15} /> Nouveau contrat
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Tous' },
          ...Object.entries(CONTRACT_STATUS_LABELS).map(([value, cfg]) => ({ value, label: cfg.label })),
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'text-sm font-semibold px-4 py-2 rounded-full border transition-colors',
              filter === f.value
                ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                : 'bg-white text-black border-gray-200 hover:border-gray-300'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <FileSignature size={28} className="text-gray-300 mx-auto mb-3" />
          <p className="text-black text-base font-semibold mb-1">Aucun contrat</p>
          <p className="text-black text-sm">
            Créez un contrat depuis une demande en finalisation, ou démarrez-en un directement.
          </p>
          <Link
            href="/dashboard/contracts/new"
            className="inline-block mt-4 text-sm text-[#0D3B66] font-semibold underline underline-offset-2"
          >
            Créer un contrat →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((c: any) => {
            const sc = CONTRACT_STATUS_LABELS[c.status as ContractStatus]
            const isA = c.party_a_clerk_id === currentUserId
            const partner = isA ? c.party_b : c.party_a
            const partnerName = partner?.company_name ?? c.party_b_pending_email ?? 'En attente'
            const canDelete = DELETABLE_STATUSES.includes(c.status)

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:border-[#0D3B66]/30 transition-colors"
              >
                <div className="px-5 py-4 flex items-center justify-between gap-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={clsx('text-sm font-semibold px-2.5 py-1 rounded-full shrink-0', sc.color)}>
                      {sc.label}
                    </span>
                    <p className="text-sm text-black font-mono truncate">{c.contract_number}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm text-black flex items-center gap-1">
                      <Clock size={12} />
                      {format(new Date(c.created_at), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    {canDelete && (
                      confirmDeleteId === c.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id}
                            className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-40"
                          >
                            {deletingId === c.id ? '...' : 'Confirmer'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-sm text-black border border-gray-200 px-2.5 py-1 rounded-lg"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(c.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Supprimer ce brouillon"
                        >
                          <Trash2 size={15} />
                        </button>
                      )
                    )}
                  </div>
                </div>
                <Link href={`/dashboard/contracts/${c.id}`} className="block p-5">
                  <p className="text-base font-bold text-[#0D3B66] truncate">
                    {c.title ?? 'Échange sans titre (en préparation)'}
                  </p>
                  <p className="text-sm text-black mt-1">
                    Avec <span className="font-semibold text-[#0D3B66]">{partnerName}</span>
                    {c.category_derived && <span className="ml-2 text-black">· {c.category_derived}</span>}
                  </p>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
