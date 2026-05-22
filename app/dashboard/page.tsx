import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile, getListings } from '@/lib/actions/profile'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, Plus, FileText, Clock,
  CheckCircle, PauseCircle, MapPin, Mail,
  Pencil, Phone, User, ArrowLeftRight, ExternalLink,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import DashboardNav from './components/DashboardNav'

const STATUS_LABEL: Record<string, string> = {
  pending:   'En attente',
  approved:  'Approuvée',
  published: 'Publiée',
  paused:    'En pause',
}

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-800',
  approved:  'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  paused:    'bg-gray-100 text-gray-500',
}

const EXCHANGE_LABEL: Record<string, string> = {
  service_service: 'Service ↔ Service',
  product_service: 'Produit ↔ Service',
  product_product: 'Produit ↔ Produit',
}

function InfoChip({ icon, value }: { icon: React.ReactNode; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-1.5 text-sm text-[#0D3B66]/70 bg-[#EEF3F8] px-3 py-1.5 rounded-full">
      <span className="opacity-60">{icon}</span>{value}
    </div>
  )
}

function ProfileCompletion({ profile }: { profile: any }) {
  const fields = [
    { key: 'company_name', label: 'Nom société' },
    { key: 'sector',       label: 'Secteur' },
    { key: 'city',         label: 'Ville' },
    { key: 'email',        label: 'Email' },
    { key: 'phone',        label: 'Téléphone' },
    { key: 'address',      label: 'Adresse' },
    { key: 'ice',          label: 'ICE' },
    { key: 'rc',           label: 'RC' },
    { key: 'patente',      label: 'Patente' },
    { key: 'cnss',         label: 'CNSS' },
    { key: 'description',  label: 'Description activité' },
    { key: 'contact_name', label: 'Contact société' },
  ]
  const filled  = fields.filter(f => profile[f.key]).length
  const total   = fields.length
  const percent = Math.round((filled / total) * 100)
  const missing = fields.filter(f => !profile[f.key]).map(f => f.label)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-[#0D3B66]">Compléter votre profil</p>
        <span className={clsx(
          'text-sm font-bold px-3 py-1 rounded-full',
          percent === 100 ? 'bg-green-100 text-green-700' :
          percent >= 60   ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-600'
        )}>
          {percent}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all',
            percent === 100 ? 'bg-green-500' :
            percent >= 60   ? 'bg-amber-400' : 'bg-red-400'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {missing.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-black">Champs manquants :</p>
          <div className="flex flex-wrap gap-2">
            {missing.map(m => (
              <span key={m} className="text-sm bg-gray-100 text-black px-2.5 py-1 rounded-full">{m}</span>
            ))}
          </div>
          <Link
            href="/dashboard/profil"
            className="text-sm text-[#0D3B66] font-semibold underline underline-offset-2 mt-1"
          >
            Compléter mon profil →
          </Link>
        </div>
      )}
    </div>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/connexion')

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''

  if (email === process.env.ADMIN_EMAIL) redirect('/admin')

  const [profile, listings] = await Promise.all([
    getOrCreateProfile(userId, email),
    getListings(userId),
  ])

  const { data: similarListings } = profile.sector
    ? await supabase
        .from('listings')
        .select('*, profiles(company_name, city)')
        .eq('status', 'published')
        .eq('category', profile.sector)
        .neq('clerk_user_id', userId)
        .limit(3)
    : { data: [] }

  const stats = {
    total:     listings.length,
    published: listings.filter(l => l.status === 'published').length,
    pending:   listings.filter(l => l.status === 'pending').length,
    paused:    listings.filter(l => l.status === 'paused').length,
  }

  const profileComplete = profile.company_name && profile.sector && profile.city && profile.email

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-[#0D3B66] text-white px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={22} className="opacity-70"/>
            <div>
              <p className="text-sm text-white/60">Espace client</p>
              <p className="font-semibold text-base">
                {profile.company_name ?? user?.firstName ?? email}
              </p>
            </div>
          </div>
          <Link
            href="/publier"
            className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
          >
            <Plus size={16}/> Publier une annonce
          </Link>
        </div>
      </div>

      <DashboardNav active="/dashboard" clerkUserId={userId} />

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Bandeaux statut profil */}
        {profile.status === 'pending_review' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock size={18} className="text-amber-600"/>
            </div>
            <div>
              <p className="text-base font-semibold text-amber-800">Profil en cours de validation</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Votre profil a été soumis et est en attente de validation par l'équipe Moubadala. Vous pourrez publier des annonces une fois approuvé.
              </p>
            </div>
          </div>
        )}

        {profile.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <XCircle size={18} className="text-red-600"/>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-red-800">Profil rejeté</p>
              <p className="text-sm text-red-700 mt-0.5">
                Votre profil n'a pas été validé. Veuillez le compléter et le soumettre à nouveau.
              </p>
            </div>
            <Link
              href="/dashboard/profil"
              className="text-sm font-semibold text-red-700 border border-red-300 hover:border-red-400 px-3 py-2 rounded-lg transition-colors shrink-0"
            >
              Modifier →
            </Link>
          </div>
        )}

        {profile.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600 shrink-0"/>
            <p className="text-sm text-green-700 font-medium">
              Profil validé — vous pouvez publier des annonces.
            </p>
          </div>
        )}

        {/* Profil card */}
        {profileComplete ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0D3B66] to-[#1a5a9a] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                  {profile.logo_url ? (
                    <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover"/>
                  ) : (
                    profile.company_name?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-base">{profile.company_name}</p>
                  <p className="text-white/60 text-sm">{profile.sector}</p>
                </div>
              </div>
              <Link
                href="/dashboard/profil"
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil size={13}/> Modifier
              </Link>
            </div>
            <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-gray-100">
              <InfoChip icon={<MapPin size={12}/>}  value={[profile.city, profile.prefecture].filter(Boolean).join(', ')}/>
              <InfoChip icon={<Mail size={12}/>}    value={profile.email}/>
              <InfoChip icon={<Phone size={12}/>}   value={profile.phone}/>
              <InfoChip icon={<User size={12}/>}    value={profile.contact_name}/>
              <InfoChip icon={<MapPin size={12}/>}  value={profile.address}/>
            </div>
            {(profile.ice || profile.rc || profile.patente || profile.cnss) && (
              <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'ICE',     value: profile.ice },
                  { label: 'RC',      value: profile.rc },
                  { label: 'Patente', value: profile.patente },
                  { label: 'CNSS',    value: profile.cnss },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <p className="text-xs font-semibold text-black uppercase tracking-wide">{item.label}</p>
                    <p className="text-base font-mono text-[#0D3B66]">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
            {profile.description && (
              <div className="px-6 py-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-black uppercase tracking-wide mb-1.5">Activité</p>
                <p className="text-base text-black leading-relaxed">{profile.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-base text-amber-800">Complétez votre profil entreprise pour publier des annonces.</p>
            <Link href="/dashboard/profil" className="text-base font-semibold text-amber-800 underline underline-offset-2 shrink-0">
              Compléter →
            </Link>
          </div>
        )}

        {/* Barre de complétion */}
        <ProfileCompletion profile={profile}/>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total annonces', value: stats.total,     icon: <FileText size={20}/>,    color: 'text-[#0D3B66]' },
            { label: 'Publiées',       value: stats.published, icon: <CheckCircle size={20}/>, color: 'text-green-600' },
            { label: 'En attente',     value: stats.pending,   icon: <Clock size={20}/>,       color: 'text-amber-600' },
            { label: 'En pause',       value: stats.paused,    icon: <PauseCircle size={20}/>, color: 'text-gray-500'  },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-7 flex flex-col gap-2 shadow-sm">
              <div className={clsx('opacity-80', stat.color)}>{stat.icon}</div>
              <p className="text-4xl font-bold text-[#0D3B66]">{stat.value}</p>
              <p className="text-sm text-black">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mes annonces */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0D3B66]">Mes annonces</h2>
            <Link href="/dashboard/annonces" className="text-sm text-[#0D3B66] hover:underline">
              Gérer tout →
            </Link>
          </div>
          {listings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <p className="text-black text-base mb-4">Vous n'avez pas encore publié d'annonce.</p>
              <Link
                href="/publier"
                className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors"
              >
                <Plus size={15}/> Publier ma première annonce
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listings.map(listing => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <p className="text-base font-semibold text-[#0D3B66] truncate">{listing.title}</p>
                    <p className="text-sm text-black">
                      {listing.city ?? '—'} · {listing.value_mad ? `${listing.value_mad.toLocaleString()} MAD` : 'Valeur non renseignée'} ·{' '}
                      {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={clsx('text-sm font-semibold px-3 py-1 rounded-full', STATUS_COLOR[listing.status])}>
                      {STATUS_LABEL[listing.status]}
                    </span>
                    <Link
                      href={`/dashboard/annonces/${listing.id}`}
                      className="flex items-center gap-1.5 text-sm text-black hover:text-[#0D3B66] border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Pencil size={13}/> Modifier
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Offres similaires */}
        {similarListings && similarListings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0D3B66]">
                Opportunités dans votre secteur
              </h2>
              <Link href="/moubaplace" className="text-sm text-[#0D3B66] hover:underline">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarListings.map((listing: any) => (
                <Link
                  key={listing.id}
                  href={`/moubaplace/${listing.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className={clsx(
                      'text-sm font-semibold px-2.5 py-0.5 rounded-full',
                      listing.listing_type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    )}>
                      {listing.listing_type === 'offer' ? 'Offre' : 'Demande'}
                    </span>
                    <ExternalLink size={13} className="text-gray-300"/>
                  </div>
                  <p className="text-base font-semibold text-[#0D3B66] line-clamp-2 leading-snug">
                    {listing.title}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold text-[#F5A623]">
                      {listing.value_mad?.toLocaleString()} MAD
                    </span>
                    {listing.exchange_type && (
                      <span className="text-sm text-black flex items-center gap-1">
                        <ArrowLeftRight size={11}/>
                        {EXCHANGE_LABEL[listing.exchange_type]}
                      </span>
                    )}
                  </div>
                  {listing.profiles?.company_name && (
                    <p className="text-sm text-black">{listing.profiles.company_name} · {listing.city}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}