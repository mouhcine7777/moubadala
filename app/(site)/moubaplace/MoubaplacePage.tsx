'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, ArrowLeftRight, Clock, Search, X, SlidersHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'

const EXCHANGE_LABEL: Record<string, string> = {
  service_service: 'Service ↔ Service',
  product_service: 'Produit ↔ Service',
  product_product: 'Produit ↔ Produit',
}

const TYPE_COLOR: Record<string, string> = {
  offer:   'bg-green-100 text-green-800',
  request: 'bg-blue-100 text-blue-800',
}

const TYPE_LABEL: Record<string, string> = {
  offer:   'Offre',
  request: 'Demande',
}

const EXCHANGE_TYPES = [
  { value: 'service_service', label: 'Service ↔ Service' },
  { value: 'product_service', label: 'Produit ↔ Service' },
  { value: 'product_product', label: 'Produit ↔ Produit' },
]

type Listing = any

function Chip({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap',
        active
          ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
          : 'bg-white text-black border-gray-200 hover:border-gray-300'
      )}
    >
      {children}
    </button>
  )
}

export default function MoubaplacePage({ listings }: { listings: Listing[] }) {
  const [search, setSearch]             = useState('')
  const [typeFilter, setTypeFilter]     = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [cityFilter, setCityFilter]     = useState<string>('')
  const [exchangeFilter, setExchangeFilter] = useState<string>('')
  const [showFilters, setShowFilters]   = useState(false)

  const availableCities = useMemo(() =>
    [...new Set(listings.map((l: any) => l.city).filter(Boolean))].sort()
  , [listings])

  const availableCategories = useMemo(() =>
    [...new Set(listings.map((l: any) => l.category).filter(Boolean))].sort()
  , [listings])

  const filtered = useMemo(() => {
    return listings.filter((l: any) => {
      const q = search.toLowerCase()
      const matchSearch = !q || (
        l.title?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.profiles?.company_name?.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q)
      )
      const matchType     = !typeFilter     || l.listing_type === typeFilter
      const matchCategory = !categoryFilter || l.category === categoryFilter
      const matchCity     = !cityFilter     || l.city === cityFilter
      const matchExchange = !exchangeFilter || l.exchange_type === exchangeFilter
      return matchSearch && matchType && matchCategory && matchCity && matchExchange
    })
  }, [listings, search, typeFilter, categoryFilter, cityFilter, exchangeFilter])

  const activeFiltersCount = [typeFilter, categoryFilter, cityFilter, exchangeFilter].filter(Boolean).length

  function clearAll() {
    setSearch('')
    setTypeFilter('')
    setCategoryFilter('')
    setCityFilter('')
    setExchangeFilter('')
  }

  const hasActiveFilters = search || typeFilter || categoryFilter || cityFilter || exchangeFilter

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero + search */}
      <div className="bg-[#0D3B66] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold mb-1">Moubaplace</h1>
            <p className="text-white/80 text-base">
              {listings.length} annonce{listings.length !== 1 ? 's' : ''} disponible{listings.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une annonce, société, catégorie..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14}/>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm',
                showFilters || activeFiltersCount > 0
                  ? 'bg-[#F5A623] text-white'
                  : 'bg-white text-black hover:bg-gray-50'
              )}
            >
              <SlidersHorizontal size={15}/>
              Filtres
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#F5A623] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filtres panel */}
          {showFilters && (
            <div className="bg-white rounded-xl p-5 flex flex-col gap-5 shadow-sm">

              {/* Type */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-black uppercase tracking-wide">Type</p>
                <div className="flex gap-2 flex-wrap">
                  <Chip active={typeFilter === ''} onClick={() => setTypeFilter('')}>Tous</Chip>
                  <Chip active={typeFilter === 'offer'} onClick={() => setTypeFilter('offer')}>Offres</Chip>
                  <Chip active={typeFilter === 'request'} onClick={() => setTypeFilter('request')}>Demandes</Chip>
                </div>
              </div>

              {/* Catégorie */}
              {availableCategories.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-black uppercase tracking-wide">Catégorie</p>
                  <div className="flex gap-2 flex-wrap">
                    <Chip active={categoryFilter === ''} onClick={() => setCategoryFilter('')}>Toutes</Chip>
                    {availableCategories.map((cat: string) => (
                      <Chip key={cat} active={categoryFilter === cat} onClick={() => setCategoryFilter(cat)}>
                        {cat}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Ville */}
              {availableCities.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-black uppercase tracking-wide">Ville</p>
                  <div className="flex gap-2 flex-wrap">
                    <Chip active={cityFilter === ''} onClick={() => setCityFilter('')}>Toutes</Chip>
                    {availableCities.map((city: string) => (
                      <Chip key={city} active={cityFilter === city} onClick={() => setCityFilter(city)}>
                        {city}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Type échange */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-black uppercase tracking-wide">Type d'échange</p>
                <div className="flex gap-2 flex-wrap">
                  <Chip active={exchangeFilter === ''} onClick={() => setExchangeFilter('')}>Tous</Chip>
                  {EXCHANGE_TYPES.map(et => (
                    <Chip key={et.value} active={exchangeFilter === et.value} onClick={() => setExchangeFilter(et.value)}>
                      {et.label}
                    </Chip>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Barre résultats + clear */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-base text-black">
            <span className="font-semibold text-[#0D3B66]">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' · filtres actifs'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-sm text-black hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              <X size={12}/> Effacer les filtres
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <Search size={32} className="text-gray-200"/>
            <p className="text-black font-semibold text-base">Aucune annonce ne correspond à votre recherche</p>
            <button onClick={clearAll} className="text-sm text-[#0D3B66] underline underline-offset-2">
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((listing: any) => (
              <Link
                key={listing.id}
                href={`/moubaplace/${listing.id}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Image ou placeholder */}
                <div className="h-36 bg-gradient-to-br from-[#EEF3F8] to-[#dce8f5] flex items-center justify-center overflow-hidden">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} className="w-full h-full object-cover" alt={listing.title}/>
                  ) : (
                    <span className="text-5xl font-bold text-[#0D3B66]/10">
                      {listing.profiles?.company_name?.[0] ?? 'M'}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={clsx('text-sm font-semibold px-2 py-0.5 rounded-full', TYPE_COLOR[listing.listing_type])}>
                      {TYPE_LABEL[listing.listing_type]}
                    </span>
                    {listing.category && (
                      <span className="text-sm text-black bg-gray-100 px-2 py-0.5 rounded-full">
                        {listing.category}
                      </span>
                    )}
                  </div>

                  {/* Titre */}
                  <h3 className="font-bold text-[#0D3B66] text-base leading-snug line-clamp-2">
                    {listing.title}
                  </h3>

                  {/* Description */}
                  {listing.description && (
                    <p className="text-sm text-black leading-relaxed line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#F5A623]">
                        {listing.value_mad?.toLocaleString()} MAD
                      </span>
                      {listing.exchange_type && (
                        <span className="text-sm text-black flex items-center gap-1">
                          <ArrowLeftRight size={12}/>{EXCHANGE_LABEL[listing.exchange_type]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-black">
                      <span className="flex items-center gap-1">
                        <MapPin size={12}/>{listing.city ?? listing.profiles?.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12}/>
                        {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    {listing.profiles?.company_name && (
                      <Link
                        href={`/entreprises/${listing.clerk_user_id}`}
                        onClick={e => e.stopPropagation()}
                        className="text-sm text-[#0D3B66] font-medium hover:text-[#0D3B66] hover:underline truncate"
                      >
                        {listing.profiles.company_name}
                      </Link>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}