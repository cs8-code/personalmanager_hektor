/*
  # Fix RLS Policies for Performance

  1. Performance Improvements
    - Replace all auth.uid() calls with (select auth.uid()) in RLS policies
    - This prevents re-evaluation of auth.uid() for each row
    - Significantly improves query performance at scale
  
  2. Tables Updated
    - profiles: 3 policies
    - workers: 5 policies  
    - user_roles: 1 policy
    - jobs: 4 policies
    - contact_messages: 2 policies
*/

-- Drop and recreate profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- Drop and recreate workers policies
DROP POLICY IF EXISTS "Managers and admins can insert workers" ON workers;
DROP POLICY IF EXISTS "Administrators can update any worker" ON workers;
DROP POLICY IF EXISTS "Managers can update own workers" ON workers;
DROP POLICY IF EXISTS "Administrators can delete any worker" ON workers;
DROP POLICY IF EXISTS "Managers can delete own workers" ON workers;

CREATE POLICY "Managers and admins can insert workers"
  ON workers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

CREATE POLICY "Administrators can update any worker"
  ON workers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'administrator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'administrator'
    )
  );

CREATE POLICY "Managers can update own workers"
  ON workers
  FOR UPDATE
  TO authenticated
  USING (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'manager'
    )
  )
  WITH CHECK (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'manager'
    )
  );

CREATE POLICY "Administrators can delete any worker"
  ON workers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'administrator'
    )
  );

CREATE POLICY "Managers can delete own workers"
  ON workers
  FOR DELETE
  TO authenticated
  USING (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role = 'manager'
    )
  );

-- Drop and recreate user_roles policies
DROP POLICY IF EXISTS "Users read own role" ON user_roles;

CREATE POLICY "Users read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate jobs policies
DROP POLICY IF EXISTS "Managers can view own jobs" ON jobs;
DROP POLICY IF EXISTS "Managers can create jobs" ON jobs;
DROP POLICY IF EXISTS "Managers can update own jobs" ON jobs;
DROP POLICY IF EXISTS "Managers can delete own jobs" ON jobs;

CREATE POLICY "Managers can view own jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

CREATE POLICY "Managers can create jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

CREATE POLICY "Managers can update own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role IN ('manager', 'administrator')
    )
  )
  WITH CHECK (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

CREATE POLICY "Managers can delete own jobs"
  ON jobs
  FOR DELETE
  TO authenticated
  USING (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = (select auth.uid())
      AND user_roles.role IN ('manager', 'administrator')
    )
  );

-- Drop and recreate contact_messages policies
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;

CREATE POLICY "Admins can view all contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.created_by = (select auth.uid())
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
      WHERE workers.created_by = (select auth.uid())
      AND workers.user_role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workers
      WHERE workers.created_by = (select auth.uid())
      AND workers.user_role = 'admin'
    )
  );
