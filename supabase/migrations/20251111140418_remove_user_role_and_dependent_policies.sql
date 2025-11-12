/*
  # Remove user_role column and dependent policies

  1. Changes
    - Drop policies that depend on user_role column
    - Drop the user_role column from workers table
    - Recreate necessary policies without user_role dependency

  2. Security
    - Maintain proper RLS policies for companies table
    - Keep workers table accessible as before
*/

-- Drop the dependent policy on companies table
DROP POLICY IF EXISTS "Admins and managers can read all companies" ON companies;

-- Drop the user_role column from workers table
ALTER TABLE workers DROP COLUMN IF EXISTS user_role;

-- Recreate a simpler policy for companies - allow authenticated users to read all companies
CREATE POLICY "Authenticated users can read companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);
