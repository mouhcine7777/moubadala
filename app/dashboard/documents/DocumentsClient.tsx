'use client'
import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { deleteDocument } from '@/lib/actions/documents'
import type { Document } from '@/lib/actions/documents'
import {
  FileText, Upload, Trash2, Download,
  X, Plus, File, CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  rc:                  { label: 'Registre de commerce',   color: 'text-blue-700',   bg: 'bg-blue-50'   },
  patente:             { label: 'Patente',                 color: 'text-amber-700',  bg: 'bg-amber-50'  },
  ice:                 { label: 'ICE',                     color: 'text-purple-700', bg: 'bg-purple-50' },
  cnss:                { label: 'CNSS',                    color: 'text-green-700',  bg: 'bg-green-50'  },
  attestation_fiscale: { label: 'Attestation fiscale',     color: 'text-red-700',    bg: 'bg-red-50'    },
  certification:       { label: 'Certification',           color: 'text-teal-700',   bg: 'bg-teal-50'   },
  contrat:             { label: 'Contrat',                 color: 'text-gray-700',   bg: 'bg-gray-100'  },
  autre:               { label: 'Autre',                   color: 'text-gray-500',   bg: 'bg-gray-50'   },
}

const DOCUMENT_TYPES = Object.entries(TYPE_CONFIG).map(([value, { label }]) => ({ value, label }))

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export default function DocumentsClient({
  documents,
  clerkUserId,
}: {
  documents: Document[]
  clerkUserId: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    type: 'rc',
    file: null as File | null,
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 2 Mo).')
      return
    }
    setError('')
    setForm(prev => ({
      ...prev,
      file: f,
      name: prev.name || f.name.replace(/\.[^.]+$/, ''),
    }))
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!form.file || !form.name) return
    setUploading(true)
    setError('')

    try {
      const ext  = form.file.name.split('.').pop()
      const path = `documents/${clerkUserId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('listings-images')
        .upload(path, form.file)

      if (uploadError) throw new Error(uploadError.message)

      const { data } = supabase.storage.from('listings-images').getPublicUrl(path)

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          clerk_user_id: clerkUserId,
          name:          form.name,
          type:          form.type,
          url:           data.publicUrl,
          size:          form.file.size,
        })

      if (dbError) throw new Error(dbError.message)

      setUploadSuccess(true)
      setForm({ name: '', type: 'rc', file: null })
      if (fileRef.current) fileRef.current.value = ''

      setTimeout(() => {
        setUploadSuccess(false)
        setShowForm(false)
        startTransition(() => router.refresh())
      }, 1500)

    } catch (err: any) {
      setError(err.message)
    }

    setUploading(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await deleteDocument(id, clerkUserId)
    setDeletingId(null)
    setConfirmDeleteId(null)
    startTransition(() => router.refresh())
  }

  // Grouper par type
  const grouped = DOCUMENT_TYPES.map(({ value, label }) => ({
    type: value,
    label,
    docs: documents.filter(d => d.type === value),
  })).filter(g => g.docs.length > 0)

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[#0D3B66]">{documents.length}</span> document{documents.length !== 1 ? 's' : ''} stocké{documents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setUploadSuccess(false) }}
          className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15}/> Ajouter un document
        </button>
      </div>

      {/* Formulaire upload */}
      {showForm && (
        <form
          onSubmit={handleUpload}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4"
        >
          <h2 className="text-sm font-bold text-[#0D3B66] border-b border-gray-100 pb-3">
            Nouveau document
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#0D3B66]">Nom du document *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Ex : RC - 2024"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#0D3B66]">Type de document *</label>
              <select
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white"
              >
                {DOCUMENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Zone upload */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileRef.current?.click()}
              className={clsx(
                'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                form.file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-[#0D3B66]/30 hover:bg-[#EEF3F8]/50'
              )}
            >
              {form.file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={20} className="text-green-600"/>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-green-700">{form.file.name}</p>
                    <p className="text-xs text-green-600">{formatBytes(form.file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setForm(p => ({ ...p, file: null })); if (fileRef.current) fileRef.current.value = '' }}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={16}/>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-gray-300"/>
                  <p className="text-sm text-gray-400">Cliquez pour sélectionner un fichier</p>
                  <p className="text-xs text-gray-300">PDF, Word, image · Max 2 Mo</p>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {uploadSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle size={16}/> Document ajouté avec succès
            </div>
          )}

          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading || !form.file || !form.name}
              className="flex items-center gap-2 bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {uploading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block"/>
              ) : (
                <Upload size={14}/>
              )}
              {uploading ? 'Upload...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {/* Liste documents */}
      {documents.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
          <File size={36} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm font-semibold mb-1">Aucun document</p>
          <p className="text-gray-400 text-xs mb-4">
            Déposez vos documents légaux (RC, patente, attestations...) pour constituer votre dossier de confiance.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={15}/> Ajouter mon premier document
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(group => {
            const tc = TYPE_CONFIG[group.type]
            return (
              <div key={group.type}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-full', tc.bg, tc.color)}>
                    {group.label}
                  </span>
                  <span className="text-xs text-gray-400">{group.docs.length} fichier{group.docs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {group.docs.map(doc => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
                    >
                      <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center shrink-0', tc.bg)}>
                        <FileText size={16} className={tc.color}/>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0D3B66] truncate">{doc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {doc.size ? formatBytes(doc.size) : ''} · Ajouté {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[#0D3B66] border border-[#0D3B66]/20 hover:border-[#0D3B66] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Download size={12}/> Télécharger
                        </a>

                        {confirmDeleteId === doc.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(doc.id)}
                              disabled={deletingId === doc.id}
                              className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                            >
                              {deletingId === doc.id ? '...' : 'Confirmer'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(doc.id)}
                            className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 p-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 size={13}/>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}