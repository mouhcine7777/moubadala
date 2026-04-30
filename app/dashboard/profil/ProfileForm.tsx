'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'
import {
  Building2, MapPin, Phone, Briefcase,
  Mail, FileText, User, Hash, AlignLeft
} from 'lucide-react'
import { LogoUpload, GalleryUpload, VideoUpload } from './MediaUpload'

const SECTORS = [
  'IT & Digital', 'Marketing & Communication', 'Finance & Comptabilité',
  'Industrie & Production', 'Commerce & Distribution', 'Transport & Logistique',
  'Immobilier & Construction', 'Santé & Bien-être', 'Formation & Education',
  'Hôtellerie & Restauration', 'Médias & Création', 'Autre',
]

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'El Jadida', 'Autre',
]

type FormState = {
  company_name:   string
  sector:         string
  city:           string
  phone:          string
  email:          string
  address:        string
  patente:        string
  contact_name:   string
  prefecture:     string
  ice:            string
  description:    string
  rc:             string
  cnss:           string
  logo_url:       string
  gallery_images: string[]
  video_url:      string
}

function Field({
  label, required, icon, children,
}: {
  label: string
  required?: boolean
  icon: React.ReactNode
  children: React.ReactNode
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

const inputCls = "border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const [form, setForm] = useState<FormState>({
    company_name:   profile.company_name   ?? '',
    sector:         profile.sector         ?? '',
    city:           profile.city           ?? '',
    phone:          profile.phone          ?? '',
    email:          profile.email          ?? '',
    address:        profile.address        ?? '',
    patente:        profile.patente        ?? '',
    contact_name:   profile.contact_name   ?? '',
    prefecture:     profile.prefecture     ?? '',
    ice:            profile.ice            ?? '',
    description:    profile.description    ?? '',
    rc:             profile.rc             ?? '',
    cnss:           profile.cnss           ?? '',
    logo_url:       profile.logo_url       ?? '',
    gallery_images: profile.gallery_images ?? [],
    video_url:      profile.video_url      ?? '',
  })

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        ...form,
        status: 'pending_review', // passe en attente de validation admin
      })
      .eq('clerk_user_id', profile.clerk_user_id)
    setSaving(false)
    if (!error) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const isComplete = form.company_name && form.sector && form.city && form.email

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* Section 1 — Informations générales */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Informations générales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Secteur d'activité" required icon={<Briefcase size={14}/>}>
            <select
              required
              value={form.sector}
              onChange={e => set('sector', e.target.value)}
              className={inputCls}
            >
              <option value="">Sélectionner</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Nom société" required icon={<Building2 size={14}/>}>
            <input
              type="text"
              required
              value={form.company_name}
              onChange={e => set('company_name', e.target.value)}
              placeholder="Ex : Moubadala SARL"
              className={inputCls}
            />
          </Field>

          <Field label="E-mail" required icon={<Mail size={14}/>}>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="contact@entreprise.ma"
              className={inputCls}
            />
          </Field>

          <Field label="Adresse société" icon={<MapPin size={14}/>}>
            <input
              type="text"
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Ex : 12 Rue Mohammed V"
              className={inputCls}
            />
          </Field>

          <Field label="Téléphone" icon={<Phone size={14}/>}>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+212 6 00 00 00 00"
              className={inputCls}
            />
          </Field>

          <Field label="Patente" icon={<Hash size={14}/>}>
            <input
              type="text"
              value={form.patente}
              onChange={e => set('patente', e.target.value)}
              placeholder="N° patente"
              className={inputCls}
            />
          </Field>

          <Field label="Ville" required icon={<MapPin size={14}/>}>
            <select
              required
              value={form.city}
              onChange={e => set('city', e.target.value)}
              className={inputCls}
            >
              <option value="">Sélectionner</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Contact société" icon={<User size={14}/>}>
            <input
              type="text"
              value={form.contact_name}
              onChange={e => set('contact_name', e.target.value)}
              placeholder="Nom du contact principal"
              className={inputCls}
            />
          </Field>

          <Field label="Préfecture ou Province" icon={<MapPin size={14}/>}>
            <input
              type="text"
              value={form.prefecture}
              onChange={e => set('prefecture', e.target.value)}
              placeholder="Ex : Préfecture de Casablanca"
              className={inputCls}
            />
          </Field>

          <Field label="ICE" icon={<Hash size={14}/>}>
            <input
              type="text"
              value={form.ice}
              onChange={e => set('ice', e.target.value)}
              placeholder="15 chiffres"
              maxLength={15}
              className={inputCls}
            />
          </Field>

          <Field label="RC" icon={<FileText size={14}/>}>
            <input
              type="text"
              value={form.rc}
              onChange={e => set('rc', e.target.value)}
              placeholder="N° registre de commerce"
              className={inputCls}
            />
          </Field>

          <Field label="CNSS" icon={<Hash size={14}/>}>
            <input
              type="text"
              value={form.cnss}
              onChange={e => set('cnss', e.target.value)}
              placeholder="N° CNSS"
              className={inputCls}
            />
          </Field>

        </div>
      </div>

      {/* Section 2 — Description activité */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Description de votre activité
        </h2>
        <Field label="Décrivez votre activité" icon={<AlignLeft size={14}/>}>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Présentez votre entreprise, vos services, vos produits..."
            rows={5}
            className={inputCls + ' resize-none'}
          />
        </Field>
      </div>

      {/* Section 3 — Médias */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
        <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
          Médias
        </h2>

        <LogoUpload
          clerkUserId={profile.clerk_user_id}
          currentUrl={form.logo_url || null}
          onUpload={url => {
            setForm(f => ({ ...f, logo_url: url }))
            setSaved(false)
          }}
        />

        <div className="border-t border-gray-100 pt-5">
          <GalleryUpload
            clerkUserId={profile.clerk_user_id}
            currentImages={form.gallery_images}
            onUpload={images => {
              setForm(f => ({ ...f, gallery_images: images }))
              setSaved(false)
            }}
          />
        </div>

        <div className="border-t border-gray-100 pt-5">
          <VideoUpload
            clerkUserId={profile.clerk_user_id}
            currentUrl={form.video_url || null}
            onUpload={url => {
              setForm(f => ({ ...f, video_url: url ?? '' }))
              setSaved(false)
            }}
          />
        </div>
      </div>

{/* Submit */}
<div className="flex items-center justify-between">
  <p className="text-xs text-gray-400">* Champs obligatoires</p>
  <div className="flex items-center gap-3">
    {saved && (
      <span className="text-xs text-green-600 font-medium">Profil sauvegardé</span>
    )}
    <button
      type="submit"
      disabled={saving || !isComplete}
      className="bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
    >
      {saving
        ? 'Enregistrement...'
        : profile.status === 'approved'
          ? 'Mettre à jour le profil'
          : 'Soumettre pour validation'
      }
    </button>
  </div>
</div>

    </form>
  )
}