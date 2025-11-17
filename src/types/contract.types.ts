/**
 * Contract-related type definitions
 * Centralized contract types used across the application
 */

export interface Contract {
  id: string;
  user_id: string;
  company_id?: string;
  contact_name: string;
  company_name: string;
  company_address?: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  start_date: string;
  end_date: string;
  num_workers: number;
  description?: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at?: string;
}

export interface CreateContractDTO {
  user_id: string;
  company_id?: string;
  contact_name: string;
  company_name: string;
  company_address?: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  start_date: string;
  end_date: string;
  num_workers: number;
  description?: string;
  status?: 'active' | 'pending' | 'completed' | 'cancelled';
}

export interface UpdateContractDTO extends Partial<CreateContractDTO> {
  id: string;
}

export interface ContractFilters {
  searchTerm?: string;
  location?: string;
  status?: 'active' | 'pending' | 'completed' | 'cancelled';
}
