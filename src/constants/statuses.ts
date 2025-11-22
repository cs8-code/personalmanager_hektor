/**
 * Status constants
 * Defines all status values used across the application
 */

// Availability statuses for workers (stored in database)
export const AVAILABILITY_STATUSES = [
  'Sofort verfügbar',
  'Demnächst verfügbar',
  'Nicht verfügbar',
  'Zurzeit beschäftigt',
] as const;

// Job statuses
export const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  DRAFT: 'draft',
} as const;

export const JOB_STATUS_LABELS: Record<string, string> = {
  [JOB_STATUS.ACTIVE]: 'Aktiv',
  [JOB_STATUS.CLOSED]: 'Geschlossen',
  [JOB_STATUS.DRAFT]: 'Entwurf',
};

// Contract statuses
export const CONTRACT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  [CONTRACT_STATUS.ACTIVE]: 'Aktiv',
  [CONTRACT_STATUS.PENDING]: 'Ausstehend',
  [CONTRACT_STATUS.COMPLETED]: 'Abgeschlossen',
  [CONTRACT_STATUS.CANCELLED]: 'Abgebrochen',
};

// Contact request statuses
export const CONTACT_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const CONTACT_REQUEST_STATUS_LABELS: Record<string, string> = {
  [CONTACT_REQUEST_STATUS.PENDING]: 'Ausstehend',
  [CONTACT_REQUEST_STATUS.ACCEPTED]: 'Akzeptiert',
  [CONTACT_REQUEST_STATUS.REJECTED]: 'Abgelehnt',
};
