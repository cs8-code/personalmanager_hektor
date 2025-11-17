/**
 * Job Service
 * Handles all job-related data operations
 */

import { supabase } from '../lib/supabase';
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types';

export const jobService = {
  /**
   * Fetch all jobs with optional filters
   */
  async getAll(filters?: JobFilters) {
    let query = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,company.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.employment_type) {
      query = query.eq('employment_type', filters.employment_type);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      // Default to active jobs only
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Job[];
  },

  /**
   * Fetch a single job by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Job | null;
  },

  /**
   * Fetch all jobs created by a specific user
   */
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Job[];
  },

  /**
   * Create a new job
   */
  async create(job: CreateJobDTO) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  },

  /**
   * Update an existing job
   */
  async update(id: string, updates: Partial<UpdateJobDTO>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  },

  /**
   * Delete a job
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Change job status
   */
  async updateStatus(id: string, status: 'active' | 'closed' | 'draft') {
    return this.update(id, { status });
  },
};
