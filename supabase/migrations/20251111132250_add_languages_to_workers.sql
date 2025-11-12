/*
  # Add Languages Field to Workers Table

  1. Changes to `workers` table
    - Add `languages` column as text array to store multiple language selections

  2. Notes
    - Field stores multiple languages as an array
    - Optional field
*/

-- Add languages column to workers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'languages'
  ) THEN
    ALTER TABLE workers ADD COLUMN languages text[] DEFAULT '{}';
  END IF;
END $$;
