-- Allow public to view companies
-- This enables workers to see which companies are available

CREATE POLICY "Anyone can view companies"
  ON companies
  FOR SELECT
  TO public
  USING (true);