import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { MapPin, ArrowLeftRight, Clock, Building2, Phone, Mail, Globe, Tag, Hash, ExternalLink  } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import InterestButton from './InterestButton'

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

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { userId } = await auth()
  
    const { data: listing } = await supabase
      .from('listings')
      .select('*, profiles(company_name, sector, city, logo_url, phone, email, website, contact_name, description, address)')
      .eq('id', id)
      .eq('status', 'published')
      .single()
  
    if (!listing) notFound()
  
    // Incrémenter les vues
    await supabase
      .from('listings')
      .update({ views: (listing.views ?? 0) + 1 })
      .eq('id', id)
  
    const p = listing.profiles
    const isOwner = userId === listing.clerk_user_id

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-4xl mx-auto text-xs text-gray-400 flex items-center gap-2">
          <Link href="/moubaplace" className="hover:text-[#0D3B66] transition-colors">Moubaplace</Link>
          <span>/</span>
          <span className="text-[#0D3B66] truncate">{listing.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne principale */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Image */}
          {listing.images?.[0] && (
            <div className="rounded-xl overflow-hidden h-64">
              <img src={listing.images[0]} className="w-full h-full object-cover" alt={listing.title} />
            </div>
          )}

          {/* Header annonce */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLOR[listing.listing_type]}`}>
                    {TYPE_LABEL[listing.listing_type]}
                  </span>
                  {listing.category && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Tag size={10}/>{listing.category}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-[#0D3B66] leading-snug">{listing.title}</h1>
              </div>
              <p className="text-xl font-bold text-[#F5A623] shrink-0">
                {listing.value_mad?.toLocaleString()} MAD
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={11}/>{listing.city}</span>
              <span className="flex items-center gap-1">
                <Clock size={11}/>
                Publiée {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: fr })}
              </span>
              <span className="text-gray-300">·</span>
              <span>{format(new Date(listing.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>

            {listing.description && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}
          </div>

          {/* Paramètres barter */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide">Conditions barter</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listing.exchange_type && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Type d'échange</p>
                  <p className="text-sm font-semibold text-[#0D3B66] flex items-center gap-1">
                    <ArrowLeftRight size={13}/>{EXCHANGE_LABEL[listing.exchange_type]}
                  </p>
                </div>
              )}
              {listing.expires_at && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Expire le</p>
                  <p className="text-sm font-semibold text-[#0D3B66]">
                    {format(new Date(listing.expires_at), 'dd/MM/yyyy')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — carte entreprise */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <Link
  href={`/entreprises/${listing.clerk_user_id}`}
  className="bg-[#0D3B66] px-5 py-5 flex items-center gap-3 hover:bg-[#0a2f52] transition-colors"
>
  <div className="w-11 h-11 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-base shrink-0 overflow-hidden">
    {p?.logo_url
      ? <img src={p.logo_url} alt="" className="w-full h-full object-cover"/>
      : p?.company_name?.[0]?.toUpperCase()
    }
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-white font-bold text-sm">{p?.company_name}</p>
    <p className="text-white/60 text-xs">{p?.sector}</p>
  </div>
  <ExternalLink size={14} className="text-white/40 shrink-0"/>
</Link>

            <div className="p-5 flex flex-col gap-3">
              {p?.city && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={13} className="text-gray-400 shrink-0"/>{p.city}
                </div>
              )}
              {p?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={13} className="text-gray-400 shrink-0"/>
                  <a href={`mailto:${p.email}`} className="hover:text-[#0D3B66] transition-colors truncate">{p.email}</a>
                </div>
              )}
              {p?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={13} className="text-gray-400 shrink-0"/>
                  <a href={`tel:${p.phone}`} className="hover:text-[#0D3B66] transition-colors">{p.phone}</a>
                </div>
              )}
              {p?.website && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe size={13} className="text-gray-400 shrink-0"/>
                  <a href={p.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#0D3B66] transition-colors truncate">{p.website}</a>
                </div>
              )}
              {p?.description && (
                <div className="border-t border-gray-100 pt-3 mt-1">
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">{p.description}</p>
                </div>
              )}
            </div>
          </div>
{/* Bouton intérêt */}
{userId && !isOwner && (
  <InterestButton
    listingId={listing.id}
    receiverClerkId={listing.clerk_user_id}
    senderClerkId={userId}
  />
)}
{!userId && (
  <Link
    href="/connexion"
    className="block text-center bg-[#F5A623] hover:bg-[#e09510] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
  >
    Connectez-vous pour manifester votre intérêt
  </Link>
)}
          {/* Retour */}
          <Link
            href="/moubaplace"
            className="text-center text-sm text-[#0D3B66] hover:underline py-2"
          >
            ← Retour aux annonces
          </Link>
        </div>
      </div>
    </div>
  )
}