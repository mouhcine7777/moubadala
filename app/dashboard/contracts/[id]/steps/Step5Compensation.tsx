'use client'
import { useState } from 'react'
import clsx from 'clsx'
import { Scale } from 'lucide-react'
import { updateContractStep5 } from '@/lib/actions/contracts'
import { sumPartyTotal } from '@/lib/contract-utils'

const inputCls = "border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

export default function Step5Compensation({
  contract, services, currentUserId, onSaved, onContinue, onBack,
}: {
  contract: any
  services: any[]
  currentUserId: string
  onSaved: () => void
  onContinue: () => void
  onBack: () => void
}) {
  const totalA = sumPartyTotal(services, 'a')
  const totalB = sumPartyTotal(services, 'b')
  const difference = Math.round((totalA - totalB) * 100) / 100

  const [form, setForm] = useState({
    compensation_prevue:   contract.compensation_prevue ?? false,
    compensation_montant:  contract.compensation_montant ?? null,
    compensation_devise:   contract.compensation_devise ?? 'MAD',
    compensation_mode:     contract.compensation_mode ?? '',
    compensation_echeance: contract.compensation_echeance ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const exceedsGap = form.compensation_prevue && form.compensation_montant != null
    && Math.abs(form.compensation_montant) > Math.abs(difference) + 0.01

  async function persist() {
    setSaving(true)
    setError('')
    try {
      await updateContractStep5(contract.id, currentUserId, {
        ...form,
        compensation_montant: form.compensation_prevue ? form.compensation_montant : null,
        compensation_mode: form.compensation_prevue ? (form.compensation_mode || null) : null,
        compensation_echeance: form.compensation_prevue ? (form.compensation_echeance || null) : null,
      } as any)
      onSaved()
      return true
    } catch (e: any) {
      setError(e.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleContinue() {
    if (await persist()) onContinue()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#0D3B66]">Étape 5 — Équilibre économique et compensation</h2>
        <p className="text-sm text-black mt-1">L'Assistant calcule automatiquement la valeur des prestations de chaque entreprise.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#EEF3F8] rounded-xl p-4">
            <p className="text-sm text-black mb-1">Entreprise A</p>
            <p className="text-lg font-bold text-[#0D3B66]">{totalA.toLocaleString()} MAD</p>
          </div>
          <div className="flex items-center justify-center">
            <Scale size={22} className="text-gray-400" />
          </div>
          <div className="bg-[#EEF3F8] rounded-xl p-4">
            <p className="text-sm text-black mb-1">Entreprise B</p>
            <p className="text-lg font-bold text-[#0D3B66]">{totalB.toLocaleString()} MAD</p>
          </div>
        </div>
        <p className="text-center text-sm text-black">
          Différence : <span className="font-bold text-[#F5A623]">{Math.abs(difference).toLocaleString()} MAD</span>
          {difference === 0 && ' — les prestations sont équilibrées.'}
        </p>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Souhaitez-vous prévoir une compensation ?</p>
          <div className="flex gap-2">
            <button type="button"
              className={clsx('text-sm font-semibold px-4 py-2 rounded-lg border transition-colors',
                !form.compensation_prevue ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white text-black border-gray-200')}
              onClick={() => setForm(f => ({ ...f, compensation_prevue: false }))}
            >Non</button>
            <button type="button"
              className={clsx('text-sm font-semibold px-4 py-2 rounded-lg border transition-colors',
                form.compensation_prevue ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white text-black border-gray-200')}
              onClick={() => setForm(f => ({ ...f, compensation_prevue: true }))}
            >Oui</button>
          </div>

          {form.compensation_prevue && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <input type="number" placeholder="Montant" value={form.compensation_montant ?? ''}
                onChange={e => setForm(f => ({ ...f, compensation_montant: e.target.value ? Number(e.target.value) : null }))} className={inputCls} />
              <input placeholder="Devise" value={form.compensation_devise}
                onChange={e => setForm(f => ({ ...f, compensation_devise: e.target.value }))} className={inputCls} />
              <input placeholder="Mode de règlement" value={form.compensation_mode}
                onChange={e => setForm(f => ({ ...f, compensation_mode: e.target.value }))} className={inputCls} />
              <input type="date" placeholder="Échéance" value={form.compensation_echeance}
                onChange={e => setForm(f => ({ ...f, compensation_echeance: e.target.value }))} className={inputCls} />
            </div>
          )}

          {exceedsGap && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
              Le montant de compensation dépasse l'écart constaté entre les deux entreprises ({Math.abs(difference).toLocaleString()} MAD).
              Vous pouvez poursuivre si les deux Parties en sont expressément convenues.
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>}

      <div className="flex justify-between">
        <button onClick={onBack} className="text-sm font-semibold text-black hover:text-[#0D3B66] px-4 py-2.5">← Retour</button>
        <div className="flex gap-2">
          <button onClick={persist} disabled={saving} className="text-sm font-semibold text-[#0D3B66] bg-[#EEF3F8] hover:bg-blue-100 px-5 py-2.5 rounded-lg transition-colors disabled:opacity-40">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button onClick={handleContinue} disabled={saving} className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40">
            Continuer →
          </button>
        </div>
      </div>
    </div>
  )
}
