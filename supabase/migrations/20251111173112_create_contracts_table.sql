-- Create contracts table for self-employed users
--
-- 1. New Tables
--    - contracts: Stores contract/job postings from self-employed users
--
-- 2. Security
--    - Enable RLS on contracts table
--    - Public can read active contracts
--    - Authenticated users can create contracts
--    - Users can update/delete own contracts

CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  contact_name text NOT NULL,
  company_name text NOT NULL,
  company_address text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  location text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  num_workers integer NOT NULL DEFAULT 1,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active contracts"
  ON contracts
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Authenticated users can create contracts"
  ON contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contracts"
  ON contracts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contracts"
  ON contracts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_location ON contracts(location);
CREATE INDEX IF NOT EXISTS idx_contracts_start_date ON contracts(start_date);