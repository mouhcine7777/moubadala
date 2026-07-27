'use client'
import { useState, useRef } from 'react'
import clsx from 'clsx'
import { Upload, Trash2, FileText, Plus, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadContractDocument, deleteContractDocument } from '@/lib/actions/contract-documents'
import type { ContractDocument } from '@/lib/types'

const CATEGORIES: { value: ContractDocument['category']; label: string }[] = [
  { value: 'devis',          label: 'Devis' },
  { value: 'cahier_charges', label: 'Cahier des charges' },
  { value: 'plan',           label: 'Plan' },
  { value: 'photo',          label: 'Photo' },
  { value: 'video',          label: 'Vidéo' },
  { value: 'catalogue',      label: 'Catalogue' },
  { value: 'certificat',     label: 'Certificat' },
  { value: 'notice',         label: 'Notice' },
  { value: 'autre',          label: 'Autre' },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

const inputCls = "border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

export default function Step7Documents({
  contract, documents, currentUserId, onSaved, onContinue, onBack,
}: {
  contract: any
  documents: any[]
  currentUserId: string
  onSaved: () => void
  onContinue: () => void
  onBack: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<{ title: string; category: ContractDocument['category']; file: File | null; comment: string }>({
    title: '', category: 'devis', file: null, comment: '',
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 1 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 1 Mo).')
      return
    }
    setError('')
    setForm(prev => ({ ...prev, file: f, title: prev.title || f.name.replace(/\.[^.]+$/, '') }))
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!form.file || !form.title) return
    setUploading(true)
    setError('')
    try {
      const ext = form.file.name.split('.').pop()
      const path = `${contract.id}/annexes/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage.from('contract-documents').upload(path, form.file)
      if (uploadError) throw new Error(uploadError.message)

      const { data } = supabase.storage.from('contract-documents').getPublicUrl(path)

      await uploadContractDocument(contract.id, currentUserId, {
        category: form.category,
        title: form.title,
        file_url: data.publicUrl,
        file_name: form.file.name,
        file_size: form.file.size,
        comment: form.comment || null,
      })

      setForm({ title: '', category: 'devis', file: null, comment: '' })
      if (fileRef.current) fileRef.current.value = ''
      setShowForm(false)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteContractDocument(id, contract.id, currentUserId)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#0D3B66]">Étape 7 — Documents et annexes</h2>
        <p className="text-sm text-black mt-1">Joignez les documents utiles à votre échange (devis, plans, photos, certificats...).</p>
      </div>

      <div className="flex flex-col gap-3">
        {documents.map((d: any) => {
          const cat = CATEGORIES.find(c => c.value === d.category)
          return (
            <div key={d.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EEF3F8] flex items-center justify-center shrink-0">
                <FileText size={16} className="text-[#0D3B66]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[#0D3B66] truncate">{d.title}</p>
                <p className="text-sm text-black">{cat?.label} {d.file_size ? `· ${formatBytes(d.file_size)}` : ''}</p>
              </div>
              <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#0D3B66] border border-[#0D3B66]/20 hover:border-[#0D3B66] px-3 py-1.5 rounded-lg shrink-0">
                Voir
              </a>
              <button onClick={() => handleDelete(d.id)} className="text-black hover:text-red-600 shrink-0"><Trash2 size={15} /></button>
            </div>
          )
        })}

        {documents.length === 0 && !showForm && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm text-black">Aucun document joint.</p>
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleUpload} className="bg-[#EEF3F8] rounded-xl p-5 flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input required placeholder="Titre du document" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))} className={inputCls}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <input ref={fileRef} type="file" onChange={handleFileChange} className="hidden" />
            <div
              onClick={() => fileRef.current?.click()}
              className={clsx('border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors',
                form.file ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white hover:border-[#0D3B66]/30')}
            >
              {form.file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText size={18} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{form.file.name}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, file: null })) }}><X size={14} /></button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <Upload size={20} className="text-gray-400" />
                  <p className="text-sm text-black">Cliquez pour sélectionner un fichier (max 1 Mo)</p>
                </div>
              )}
            </div>
            <input placeholder="Commentaire (facultatif)" value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className={inputCls} />
            <div className="flex gap-2">
              <button type="submit" disabled={uploading || !form.file || !form.title} className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2 rounded-lg disabled:opacity-40">
                {uploading ? 'Envoi...' : 'Ajouter le document'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm font-semibold text-black px-3 py-2">Annuler</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#0D3B66] bg-[#EEF3F8] hover:bg-blue-100 border border-dashed border-[#0D3B66]/20 px-4 py-3 rounded-xl transition-colors">
            <Plus size={15} /> Ajouter un document
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>}

      <div className="flex justify-between">
        <button onClick={onBack} className="text-sm font-semibold text-black hover:text-[#0D3B66] px-4 py-2.5">← Retour</button>
        <button onClick={onContinue} className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-6 py-2.5 rounded-lg transition-colors">
          Continuer →
        </button>
      </div>
    </div>
  )
}
