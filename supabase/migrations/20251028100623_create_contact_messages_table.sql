/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `name` (text) - Name of the person contacting
      - `email` (text) - Email address of the person
      - `phone` (text, nullable) - Optional phone number
      - `subject` (text) - Subject of the message
      - `message` (text) - Message content
      - `status` (text) - Status of the message (new, read, replied)
      - `created_at` (timestamptz) - When the message was submitted
      - `updated_at` (timestamptz) - When the message was last updated
  
  2. Security
    - Enable RLS on `contact_messages` table
    - Allow anyone to insert messages (public contact form)
    - Only admins can read and update messages
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.created_by = auth.uid()
      AND workers.user_role = 'admin'
    )
  );

CREATE POLICY "Admins can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.created_by = auth.uid()
      AND workers.user_role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.created_by = auth.uid()
      AND workers.user_role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
