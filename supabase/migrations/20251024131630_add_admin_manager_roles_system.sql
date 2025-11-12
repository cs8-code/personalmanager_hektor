/*
  # Add Administrator and Manager Roles System

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text, CHECK constraint for 'administrator' or 'manager')
      - `granted_by` (uuid, references auth.users - the admin who granted the role)
      - `granted_at` (timestamp)
      - `created_at` (timestamp)
    
  2. Changes to Existing Tables
    - Add `created_by` column to workers table to track who created the entry
    - Keep user_role in workers table (keeps 'Subunternehmer' or 'SIPO')
    - user_roles table handles platform roles (administrator/manager) separately
  
  3. Security
    - Enable RLS on user_roles table
    - Administrators can view all user roles
    - Managers can view their own role
    - Only administrators can grant manager roles
    - Administrators can read, edit, and delete all workers entries
    - Managers can create workers entries and edit/delete only their own
    - Regular users can only read workers entries
  
  4. Notes
    - Administrator role cannot be granted through the UI
    - Administrator role must be manually assigned in the database
    - Only administrators can grant manager roles to other users
    - The user_role field in workers table remains unchanged (business role)
    - The user_roles table handles platform permissions (admin/manager)
*/

-- Create user_roles table for platform roles
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('administrator', 'manager')),
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Add created_by column to workers table to track who created the entry
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE workers ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- RLS Policies for user_roles table

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Administrators can view all roles
CREATE POLICY "Administrators can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'administrator'
    )
  );

-- Policy: Only administrators can insert manager roles
CREATE POLICY "Administrators can grant manager roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'administrator'
    )
    AND role = 'manager'
  );

-- Policy: Only administrators can delete roles
CREATE POLICY "Administrators can delete roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'administrator'
    )
  );

-- Update workers table RLS policies for admin and manager access

-- Drop existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view workers" ON workers;
  DROP POLICY IF EXISTS "Users can insert own worker profile" ON workers;
  DROP POLICY IF EXISTS "Users can update own worker profile" ON workers;
  DROP POLICY IF EXISTS "Users can delete own worker profile" ON workers;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Policy: Everyone (including unauthenticated) can view workers
CREATE POLICY "Everyone can view workers"
  ON workers FOR SELECT
  USING (true);

-- Policy: Authenticated users with manager or admin role can insert workers
CREATE POLICY "Managers and admins can insert workers"
  ON workers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('administrator', 'manager')
    )
  );

-- Policy: Administrators can update any worker
CREATE POLICY "Administrators can update any worker"
  ON workers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'administrator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'administrator'
    )
  );

-- Policy: Managers can update workers they created
CREATE POLICY "Managers can update own workers"
  ON workers FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

-- Policy: Administrators can delete any worker
CREATE POLICY "Administrators can delete any worker"
  ON workers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'administrator'
    )
  );

-- Policy: Managers can delete workers they created
CREATE POLICY "Managers can delete own workers"
  ON workers FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

-- Create helper functions

-- Check if user is administrator
CREATE OR REPLACE FUNCTION is_administrator(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid AND role = 'administrator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is manager
CREATE OR REPLACE FUNCTION is_manager(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid AND role = 'manager'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has any elevated role (admin or manager)
CREATE OR REPLACE FUNCTION has_elevated_role(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_uuid AND role IN ('administrator', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
