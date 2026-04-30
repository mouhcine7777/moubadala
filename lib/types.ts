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