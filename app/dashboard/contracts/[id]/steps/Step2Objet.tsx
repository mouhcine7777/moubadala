'use client'
import { useState } from 'react'
import clsx from 'clsx'
import { updateContractStep2 } from '@/lib/actions/contracts'

const EXCHANGE_TYPES = [
  { value: 'produit_produit', label: 'Produit contre Produit' },
  { value: 'service_service', label: 'Service contre Service' },
  { value: 'produit_service', label: 'Produit contre Service' },
  { value: 'plusieurs',       label: 'Plusieurs produits et/ou services' },
  { value: 'autre',           label: 'Autre' },
] as const

const EXECUTION_MODES = [
  { value: 'une_fois',                 label: 'En une seule fois' },
  { value: 'plusieurs_livraisons',     label: 'En plusieurs livraisons' },
  { value: 'plusieurs_interventions',  label: 'En plusieurs interventions' },
  { value: 'calendrier',               label: 'Selon un calendrier' },
] as const

const LIEUX = [
  { value: 'chez_a',      label: "Chez l'entreprise A" },
  { value: 'chez_b',      label: "Chez l'entreprise B" },
  { value: 'chez_client', label: 'Chez un client' },
  { value: 'a_distance',  label: 'À distance' },
  { value: 'plusieurs',   label: 'Plusieurs lieux' },
] as const

const radioCls = (active: boolean) => clsx(
  'text-sm font-medium px-3.5 py-2 rounded-lg border cursor-pointer transition-colors',
  active ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white text-black border-gray-200 hover:border-gray-300'
)

const inputCls = "border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

export default function Step2Objet({
  contract, currentUserId, onSaved, onContinue, onBack,
}: {
  contract: any
  currentUserId: string
  onSaved: () => void
  onContinue: () => void
  onBack: () => void
}) {
  const [form, setForm] = useState({
    exchange_type:   contract.exchange_type ?? '',
    title:           contract.title ?? '',
    objectif:        Array.isArray(contract.objectif) ? (contract.objectif[0] ?? '') : (contract.objectif ?? ''),
    execution_mode:  contract.execution_mode ?? '',
    lieu_execution:  contract.lieu_execution ?? '',
    confidentialite: contract.confidentialite ?? 'standard',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isServiceOnly = form.exchange_type === 'service_service'

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await updateContractStep2(contract.id, currentUserId, {
        ...form,
        exchange_type: form.exchange_type || null,
        objectif: form.objectif.trim() ? [form.objectif.trim()] : [],
        description: form.objectif.trim() || form.title,
        execution_mode: form.execution_mode || null,
        lieu_execution: isServiceOnly ? null : (form.lieu_execution || null),
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
    const ok = await handleSave()
    if (ok) onContinue()
  }

  const canContinue = form.exchange_type && form.title.trim() && form.execution_mode
    && (isServiceOnly || form.lieu_execution)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#0D3B66]">Étape 2 — Nature et objet de l'échange</h2>
        <p className="text-sm text-black mt-1">Définissez précisément ce que les deux entreprises souhaitent réaliser.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">

        <div>
          <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Quel type d'échange souhaitez-vous réaliser ? *</p>
          <div className="flex flex-wrap gap-2">
            {EXCHANGE_TYPES.map(t => (
              <button key={t.value} type="button" className={radioCls(form.exchange_type === t.value)}
                onClick={() => setForm(f => ({ ...f, exchange_type: t.value }))}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Comment souhaitez-vous identifier cet échange ? *</p>
          <input
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Ex : Fourniture de mobilier de bureau contre prestations de communication digitale"
            className={inputCls}
          />
          <p className="text-sm text-black mt-1">Ce titre deviendra le titre du contrat, du dossier et du PDF.</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Objectif principal (facultatif, usage statistique)</p>
          <input
            value={form.objectif} onChange={e => setForm(f => ({ ...f, objectif: e.target.value }))}
            placeholder="Ex : Développement commercial"
            className={inputCls}
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Comment la prestation sera-t-elle réalisée ? *</p>
          <div className="flex flex-wrap gap-2">
            {EXECUTION_MODES.map(m => (
              <button key={m.value} type="button" className={radioCls(form.execution_mode === m.value)}
                onClick={() => setForm(f => ({ ...f, execution_mode: m.value }))}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {!isServiceOnly && (
          <div>
            <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Où l'échange sera-t-il réalisé ? *</p>
            <div className="flex flex-wrap gap-2">
              {LIEUX.map(l => (
                <button key={l.value} type="button" className={radioCls(form.lieu_execution === l.value)}
                  onClick={() => setForm(f => ({ ...f, lieu_execution: l.value }))}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Niveau de confidentialité</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={radioCls(form.confidentialite === 'standard')}
              onClick={() => setForm(f => ({ ...f, confidentialite: 'standard' }))}>Standard</button>
            <button type="button" className={radioCls(form.confidentialite === 'renforcee')}
              onClick={() => setForm(f => ({ ...f, confidentialite: 'renforcee' }))}>Renforcé</button>
          </div>
          {form.confidentialite === 'renforcee' && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
              Une clause complémentaire de confidentialité sera ajoutée automatiquement au contrat.
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>}

      <div className="flex justify-between">
        <button onClick={onBack} className="text-sm font-semibold text-black hover:text-[#0D3B66] px-4 py-2.5">← Retour</button>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="text-sm font-semibold text-[#0D3B66] bg-[#EEF3F8] hover:bg-blue-100 px-5 py-2.5 rounded-lg transition-colors disabled:opacity-40">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            onClick={handleContinue} disabled={!canContinue || saving}
            className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-30 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg transition-colors"
          >
            Continuer →
          </button>
        </div>
      </div>
    </div>
  )
}
