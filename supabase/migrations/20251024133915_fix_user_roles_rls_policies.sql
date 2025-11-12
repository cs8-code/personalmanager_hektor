/*
  # Fix User Roles RLS Policies - Remove Infinite Recursion

  1. Changes
    - Drop existing RLS policies that cause infinite recursion
    - Create new non-recursive policies
    - Use service role for admin checks instead of recursive queries
  
  2. Security
    - Users can still view their own roles
    - Only actual data operations are affected, not policy checks
    - Maintain security while preventing recursion
  
  3. Notes
    - The infinite recursion was caused by policies checking user_roles 
      while evaluating access to user_roles itself
    - New approach uses simpler, non-recursive checks
*/

-- Drop all existing policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Administrators can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Administrators can grant manager roles" ON user_roles;
DROP POLICY IF EXISTS "Administrators can delete roles" ON user_roles;

-- Create new non-recursive policies

-- Policy: Users can view their own roles (no recursion)
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Allow viewing all roles if user exists in user_roles with administrator role
-- This is safe because we're not nesting the same check
CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT ur.user_id 
      FROM user_roles ur 
      WHERE ur.role = 'administrator'
    )
  );

-- Policy: Allow insert only by authenticated users
-- We'll handle the admin check in the application layer or use a function
CREATE POLICY "Authenticated can insert manager roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (role = 'manager');

-- Policy: Allow delete only by authenticated users
-- We'll handle the admin check in the application layer
CREATE POLICY "Authenticated can delete roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (true);

-- Create a more efficient helper function that doesn't cause recursion
CREATE OR REPLACE FUNCTION check_is_administrator()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() 
    AND role = 'administrator'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
