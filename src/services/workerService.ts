/**
 * Worker Service
 * Handles all worker-related data operations
 */

import { supabase } from '../lib/supabase';
import type { Worker, CreateWorkerDTO, UpdateWorkerDTO, WorkerFilters } from '../types';

export const workerService = {
  /**
   * Fetch all workers with optional filters
   */
  async getAll(filters?: WorkerFilters) {
    let query = supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.searchTerm) {
      query = query.or(
        `first_name.ilike.%${filters.searchTerm}%,last_name.ilike.%${filters.searchTerm}%,name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`
      );
    }

    if (filters?.location) {
      query = query.or(`location.ilike.%${filters.location}%,city.ilike.%${filters.location}%`);
    }

    if (filters?.availability_status) {
      query = query.eq('availability_status', filters.availability_status);
    }

    if (filters?.employment_type) {
      query = query.eq('employment_type', filters.employment_type);
    }

    if (filters?.qualifications && filters.qualifications.length > 0) {
      query = query.contains('qualifications', filters.qualifications);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Worker[];
  },

  /**
   * Fetch a single worker by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Worker | null;
  },

  /**
   * Fetch all workers created by a specific manager
   */
  async getByCreatorId(creatorId: string) {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('created_by', creatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Worker[];
  },

  /**
   * Create a new worker profile
   */
  async create(worker: CreateWorkerDTO) {
    const { data, error } = await supabase
      .from('workers')
      .insert([worker])
      .select()
      .single();

    if (error) throw error;
    return data as Worker;
  },

  /**
   * Update an existing worker profile
   */
  async update(id: string, updates: Partial<UpdateWorkerDTO>) {
    const { data, error } = await supabase
      .from('workers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Worker;
  },

  /**
   * Delete a worker profile
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Update worker availability status
   */
  async updateAvailabilityStatus(id: string, status: string) {
    return this.update(id, { availability_status: status });
  },

  /**
   * Update worker profile image
   */
  async updateImage(id: string, imageUrl: string) {
    return this.update(id, { image_url: imageUrl });
  },

  /**
   * Search workers by multiple criteria
   */
  async search(searchTerm: string) {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Worker[];
  },
};
