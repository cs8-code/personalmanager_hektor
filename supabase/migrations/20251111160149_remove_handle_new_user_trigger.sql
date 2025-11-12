/*
  # Remove handle_new_user trigger

  1. Changes
    - Drop the trigger that automatically creates profiles on user signup
    - We're now handling worker profile creation manually in the registration flow
    
  2. Reason
    - The old trigger was trying to insert into profiles table with a role column that doesn't exist
    - We're using the workers table instead and creating records manually after auth signup
*/

-- Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();
