/**
 * Status constants
 * Defines all status values used across the application
 */

// Availability statuses for workers
export const AVAILABILITY_STATUS = {
  IMMEDIATELY_AVAILABLE: 'sofort verfügbar',
  AVAILABLE_SOON: 'demnächst verfügbar',
  NOT_AVAILABLE: 'nicht verfügbar',
  CURRENTLY_EMPLOYED: 'zurzeit beschäftigt',
} as const;

export const AVAILABILITY_STATUS_VALUES = Object.values(AVAILABILITY_STATUS);

export const AVAILABILITY_STATUS_LABELS: Record<string, string> = {
  [AVAILABILITY_STATUS.IMMEDIATELY_AVAILABLE]: 'Sofort verfügbar',
  [AVAILABILITY_STATUS.AVAILABLE_SOON]: 'Demnächst verfügbar',
  [AVAILABILITY_STATUS.NOT_AVAILABLE]: 'Nicht verfügbar',
  [AVAILABILITY_STATUS.CURRENTLY_EMPLOYED]: 'Zurzeit beschäftigt',
};

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
