/*
  # Fix Security Issues - Add Missing Indexes

  1. Performance Improvements
    - Add index on `user_roles.granted_by` foreign key
    - Add index on `workers.created_by` foreign key
  
  2. Notes
    - These indexes improve query performance when joining on foreign keys
    - Foreign key columns should always be indexed for optimal performance
*/

-- Add index for user_roles.granted_by foreign key
CREATE INDEX IF NOT EXISTS idx_user_roles_granted_by ON user_roles(granted_by);

-- Add index for workers.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_workers_created_by ON workers(created_by);
