/*
  # Fix Availability Status Constraint

  1. Changes
    - Update availability_status constraint to use lowercase 'sofort verfügbar'
      to match the constants in the application code
    - Migrate existing data from 'Sofort verfügbar' to 'sofort verfügbar'

  2. Notes
    - This fixes the 422 error during registration
    - All status values should now match the AVAILABILITY_STATUS constants
*/

-- Drop the existing constraint
ALTER TABLE workers DROP CONSTRAINT IF EXISTS workers_availability_status_check;

-- Update existing data to use lowercase format
UPDATE workers
SET availability_status = CASE
  WHEN availability_status = 'Sofort verfügbar' THEN 'sofort verfügbar'
  WHEN availability_status = 'Demnächst verfügbar' THEN 'demnächst verfügbar'
  WHEN availability_status = 'Nicht verfügbar' THEN 'nicht verfügbar'
  WHEN availability_status = 'Zurzeit beschäftigt' THEN 'zurzeit beschäftigt'
  ELSE availability_status
END;

-- Add the corrected constraint with lowercase values
ALTER TABLE workers ADD CONSTRAINT workers_availability_status_check
  CHECK (availability_status IN ('sofort verfügbar', 'demnächst verfügbar', 'nicht verfügbar', 'zurzeit beschäftigt'));

-- Update the default value
ALTER TABLE workers ALTER COLUMN availability_status SET DEFAULT 'sofort verfügbar';
