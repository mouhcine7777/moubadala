import { getAllListings } from '@/lib/actions/admin'
import { supabase } from '@/lib/supabase'

export default async function AdminPage() {
  const listings = await getAllListings()

  const [{ data: requests }, { data: profiles }] = await Promise.all([
    supabase.from('requests').select('id, status'),
    supabase.from('profiles').select('id, status').not('company_name', 'is', null),
  ])

  const stats = [
    { label: 'Annonces total',        value: listings.length,                                                    bg: 'bg-white',     text: 'text-[#0D3B66]'  },
    { label: 'En attente valid.',     value: listings.filter(l => l.status === 'pending').length,                bg: 'bg-amber-50',  text: 'text-amber-700'  },
    { label: 'Publiées',              value: listings.filter(l => l.status === 'published').length,              bg: 'bg-green-50',  text: 'text-green-700'  },
    { label: 'En pause',              value: listings.filter(l => l.status === 'paused').length,                 bg: 'bg-gray-100',  text: 'text-gray-500'   },
    { label: 'Demandes total',        value: requests?.length ?? 0,                                              bg: 'bg-white',     text: 'text-[#0D3B66]'  },
    { label: 'Demandes en attente',   value: requests?.filter(r => r.status === 'pending').length ?? 0,          bg: 'bg-amber-50',  text: 'text-amber-700'  },
    { label: 'Demandes acceptées',    value: requests?.filter(r => r.status === 'accepted').length ?? 0,         bg: 'bg-green-50',  text: 'text-green-700'  },
    { label: 'En finalisation',       value: requests?.filter(r => r.status === 'finalizing').length ?? 0,       bg: 'bg-purple-50', text: 'text-purple-700' },
    { label: 'Membres total',         value: profiles?.length ?? 0,                                              bg: 'bg-white',     text: 'text-[#0D3B66]'  },
    { label: 'Profils en attente',    value: profiles?.filter(p => p.status === 'pending_review').length ?? 0,   bg: 'bg-amber-50',  text: 'text-amber-700'  },
    { label: 'Profils approuvés',     value: profiles?.filter(p => p.status === 'approved').length ?? 0,         bg: 'bg-green-50',  text: 'text-green-700'  },
    { label: 'Profils rejetés',       value: profiles?.filter(p => p.status === 'rejected').length ?? 0,         bg: 'bg-red-50',    text: 'text-red-600'    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold text-[#0D3B66] mb-6">Vue générale</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-gray-100 p-7 shadow-sm`}>
              <p className={`text-4xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-sm text-black mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}