'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTransaction } from '@/lib/actions/transactions'
import { ArrowLeftRight, Building2, FileText } from 'lucide-react'

const inputCls = "border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

export default function NewTransactionForm({
  request,
  currentUserId,
}: {
  request: any
  currentUserId: string
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isPartyA = currentUserId === request.receiver_clerk_id
  const partyA = isPartyA ? request.receiver : request.sender
  const partyB = isPartyA ? request.sender : request.receiver
  const partyAId = isPartyA ? request.receiver_clerk_id : request.sender_clerk_id
  const partyBId = isPartyA ? request.sender_clerk_id : request.receiver_clerk_id

  const [form, setForm] = useState({
    party_a_offering:  request.listings?.title ?? '',
    party_b_offering:  '',
    party_a_value_mad: request.listings?.value_mad?.toString() ?? '',
    party_b_value_mad: '',
    notes: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createTransaction({
        request_id:        request.id,
        party_a_clerk_id:  partyAId,
        party_b_clerk_id:  partyBId,
        party_a_offering:  form.party_a_offering,
        party_b_offering:  form.party_b_offering,
        party_a_value_mad: parseFloat(form.party_a_value_mad) || 0,
        party_b_value_mad: parseFloat(form.party_b_value_mad) || 0,
        notes: form.notes || null,
      })
      router.push('/dashboard/transactions')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Annonce liée */}
      {request.listings && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 mb-1">Annonce concernée</p>
          <p className="text-sm font-bold text-[#0D3B66]">{request.listings.title}</p>
        </div>
      )}

      {/* Partie A */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#F5A623] flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          {partyA?.company_name}
        </h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#0D3B66]">Ce qu'il apporte *</label>
          <input
            type="text"
            required
            value={form.party_a_offering}
            onChange={e => set('party_a_offering', e.target.value)}
            placeholder="Ex : Prestation de développement web"
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#0D3B66]">Valeur (MAD)</label>
          <input
            type="number"
            min={0}
            value={form.party_a_value_mad}
            onChange={e => set('party_a_value_mad', e.target.value)}
            placeholder="0"
            className={inputCls}
          />
        </div>
      </div>

      {/* Séparateur */}
      <div className="flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[#EEF3F8] flex items-center justify-center">
          <ArrowLeftRight size={18} className="text-[#0D3B66]"/>
        </div>
      </div>

      {/* Partie B */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#0D3B66] flex items-center justify-center text-white text-xs font-bold">
            B
          </div>
          {partyB?.company_name}
        </h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#0D3B66]">Ce qu'il apporte *</label>
          <input
            type="text"
            required
            value={form.party_b_offering}
            onChange={e => set('party_b_offering', e.target.value)}
            placeholder="Ex : Formation marketing digital"
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#0D3B66]">Valeur (MAD)</label>
          <input
            type="number"
            min={0}
            value={form.party_b_value_mad}
            onChange={e => set('party_b_value_mad', e.target.value)}
            placeholder="0"
            className={inputCls}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Notes
        </h2>
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Conditions particulières, remarques, modalités de livraison..."
          rows={4}
          className={inputCls + ' resize-none'}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 border border-gray-200 px-4 py-2.5 rounded-lg hover:border-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          {saving ? 'Enregistrement...' : 'Créer la transaction'}
        </button>
      </div>

    </form>
  )
}