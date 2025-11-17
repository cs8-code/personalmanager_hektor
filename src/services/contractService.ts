/**
 * Contract Service
 * Handles all contract-related data operations
 */

import { supabase } from '../lib/supabase';
import type { Contract, CreateContractDTO, UpdateContractDTO, ContractFilters } from '../types';

export const contractService = {
  /**
   * Fetch all contracts with optional filters
   */
  async getAll(filters?: ContractFilters) {
    let query = supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.searchTerm) {
      query = query.or(
        `company_name.ilike.%${filters.searchTerm}%,contact_name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
      );
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Contract[];
  },

  /**
   * Fetch a single contract by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Contract | null;
  },

  /**
   * Fetch all contracts created by a specific user
   */
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Contract[];
  },

  /**
   * Create a new contract
   */
  async create(contract: CreateContractDTO) {
    const { data, error } = await supabase
      .from('contracts')
      .insert([contract])
      .select()
      .single();

    if (error) throw error;
    return data as Contract;
  },

  /**
   * Update an existing contract
   */
  async update(id: string, updates: Partial<UpdateContractDTO>) {
    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Contract;
  },

  /**
   * Delete a contract
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Change contract status
   */
  async updateStatus(id: string, status: 'active' | 'pending' | 'completed' | 'cancelled') {
    return this.update(id, { status });
  },

  /**
   * Get active contracts
   */
  async getActive() {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('status', 'active')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data as Contract[];
  },

  /**
   * Get contracts by date range
   */
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .gte('start_date', startDate)
      .lte('end_date', endDate)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data as Contract[];
  },
};
