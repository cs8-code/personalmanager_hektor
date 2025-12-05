-- Update companies table for Gleissicherungsfirmen management
-- Allow managers to create multiple companies

-- First, drop ALL existing policies (old and new)
DROP POLICY IF EXISTS "Companies can read own data" ON companies;
DROP POLICY IF EXISTS "Companies can insert own data" ON companies;
DROP POLICY IF EXISTS "Companies can update own data" ON companies;
DROP POLICY IF EXISTS "Companies can delete own data" ON companies;
DROP POLICY IF EXISTS "Admins and managers can read all companies" ON companies;
DROP POLICY IF EXISTS "Anyone can view companies" ON companies;
DROP POLICY IF EXISTS "Managers can insert companies" ON companies;
DROP POLICY IF EXISTS "Managers can update own companies" ON companies;
DROP POLICY IF EXISTS "Managers can delete own companies" ON companies;

-- Step 1: Drop the foreign key constraint from contracts table
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_company_id_fkey;

-- Step 2: Alter the table structure
-- Change id from PRIMARY KEY reference to auth.users to a regular UUID
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_pkey CASCADE;
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_id_fkey;

-- Step 3: Add new columns
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Make id a regular UUID primary key with default
ALTER TABLE companies ALTER COLUMN id DROP DEFAULT;
ALTER TABLE companies ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE companies ADD PRIMARY KEY (id);

-- Step 5: Update existing rows to have created_by set to their id (if any exist)
UPDATE companies SET created_by = id WHERE created_by IS NULL;

-- Step 6: Recreate the foreign key constraint from contracts table
ALTER TABLE contracts
  ADD CONSTRAINT contracts_company_id_fkey
  FOREIGN KEY (company_id)
  REFERENCES companies(id)
  ON DELETE SET NULL;

-- Create new RLS policies for manager-based access

-- Policy: Anyone can view companies (public read)
CREATE POLICY "Anyone can view companies"
  ON companies
  FOR SELECT
  TO public
  USING (true);

-- Policy: Managers can insert companies
CREATE POLICY "Managers can insert companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

-- Policy: Managers can update their own companies
CREATE POLICY "Managers can update own companies"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Policy: Managers can delete their own companies
CREATE POLICY "Managers can delete own companies"
  ON companies
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
