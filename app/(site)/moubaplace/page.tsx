import { supabase } from '@/lib/supabase'
import MoubaplacePage from './MoubaplacePage'

async function getPublishedListings() {
  const { data } = await supabase
    .from('listings')
    .select('*, profiles(company_name, sector, city, logo_url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function Page() {
  const listings = await getPublishedListings()
  return <MoubaplacePage listings={listings} />
}