/**
 * Contact Request Service
 * Handles all contact request-related data operations
 */

import { supabase } from '../lib/supabase';
import type { ContactRequest, CreateContactRequestDTO } from '../types';

export const contactRequestService = {
  /**
   * Fetch all contact requests
   */
  async getAll() {
    const { data, error } = await supabase
      .from('contact_requests')
      .select(`
        *,
        worker:workers!worker_id (
          id,
          name,
          first_name,
          last_name,
          email,
          phone,
          image_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ContactRequest[];
  },

  /**
   * Fetch a single contact request by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('contact_requests')
      .select(`
        *,
        worker:workers!worker_id (
          id,
          name,
          first_name,
          last_name,
          email,
          phone,
          image_url
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as ContactRequest | null;
  },

  /**
   * Fetch all contact requests for a specific worker
   */
  async getByWorkerId(workerId: string) {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ContactRequest[];
  },

  /**
   * Create a new contact request
   */
  async create(request: CreateContactRequestDTO) {
    const requestData = {
      ...request,
      status: 'pending' as const,
    };

    const { data, error } = await supabase
      .from('contact_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data as ContactRequest;
  },

  /**
   * Update contact request status
   */
  async updateStatus(id: string, status: 'pending' | 'accepted' | 'rejected') {
    const { data, error } = await supabase
      .from('contact_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ContactRequest;
  },

  /**
   * Accept a contact request
   */
  async accept(id: string) {
    return this.updateStatus(id, 'accepted');
  },

  /**
   * Reject a contact request
   */
  async reject(id: string) {
    return this.updateStatus(id, 'rejected');
  },

  /**
   * Delete a contact request
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('contact_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Get contact requests count by status
   */
  async getCountByStatus(workerId: string, status: 'pending' | 'accepted' | 'rejected') {
    const { count, error } = await supabase
      .from('contact_requests')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', workerId)
      .eq('status', status);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Get pending contact requests count for a worker
   */
  async getPendingCount(workerId: string) {
    return this.getCountByStatus(workerId, 'pending');
  },
};
