/*
  # Fix workers INSERT policy for registration

  1. Changes
    - Drop the old "Anyone can insert workers" policy
    - Create a new policy that allows authenticated users to insert their own worker profile
    - This enables user registration to work properly

  2. Security
    - Users can only insert a worker record where the id matches their auth.uid()
    - This prevents users from creating profiles for other users
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can insert workers" ON workers;

-- Create a new policy that allows users to insert their own profile
CREATE POLICY "Users can insert own worker profile"
  ON workers
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());
