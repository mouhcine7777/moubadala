export type Profile = {
  id: string
  clerk_user_id: string
  company_name: string | null
  sector: string | null
  city: string | null
  logo_url: string | null
  phone: string | null
  website: string | null
  email: string | null
  address: string | null
  patente: string | null
  contact_name: string | null
  prefecture: string | null
  ice: string | null
  description: string | null
  rc: string | null
  cnss: string | null
  created_at: string
  gallery_images: string[]
video_url: string | null
status: 'incomplete' | 'pending_review' | 'approved' | 'rejected' | null
  // Identité légale pour la contractualisation (Assistant Intelligent de Contractualisation)
  if_number: string | null
  legal_form: string | null
  capital_social: number | null
  rep_prenom: string | null
  rep_nom: string | null
  rep_fonction: string | null
  rep_email: string | null
  rep_phone: string | null
}

// ── Assistant Intelligent de Contractualisation (AIC) ──────────────────────

export type ContractStatus =
  | 'brouillon' | 'en_preparation' | 'en_attente_validation' | 'en_attente_signature'
  | 'signe' | 'en_execution' | 'cloture' | 'resilie' | 'archive'

export const CONTRACT_PRE_SIGNATURE_STATUSES: ContractStatus[] = [
  'brouillon', 'en_preparation', 'en_attente_validation', 'en_attente_signature',
]

export type Contract = {
  id: string
  contract_number: string
  request_id: string | null
  party_a_clerk_id: string
  party_b_clerk_id: string | null
  party_b_pending_email: string | null
  party_b_pending_name: string | null
  party_b_invite_token: string | null
  party_b_invited_at: string | null
  created_by_clerk_id: string
  status: ContractStatus
  exchange_type: 'produit_produit' | 'service_service' | 'produit_service' | 'plusieurs' | 'autre' | null
  title: string | null
  objectif: string[] | null
  description: string | null
  execution_mode: 'une_fois' | 'plusieurs_livraisons' | 'plusieurs_interventions' | 'continue' | 'calendrier' | null
  lieu_execution: 'chez_a' | 'chez_b' | 'chez_client' | 'a_distance' | 'plusieurs' | null
  confidentialite: 'standard' | 'renforcee'
  category_derived: string | null
  complexity_indicator: 'faible' | 'moyenne' | 'elevee' | null
  compensation_prevue: boolean
  compensation_montant: number | null
  compensation_devise: string | null
  compensation_mode: string | null
  compensation_echeance: string | null
  calendar_start_date: string | null
  calendar_end_date: string | null
  calendar_mode: 'unique' | 'multi_jalons' | null
  signatory_a_nom: string | null
  signatory_a_prenom: string | null
  signatory_a_fonction: string | null
  signatory_a_email: string | null
  signatory_a_phone: string | null
  signatory_b_nom: string | null
  signatory_b_prenom: string | null
  signatory_b_fonction: string | null
  signatory_b_email: string | null
  signatory_b_phone: string | null
  signed_at_a: string | null
  signature_ip_a: string | null
  signed_at_b: string | null
  signature_ip_b: string | null
  pdf_url: string | null
  closure_pv_url: string | null
  closure_requested_by: string | null
  closure_requested_at: string | null
  closed_at: string | null
  language: string
  created_at: string
  updated_at: string
}

export type ContractServiceParty = 'a' | 'b'
export type ContractServiceExecStatus = 'a_realiser' | 'en_cours' | 'realisee' | 'validee' | 'contestee'

export type ContractService = {
  id: string
  contract_id: string
  party: ContractServiceParty
  label: string
  nature: 'produit' | 'service' | 'produit_service' | null
  description: string
  quantite: number | null
  unite: string | null
  valeur_ht: number
  tva_percent: number
  delai_debut: string | null
  delai_fin: string | null
  lieu_execution: string | null
  conditions_particulieres: string | null
  garantie: boolean
  garantie_nature: string | null
  garantie_duree: string | null
  garantie_conditions: string | null
  exec_status: ContractServiceExecStatus
  declared_done_at: string | null
  declared_done_by: string | null
  declared_comment: string | null
  validated_at: string | null
  validated_by: string | null
  created_at: string
  updated_at: string
}

export type ContractMilestone = {
  id: string
  contract_id: string
  label: string
  due_date: string
  status: 'a_venir' | 'en_cours' | 'realise' | 'en_retard'
  created_at: string
}

export type ContractDocument = {
  id: string
  contract_id: string
  service_id: string | null
  reserve_id: string | null
  category: 'devis' | 'cahier_charges' | 'plan' | 'photo' | 'video' | 'catalogue' | 'certificat' | 'notice' | 'autre'
  title: string
  file_url: string
  file_name: string | null
  file_size: number | null
  version: number
  comment: string | null
  uploaded_by_clerk_id: string
  created_at: string
}

export type ContractReserve = {
  id: string
  contract_id: string
  contract_service_id: string
  raised_by_clerk_id: string
  subject: string
  description: string
  status: 'ouverte' | 'resolue'
  resolved_at: string | null
  resolved_by: string | null
  resolution_comment: string | null
  created_at: string
}

export type ContractEvent = {
  id: string
  contract_id: string
  event_type: string
  actor_clerk_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export type ContractMessage = {
  id: string
  contract_id: string
  sender_clerk_id: string
  content: string
  attachment_url: string | null
  attachment_name: string | null
  attachment_size: number | null
  created_at: string
}
  
export type Listing = {
  id: string
  clerk_user_id: string
  title: string
  category: string | null
  listing_type: 'offer' | 'request' | null
  description: string | null
  value_mad: number | null
  exchange_type: 'service_service' | 'product_service' | 'product_product' | null
  barter_percent: number | null
  cash_percent: number | null
  city: string | null
  images: string[]
  status: 'pending' | 'approved' | 'published' | 'paused' | 'negotiating' | 'expired'
  featured: boolean
  expires_at: string | null
  views: number
  archived: boolean
  created_at: string
}

export type Request = {
  id: string
  listing_id: string
  sender_clerk_id: string
  receiver_clerk_id: string
  message: string | null
  status: 'pending' | 'accepted' | 'refused' | 'finalizing'
  created_at: string
}

export type Transaction = {
  id: string
  request_id: string | null
  party_a_clerk_id: string
  party_b_clerk_id: string
  party_a_offering: string
  party_b_offering: string
  party_a_value_mad: number
  party_b_value_mad: number
  status: 'ongoing' | 'partial' | 'closed'
  notes: string | null
  concluded_at: string
  created_at: string
}