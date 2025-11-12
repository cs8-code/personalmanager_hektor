/*
  # Create Contact Requests Table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `requester_id` (uuid, references auth.users) - User sending the request
      - `worker_id` (uuid, references workers) - Worker receiving the request
      - `status` (text) - 'pending', 'accepted', 'rejected'
      - `message` (text) - Optional message from requester
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `contact_requests` table
    - Requesters can view their own sent requests
    - Workers can view requests sent to them
    - Workers can update status of requests sent to them
    - Requesters can insert new requests

  3. Indexes
    - Index on requester_id for faster lookups
    - Index on worker_id for faster lookups
    - Index on status for filtering
*/

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Requesters can view their own sent requests
CREATE POLICY "Requesters can view own sent requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id);

-- Policy: Workers can view requests sent to them
CREATE POLICY "Workers can view requests sent to them"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = worker_id);

-- Policy: Requesters can insert new requests
CREATE POLICY "Authenticated users can send requests"
  ON contact_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

-- Policy: Workers can update status of requests sent to them
CREATE POLICY "Workers can update request status"
  ON contact_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = worker_id)
  WITH CHECK (auth.uid() = worker_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_requests_requester_id ON contact_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_worker_id ON contact_requests(worker_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);

-- Prevent duplicate pending requests
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_request 
  ON contact_requests(requester_id, worker_id) 
  WHERE status = 'pending';