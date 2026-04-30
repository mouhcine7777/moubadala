'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react'
import clsx from 'clsx'

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function LogoUpload({
  clerkUserId,
  currentUrl,
  onUpload,
}: {
  clerkUserId: string
  currentUrl: string | null
  onUpload: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setError('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('Format non supporté. Utilisez JPEG, PNG ou WebP.')
      return
    }
    if (f.size > 2 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 2 Mo).')
      return
    }

    setUploading(true)
    const ext  = f.name.split('.').pop()
    const path = `profiles/${clerkUserId}/logo.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('listings-images')
      .upload(path, f, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('listings-images').getPublicUrl(path)
    onUpload(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#0D3B66]">Logo entreprise</label>
      <div className="flex items-center gap-4">
        {/* Aperçu */}
        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
          {currentUrl ? (
            <img src={currentUrl} alt="Logo" className="w-full h-full object-cover"/>
          ) : (
            <ImageIcon size={20} className="text-gray-300"/>
          )}
        </div>
        {/* Bouton upload */}
        <div className="flex flex-col gap-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-xs font-semibold text-[#0D3B66] border border-[#0D3B66]/20 hover:border-[#0D3B66] px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
          >
            {uploading ? <Loader2 size={13} className="animate-spin"/> : <Upload size={13}/>}
            {uploading ? 'Upload...' : 'Choisir un logo'}
          </button>
          <p className="text-xs text-gray-400">JPEG, PNG, WebP · Max 2 Mo</p>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function GalleryUpload({
  clerkUserId,
  currentImages,
  onUpload,
}: {
  clerkUserId: string
  currentImages: string[]
  onUpload: (images: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setError('')

    const remaining = 6 - currentImages.length
    if (files.length > remaining) {
      setError(`Maximum 6 images. Vous pouvez en ajouter encore ${remaining}.`)
      return
    }

    for (const f of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        setError('Format non supporté. Utilisez JPEG, PNG ou WebP.')
        return
      }
      if (f.size > 2 * 1024 * 1024) {
        setError(`"${f.name}" dépasse 2 Mo.`)
        return
      }
    }

    setUploading(true)
    const newUrls: string[] = []

    for (const f of files) {
      const ext  = f.name.split('.').pop()
      const path = `profiles/${clerkUserId}/gallery/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('listings-images')
        .upload(path, f)

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }
      const { data } = supabase.storage.from('listings-images').getPublicUrl(path)
      newUrls.push(data.publicUrl)
    }

    onUpload([...currentImages, ...newUrls])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function removeImage(url: string) {
    onUpload(currentImages.filter(u => u !== url))
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#0D3B66]">
        Galerie photos
        <span className="ml-2 text-xs font-normal text-gray-400">{currentImages.length}/6</span>
      </label>

      {/* Grille images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {currentImages.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
              <img src={url} alt="" className="w-full h-full object-cover"/>
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12}/>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bouton ajouter */}
      {currentImages.length < 6 && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-xs font-semibold text-[#0D3B66] border border-dashed border-[#0D3B66]/30 hover:border-[#0D3B66] px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40 w-full justify-center"
          >
            {uploading ? <Loader2 size={13} className="animate-spin"/> : <ImageIcon size={13}/>}
            {uploading ? 'Upload...' : 'Ajouter des photos'}
          </button>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP · Max 2 Mo par image · Max 6 images</p>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function VideoUpload({
  clerkUserId,
  currentUrl,
  onUpload,
}: {
  clerkUserId: string
  currentUrl: string | null
  onUpload: (url: string | null) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setError('')

    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(f.type)) {
      setError('Format non supporté. Utilisez MP4, WebM ou MOV.')
      return
    }
    if (f.size > 2 * 1024 * 1024) {
      setError('Vidéo trop volumineuse (max 2 Mo).')
      return
    }

    setUploading(true)
    const ext  = f.name.split('.').pop()
    const path = `profiles/${clerkUserId}/video.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('listings-images')
      .upload(path, f, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('listings-images').getPublicUrl(path)
    onUpload(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#0D3B66]">Vidéo de présentation</label>

      {currentUrl ? (
        <div className="flex flex-col gap-2">
          <video
            src={currentUrl}
            controls
            className="w-full rounded-xl border border-gray-100 max-h-48 object-cover"
          />
          <button
            type="button"
            onClick={() => onUpload(null)}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 self-start"
          >
            <X size={12}/> Supprimer la vidéo
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-xs font-semibold text-[#0D3B66] border border-dashed border-[#0D3B66]/30 hover:border-[#0D3B66] px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40 w-full justify-center"
          >
            {uploading ? <Loader2 size={13} className="animate-spin"/> : <Video size={13}/>}
            {uploading ? 'Upload...' : 'Ajouter une vidéo'}
          </button>
          <p className="text-xs text-gray-400 mt-1">MP4, WebM, MOV · Max 2 Mo</p>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}