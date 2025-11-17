/**
 * Custom hook for permission and authorization checks
 * Provides utilities to check user roles and permissions
 */

import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SYSTEM_ROLES } from '../constants';
import type { SystemRole } from '../types';

export const usePermissions = () => {
  const { user, userProfile } = useAuth();

  const systemRole = userProfile?.systemRole;

  const permissions = useMemo(() => ({
    // Check if user is authenticated
    isAuthenticated: !!user,

    // Check if user is an administrator
    isAdministrator: systemRole === SYSTEM_ROLES.ADMINISTRATOR,

    // Check if user is a manager
    isManager: systemRole === SYSTEM_ROLES.MANAGER,

    // Check if user is manager or admin
    isManagerOrAdmin:
      systemRole === SYSTEM_ROLES.MANAGER ||
      systemRole === SYSTEM_ROLES.ADMINISTRATOR,

    // Check if user has a specific role
    hasRole: (role: SystemRole) => {
      if (!role) return true;
      return systemRole === role;
    },

    // Check if user can edit a worker profile
    canEditWorker: (workerId: string, createdBy?: string) => {
      if (!user) return false;
      if (systemRole === SYSTEM_ROLES.ADMINISTRATOR) return true;
      if (workerId === user.id) return true; // Own profile
      if (systemRole === SYSTEM_ROLES.MANAGER && createdBy === user.id) return true;
      return false;
    },

    // Check if user can delete a worker profile
    canDeleteWorker: (_workerId: string, createdBy?: string) => {
      if (!user) return false;
      if (systemRole === SYSTEM_ROLES.ADMINISTRATOR) return true;
      if (systemRole === SYSTEM_ROLES.MANAGER && createdBy === user.id) return true;
      return false;
    },

    // Check if user can create workers
    canCreateWorker:
      systemRole === SYSTEM_ROLES.MANAGER ||
      systemRole === SYSTEM_ROLES.ADMINISTRATOR,

    // Check if user can manage jobs
    canManageJobs:
      systemRole === SYSTEM_ROLES.MANAGER ||
      systemRole === SYSTEM_ROLES.ADMINISTRATOR,

    // Check if user can edit a job
    canEditJob: (jobCreatedBy: string) => {
      if (!user) return false;
      if (systemRole === SYSTEM_ROLES.ADMINISTRATOR) return true;
      if (systemRole === SYSTEM_ROLES.MANAGER && jobCreatedBy === user.id) return true;
      return false;
    },

    // Check if user can delete a job
    canDeleteJob: (jobCreatedBy: string) => {
      if (!user) return false;
      if (systemRole === SYSTEM_ROLES.ADMINISTRATOR) return true;
      if (systemRole === SYSTEM_ROLES.MANAGER && jobCreatedBy === user.id) return true;
      return false;
    },

    // Check if user can manage contracts
    canManageContracts: !!user,

    // Check if user can edit a contract
    canEditContract: (contractUserId: string) => {
      if (!user) return false;
      if (systemRole === SYSTEM_ROLES.ADMINISTRATOR) return true;
      return contractUserId === user.id;
    },

    // Check if user can delete a contract
    canDeleteContract: (contractUserId: string) => {
      if (!user) return false;
      if (systemRole === SYSTEM_ROLES.ADMINISTRATOR) return true;
      return contractUserId === user.id;
    },

    // Check if user can grant roles
    canGrantRoles: systemRole === SYSTEM_ROLES.ADMINISTRATOR,

    // Check if user can access admin panel
    canAccessAdminPanel: systemRole === SYSTEM_ROLES.ADMINISTRATOR,

    // Check if user can access manager dashboard
    canAccessManagerDashboard:
      systemRole === SYSTEM_ROLES.MANAGER ||
      systemRole === SYSTEM_ROLES.ADMINISTRATOR,

    // Current user ID
    userId: user?.id,

    // Current system role
    currentRole: systemRole,
  }), [user, systemRole]);

  return permissions;
};
