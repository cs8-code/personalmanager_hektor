/**
 * Employment type constants
 * Defines all employment type options
 */

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'Vollzeit',
  PART_TIME: 'Teilzeit',
  FREELANCE: 'Freelance',
  FIXED_TERM: 'Befristet',
  MINIJOB: 'Minijob',
  INTERNSHIP: 'Praktikum',
} as const;

export const EMPLOYMENT_TYPE_VALUES = Object.values(EMPLOYMENT_TYPES);

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: EMPLOYMENT_TYPES.FULL_TIME, label: 'Vollzeit' },
  { value: EMPLOYMENT_TYPES.PART_TIME, label: 'Teilzeit' },
  { value: EMPLOYMENT_TYPES.FREELANCE, label: 'Freelance' },
  { value: EMPLOYMENT_TYPES.FIXED_TERM, label: 'Befristet' },
  { value: EMPLOYMENT_TYPES.MINIJOB, label: 'Minijob' },
  { value: EMPLOYMENT_TYPES.INTERNSHIP, label: 'Praktikum' },
];
