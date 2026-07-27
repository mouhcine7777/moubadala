import type { Contract, ContractService, ContractStatus } from '@/lib/types'
import { CONTRACT_PRE_SIGNATURE_STATUSES } from '@/lib/types'

/** Lève une erreur si le contrat n'est plus modifiable (déjà signé ou au-delà).
 *  Aucun avenant n'est géré en Phase 1 — toute mutation post-signature doit être bloquée. */
export function assertContractMutable(status: ContractStatus) {
  if (!CONTRACT_PRE_SIGNATURE_STATUSES.includes(status)) {
    throw new Error(
      `Ce contrat n'est plus modifiable (statut : ${status}). Une modification après signature nécessite un avenant.`
    )
  }
}

/** Le suivi d'exécution (déclarations, validations, réserves) n'est ouvert que pendant l'exécution. */
export function assertContractInExecution(status: ContractStatus) {
  if (status !== 'en_execution') {
    throw new Error(`Le suivi d'exécution n'est disponible que pour un contrat en cours d'exécution (statut actuel : ${status}).`)
  }
}

/** Catégorie d'échange dérivée automatiquement de la nature des prestations des deux parties (Étape 2). */
export function deriveExchangeCategory(exchangeType: Contract['exchange_type']): string | null {
  switch (exchangeType) {
    case 'produit_produit': return 'PRODUIT ↔ PRODUIT'
    case 'service_service': return 'SERVICE ↔ SERVICE'
    case 'produit_service': return 'PRODUIT ↔ SERVICE'
    case 'plusieurs': return 'ÉCHANGE MIXTE'
    case 'autre': return 'AUTRE'
    default: return null
  }
}

/**
 * Indicateur de complexité — heuristique provisoire (le cahier des charges ne définit pas de
 * formule précise) : à valider avec le propriétaire de la plateforme.
 * Combine : nombre total de prestations, confidentialité renforcée, calendrier multi-jalons.
 */
export function deriveComplexity(
  contract: Pick<Contract, 'confidentialite' | 'calendar_mode'>,
  services: Pick<ContractService, 'id'>[]
): Contract['complexity_indicator'] {
  let score = 0
  if (services.length > 4) score += 1
  if (services.length > 8) score += 1
  if (contract.confidentialite === 'renforcee') score += 1
  if (contract.calendar_mode === 'multi_jalons') score += 1

  if (score >= 3) return 'elevee'
  if (score >= 1) return 'moyenne'
  return 'faible'
}

/** Calcule le total TTC d'une ligne de prestation. */
export function computeServiceTotalTtc(service: Pick<ContractService, 'valeur_ht' | 'tva_percent'>): number {
  const ht = service.valeur_ht ?? 0
  const tva = service.tva_percent ?? 0
  return Math.round(ht * (1 + tva / 100) * 100) / 100
}

/** Somme des valeurs TTC des prestations d'une des deux parties. */
export function sumPartyTotal(services: ContractService[], party: 'a' | 'b'): number {
  return services
    .filter(s => s.party === party)
    .reduce((sum, s) => sum + computeServiceTotalTtc(s), 0)
}

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, { label: string; color: string }> = {
  brouillon:               { label: 'Brouillon',                 color: 'bg-gray-100 text-gray-700' },
  en_preparation:          { label: 'En préparation',            color: 'bg-blue-100 text-blue-800' },
  en_attente_validation:   { label: 'En attente de validation',  color: 'bg-amber-100 text-amber-800' },
  en_attente_signature:    { label: 'En attente de signature',   color: 'bg-purple-100 text-purple-800' },
  signe:                   { label: 'Signé',                      color: 'bg-teal-100 text-teal-800' },
  en_execution:            { label: "En cours d'exécution",      color: 'bg-indigo-100 text-indigo-800' },
  cloture:                 { label: 'Clôturé',                    color: 'bg-green-100 text-green-800' },
  resilie:                 { label: 'Résilié',                    color: 'bg-red-100 text-red-600' },
  archive:                 { label: 'Archivé',                    color: 'bg-gray-100 text-gray-500' },
}
