import { getAllListings } from '@/lib/actions/admin'
import AdminTable from '../AdminTable'

export default async function AdminAnnoncesPage() {
  const listings = await getAllListings()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0D3B66]">Gestion des annonces</h2>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-[#0D3B66]">{listings.length}</span> annonce{listings.length !== 1 ? 's' : ''}
        </p>
      </div>
      <AdminTable listings={listings} />
    </div>
  )
}