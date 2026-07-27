'use client'
import { useState } from 'react'
import clsx from 'clsx'
import { Plus, Trash2, Pencil, Package, ShieldCheck } from 'lucide-react'
import { addService, updateService, deleteService, type ServiceInput } from '@/lib/actions/contract-services'
import { computeServiceTotalTtc } from '@/lib/contract-utils'
import type { ContractServiceParty } from '@/lib/types'

const inputCls = "border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

const EMPTY: ServiceInput = {
  nature: 'service', description: '', quantite: null, unite: '', valeur_ht: 0, tva_percent: 20,
  delai_debut: null, delai_fin: null, lieu_execution: '', conditions_particulieres: '',
  garantie: false, garantie_nature: '', garantie_duree: '', garantie_conditions: '',
}

function ServiceForm({
  initial, onSubmit, onCancel, saving,
}: {
  initial: ServiceInput
  onSubmit: (data: ServiceInput) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<ServiceInput>(initial)
  const ttc = computeServiceTotalTtc({ valeur_ht: Number(form.valeur_ht) || 0, tva_percent: Number(form.tva_percent) || 0 })

  return (
    <div className="bg-[#EEF3F8] rounded-xl p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-[#0D3B66] mb-2">Nature de la prestation</p>
        <div className="flex gap-2">
          {[{ v: 'produit', l: 'Produit' }, { v: 'service', l: 'Service' }, { v: 'produit_service', l: 'Produit + Service' }].map(o => (
            <button key={o.v} type="button"
              className={clsx('text-sm font-semibold px-3.5 py-1.5 rounded-full border transition-colors',
                form.nature === o.v ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white text-black border-gray-200')}
              onClick={() => setForm(f => ({ ...f, nature: o.v as any }))}
            >{o.l}</button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Décrivez votre prestation (ex : Fourniture de 50 bureaux ergonomiques en bois)"
        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        rows={2} className={inputCls + ' resize-none'}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-sm text-black">Quantité</label>
          <input type="number" placeholder="Ex : 50" value={form.quantite ?? ''} onChange={e => setForm(f => ({ ...f, quantite: e.target.value ? Number(e.target.value) : null }))} className={inputCls} />
        </div>
        <div>
          <label className="text-sm text-black">Unité</label>
          <input placeholder="Ex : unités, kg, heures" value={form.unite ?? ''} onChange={e => setForm(f => ({ ...f, unite: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className="text-sm text-black">Valeur HT (MAD) *</label>
          <input type="number" placeholder="Ex : 45000" value={form.valeur_ht || ''} onChange={e => setForm(f => ({ ...f, valeur_ht: Number(e.target.value) || 0 }))} className={inputCls} />
        </div>
        <div>
          <label className="text-sm text-black">TVA %</label>
          <input type="number" value={form.tva_percent} onChange={e => setForm(f => ({ ...f, tva_percent: Number(e.target.value) }))} className={inputCls} />
        </div>
      </div>
      <p className="text-sm text-black">Montant TTC calculé automatiquement : <span className="font-bold text-[#0D3B66]">{ttc.toLocaleString()} MAD</span></p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-black">Date de début</label>
          <input type="date" value={form.delai_debut ?? ''} onChange={e => setForm(f => ({ ...f, delai_debut: e.target.value || null }))} className={inputCls} />
        </div>
        <div>
          <label className="text-sm text-black">Date de fin</label>
          <input type="date" value={form.delai_fin ?? ''} onChange={e => setForm(f => ({ ...f, delai_fin: e.target.value || null }))} className={inputCls} />
        </div>
      </div>

      <input placeholder="Lieu d'exécution" value={form.lieu_execution ?? ''} onChange={e => setForm(f => ({ ...f, lieu_execution: e.target.value }))} className={inputCls} />
      <textarea placeholder="Conditions particulières (ex : accès sécurisé, travail de nuit...)" value={form.conditions_particulieres ?? ''} onChange={e => setForm(f => ({ ...f, conditions_particulieres: e.target.value }))} rows={2} className={inputCls + ' resize-none'} />

      <div>
        <label className="flex items-center gap-2 text-sm text-[#0D3B66] font-semibold cursor-pointer">
          <input type="checkbox" checked={form.garantie} onChange={e => setForm(f => ({ ...f, garantie: e.target.checked }))} />
          <ShieldCheck size={15} /> Offrir une garantie
        </label>
        {form.garantie && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <input placeholder="Nature de la garantie" value={form.garantie_nature ?? ''} onChange={e => setForm(f => ({ ...f, garantie_nature: e.target.value }))} className={inputCls} />
            <input placeholder="Durée" value={form.garantie_duree ?? ''} onChange={e => setForm(f => ({ ...f, garantie_duree: e.target.value }))} className={inputCls} />
            <input placeholder="Conditions" value={form.garantie_conditions ?? ''} onChange={e => setForm(f => ({ ...f, garantie_conditions: e.target.value }))} className={inputCls} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button" disabled={saving || !form.description.trim() || !form.valeur_ht}
          onClick={() => onSubmit(form)}
          className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer la prestation'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-black px-3 py-2">Annuler</button>
        {!saving && (!form.description.trim() || !form.valeur_ht) && (
          <p className="text-sm text-amber-600">
            {!form.description.trim() && !form.valeur_ht
              ? 'Renseignez une description et une valeur HT supérieure à 0.'
              : !form.description.trim()
                ? 'Renseignez une description pour activer l’enregistrement.'
                : 'La valeur HT doit être supérieure à 0.'}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Step3Services({
  contract, services, party, currentUserId, onSaved, onContinue, onBack,
}: {
  contract: any
  services: any[]
  party: ContractServiceParty
  currentUserId: string
  onSaved: () => void
  onContinue: () => void
  onBack: () => void
}) {
  const isMine = party === 'a'
    ? contract.party_a_clerk_id === currentUserId
    : contract.party_b_clerk_id === currentUserId

  const companyLabel = party === 'a' ? contract.party_a?.company_name : contract.party_b?.company_name
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const total = services.reduce((sum, s) => sum + computeServiceTotalTtc(s), 0)

  async function handleAdd(data: ServiceInput) {
    setSaving(true)
    setError('')
    try {
      await addService(contract.id, currentUserId, party, data)
      setAdding(false)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(id: string, data: ServiceInput) {
    setSaving(true)
    setError('')
    try {
      await updateService(id, contract.id, currentUserId, data)
      setEditingId(null)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setError('')
    try {
      await deleteService(id, contract.id, currentUserId)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const canContinue = !isMine || services.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#0D3B66]">
          Étape {party === 'a' ? '3' : '4'} — Prestations de l'Entreprise {party.toUpperCase()}
          {companyLabel && <span className="text-black font-normal"> · {companyLabel}</span>}
        </h2>
        <p className="text-sm text-black mt-1">
          {isMine
            ? "Décrivez avec précision ce que votre entreprise s'engage à livrer ou réaliser."
            : `Prestations renseignées par ${companyLabel ?? "l'autre entreprise"}.`}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {services.map((s: any) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {editingId === s.id ? (
              <ServiceForm initial={s} saving={saving} onCancel={() => setEditingId(null)} onSubmit={data => handleEdit(s.id, data)} />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-mono text-gray-500">{s.label}</p>
                  <p className="text-base font-semibold text-[#0D3B66]">{s.description}</p>
                  <p className="text-sm text-black mt-1">
                    {s.quantite && `${s.quantite} ${s.unite ?? ''} · `}
                    {computeServiceTotalTtc(s).toLocaleString()} MAD TTC
                    {s.delai_fin && ` · échéance ${s.delai_fin}`}
                  </p>
                </div>
                {isMine && (
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => setEditingId(s.id)} className="p-1.5 rounded-lg text-black hover:text-[#0D3B66] hover:bg-gray-50"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-black hover:text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {services.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <Package size={22} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-black">Aucune prestation renseignée pour le moment.</p>
          </div>
        )}

        {isMine && (adding ? (
          <ServiceForm initial={EMPTY} saving={saving} onCancel={() => setAdding(false)} onSubmit={handleAdd} />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#0D3B66] bg-[#EEF3F8] hover:bg-blue-100 border border-dashed border-[#0D3B66]/20 px-4 py-3 rounded-xl transition-colors"
          >
            <Plus size={15} /> Ajouter une prestation
          </button>
        ))}
      </div>

      {services.length > 0 && (
        <p className="text-sm font-semibold text-[#0D3B66] text-right">
          Valeur totale des prestations de l'Entreprise {party.toUpperCase()} : {total.toLocaleString()} MAD
        </p>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>}

      <div className="flex justify-between">
        <button onClick={onBack} className="text-sm font-semibold text-black hover:text-[#0D3B66] px-4 py-2.5">← Retour</button>
        <button
          onClick={onContinue} disabled={!canContinue}
          className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-30 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg transition-colors"
        >
          Continuer →
        </button>
      </div>
    </div>
  )
}
