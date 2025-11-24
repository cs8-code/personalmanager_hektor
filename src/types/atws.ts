export type ListingType = 'verkaufen' | 'kaufen' | 'vermieten' | 'mieten';
export type ListingCondition = 'neu' | 'gebraucht' | 'überholt';
export type ListingStatus = 'active' | 'sold' | 'closed' | 'draft';

export interface ATWSListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  listing_type: ListingType;
  condition?: ListingCondition;
  price?: number;
  price_negotiable: boolean;
  location?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  images: string[];
  status: ListingStatus;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ATWSListingFormData {
  title: string;
  description: string;
  listing_type: ListingType;
  condition?: ListingCondition;
  price?: number;
  price_negotiable: boolean;
  location?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: ListingStatus;
}
