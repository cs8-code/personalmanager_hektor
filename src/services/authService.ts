/**
 * Authentication Service
 * Handles all authentication and user management operations
 */

import { supabase } from '../lib/supabase';
import type { UserProfile, LoginCredentials, RegistrationData, SystemRole } from '../types';

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign up a new user with worker profile
   */
  async signUp(registrationData: RegistrationData) {
    const { email, password, ...profileData } = registrationData;

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Benutzer konnte nicht erstellt werden');

    // Create worker profile
    const { error: profileError } = await supabase
      .from('workers')
      .insert([{
        id: authData.user.id,
        email,
        ...profileData,
      }]);

    if (profileError) {
      // Rollback: Delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return authData;
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current user session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (workerError) throw workerError;
    if (!worker) return null;

    // Fetch system role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (roleError && roleError.code !== 'PGRST116') {
      throw roleError;
    }

    return {
      ...worker,
      systemRole: roleData?.role || null,
    } as UserProfile;
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  /**
   * Reset password via email
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  /**
   * Check if user has a specific role
   */
  async hasRole(userId: string, role: SystemRole): Promise<boolean> {
    if (!role) return true;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  },

  /**
   * Check if user is manager or admin
   */
  async isManagerOrAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .in('role', ['manager', 'administrator'])
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  },
};
