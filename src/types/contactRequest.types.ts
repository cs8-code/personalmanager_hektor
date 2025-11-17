/**
 * Contact Request type definitions
 * Centralized contact request types used across the application
 */

export interface ContactRequest {
  id: string;
  worker_id: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
  worker?: {
    id: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
    image_url?: string;
  };
}

export interface CreateContactRequestDTO {
  worker_id: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  message?: string;
}

export interface UpdateContactRequestDTO {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export type ContactRequestStatus = 'pending' | 'accepted' | 'rejected';
