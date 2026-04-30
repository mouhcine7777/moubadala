'use client'
import { useState, useMemo } from 'react'
import { MapPin, Mail, Phone, Search, Users, Handshake, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  accepted:   { label: 'Partenaire actif',    color: 'bg-green-100 text-green-700'   },
  finalizing: { label: 'En finalisation',     color: 'bg-purple-100 text-purple-700' },
}

function PartnerCard({ partner }: { partner: any }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D3B66] to-[#1a5a9a] px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-base shrink-0">
          {partner.company_name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{partner.company_name}</p>
          <p className="text-white/60 text-xs">{partner.sector}</p>
        </div>
        <span className={clsx('text-[10px] font-bold px-2 py-1 rounded-full shrink-0', STATUS_CONFIG[partner.request_status]?.color)}>
          {STATUS_CONFIG[partner.request_status]?.label}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2.5">
        {partner.city && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} className="text-gray-400 shrink-0"/>{partner.city}
          </div>
        )}
        {partner.email && (
          <a href={`mailto:${partner.email}`} className="flex items-center gap-2 text-xs text-[#0D3B66] hover:underline">
            <Mail size={12} className="text-gray-400 shrink-0"/>{partner.email}
          </a>
        )}
        {partner.phone && (
          <a href={`tel:${partner.phone}`} className="flex items-center gap-2 text-xs text-gray-500 hover:underline">
            <Phone size={12} className="text-gray-400 shrink-0"/>{partner.phone}
          </a>
        )}
        {partner.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mt-1">
            {partner.description}
          </p>
        )}
        <p className="text-[10px] text-gray-300 mt-1">
          Connecté {formatDistanceToNow(new Date(partner.connected_since), { addSuffix: true, locale: fr })}
        </p>
      </div>
    </div>
  )
}

function MemberCard({ member }: { member: any }) {
  return (
    <Link
      href={`/entreprises/${member.clerk_user_id}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EEF3F8] flex items-center justify-center text-[#0D3B66] font-bold text-base shrink-0">
        {member.logo_url
          ? <img src={member.logo_url} alt="" className="w-full h-full object-cover"/>
          : member.company_name?.[0]?.toUpperCase()
        }
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-bold text-[#0D3B66] truncate">{member.company_name}</p>
        {member.sector && <p className="text-xs text-gray-400">{member.sector}</p>}
        {member.city && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={10}/>{member.city}
          </p>
        )}
        {member.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mt-0.5">
            {member.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function ReseauClient({
  partners,
  members,
  currentUserId,
}: {
  partners: any[]
  members: any[]
  currentUserId: string
}) {
  const [tab, setTab] = useState<'partners' | 'directory'>('partners')
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  const availableSectors = useMemo(() =>
    [...new Set(members.map(m => m.sector).filter(Boolean))].sort()
  , [members])

  const availableCities = useMemo(() =>
    [...new Set(members.map(m => m.city).filter(Boolean))].sort()
  , [members])

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = search.toLowerCase()
      const matchSearch = !q || (
        m.company_name?.toLowerCase().includes(q) ||
        m.sector?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
      )
      const matchSector = !sectorFilter || m.sector === sectorFilter
      const matchCity   = !cityFilter   || m.city === cityFilter
      return matchSearch && matchSector && matchCity
    })
  }, [members, search, sectorFilter, cityFilter])

  const hasFilters = search || sectorFilter || cityFilter

  function clearFilters() {
    setSearch('')
    setSectorFilter('')
    setCityFilter('')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#EEF3F8] flex items-center justify-center">
            <Handshake size={18} className="text-[#0D3B66]"/>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0D3B66]">{partners.length}</p>
            <p className="text-xs text-gray-400">Partenaires confirmés</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#EEF3F8] flex items-center justify-center">
            <Users size={18} className="text-[#0D3B66]"/>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0D3B66]">{members.length}</p>
            <p className="text-xs text-gray-400">Membres actifs</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('partners')}
          className={clsx(
            'text-xs font-semibold px-4 py-2 rounded-full border transition-colors',
            tab === 'partners'
              ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          )}
        >
          Mes partenaires
          {partners.length > 0 && (
            <span className={clsx(
              'ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
              tab === 'partners' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            )}>
              {partners.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('directory')}
          className={clsx(
            'text-xs font-semibold px-4 py-2 rounded-full border transition-colors',
            tab === 'directory'
              ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          )}
        >
          Annuaire membres
          {members.length > 0 && (
            <span className={clsx(
              'ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
              tab === 'directory' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            )}>
              {members.length}
            </span>
          )}
        </button>
      </div>

      {/* Partenaires */}
      {tab === 'partners' && (
        <div>
          {partners.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Handshake size={32} className="text-gray-200 mx-auto mb-3"/>
              <p className="text-gray-400 text-sm font-semibold mb-1">Aucun partenaire pour le moment</p>
              <p className="text-gray-400 text-xs mb-4">
                Vos partenaires apparaissent ici quand une demande d'échange est acceptée.
              </p>
              <Link
                href="/moubaplace"
                className="inline-block text-sm text-[#0D3B66] font-semibold underline underline-offset-2"
              >
                Explorer les annonces →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map(p => (
                <PartnerCard key={p.clerk_user_id} partner={p}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Annuaire */}
      {tab === 'directory' && (
        <div className="flex flex-col gap-4">

          {/* Barre recherche + filtres */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une entreprise, secteur, ville..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14}/>
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Filtre secteur */}
              <select
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D3B66] bg-white text-gray-500"
              >
                <option value="">Tous les secteurs</option>
                {availableSectors.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Filtre ville */}
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0D3B66] bg-white text-gray-500"
              >
                <option value="">Toutes les villes</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg transition-colors"
                >
                  <X size={12}/> Effacer
                </button>
              )}
            </div>
          </div>

          {/* Résultats */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#0D3B66]">{filteredMembers.length}</span> membre{filteredMembers.length !== 1 ? 's' : ''}
              {hasFilters && ' · filtres actifs'}
            </p>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Search size={28} className="text-gray-200 mx-auto mb-3"/>
              <p className="text-gray-400 text-sm">Aucun membre ne correspond à votre recherche.</p>
              <button onClick={clearFilters} className="mt-3 text-sm text-[#0D3B66] underline underline-offset-2">
                Effacer les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMembers.map(m => (
                <MemberCard key={m.clerk_user_id} member={m}/>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}