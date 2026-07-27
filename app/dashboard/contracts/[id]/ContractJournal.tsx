'use client'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { History } from 'lucide-react'
import { getContractEvents } from '@/lib/actions/contracts'

const EVENT_LABELS: Record<string, string> = {
  created: 'Contrat créé',
  party_b_attached: "Entreprise partenaire rattachée",
  party_b_invited: "Invitation envoyée à l'entreprise partenaire",
  party_b_joined: "L'entreprise partenaire a rejoint Moubadala",
  signatory_designated: 'Signataire désigné',
  step2_updated: "Objet de l'échange mis à jour",
  step5_updated: 'Conditions financières mises à jour',
  step6_updated: 'Calendrier mis à jour',
  milestone_added: 'Échéance ajoutée',
  service_added: 'Prestation ajoutée',
  service_updated: 'Prestation modifiée',
  service_deleted: 'Prestation supprimée',
  document_added: 'Document ajouté',
  document_deleted: 'Document supprimé',
  submitted_for_signature: 'Contrat prêt pour signature',
  signed_a: "Signature de l'Entreprise A",
  signed_b: "Signature de l'Entreprise B",
  signed_complete: 'Contrat signé par les deux Parties',
  pdf_generation_failed: 'Échec de génération du PDF (réessai possible)',
  service_declared_done: 'Prestation déclarée réalisée',
  service_validated: 'Prestation validée',
  reserve_raised: 'Réserve émise',
  reserve_resolved: 'Réserve levée',
  closure_requested: 'Clôture demandée',
  closure_confirmed: 'Échange clôturé',
}

export default function ContractJournal({ contractId }: { contractId: string }) {
  const [events, setEvents] = useState<any[] | null>(null)

  useEffect(() => {
    getContractEvents(contractId).then(setEvents)
  }, [contractId])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <p className="text-sm font-bold text-[#0D3B66] flex items-center gap-2 mb-4">
        <History size={15} /> Journal du contrat
      </p>
      {!events ? (
        <p className="text-sm text-black">Chargement...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-black">Aucun évènement enregistré.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((e: any) => (
            <div key={e.id} className="flex items-start gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0D3B66] mt-1.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-black font-medium">{EVENT_LABELS[e.event_type] ?? e.event_type}</p>
                <p className="text-gray-500">
                  {format(new Date(e.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  {e.actor?.company_name && ` · ${e.actor.company_name}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
