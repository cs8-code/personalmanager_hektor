/*
  # Fix workers role field constraint

  1. Changes
    - Drop the CHECK constraint on the `role` column in workers table
    - The `role` column should store job position/title and can be any text or NULL
    - The `user_role` column continues to enforce 'Subunternehmer' or 'SIPO' constraint
  
  2. Reasoning
    - The `role` field is meant to store flexible job titles/positions (e.g., "Bauleiter", "Projektmanager")
    - The `user_role` field enforces the business rule of user type (Subunternehmer or SIPO)
    - These are two different concerns and should have different constraints
*/

-- Drop the CHECK constraint on role column
ALTER TABLE workers DROP CONSTRAINT IF EXISTS workers_role_check;
