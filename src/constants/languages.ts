/**
 * Language constants
 * Defines all available languages
 */

export const LANGUAGES = [
  'Deutsch',
  'Englisch',
  'Türkisch',
  'Arabisch',
  'Polnisch',
  'Rumänisch',
  'Russisch',
  'Spanisch',
  'Französisch',
  'Italienisch',
  'Portugiesisch',
  'Griechisch',
  'Kroatisch',
  'Serbisch',
  'Bulgarisch',
  'Albanisch',
] as const;

export type LanguageType = typeof LANGUAGES[number];
