'use client'
import { useState } from 'react'
import { CheckCircle2, FileSignature, Download } from 'lucide-react'
import { sumPartyTotal } from '@/lib/contract-utils'

export default function Step8Signature({
  contract, services, milestones, documents, currentUserId, onSaved, onBack,
}: {
  contract: any
  services: any[]
  milestones: any[]
  documents: any[]
  currentUserId: string
  onSaved: () => void
  onBack: () => void
}) {
  const isA = contract.party_a_clerk_id === currentUserId
  const iAlreadySigned = isA ? !!contract.signed_at_a : !!contract.signed_at_b
  const partnerSigned = isA ? !!contract.signed_at_b : !!contract.signed_at_a

  const [checkInfo, setCheckInfo] = useState(false)
  const [checkCgu, setCheckCgu] = useState(false)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState('')

  const totalA = sumPartyTotal(services, 'a')
  const totalB = sumPartyTotal(services, 'b')

  async function handleSign() {
    setSigning(true)
    setError('')
    try {
      const res = await fetch(`/api/contracts/${contract.id}/sign`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la signature.')
      onSaved()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSigning(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#0D3B66]">Étape 8 — Vérification et signature électronique</h2>
        <p className="text-sm text-black mt-1">Vérifiez le résumé ci-dessous avant de signer.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-1">Parties</p>
          <p className="text-base text-black">{contract.party_a?.company_name ?? '—'} ↔ {contract.party_b?.company_name ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-1">Objet de l'échange</p>
          <p className="text-base text-black font-semibold">{contract.title ?? '—'}</p>
          <p className="text-sm text-black">{contract.category_derived ?? ''}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-1">Prestations</p>
            <p className="text-sm text-black">Entreprise A : {services.filter(s => s.party === 'a').length} prestation(s), {totalA.toLocaleString()} MAD</p>
            <p className="text-sm text-black">Entreprise B : {services.filter(s => s.party === 'b').length} prestation(s), {totalB.toLocaleString()} MAD</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-1">Calendrier</p>
            <p className="text-sm text-black">Début : {contract.calendar_start_date ?? '—'}</p>
            <p className="text-sm text-black">Fin : {contract.calendar_end_date ?? '—'}</p>
            {milestones.length > 0 && <p className="text-sm text-black">{milestones.length} échéance(s)</p>}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-1">Annexes</p>
          <p className="text-sm text-black">{documents.length} document(s) joint(s)</p>
        </div>
      </div>

      {partnerSigned && !iAlreadySigned && (
        <p className="text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5">
          L'autre entreprise a déjà signé le contrat. Il ne manque plus que votre signature.
        </p>
      )}

      {iAlreadySigned ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center gap-2 text-center">
          <CheckCircle2 size={28} className="text-green-600" />
          <p className="text-sm font-semibold text-green-800">
            Vous avez signé ce contrat{partnerSigned ? ' — les deux Parties ont signé.' : ', en attente de la signature de votre partenaire.'}
          </p>
          {contract.pdf_url && (
            <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2 rounded-lg mt-2">
              <Download size={14} /> Télécharger le contrat signé
            </a>
          )}
        </div>
      ) : (
        <div className="bg-[#EEF3F8] rounded-xl p-5 flex flex-col gap-3">
          <label className="flex items-start gap-2.5 text-sm text-[#0D3B66] cursor-pointer">
            <input type="checkbox" checked={checkInfo} onChange={e => setCheckInfo(e.target.checked)} className="mt-0.5" />
            Je confirme avoir vérifié les informations relatives à mon entreprise.
          </label>
          <label className="flex items-start gap-2.5 text-sm text-[#0D3B66] cursor-pointer">
            <input type="checkbox" checked={checkCgu} onChange={e => setCheckCgu(e.target.checked)} className="mt-0.5" />
            Je reconnais avoir lu et accepté les Conditions Générales du contractualisation.
          </label>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>}

      <div className="flex justify-between">
        <button onClick={onBack} className="text-sm font-semibold text-black hover:text-[#0D3B66] px-4 py-2.5">← Retour</button>
        {!iAlreadySigned && (
          <button
            onClick={handleSign} disabled={!checkInfo || !checkCgu || signing}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-30 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg transition-colors"
          >
            <FileSignature size={15} /> {signing ? 'Signature en cours...' : 'Valider et signer'}
          </button>
        )}
      </div>
    </div>
  )
}
