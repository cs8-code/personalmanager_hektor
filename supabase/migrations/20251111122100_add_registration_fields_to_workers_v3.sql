/*
  # Add Additional Registration Fields to Workers Table

  1. Changes to `workers` table
    - Add `employment_type` column (selbständig or angestellt)
    - Add `company_name` column (for selbständig users)
    - Add `company_address` column (for selbständig users)
    - Add `username` column (unique identifier for display)
    - Add `birth_date` column (to determine age)
    - Add `gender` column (Geschlecht)
    - Add `city` column (Stadt)
    - Update `availability_status` to use new options

  2. Notes
    - All new fields are optional except `employment_type` which defaults to 'angestellt'
    - `username` must be unique
    - Existing availability_status values will be migrated to new format
*/

-- Add new columns to workers table
DO $$
BEGIN
  -- Add employment_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'employment_type'
  ) THEN
    ALTER TABLE workers ADD COLUMN employment_type text DEFAULT 'angestellt';
  END IF;

  -- Add company_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE workers ADD COLUMN company_name text;
  END IF;

  -- Add company_address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'company_address'
  ) THEN
    ALTER TABLE workers ADD COLUMN company_address text;
  END IF;

  -- Add username column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'username'
  ) THEN
    ALTER TABLE workers ADD COLUMN username text UNIQUE;
  END IF;

  -- Add birth_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE workers ADD COLUMN birth_date date;
  END IF;

  -- Add gender column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'gender'
  ) THEN
    ALTER TABLE workers ADD COLUMN gender text;
  END IF;

  -- Add city column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'city'
  ) THEN
    ALTER TABLE workers ADD COLUMN city text;
  END IF;
END $$;

-- Drop old availability_status constraint first
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'workers_availability_status_check'
  ) THEN
    ALTER TABLE workers DROP CONSTRAINT workers_availability_status_check;
  END IF;
END $$;

-- Migrate existing availability_status data to new format
UPDATE workers 
SET availability_status = CASE
  WHEN availability_status = 'sofort verfügbar' THEN 'Sofort verfügbar'
  WHEN availability_status = 'available' THEN 'Sofort verfügbar'
  WHEN availability_status = 'demnächst verfügbar' THEN 'demnächst verfügbar'
  WHEN availability_status LIKE '%beschäftigt%' THEN 'zurzeit beschäftigt'
  ELSE 'Sofort verfügbar'
END;

-- Add new availability_status constraint
ALTER TABLE workers ADD CONSTRAINT workers_availability_status_check
  CHECK (availability_status IN ('Sofort verfügbar', 'demnächst verfügbar', 'nicht verfügbar', 'zurzeit beschäftigt'));

-- Update default for availability_status
ALTER TABLE workers ALTER COLUMN availability_status SET DEFAULT 'Sofort verfügbar';

-- Add check constraint for employment_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'workers_employment_type_check'
  ) THEN
    ALTER TABLE workers ADD CONSTRAINT workers_employment_type_check
      CHECK (employment_type IN ('selbständig', 'angestellt'));
  END IF;
END $$;

-- Add check constraint for gender
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'workers_gender_check'
  ) THEN
    ALTER TABLE workers ADD CONSTRAINT workers_gender_check
      CHECK (gender IS NULL OR gender IN ('männlich', 'weiblich', 'divers'));
  END IF;
END $$;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_workers_username ON workers(username);
