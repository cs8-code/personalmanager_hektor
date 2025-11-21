/*
  # Allow Anonymous Users to View Survey Results

  1. Changes
    - Drop the existing SELECT policy that only allows authenticated users
    - Create a new SELECT policy that allows both authenticated AND anonymous users to view survey responses

  2. Security
    - Anonymous users can now view all survey responses (for displaying results)
    - Only authenticated users can still vote (INSERT/UPDATE policies remain unchanged)
*/

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can view survey responses" ON elba_survey_responses;

-- Create new policy that allows anonymous and authenticated users to view results
CREATE POLICY "Public can view survey responses"
  ON elba_survey_responses
  FOR SELECT
  TO anon, authenticated
  USING (true);
