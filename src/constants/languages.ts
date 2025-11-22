/**
 * Language constants
 * Defines all available languages
 */

export const LANGUAGES = [
  'Deutsch',
  'Englisch',
  'Türkisch',
  'Italienisch',
  'Albanisch',
  'Arabisch',
  'Polnisch',
  'Russisch',
  'Spanisch',
  'Französisch',
] as const;

export type LanguageType = typeof LANGUAGES[number];
