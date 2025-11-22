/**
 * Work preference constants
 * Defines work days, shifts, and smoking status options
 */

export const WORK_DAYS = [
  'Montag bis Freitag',
  'Nur Wochenende',
  '7-Tage (ohne Feiertag)',
  'Täglich (inklusive Feiertag)',
] as const;

export const SHIFTS = [
  'Früh',
  'Mittag/Spät',
  'Nacht',
  'Alle',
] as const;

export const SMOKING_STATUS = [
  'Raucher',
  'Nicht-Raucher',
] as const;

export const ARBEITSORT = [
  'Nahbaustellen',
  'Montage (ohne km-Begrenzung)',
  'Montage (mit km-Begrenzung)',
  'Nahbau & Montage',
] as const;

export const GENDERS = [
  'Mann',
  'Frau',
] as const;
