-- =====================================================
-- RUN THIS IN SUPABASE DASHBOARD → SQL EDITOR
-- =====================================================
-- This removes the trigger that's causing registration issues
-- =====================================================

-- Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- =====================================================
-- DONE! Trigger removed
-- =====================================================
