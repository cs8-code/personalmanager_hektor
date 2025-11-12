/*
  # Create Companies Table

  1. New Tables
    - `companies`
      - `id` (uuid, primary key, references auth.users)
      - `company_name` (text, required)
      - `company_address` (text)
      - `contact_person` (text)
      - `email` (text, unique, required)
      - `phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `companies` table
    - Add policies for authenticated users to manage their own company data
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_address text,
  contact_person text,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policy: Companies can read their own data
CREATE POLICY "Companies can read own data"
  ON companies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Companies can insert their own data
CREATE POLICY "Companies can insert own data"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Companies can update their own data
CREATE POLICY "Companies can update own data"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Companies can delete their own data
CREATE POLICY "Companies can delete own data"
  ON companies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Admins and managers can read all companies
CREATE POLICY "Admins and managers can read all companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.id = auth.uid()
      AND workers.user_role IN ('admin', 'manager')
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);
