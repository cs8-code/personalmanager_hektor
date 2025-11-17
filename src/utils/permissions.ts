/**
 * Permission utilities
 * Helper functions for authorization checks
 */

import { SYSTEM_ROLES } from '../constants';
import type { SystemRole } from '../types';

/**
 * Check if user is an administrator
 */
export const isAdministrator = (systemRole?: SystemRole): boolean => {
  return systemRole === SYSTEM_ROLES.ADMINISTRATOR;
};

/**
 * Check if user is a manager
 */
export const isManager = (systemRole?: SystemRole): boolean => {
  return systemRole === SYSTEM_ROLES.MANAGER;
};

/**
 * Check if user is manager or admin
 */
export const isManagerOrAdmin = (systemRole?: SystemRole): boolean => {
  return (
    systemRole === SYSTEM_ROLES.MANAGER ||
    systemRole === SYSTEM_ROLES.ADMINISTRATOR
  );
};

/**
 * Check if user can edit a resource
 */
export const canEditResource = (
  userId: string,
  resourceOwnerId: string,
  systemRole?: SystemRole
): boolean => {
  // Admins can edit anything
  if (isAdministrator(systemRole)) {
    return true;
  }

  // Users can edit their own resources
  if (userId === resourceOwnerId) {
    return true;
  }

  return false;
};

/**
 * Check if user can delete a resource
 */
export const canDeleteResource = (
  userId: string,
  resourceOwnerId: string,
  systemRole?: SystemRole
): boolean => {
  // Same logic as edit for now
  return canEditResource(userId, resourceOwnerId, systemRole);
};

/**
 * Check if manager can edit a worker they created
 */
export const canManagerEditWorker = (
  managerId: string,
  workerCreatedBy?: string,
  systemRole?: SystemRole
): boolean => {
  // Admins can edit all workers
  if (isAdministrator(systemRole)) {
    return true;
  }

  // Managers can edit workers they created
  if (isManager(systemRole) && workerCreatedBy === managerId) {
    return true;
  }

  return false;
};

/**
 * Check if user has specific role
 */
export const hasRole = (userRole: SystemRole, requiredRole: SystemRole): boolean => {
  if (!requiredRole) return true;
  return userRole === requiredRole;
};

/**
 * Get highest permission level between roles
 */
export const getHighestRole = (roles: SystemRole[]): SystemRole => {
  if (roles.includes(SYSTEM_ROLES.ADMINISTRATOR)) {
    return SYSTEM_ROLES.ADMINISTRATOR;
  }
  if (roles.includes(SYSTEM_ROLES.MANAGER)) {
    return SYSTEM_ROLES.MANAGER;
  }
  return null;
};
