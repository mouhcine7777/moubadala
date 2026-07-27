import { getAllContracts } from '@/lib/actions/contracts'
import AdminContracts from '../AdminContracts'

export default async function AdminContratsPage() {
  const contracts = await getAllContracts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0D3B66]">Suivi des contrats d'échange</h2>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-[#0D3B66]">{contracts.length}</span> contrat{contracts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <p className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
        Vue de supervision en lecture seule — Moubadala agit en tiers de confiance et ne modifie jamais les données contractuelles des Parties.
      </p>
      <AdminContracts contracts={contracts} />
    </div>
  )
}
