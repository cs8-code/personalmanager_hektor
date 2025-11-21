/*
  # Create ELBA Survey Table

  1. New Tables
    - `elba_survey_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - User who voted
      - `vote` (text) - 'thumbs_up' or 'thumbs_down'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `elba_survey_responses` table
    - Only authenticated users can vote
    - Users can only insert their own vote (one vote per user)
    - Everyone can read aggregate results

  3. Indexes
    - Index on user_id for faster lookups
    - Index on vote for aggregation queries
    - Unique index on user_id to prevent duplicate votes
*/

-- Create elba_survey_responses table
CREATE TABLE IF NOT EXISTS elba_survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote text NOT NULL CHECK (vote IN ('thumbs_up', 'thumbs_down')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE elba_survey_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view all responses (for aggregate stats)
CREATE POLICY "Anyone can view survey responses"
  ON elba_survey_responses
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert their own vote
CREATE POLICY "Authenticated users can vote"
  ON elba_survey_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own vote
CREATE POLICY "Users can update own vote"
  ON elba_survey_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_elba_survey_user_id ON elba_survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_elba_survey_vote ON elba_survey_responses(vote);

-- Ensure one vote per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_vote ON elba_survey_responses(user_id);
