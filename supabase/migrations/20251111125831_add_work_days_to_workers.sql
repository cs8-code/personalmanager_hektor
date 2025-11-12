/*
  # Add Work Days Field to Workers Table

  1. Changes to `workers` table
    - Add `work_days` column with predefined options

  2. Notes
    - Field includes options for different work schedules
    - Optional field with check constraint for valid values
*/

-- Add work_days column to workers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'work_days'
  ) THEN
    ALTER TABLE workers ADD COLUMN work_days text;
  END IF;
END $$;

-- Add check constraint for work_days
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'workers_work_days_check'
  ) THEN
    ALTER TABLE workers ADD CONSTRAINT workers_work_days_check
      CHECK (work_days IS NULL OR work_days IN ('Montag bis Freitag', 'Nur Wochenende', '7-Tage (ohne Feiertag)', 'Täglich (inklusive Feiertag)'));
  END IF;
END $$;
