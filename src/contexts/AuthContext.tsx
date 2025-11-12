import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  birthdate: string | null;
  gender: string | null;
  city: string | null;
  employment_type: string | null;
  company_name: string | null;
  company_address: string | null;
  languages: string[] | null;
  qualifications: string[] | null;
  work_days: string | null;
  shifts: string | null;
  smoking_status: string | null;
  arbeitsort: string | null;
  remarks: string | null;
  availability_status: string | null;
  image_url: string;
  location: string;
  experience_years: number;
  bio: string;
  role: string;
  company: string;
  systemRole?: 'administrator' | 'manager' | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (workerError && workerError.code !== 'PGRST116') throw workerError;

      if (workerData) {
        setUserProfile({
          ...workerData,
          birthdate: workerData.birth_date, // Map birth_date to birthdate
          systemRole: roleData?.role || null,
        });
      } else if (roleData?.role) {
        const { data: { user } } = await supabase.auth.getUser();
        setUserProfile({
          id: userId,
          name: user?.email?.split('@')[0] || 'User',
          email: user?.email || '',
          username: '',
          phone: '',
          birthdate: null,
          gender: null,
          city: null,
          employment_type: null,
          company_name: null,
          company_address: null,
          qualifications: [],
          languages: [],
          work_days: null,
          shifts: null,
          smoking_status: null,
          arbeitsort: null,
          remarks: null,
          availability_status: 'Sofort verfügbar',
          image_url: '',
          location: '',
          experience_years: 0,
          bio: '',
          role: '',
          company: '',
          systemRole: roleData.role,
        });
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await fetchUserProfile(session.user.id);
        })();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    }));

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signOut,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
