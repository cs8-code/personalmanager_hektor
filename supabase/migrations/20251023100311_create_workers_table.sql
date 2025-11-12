/*
  # Create Workers Table for Personalsuche

  1. New Tables
    - `workers`
      - `id` (uuid, primary key) - Unique identifier for each worker
      - `name` (text) - Full name of the worker
      - `email` (text, unique) - Email address for contact
      - `image_url` (text) - URL to profile image
      - `phone` (text) - Contact phone number
      - `qualifications` (text array) - List of qualifications (e.g., SiPO, Bauleiter, etc.)
      - `availability_status` (text) - Current availability status
      - `location` (text) - Current location/region
      - `experience_years` (integer) - Years of experience
      - `bio` (text) - Short bio/description
      - `created_at` (timestamptz) - When the profile was created
      - `updated_at` (timestamptz) - Last profile update

  2. Security
    - Enable RLS on `workers` table
    - Add policy for public read access (anyone can view available workers)
    - Add policy for authenticated users to update their own profiles
    - Add policy for authenticated users to insert their own profiles

  3. Notes
    - Availability statuses: 'sofort verfügbar', 'Minijob beschäftigt und teilzeit arbeitssuchend', 
      'aktuell beschäftigt', 'demnächst verfügbar'
    - Workers table is publicly readable to allow companies to find talent
*/

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  image_url text DEFAULT '',
  phone text DEFAULT '',
  qualifications text[] DEFAULT '{}',
  availability_status text NOT NULL DEFAULT 'sofort verfügbar',
  location text DEFAULT '',
  experience_years integer DEFAULT 0,
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view workers (public read access)
CREATE POLICY "Anyone can view workers"
  ON workers
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own profile
CREATE POLICY "Users can create their own profile"
  ON workers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'email' = email);

-- Policy: Authenticated users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON workers
  FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' = email)
  WITH CHECK (auth.jwt()->>'email' = email);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_workers_availability ON workers(availability_status);
CREATE INDEX IF NOT EXISTS idx_workers_location ON workers(location);
CREATE INDEX IF NOT EXISTS idx_workers_created_at ON workers(created_at DESC);