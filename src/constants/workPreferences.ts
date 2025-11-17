/**
 * Work preference constants
 * Defines work days, shifts, and smoking status options
 */

export const WORK_DAYS = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
] as const;

export type WorkDayType = typeof WORK_DAYS[number];

export const SHIFTS = [
  'Frühschicht',
  'Spätschicht',
  'Nachtschicht',
  'Wechselschicht',
] as const;

export type ShiftType = typeof SHIFTS[number];

export const SMOKING_STATUS = {
  SMOKER: 'Raucher',
  NON_SMOKER: 'Nichtraucher',
} as const;

export const SMOKING_STATUS_OPTIONS = [
  { value: SMOKING_STATUS.SMOKER, label: 'Raucher' },
  { value: SMOKING_STATUS.NON_SMOKER, label: 'Nichtraucher' },
];

export const GENDER_OPTIONS = [
  { value: 'männlich', label: 'Männlich' },
  { value: 'weiblich', label: 'Weiblich' },
  { value: 'divers', label: 'Divers' },
];
