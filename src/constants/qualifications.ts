/**
 * Qualification constants
 * Defines all available qualifications
 */

export const QUALIFICATIONS = [
  'Anlagenmechaniker',
  'Bauhelfer',
  'Bauleiter',
  'Bodenleger',
  'Dachdecker',
  'Elektriker',
  'Estrichleger',
  'Fassadenbauer',
  'Fliesenleger',
  'Gerüstbauer',
  'Gipser',
  'Glaser',
  'Heizungsbauer',
  'Hochbaufacharbeiter',
  'Holzmechaniker',
  'Isolierer',
  'Installateur',
  'Klempner',
  'Maler',
  'Maurer',
  'Metallbauer',
  'Monteur',
  'Parkettleger',
  'Pflasterer',
  'Projektleiter',
  'Sanitärinstallateur',
  'Schlosser',
  'Schreiner',
  'Schweißer',
  'Staplerfahrer',
  'Straßenbauer',
  'Stuckateur',
  'Tiefbaufacharbeiter',
  'Trockenbauer',
  'Zimmerer',
] as const;

export type QualificationType = typeof QUALIFICATIONS[number];
