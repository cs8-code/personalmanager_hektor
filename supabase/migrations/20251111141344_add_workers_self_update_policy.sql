/*
  # Add policy for users to update their own worker profile

  1. Changes
    - Add a new RLS policy allowing authenticated users to update their own worker record
    - This allows users to edit their profile information

  2. Security
    - Users can only update their own record (where id matches auth.uid())
    - Policy is restrictive and checks both USING and WITH CHECK clauses
*/

-- Allow users to update their own worker profile
CREATE POLICY "Users can update own worker profile"
  ON workers
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
