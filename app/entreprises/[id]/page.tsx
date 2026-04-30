import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Mail, Phone, Globe, Building2,
  Hash, ArrowLeft, FileText, ExternalLink,
  ArrowLeftRight, Clock
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'

const EXCHANGE_LABEL: Record<string, string> = {
  service_service: 'Service ↔ Service',
  product_service: 'Produit ↔ Service',
  product_product: 'Produit ↔ Produit',
}

export default async function EntreprisePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', id)
    .eq('status', 'approved')
    .single()

  if (!profile) notFound()

  // Annonces publiées de cette entreprise
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('clerk_user_id', id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-[#0D3B66] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/moubaplace"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors w-fit"
          >
            <ArrowLeft size={15}/> Retour à Moubaplace
          </Link>

          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-[#F5A623] flex items-center justify-center text-white font-bold text-3xl shrink-0 overflow-hidden border-2 border-white/20">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt={profile.company_name} className="w-full h-full object-cover"/>
              ) : (
                profile.company_name?.[0]?.toUpperCase()
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-white font-bold text-2xl">{profile.company_name}</h1>
              <p className="text-white/70 text-sm">{profile.sector}</p>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                {profile.city && (
                  <span className="flex items-center gap-1.5 text-xs text-white/60">
                    <MapPin size={12}/>{profile.city}
                    {profile.prefecture && ` — ${profile.prefecture}`}
                  </span>
                )}
                {listings && listings.length > 0 && (
                  <span className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full">
                    {listings.length} annonce{listings.length !== 1 ? 's' : ''} active{listings.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne principale */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Vidéo */}
          {profile.video_url && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <video
                src={profile.video_url}
                controls
                className="w-full max-h-72 object-cover"
                poster={profile.logo_url ?? undefined}
              />
            </div>
          )}

          {/* Description */}
          {profile.description && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-3">
                À propos
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {profile.description}
              </p>
            </div>
          )}

          {/* Galerie */}
          {profile.gallery_images && profile.gallery_images.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-4">
                Galerie
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.gallery_images.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-xl overflow-hidden border border-gray-100 hover:opacity-90 transition-opacity"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover"/>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Annonces publiées */}
          {listings && listings.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide mb-4">
                Annonces actives
              </h2>
              <div className="flex flex-col gap-3">
                {listings.map((listing: any) => (
                  <Link
                    key={listing.id}
                    href={`/moubaplace/${listing.id}`}
                    className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#0D3B66]/20 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          listing.listing_type === 'offer'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {listing.listing_type === 'offer' ? 'Offre' : 'Demande'}
                        </span>
                        {listing.category && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {listing.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#0D3B66] truncate">{listing.title}</p>
                      {listing.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">{listing.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                        {listing.value_mad && (
                          <span className="font-bold text-[#F5A623]">
                            {listing.value_mad.toLocaleString()} MAD
                          </span>
                        )}
                        {listing.exchange_type && (
                          <span className="flex items-center gap-1">
                            <ArrowLeftRight size={10}/>
                            {EXCHANGE_LABEL[listing.exchange_type]}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={10}/>
                          {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: fr })}
                        </span>
                      </div>
                    </div>
                    {listing.images?.[0] && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={listing.images[0]} className="w-full h-full object-cover" alt=""/>
                      </div>
                    )}
                    <ExternalLink size={14} className="text-gray-300 shrink-0 mt-1"/>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Coordonnées */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
              Coordonnées
            </h2>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0D3B66] transition-colors">
                <Mail size={14} className="text-gray-400 shrink-0"/>{profile.email}
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0D3B66] transition-colors">
                <Phone size={14} className="text-gray-400 shrink-0"/>{profile.phone}
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0D3B66] transition-colors truncate">
                <Globe size={14} className="text-gray-400 shrink-0"/>{profile.website}
              </a>
            )}
            {profile.address && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5"/>{profile.address}
              </div>
            )}
            {profile.contact_name && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 size={14} className="text-gray-400 shrink-0"/>Contact : {profile.contact_name}
              </div>
            )}
          </div>

          {/* Identifiants légaux */}
          {(profile.ice || profile.rc || profile.patente || profile.cnss) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <h2 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide border-b border-gray-100 pb-3">
                Identifiants légaux
              </h2>
              {[
                { label: 'ICE',     value: profile.ice     },
                { label: 'RC',      value: profile.rc      },
                { label: 'Patente', value: profile.patente },
                { label: 'CNSS',    value: profile.cnss    },
              ].filter(i => i.value).map(item => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-mono text-[#0D3B66]">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Membre depuis */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400">Membre depuis</p>
            <p className="text-sm font-semibold text-[#0D3B66] mt-1">
              {format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr })}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}