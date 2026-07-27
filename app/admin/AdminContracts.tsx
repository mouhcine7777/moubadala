'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import { CheckCircle2, Clock } from 'lucide-react'
import { CONTRACT_STATUS_LABELS, sumPartyTotal } from '@/lib/contract-utils'
import type { ContractStatus } from '@/lib/types'

export default function AdminContracts({ contracts }: { contracts: any[] }) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? contracts : contracts.filter(c => c.status === filter)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 flex-wrap">
        {[{ value: 'all', label: 'Tous' }, ...Object.entries(CONTRACT_STATUS_LABELS).map(([value, cfg]) => ({ value, label: cfg.label }))].map(f => {
          const count = f.value === 'all' ? contracts.length : contracts.filter(c => c.status === f.value).length
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={clsx(
                'text-sm font-semibold px-4 py-2 rounded-full border transition-colors',
                filter === f.value ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white text-black border-gray-200 hover:border-gray-300'
              )}
            >
              {f.label}
              {count > 0 && (
                <span className={clsx('ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full', filter === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-black')}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-14 text-center text-black text-base">
          Aucun contrat dans cette catégorie.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((c: any) => {
            const sc = CONTRACT_STATUS_LABELS[c.status as ContractStatus]
            const services = c.contract_services ?? []
            const totalA = sumPartyTotal(services, 'a')
            const totalB = sumPartyTotal(services, 'b')
            const validated = services.filter((s: any) => s.exec_status === 'validee').length
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className={clsx('text-sm font-semibold px-3 py-1 rounded-full', sc.color)}>{sc.label}</span>
                    <span className="text-sm text-black font-mono">{c.contract_number}</span>
                  </div>
                  <span className="text-sm text-black">{format(new Date(c.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                </div>

                <p className="text-base font-bold text-[#0D3B66]">{c.title ?? 'Échange sans titre'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 border border-gray-100 rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {c.party_a?.company_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black uppercase tracking-wide">Entreprise A</p>
                      <p className="text-base font-bold text-[#0D3B66] truncate">{c.party_a?.company_name ?? '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 border border-gray-100 rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-[#0D3B66] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {c.party_b?.company_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black uppercase tracking-wide">Entreprise B</p>
                      <p className="text-base font-bold text-[#0D3B66] truncate">{c.party_b?.company_name ?? c.party_b_pending_email ?? 'En attente'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 flex-wrap text-sm text-black border-t border-gray-100 pt-3">
                  <span>Entreprise A : <span className="font-semibold text-[#0D3B66]">{totalA.toLocaleString()} MAD</span></span>
                  <span>Entreprise B : <span className="font-semibold text-[#0D3B66]">{totalB.toLocaleString()} MAD</span></span>
                  {services.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-green-600" /> {validated}/{services.length} prestations validées
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {c.signed_at_a && c.signed_at_b ? 'Signé par les deux Parties' : c.signed_at_a || c.signed_at_b ? 'Signé par une Partie' : 'Non signé'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
