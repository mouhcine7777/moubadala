'use client'
import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost, deletePost, togglePublished } from '@/lib/actions/blog'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/actions/blog'
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  X, Upload, ExternalLink, FileText
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'

const inputCls = "border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

type Mode = 'list' | 'create' | 'edit'

export default function AdminBlogClient({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [mode, setMode] = useState<Mode>('list')
  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title:     '',
    excerpt:   '',
    content:   '',
    cover_url: '',
    published: false,
  })

  function openCreate() {
    setForm({ title: '', excerpt: '', content: '', cover_url: '', published: false })
    setEditPost(null)
    setMode('create')
  }

  function openEdit(post: BlogPost) {
    setForm({
      title:     post.title,
      excerpt:   post.excerpt ?? '',
      content:   post.content,
      cover_url: post.cover_url ?? '',
      published: post.published,
    })
    setEditPost(post)
    setMode('edit')
  }

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function uploadCover(file: File): Promise<string> {
    if (file.size > 2 * 1024 * 1024) throw new Error('Image trop volumineuse (max 2 Mo)')
    const ext  = file.name.split('.').pop()
    const path = `blog/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('listings-images').upload(path, file)
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('listings-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadCover(file)
      set('cover_url', url)
    } catch (err: any) {
      alert(err.message)
    }
    setUploadingCover(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (mode === 'edit' && editPost) {
        await updatePost(editPost.id, form)
      } else {
        await createPost(form)
      }
      setMode('list')
      startTransition(() => router.refresh())
    } catch (err: any) {
      alert(err.message)
    }
    setSaving(false)
  }

  async function handleToggle(id: string, published: boolean) {
    setLoadingId(id)
    await togglePublished(id, !published)
    setLoadingId(null)
    startTransition(() => router.refresh())
  }

  async function handleDelete(id: string) {
    setLoadingId(id)
    await deletePost(id)
    setLoadingId(null)
    setConfirmDeleteId(null)
    startTransition(() => router.refresh())
  }

  // Formulaire create/edit
  if (mode === 'create' || mode === 'edit') {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0D3B66]">
            {mode === 'create' ? 'Nouvel article' : 'Modifier l\'article'}
          </h3>
          <button
            type="button"
            onClick={() => setMode('list')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-2 rounded-lg"
          >
            <X size={13}/> Annuler
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">

          {/* Cover */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#0D3B66]">Image de couverture</label>
            <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden"/>
            {form.cover_url ? (
              <div className="relative group w-full h-40 rounded-xl overflow-hidden border border-gray-100">
                <img src={form.cover_url} alt="" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => coverRef.current?.click()}
                    className="text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={() => set('cover_url', '')}
                    className="text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 px-3 py-1.5 rounded-lg"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                disabled={uploadingCover}
                className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#0D3B66]/30 rounded-xl p-8 text-xs text-gray-400 hover:text-[#0D3B66] transition-colors"
              >
                <Upload size={16}/>
                {uploadingCover ? 'Upload...' : 'Ajouter une image de couverture · Max 2 Mo'}
              </button>
            )}
          </div>

          {/* Titre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0D3B66]">Titre *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Titre de l'article"
              className={inputCls}
            />
          </div>

          {/* Extrait */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0D3B66]">Extrait</label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="Courte description affichée dans la liste des articles..."
              rows={2}
              className={inputCls + ' resize-none'}
            />
          </div>

          {/* Contenu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0D3B66]">Contenu *</label>
            <textarea
              required
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder="Contenu complet de l'article..."
              rows={16}
              className={inputCls + ' resize-none font-mono text-xs'}
            />
            <p className="text-xs text-gray-400">Supporte le Markdown : **gras**, *italique*, # Titre, - liste</p>
          </div>

          {/* Publié */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={clsx(
              'relative w-10 h-5 rounded-full transition-colors',
              form.published ? 'bg-green-500' : 'bg-gray-200'
            )}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => set('published', e.target.checked)}
                className="sr-only"
              />
              <div className={clsx(
                'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                form.published ? 'translate-x-5' : 'translate-x-0.5'
              )}/>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {form.published ? 'Publié — visible sur /blog' : 'Brouillon — non visible'}
            </span>
          </label>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => setMode('list')}
            className="text-sm text-gray-500 border border-gray-200 px-4 py-2.5 rounded-lg hover:border-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'Enregistrement...' : mode === 'create' ? 'Publier l\'article' : 'Enregistrer'}
          </button>
        </div>
      </form>
    )
  }

  // Liste des articles
  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={openCreate}
        className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors self-start"
      >
        <Plus size={15}/> Nouvel article
      </button>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <FileText size={32} className="text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400 text-sm">Aucun article. Créez votre premier article.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 p-5">

                {/* Cover thumbnail */}
                {post.cover_url && (
                  <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <img src={post.cover_url} alt="" className="w-full h-full object-cover"/>
                  </div>
                )}

                {/* Infos */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx(
                      'text-xs font-semibold px-2.5 py-0.5 rounded-full',
                      post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    )}>
                      {post.published ? 'Publié' : 'Brouillon'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(post.created_at), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0D3B66] truncate">{post.title}</p>
                  {post.excerpt && (
                    <p className="text-xs text-gray-400 line-clamp-2">{post.excerpt}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {post.published && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0D3B66] border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <ExternalLink size={12}/> Voir
                    </a>
                  )}

                  <button
                    onClick={() => handleToggle(post.id, post.published)}
                    disabled={loadingId === post.id}
                    className={clsx(
                      'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40',
                      post.published
                        ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                        : 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                    )}
                  >
                    {post.published ? <EyeOff size={12}/> : <Eye size={12}/>}
                    {loadingId === post.id ? '...' : post.published ? 'Dépublier' : 'Publier'}
                  </button>

                  <button
                    onClick={() => openEdit(post)}
                    className="flex items-center gap-1.5 text-xs text-[#0D3B66] border border-[#0D3B66]/20 hover:border-[#0D3B66] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil size={12}/> Modifier
                  </button>

                  {confirmDeleteId === post.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={loadingId === post.id}
                        className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg disabled:opacity-40"
                      >
                        {loadingId === post.id ? '...' : 'Confirmer'}
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
                      onClick={() => setConfirmDeleteId(post.id)}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={13}/>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}