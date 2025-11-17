/**
 * Admin Service
 * Handles all admin-related operations
 */

import { supabase } from '../lib/supabase';
import type { UserRole } from '../types';

export const adminService = {
  /**
   * Get all user roles
   */
  async getAllUserRoles() {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        worker:workers!user_id (
          id,
          name,
          first_name,
          last_name,
          email
        )
      `)
      .order('granted_at', { ascending: false });

    if (error) throw error;
    return data as UserRole[];
  },

  /**
   * Grant a role to a user
   */
  async grantRole(userId: string, role: 'administrator' | 'manager', grantedBy: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{
        user_id: userId,
        role,
        granted_by: grantedBy,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as UserRole;
  },

  /**
   * Revoke a user's role
   */
  async revokeRole(userId: string) {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Get all workers (for admin management)
   */
  async getAllWorkers() {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get all contact messages
   */
  async getAllContactMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Delete a contact message
   */
  async deleteContactMessage(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Get system statistics
   */
  async getSystemStats() {
    const [workersResult, jobsResult, contractsResult, requestsResult] = await Promise.all([
      supabase.from('workers').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('contracts').select('*', { count: 'exact', head: true }),
      supabase.from('contact_requests').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalWorkers: workersResult.count || 0,
      totalJobs: jobsResult.count || 0,
      totalContracts: contractsResult.count || 0,
      totalContactRequests: requestsResult.count || 0,
    };
  },
};
