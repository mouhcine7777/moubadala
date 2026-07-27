'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle2, Clock, AlertTriangle, PackageCheck, MessageCircle, Download, PartyPopper, RotateCw } from 'lucide-react'
import { declareServiceDone, validateService, raiseReserve, resolveReserve } from '@/lib/actions/contract-execution'
import { requestClosure, confirmClosure } from '@/lib/actions/contract-closure'
import { CONTRACT_STATUS_LABELS } from '@/lib/contract-utils'
import type { ContractStatus } from '@/lib/types'
import ContractJournal from './ContractJournal'

const EXEC_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  a_realiser: { label: 'À réaliser', color: 'bg-gray-100 text-gray-600',   icon: <Clock size={12} /> },
  en_cours:   { label: 'En cours',   color: 'bg-blue-100 text-blue-800',  icon: <Clock size={12} /> },
  realisee:   { label: 'Réalisée',   color: 'bg-amber-100 text-amber-800',icon: <PackageCheck size={12} /> },
  validee:    { label: 'Validée',    color: 'bg-green-100 text-green-800',icon: <CheckCircle2 size={12} /> },
  contestee:  { label: 'En réserve', color: 'bg-red-100 text-red-700',    icon: <AlertTriangle size={12} /> },
}

function ServiceRow({ service, isMine, contractId, currentUserId, onSaved }: any) {
  const [showDeclare, setShowDeclare] = useState(false)
  const [showReserve, setShowReserve] = useState(false)
  const [comment, setComment] = useState('')
  const [reserveSubject, setReserveSubject] = useState('')
  const [reserveDesc, setReserveDesc] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const ec = EXEC_STATUS_CONFIG[service.exec_status]

  async function handleDeclare() {
    setBusy(true)
    setError('')
    try {
      await declareServiceDone(service.id, contractId, currentUserId, comment || undefined)
      setShowDeclare(false)
      onSaved()
    } catch (e: any) { setError(e.message) } finally { setBusy(false) }
  }

  async function handleValidate() {
    setBusy(true)
    setError('')
    try {
      await validateService(service.id, contractId, currentUserId)
      onSaved()
    } catch (e: any) { setError(e.message) } finally { setBusy(false) }
  }

  async function handleReserve() {
    if (!reserveSubject || !reserveDesc) return
    setBusy(true)
    setError('')
    try {
      await raiseReserve(service.id, contractId, currentUserId, reserveSubject, reserveDesc)
      setShowReserve(false)
      onSaved()
    } catch (e: any) { setError(e.message) } finally { setBusy(false) }
  }

  // La partie qui a déclaré la prestation réalisée ne peut pas valider/contester sa propre déclaration.
  const canRespond = service.exec_status === 'realisee' && service.declared_done_by !== currentUserId

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-mono text-gray-500">{service.label}</p>
          <p className="text-base font-semibold text-[#0D3B66]">{service.description}</p>
        </div>
        <span className={clsx('text-sm font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0', ec.color)}>
          {ec.icon}{ec.label}
        </span>
      </div>

      {isMine && (service.exec_status === 'a_realiser' || service.exec_status === 'en_cours') && (
        showDeclare ? (
          <div className="mt-3 flex flex-col gap-2">
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Commentaire (facultatif)"
              rows={2} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-black resize-none" />
            <div className="flex gap-2">
              <button onClick={handleDeclare} disabled={busy} className="text-sm font-semibold text-white bg-[#0D3B66] px-3 py-1.5 rounded-lg disabled:opacity-40">Confirmer</button>
              <button onClick={() => setShowDeclare(false)} className="text-sm text-black px-2 py-1.5">Annuler</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowDeclare(true)} className="mt-3 text-sm font-semibold text-[#0D3B66] bg-[#EEF3F8] hover:bg-blue-100 px-3 py-1.5 rounded-lg">
            Déclarer la prestation réalisée
          </button>
        )
      )}

      {canRespond && (
        <div className="mt-3 flex flex-col gap-2">
          {!showReserve ? (
            <div className="flex gap-2">
              <button onClick={handleValidate} disabled={busy} className="text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg disabled:opacity-40">
                Valider la réalisation
              </button>
              <button onClick={() => setShowReserve(true)} className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-lg">
                Signaler une réserve
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input value={reserveSubject} onChange={e => setReserveSubject(e.target.value)} placeholder="Objet de la réserve"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-black" />
              <textarea value={reserveDesc} onChange={e => setReserveDesc(e.target.value)} placeholder="Description"
                rows={2} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-black resize-none" />
              <div className="flex gap-2">
                <button onClick={handleReserve} disabled={busy} className="text-sm font-semibold text-white bg-red-600 px-3 py-1.5 rounded-lg disabled:opacity-40">Émettre la réserve</button>
                <button onClick={() => setShowReserve(false)} className="text-sm text-black px-2 py-1.5">Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}

export default function ContractTrackingDashboard({
  contract, services, milestones, documents, currentUserId,
}: {
  contract: any
  services: any[]
  milestones: any[]
  documents: any[]
  currentUserId: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [closing, setClosing] = useState(false)
  const [regeneratingPdf, setRegeneratingPdf] = useState(false)
  const [error, setError] = useState('')

  function refresh() {
    startTransition(() => router.refresh())
  }

  const isA = contract.party_a_clerk_id === currentUserId
  const partner = isA ? contract.party_b : contract.party_a

  const total = services.length
  const validated = services.filter(s => s.exec_status === 'validee').length
  const percent = total === 0 ? 0 : Math.round((validated / total) * 100)
  const allValidated = total > 0 && validated === total
  const sc = CONTRACT_STATUS_LABELS[contract.status as ContractStatus]

  const openReserves = services.filter(s => s.exec_status === 'contestee').length

  async function handleRequestClosure() {
    setClosing(true)
    setError('')
    try {
      await requestClosure(contract.id, currentUserId)
      refresh()
    } catch (e: any) { setError(e.message) } finally { setClosing(false) }
  }

  async function handleConfirmClosure() {
    setClosing(true)
    setError('')
    try {
      await confirmClosure(contract.id, currentUserId)
      refresh()
    } catch (e: any) { setError(e.message) } finally { setClosing(false) }
  }

  async function handleRegeneratePdf() {
    setRegeneratingPdf(true)
    setError('')
    try {
      const res = await fetch(`/api/contracts/${contract.id}/generate-pdf`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la génération du PDF.')
      refresh()
    } catch (e: any) { setError(e.message) } finally { setRegeneratingPdf(false) }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* En-tête */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className={clsx('text-sm font-semibold px-2.5 py-1 rounded-full', sc.color)}>{sc.label}</span>
            <p className="text-base text-black mt-2">
              {contract.party_a?.company_name} ↔ {contract.party_b?.company_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {contract.pdf_url ? (
              <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#0D3B66] border border-[#0D3B66]/20 hover:border-[#0D3B66] px-3 py-2 rounded-lg">
                <Download size={14} /> Contrat signé
              </a>
            ) : (
              <button onClick={handleRegeneratePdf} disabled={regeneratingPdf}
                className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-lg disabled:opacity-40">
                <RotateCw size={14} className={regeneratingPdf ? 'animate-spin' : ''} />
                {regeneratingPdf ? 'Génération...' : 'Générer le PDF du contrat'}
              </button>
            )}
            <Link href={`/dashboard/contracts/${contract.id}/messages`}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-3 py-2 rounded-lg">
              <MessageCircle size={14} /> Messagerie
            </Link>
          </div>
        </div>

        {total > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm text-black mb-1.5">
              <span>Progression de l'échange</span>
              <span className="font-semibold text-[#0D3B66]">{validated} / {total} prestations réalisées</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-sm text-black">
          <p>Signé le : {contract.signed_at_a && contract.signed_at_b
            ? format(new Date(contract.signed_at_b > contract.signed_at_a ? contract.signed_at_b : contract.signed_at_a), 'dd MMM yyyy', { locale: fr })
            : '—'}</p>
          <p>Fin prévue : {contract.calendar_end_date ?? '—'}</p>
          <p>{openReserves > 0 && <span className="text-red-600 font-semibold">{openReserves} réserve(s) en cours</span>}</p>
        </div>
      </div>

      {/* Clôture */}
      {contract.status === 'en_execution' && allValidated && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <PartyPopper size={16} /> Toutes les prestations sont validées — l'échange peut être clôturé.
          </p>
          {!contract.closure_requested_at ? (
            <button onClick={handleRequestClosure} disabled={closing} className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-40">
              Demander la clôture
            </button>
          ) : contract.closure_requested_by === currentUserId ? (
            <p className="text-sm text-green-700">En attente de confirmation par {partner?.company_name}.</p>
          ) : (
            <button onClick={handleConfirmClosure} disabled={closing} className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-40">
              Confirmer la clôture
            </button>
          )}
        </div>
      )}

      {contract.status === 'cloture' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-between gap-4">
          <p className="text-sm text-[#0D3B66] font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" /> Échange clôturé le {contract.closed_at ? format(new Date(contract.closed_at), 'dd MMM yyyy', { locale: fr }) : ''}
          </p>
          {contract.closure_pv_url && (
            <a href={contract.closure_pv_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2 rounded-lg">
              <Download size={14} /> Procès-verbal de clôture
            </a>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>}

      {/* Prestations */}
      {contract.status === 'en_execution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide">Entreprise A</p>
            {services.filter(s => s.party === 'a').map(s => (
              <ServiceRow key={s.id} service={s} isMine={isA} contractId={contract.id} currentUserId={currentUserId} onSaved={refresh} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide">Entreprise B</p>
            {services.filter(s => s.party === 'b').map(s => (
              <ServiceRow key={s.id} service={s} isMine={!isA} contractId={contract.id} currentUserId={currentUserId} onSaved={refresh} />
            ))}
          </div>
        </div>
      )}

      <ContractJournal contractId={contract.id} />
    </div>
  )
}
