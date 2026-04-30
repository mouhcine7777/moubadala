import { supabase } from '@/lib/supabase'
import AdminMembers from '../AdminMembers'

export default async function AdminMembresPage() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .not('company_name', 'is', null)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0D3B66]">Membres de la plateforme</h2>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-[#0D3B66]">{profiles?.length ?? 0}</span> membre{(profiles?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>
      <AdminMembers profiles={profiles ?? []} />
    </div>
  )
}