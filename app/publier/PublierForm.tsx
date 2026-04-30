'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createListing } from '@/lib/actions/profile'
import { FileText, MapPin, Hash, AlignLeft, Tag, ArrowLeftRight } from 'lucide-react'

const CATEGORIES = [
  'IT & Digital', 'Marketing & Communication', 'Finance & Comptabilité',
  'Industrie & Production', 'Commerce & Distribution', 'Transport & Logistique',
  'Immobilier & Construction', 'Santé & Bien-être', 'Formation & Education',
  'Hôtellerie & Restauration', 'Médias & Création', 'Autre',
]

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'El Jadida', 'Autre',
]

const EXCHANGE_TYPES = [
  { value: 'service_service', label: 'Service ↔ Service' },
  { value: 'product_service', label: 'Produit ↔ Service' },
  { value: 'product_product', label: 'Produit ↔ Produit' },
]

const inputCls = "border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

function Field({ label, required, icon, children }: {
  label: string; required?: boolean; icon: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0D3B66] flex items-center gap-2">
        <span className="opacity-60">{icon}</span>
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  )
}

export default function PublierForm({
  clerkUserId,
  defaultCity,
}: {
  clerkUserId: string
  defaultCity: string
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [form, setForm] = useState({
    title: '',
    category: '',
    listing_type: 'offer' as 'offer' | 'request',
    description: '',
    value_mad: '',
    exchange_type: 'service_service' as 'service_service' | 'product_service' | 'product_product',
    barter_percent: '100',
    city: defaultCity,
    expires_at: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function uploadImages(listingId: string): Promise<string[]> {
    const urls: string[] = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const path = `${listingId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('listings-images')
        .upload(path, file)
      if (!error) {
        const { data } = supabase.storage
          .from('listings-images')
          .getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { id } = await createListing(clerkUserId, {
        title: form.title,
        category: form.category || null,
        listing_type: form.listing_type,
        description: form.description || null,
        value_mad: form.value_mad ? parseFloat(form.value_mad) : null,
        exchange_type: form.exchange_type,
        barter_percent: parseInt(form.barter_percent),
        city: form.city || null,
        images: [],
        expires_at: form.expires_at || null,
      })

      // Upload images si présentes
      if (images.length > 0) {
        const urls = await uploadImages(id)
        await supabase.from('listings').update({ images: urls }).eq('id', id)
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Type offre/demande */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Type d'annonce
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'offer',   label: 'Je propose', desc: 'Vous offrez un bien ou service' },
            { value: 'request', label: 'Je recherche', desc: 'Vous cherchez un bien ou service' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('listing_type', opt.value)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                form.listing_type === opt.value
                  ? 'border-[#0D3B66] bg-[#EEF3F8]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-bold text-sm text-[#0D3B66]">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Infos principales */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Informations principales
        </h2>

        <Field label="Titre de l'annonce" required icon={<FileText size={14}/>}>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Ex : Prestation de développement web en échange de formation"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Catégorie" icon={<Tag size={14}/>}>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
              <option value="">Sélectionner</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Ville" icon={<MapPin size={14}/>}>
            <select value={form.city} onChange={e => set('city', e.target.value)} className={inputCls}>
              <option value="">Sélectionner</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Description" required icon={<AlignLeft size={14}/>}>
          <textarea
            required
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Décrivez précisément votre offre ou demande, les conditions, les livrables..."
            rows={5}
            className={inputCls + ' resize-none'}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Valeur estimée (MAD)" required icon={<Hash size={14}/>}>
            <input
              type="number"
              required
              min={0}
              value={form.value_mad}
              onChange={e => set('value_mad', e.target.value)}
              placeholder="Ex : 15000"
              className={inputCls}
            />
          </Field>

          <Field label="Durée de publication" icon={<FileText size={14}/>}>
            <select value={form.expires_at} onChange={e => set('expires_at', e.target.value)} className={inputCls}>
              <option value="">Sélectionner</option>
              {[30, 60, 90].map(days => {
                const d = new Date()
                d.setDate(d.getDate() + days)
                return (
                  <option key={days} value={d.toISOString()}>
                    {days} jours
                  </option>
                )
              })}
            </select>
          </Field>
        </div>
      </div>

      {/* Paramètres barter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Paramètres barter
        </h2>

        <Field label="Type d'échange" icon={<ArrowLeftRight size={14}/>}>
          <div className="grid grid-cols-3 gap-2">
            {EXCHANGE_TYPES.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('exchange_type', opt.value)}
                className={`rounded-lg border-2 px-3 py-2.5 text-xs font-semibold text-center transition-all ${
                  form.exchange_type === opt.value
                    ? 'border-[#F5A623] bg-amber-50 text-amber-800'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 leading-relaxed">
          💡 En cas de non équivalence des valeurs à échanger, une compensation en numéraire est autorisée.
        </p>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Images (optionnel)
        </h2>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={e => setImages(Array.from(e.target.files ?? []).slice(0, 5))}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#EEF3F8] file:text-[#0D3B66] hover:file:bg-[#dce8f5]"
        />
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((f, i) => (
              <div key={i} className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400">Max 5 images · JPEG, PNG, WebP · 2 Mo max</p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {submitting ? 'Envoi en cours...' : 'Soumettre l\'annonce'}
      </button>
      <p className="text-xs text-center text-gray-400">
        Votre annonce sera visible après validation par l'équipe Moubadala.
      </p>

    </form>
  )
}