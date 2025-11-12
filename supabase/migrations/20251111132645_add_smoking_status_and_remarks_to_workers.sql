/*
  # Add Smoking Status and Remarks Fields to Workers Table

  1. Changes to `workers` table
    - Add `smoking_status` column with predefined options
    - Add `remarks` column for special requests/notes

  2. Notes
    - smoking_status includes options for smoker/non-smoker
    - remarks field allows up to 200 characters for special notes
    - Both fields are optional
*/

-- Add smoking_status column to workers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'smoking_status'
  ) THEN
    ALTER TABLE workers ADD COLUMN smoking_status text;
  END IF;
END $$;

-- Add check constraint for smoking_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'workers_smoking_status_check'
  ) THEN
    ALTER TABLE workers ADD CONSTRAINT workers_smoking_status_check
      CHECK (smoking_status IS NULL OR smoking_status IN ('Raucher', 'Nicht-Raucher'));
  END IF;
END $$;

-- Add remarks column to workers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'remarks'
  ) THEN
    ALTER TABLE workers ADD COLUMN remarks text;
  END IF;
END $$;

-- Add check constraint for remarks length
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'workers_remarks_length_check'
  ) THEN
    ALTER TABLE workers ADD CONSTRAINT workers_remarks_length_check
      CHECK (remarks IS NULL OR length(remarks) <= 200);
  END IF;
END $$;
