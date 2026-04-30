'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Search, X, MapPin, Mail, Phone, Hash, CheckCircle, XCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import { notifyProfileApproved, notifyProfileRejected } from '@/lib/actions/notifications'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  incomplete:     { label: 'Incomplet',         color: 'text-gray-500',   bg: 'bg-gray-100'   },
  pending_review: { label: 'En attente',         color: 'text-amber-700',  bg: 'bg-amber-100'  },
  approved:       { label: 'Approuvé',           color: 'text-green-700',  bg: 'bg-green-100'  },
  rejected:       { label: 'Rejeté',             color: 'text-red-700',    bg: 'bg-red-100'    },
}

export default function AdminMembers({ profiles }: { profiles: any[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [search, setSearch]           = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [cityFilter, setCityFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loadingId, setLoadingId]     = useState<string | null>(null)

  const sectors = [...new Set(profiles.map(p => p.sector).filter(Boolean))].sort()
  const cities  = [...new Set(profiles.map(p => p.city).filter(Boolean))].sort()

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || (
      p.company_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.sector?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.ice?.includes(q) ||
      p.rc?.includes(q)
    )
    const matchSector = !sectorFilter || p.sector === sectorFilter
    const matchCity   = !cityFilter   || p.city === cityFilter
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchSector && matchCity && matchStatus
  })

  const pendingCount = profiles.filter(p => p.status === 'pending_review').length
  async function updateStatus(clerkUserId: string, status: 'approved' | 'rejected') {
    setLoadingId(clerkUserId)
    await supabase
      .from('profiles')
      .update({ status })
      .eq('clerk_user_id', clerkUserId)
  
    // Notifie le client
    if (status === 'approved') {
      await notifyProfileApproved(clerkUserId)
    } else {
      await notifyProfileRejected(clerkUserId)
    }
  
    setLoadingId(null)
    startTransition(() => router.refresh())
  }

  function clearFilters() {
    setSearch('')
    setSectorFilter('')
    setCityFilter('')
    setStatusFilter('')
  }

  const hasFilters = search || sectorFilter || cityFilter || statusFilter

  return (
    <div className="flex flex-col gap-4">

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#0D3B66]">{profiles.length}</p>
          <p className="text-xs text-gray-400 mt-1">Membres total</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1">En attente validation</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-700">
            {profiles.filter(p => p.status === 'approved').length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Approuvés</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-red-600">
            {profiles.filter(p => p.status === 'rejected').length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Rejetés</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher nom, email, ICE, RC..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#0D3B66] bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={12}/>
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D3B66] bg-white text-gray-500"
        >
          <option value="">Tous les statuts</option>
          <option value="pending_review">En attente</option>
          <option value="approved">Approuvés</option>
          <option value="rejected">Rejetés</option>
          <option value="incomplete">Incomplets</option>
        </select>
        <select
          value={sectorFilter}
          onChange={e => setSectorFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D3B66] bg-white text-gray-500"
        >
          <option value="">Tous les secteurs</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D3B66] bg-white text-gray-500"
        >
          <option value="">Toutes les villes</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg"
          >
            <X size={12}/> Effacer
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        <span className="font-semibold text-[#0D3B66]">{filtered.length}</span> membre{filtered.length !== 1 ? 's' : ''}
        {hasFilters && ' · filtres actifs'}
      </p>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-sm text-gray-400">
          Aucun membre trouvé.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((profile: any) => {
            const sc = STATUS_CONFIG[profile.status ?? 'incomplete']
            const isLoading = loadingId === profile.clerk_user_id

            return (
              <div key={profile.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">

                  {/* Avatar + nom */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F5A623] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {profile.logo_url
                        ? <img src={profile.logo_url} alt="" className="w-full h-full object-cover"/>
                        : profile.company_name?.[0]?.toUpperCase()
                      }
                    </div>
                    <div className="min-w-0">
  <div className="flex items-center gap-2">
    <a
      href={`/entreprises/${profile.clerk_user_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-bold text-[#0D3B66] truncate hover:underline"
    >
      {profile.company_name}
    </a>
    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0', sc.bg, sc.color)}>
      {sc.label}
    </span>
  </div>
  <p className="text-xs text-gray-400">{profile.sector}</p>
</div>
                  </div>

                  {/* Coordonnées */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="text-xs text-gray-500 hover:text-[#0D3B66] flex items-center gap-1.5 truncate">
                        <Mail size={11} className="shrink-0"/>{profile.email}
                      </a>
                    )}
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Phone size={11} className="shrink-0"/>{profile.phone}
                      </a>
                    )}
                    {profile.city && (
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <MapPin size={11} className="shrink-0"/>{profile.city}
                      </p>
                    )}
                  </div>

                  {/* Identifiants légaux */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    {profile.ice && (
                      <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                        <Hash size={11} className="shrink-0 text-gray-400"/>ICE : {profile.ice}
                      </p>
                    )}
                    {profile.rc && (
                      <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                        <Hash size={11} className="shrink-0 text-gray-400"/>RC : {profile.rc}
                      </p>
                    )}
                    {profile.patente && (
                      <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                        <Hash size={11} className="shrink-0 text-gray-400"/>Patente : {profile.patente}
                      </p>
                    )}
                  </div>

                  {/* Date + actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: fr })}
                    </p>

                    {profile.status === 'pending_review' && (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isLoading}
                          onClick={() => updateStatus(profile.clerk_user_id, 'approved')}
                          className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                        >
                          <CheckCircle size={12}/>
                          {isLoading ? '...' : 'Approuver'}
                        </button>
                        <button
                          disabled={isLoading}
                          onClick={() => updateStatus(profile.clerk_user_id, 'rejected')}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                        >
                          <XCircle size={12}/>
                          {isLoading ? '...' : 'Rejeter'}
                        </button>
                      </div>
                    )}

                    {profile.status === 'approved' && (
                      <button
                        disabled={isLoading}
                        onClick={() => updateStatus(profile.clerk_user_id, 'rejected')}
                        className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                      >
                        {isLoading ? '...' : 'Révoquer'}
                      </button>
                    )}

                    {profile.status === 'rejected' && (
                      <button
                        disabled={isLoading}
                        onClick={() => updateStatus(profile.clerk_user_id, 'approved')}
                        className="text-xs text-green-600 hover:text-green-700 border border-green-200 hover:border-green-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                      >
                        {isLoading ? '...' : 'Approuver quand même'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                {profile.description && (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-400 line-clamp-2">{profile.description}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}