/**
 * Job-related type definitions
 * Centralized job types used across the application
 */

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  employment_type: string;
  experience_required?: string;
  salary_range?: string;
  requirements?: string[];
  benefits?: string[];
  contact_email?: string;
  contact_phone?: string;
  status: 'active' | 'closed' | 'draft';
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateJobDTO {
  title: string;
  description: string;
  company: string;
  location: string;
  employment_type: string;
  experience_required?: string;
  salary_range?: string;
  requirements?: string[];
  benefits?: string[];
  contact_email?: string;
  contact_phone?: string;
  status?: 'active' | 'closed' | 'draft';
  created_by: string;
}

export interface UpdateJobDTO extends Partial<CreateJobDTO> {
  id: string;
}

export interface JobFilters {
  searchTerm?: string;
  location?: string;
  employment_type?: string;
  status?: 'active' | 'closed' | 'draft';
}
