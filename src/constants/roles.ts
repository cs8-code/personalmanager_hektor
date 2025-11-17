/**
 * System role constants
 * Defines all system roles and role-related utilities
 */

export const SYSTEM_ROLES = {
  ADMINISTRATOR: 'administrator',
  MANAGER: 'manager',
} as const;

export type SystemRoleType = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES];

export const ROLE_LABELS: Record<string, string> = {
  [SYSTEM_ROLES.ADMINISTRATOR]: 'Administrator',
  [SYSTEM_ROLES.MANAGER]: 'Manager',
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  [SYSTEM_ROLES.ADMINISTRATOR]: 'Vollständiger Systemzugriff, kann Manager-Rollen vergeben und alle Daten verwalten',
  [SYSTEM_ROLES.MANAGER]: 'Kann Mitarbeiter erstellen/verwalten, Jobs veröffentlichen und Verträge verwalten',
};
