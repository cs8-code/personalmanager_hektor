/*
  # Add User Role Column to Workers Table

  1. Changes
    - Add `user_role` column to workers table with CHECK constraint
    - Only allows 'Subunternehmer' or 'SIPO' as valid values
    - Set NOT NULL constraint to ensure every user has a role

  2. Security
    - Maintain existing RLS policies
    - No changes to access control needed

  3. Notes
    - This is a required field for all new registrations
    - Existing sample data will be updated to include roles
*/

-- Add user_role column to workers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'user_role'
  ) THEN
    ALTER TABLE workers 
    ADD COLUMN user_role text CHECK (user_role IN ('Subunternehmer', 'SIPO'));
  END IF;
END $$;

-- Update existing sample data with roles
UPDATE workers 
SET user_role = 'Subunternehmer' 
WHERE user_role IS NULL AND role = 'Subunternehmer';

UPDATE workers 
SET user_role = 'SIPO' 
WHERE user_role IS NULL AND role = 'Sipo';

-- Now make the column NOT NULL after updating existing data
ALTER TABLE workers ALTER COLUMN user_role SET NOT NULL;