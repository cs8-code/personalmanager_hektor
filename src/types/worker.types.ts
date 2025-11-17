/**
 * Worker-related type definitions
 * Centralized worker types used across the application
 */

export interface Worker {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  qualifications?: string[];
  availability_status?: string;
  location?: string;
  experience_years?: number;
  bio?: string;
  image_url?: string;
  birth_date?: string;
  username?: string;
  gender?: string;
  city?: string;
  employment_type?: string;
  company_name?: string;
  company_address?: string;
  languages?: string[];
  work_days?: string[];
  shifts?: string[];
  smoking_status?: string;
  arbeitsort?: string;
  remarks?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWorkerDTO {
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  qualifications?: string[];
  availability_status?: string;
  location?: string;
  experience_years?: number;
  bio?: string;
  image_url?: string;
  birth_date?: string;
  username?: string;
  gender?: string;
  city?: string;
  employment_type?: string;
  company_name?: string;
  company_address?: string;
  languages?: string[];
  work_days?: string[];
  shifts?: string[];
  smoking_status?: string;
  arbeitsort?: string;
  remarks?: string;
  created_by?: string;
}

export interface UpdateWorkerDTO extends Partial<CreateWorkerDTO> {
  id: string;
}

export interface WorkerFilters {
  searchTerm?: string;
  location?: string;
  qualifications?: string[];
  availability_status?: string;
  employment_type?: string;
}
