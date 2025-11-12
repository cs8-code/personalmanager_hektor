/*
  # Create jobs table

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key) - Unique identifier for the job
      - `title` (text, required) - Job title
      - `description` (text, required) - Detailed job description
      - `company` (text, required) - Company offering the job
      - `location` (text, required) - Job location
      - `employment_type` (text, required) - Type of employment (e.g., "Vollzeit", "Teilzeit", "Freelance")
      - `experience_required` (integer) - Years of experience required
      - `salary_range` (text) - Salary range information
      - `requirements` (text array) - List of job requirements
      - `benefits` (text array) - List of job benefits
      - `contact_email` (text, required) - Contact email for applications
      - `contact_phone` (text) - Contact phone number
      - `status` (text, required) - Job status ("active", "closed", "draft")
      - `created_by` (uuid, required) - User ID of the manager who created the job
      - `created_at` (timestamptz) - Timestamp when job was created
      - `updated_at` (timestamptz) - Timestamp when job was last updated

  2. Security
    - Enable RLS on `jobs` table
    - Policy: Anyone can view active jobs
    - Policy: Authenticated managers can view all jobs they created
    - Policy: Authenticated managers can create new jobs
    - Policy: Authenticated managers can update their own jobs
    - Policy: Authenticated managers can delete their own jobs
*/

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  employment_type text NOT NULL DEFAULT 'Vollzeit',
  experience_required integer DEFAULT 0,
  salary_range text,
  requirements text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  contact_email text NOT NULL,
  contact_phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active jobs
CREATE POLICY "Anyone can view active jobs"
  ON jobs
  FOR SELECT
  USING (status = 'active');

-- Policy: Authenticated users with manager/admin role can view all their jobs
CREATE POLICY "Managers can view own jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

-- Policy: Authenticated managers can create jobs
CREATE POLICY "Managers can create jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

-- Policy: Authenticated managers can update their own jobs
CREATE POLICY "Managers can update own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('manager', 'administrator')
    )
  )
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

-- Policy: Authenticated managers can delete their own jobs
CREATE POLICY "Managers can delete own jobs"
  ON jobs
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_created_by_idx ON jobs(created_by);
CREATE INDEX IF NOT EXISTS jobs_location_idx ON jobs(location);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_jobs_updated_at_trigger
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_jobs_updated_at();
