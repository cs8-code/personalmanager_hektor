/*
  # Fix Function Search Paths

  1. Security Improvements
    - Add SECURITY DEFINER and SET search_path to all functions
    - This prevents search_path manipulation attacks
    - Ensures functions execute with a predictable schema search order
  
  2. Functions Updated
    - is_administrator
    - is_manager
    - has_elevated_role
    - check_is_administrator
    - update_jobs_updated_at
*/

-- Drop and recreate is_administrator function with secure search_path
DROP FUNCTION IF EXISTS is_administrator();
CREATE OR REPLACE FUNCTION is_administrator()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'administrator'
  );
END;
$$;

-- Drop and recreate is_manager function with secure search_path
DROP FUNCTION IF EXISTS is_manager();
CREATE OR REPLACE FUNCTION is_manager()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'manager'
  );
END;
$$;

-- Drop and recreate has_elevated_role function with secure search_path
DROP FUNCTION IF EXISTS has_elevated_role();
CREATE OR REPLACE FUNCTION has_elevated_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('manager', 'administrator')
  );
END;
$$;

-- Drop and recreate check_is_administrator function with secure search_path
DROP FUNCTION IF EXISTS check_is_administrator();
CREATE OR REPLACE FUNCTION check_is_administrator()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'administrator'
  ) THEN
    RAISE EXCEPTION 'Only administrators can perform this action';
  END IF;
END;
$$;

-- Drop and recreate update_jobs_updated_at function with secure search_path
DROP FUNCTION IF EXISTS update_jobs_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger since we dropped the function with CASCADE
DROP TRIGGER IF EXISTS update_jobs_updated_at_trigger ON jobs;
CREATE TRIGGER update_jobs_updated_at_trigger
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_jobs_updated_at();
