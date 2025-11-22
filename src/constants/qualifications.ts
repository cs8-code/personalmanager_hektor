/**
 * Qualification constants
 * Defines all available qualifications for railway construction safety (Gleisbausicherung)
 */

export const QUALIFICATIONS = [
  'SIPO',
  'SAKRA',
  'Büro & technisches Arbeiten',
  'Scheibenaufsteller',
  'AwS Monteur',
  'BM',
  'BüP',
  'HiBA',
  'SH2',
  'SAS',
  'Planprüfer',
  'Projektan',
  '4.2',
  'Koordinator',
  'Einsatzleiter',
  'Bahnerder',
  'Führerschein',
] as const;

export type QualificationType = typeof QUALIFICATIONS[number];
