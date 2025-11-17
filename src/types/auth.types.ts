/**
 * Authentication and authorization type definitions
 * Centralized auth types used across the application
 */

import { User } from '@supabase/supabase-js';

export interface UserProfile {
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
  systemRole?: SystemRole;
}

export type SystemRole = 'administrator' | 'manager' | null;

export interface UserRole {
  id: string;
  user_id: string;
  role: 'administrator' | 'manager';
  granted_by?: string;
  granted_at: string;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData extends LoginCredentials {
  first_name: string;
  last_name: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  city?: string;
  qualifications?: string[];
  languages?: string[];
  employment_type?: string;
  work_days?: string[];
  shifts?: string[];
  availability_status?: string;
}
