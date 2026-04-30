'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateListing } from '@/lib/actions/profile'
import type { Listing } from '@/lib/types'
import { FileText, MapPin, Hash, AlignLeft, Tag, ArrowLeftRight, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

function Field({ label, icon, children }: {
  label: string; icon: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0D3B66] flex items-center gap-2">
        <span className="opacity-60">{icon}</span>{label}
      </label>
      {children}
    </div>
  )
}

export default function EditListingForm({
  listing,
  clerkUserId,
}: {
  listing: Listing
  clerkUserId: string
}) {
  const router = useRouter()
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [error, setError]         = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [form, setForm] = useState({
    title:         listing.title ?? '',
    category:      listing.category ?? '',
    listing_type:  listing.listing_type ?? 'offer',
    description:   listing.description ?? '',
    value_mad:     listing.value_mad?.toString() ?? '',
    exchange_type: listing.exchange_type ?? 'service_service',
    barter_percent: listing.barter_percent?.toString() ?? '100',
    city:          listing.city ?? '',
    expires_at:    listing.expires_at ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateListing(listing.id, clerkUserId, {
        title:          form.title,
        category:       form.category || null,
        listing_type:   form.listing_type as 'offer' | 'request',
        description:    form.description || null,
        value_mad:      form.value_mad ? parseFloat(form.value_mad) : null,
        exchange_type:  form.exchange_type as any,
        barter_percent: parseInt(form.barter_percent),
        city:           form.city || null,
        status:         'pending', // repasse en attente après modification
      })
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listing.id)
      .eq('clerk_user_id', clerkUserId)

    if (error) {
      setError(error.message)
      setDeleting(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">

      {/* Statut info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800">
        Toute modification repassera l'annonce en statut "En attente" pour validation.
      </div>

      {/* Type offre/demande */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Type d'annonce
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'offer',   label: 'Je propose',   desc: 'Vous offrez un bien ou service' },
            { value: 'request', label: 'Je recherche',  desc: 'Vous cherchez un bien ou service' },
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

        <Field label="Titre de l'annonce" icon={<FileText size={14}/>}>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
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

        <Field label="Description" icon={<AlignLeft size={14}/>}>
          <textarea
            required
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={5}
            className={inputCls + ' resize-none'}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Valeur estimée (MAD)" icon={<Hash size={14}/>}>
            <input
              type="number"
              min={0}
              value={form.value_mad}
              onChange={e => set('value_mad', e.target.value)}
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
                  <option key={days} value={d.toISOString()}>{days} jours</option>
                )
              })}
            </select>
          </Field>
        </div>
      </div>

      {/* Barter */}
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
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">

        {/* Supprimer */}
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-4 py-2.5 rounded-lg transition-colors"
          >
            <Trash2 size={14}/> Supprimer
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-medium">Confirmer la suppression ?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
            >
              {deleting ? '...' : 'Oui, supprimer'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>

    </form>
  )
}