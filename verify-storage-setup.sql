-- Verification script for profile-pictures storage bucket setup
-- Run this in your Supabase SQL Editor to verify the setup

-- 1. Check if the storage bucket exists
SELECT
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id = 'profile-pictures';

-- Expected result: 1 row with id='profile-pictures', public=true

-- 2. Check storage policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%profile picture%';

-- Expected result: 4 rows with policies for INSERT, UPDATE, DELETE, and SELECT

-- 3. List all storage policies for the objects table (to see what exists)
SELECT
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;