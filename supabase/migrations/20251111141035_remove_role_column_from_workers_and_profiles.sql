/*
  # Remove role column from workers and profiles tables

  1. Changes
    - Drop the role column from workers table
    - Drop the role column from profiles table
    - These columns are no longer needed in the application

  2. Security
    - No RLS policy changes needed
*/

-- Drop the role column from workers table
ALTER TABLE workers DROP COLUMN IF EXISTS role;

-- Drop the role column from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS role;
