import { supabase } from '@/lib/supabase'
import AdminRequests from '../AdminRequests'

export default async function AdminDemandesPage() {
  const { data: requests } = await supabase
    .from('requests')
    .select(`
      *,
      listings(id, title, value_mad, city, listing_type),
      sender:profiles!requests_sender_clerk_id_fkey(company_name, sector, city, email, phone),
      receiver:profiles!requests_receiver_clerk_id_fkey(company_name, sector, city, email, phone)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0D3B66]">Suivi des demandes d'échange</h2>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-[#0D3B66]">{requests?.length ?? 0}</span> demande{(requests?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>
      <AdminRequests requests={requests ?? []} />
    </div>
  )
}