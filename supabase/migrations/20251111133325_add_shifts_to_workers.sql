/*
  # Add Shifts Field to Workers Table

  1. Changes to `workers` table
    - Add `shifts` column with predefined shift options

  2. Notes
    - Field includes options for different shift preferences
    - Optional field with check constraint for valid values
*/

-- Add shifts column to workers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'shifts'
  ) THEN
    ALTER TABLE workers ADD COLUMN shifts text;
  END IF;
END $$;

-- Add check constraint for shifts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'workers_shifts_check'
  ) THEN
    ALTER TABLE workers ADD CONSTRAINT workers_shifts_check
      CHECK (shifts IS NULL OR shifts IN ('Früh', 'Mittag/Spät', 'Nacht', 'Alle'));
  END IF;
END $$;
