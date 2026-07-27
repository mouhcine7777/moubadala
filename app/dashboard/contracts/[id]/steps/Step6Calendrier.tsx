'use client'
import { useState } from 'react'
import clsx from 'clsx'
import { Plus, Trash2, CalendarDays } from 'lucide-react'
import { updateContractStep6, addMilestone, deleteMilestone } from '@/lib/actions/contracts'

const inputCls = "border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

export default function Step6Calendrier({
  contract, milestones, currentUserId, onSaved, onContinue, onBack,
}: {
  contract: any
  milestones: any[]
  currentUserId: string
  onSaved: () => void
  onContinue: () => void
  onBack: () => void
}) {
  const [form, setForm] = useState({
    calendar_start_date: contract.calendar_start_date ?? '',
    calendar_end_date:   contract.calendar_end_date ?? '',
    calendar_mode:       contract.calendar_mode ?? 'unique',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newMilestone, setNewMilestone] = useState({ label: '', due_date: '' })
  const [addingMilestone, setAddingMilestone] = useState(false)

  const dateIncoherent = form.calendar_start_date && form.calendar_end_date && form.calendar_end_date < form.calendar_start_date

  async function persist() {
    setSaving(true)
    setError('')
    try {
      await updateContractStep6(contract.id, currentUserId, {
        calendar_start_date: form.calendar_start_date || null,
        calendar_end_date: form.calendar_end_date || null,
        calendar_mode: form.calendar_mode as any,
      })
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
    if (dateIncoherent) { setError('La date de fin est antérieure à la date de début.'); return }
    if (await persist()) onContinue()
  }

  async function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault()
    if (!newMilestone.label || !newMilestone.due_date) return
    setAddingMilestone(true)
    setError('')
    try {
      await addMilestone(contract.id, currentUserId, newMilestone.label, newMilestone.due_date)
      setNewMilestone({ label: '', due_date: '' })
      onSaved()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setAddingMilestone(false)
    }
  }

  async function handleRemoveMilestone(id: string) {
    try {
      await deleteMilestone(id, contract.id)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#0D3B66]">Étape 6 — Calendrier d'exécution</h2>
        <p className="text-sm text-black mt-1">Répondez simplement aux questions, le calendrier se construit automatiquement.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-black">Quand débute l'échange ?</label>
            <input type="date" value={form.calendar_start_date} onChange={e => setForm(f => ({ ...f, calendar_start_date: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-black">Existe-t-il une date limite ?</label>
            <input type="date" value={form.calendar_end_date} onChange={e => setForm(f => ({ ...f, calendar_end_date: e.target.value }))} className={inputCls} />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0D3B66] mb-2.5">Les prestations sont-elles réalisées en une seule fois ?</p>
          <div className="flex gap-2">
            <button type="button"
              className={clsx('text-sm font-semibold px-4 py-2 rounded-lg border transition-colors',
                form.calendar_mode === 'unique' ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white text-black border-gray-200')}
              onClick={() => setForm(f => ({ ...f, calendar_mode: 'unique' }))}
            >Oui</button>
            <button type="button"
              className={clsx('text-sm font-semibold px-4 py-2 rounded-lg border transition-colors',
                form.calendar_mode === 'multi_jalons' ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white text-black border-gray-200')}
              onClick={() => setForm(f => ({ ...f, calendar_mode: 'multi_jalons' }))}
            >Non — ajouter des échéances</button>
          </div>
        </div>

        {form.calendar_mode === 'multi_jalons' && (
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {milestones.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between gap-3 bg-[#EEF3F8] rounded-lg px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm text-[#0D3B66]">
                  <CalendarDays size={15} className="text-gray-500" />
                  <span className="font-semibold">{m.label}</span>
                  <span className="text-black">· {m.due_date}</span>
                </div>
                <button onClick={() => handleRemoveMilestone(m.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={15} /></button>
              </div>
            ))}
            <form onSubmit={handleAddMilestone} className="flex gap-2">
              <input placeholder="Ex : Livraison de la prestation A" value={newMilestone.label}
                onChange={e => setNewMilestone(m => ({ ...m, label: e.target.value }))} className={inputCls} />
              <input type="date" value={newMilestone.due_date}
                onChange={e => setNewMilestone(m => ({ ...m, due_date: e.target.value }))} className={inputCls + ' max-w-[160px]'} />
              <button type="submit" disabled={addingMilestone} className="shrink-0 flex items-center gap-1 text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2 rounded-lg disabled:opacity-40">
                <Plus size={14} /> Ajouter
              </button>
            </form>
          </div>
        )}
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
