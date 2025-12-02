/*
  # Create trigger to handle new user registration

  1. Changes
    - Creates a function to automatically create worker profile when a new auth user is created
    - Creates a trigger that runs after INSERT on auth.users
    - Uses SECURITY DEFINER to bypass RLS policies

  2. Security
    - Function runs with DEFINER privileges (bypasses RLS)
    - Only creates profile for the new user (not for other users)
    - Uses user metadata from registration form
*/

-- Function to create worker profile after user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create worker profile if it doesn't exist yet
  INSERT INTO public.workers (
    id,
    email,
    name,
    username,
    phone,
    birth_date,
    gender,
    city,
    employment_type,
    company_name,
    company_address,
    qualifications,
    languages,
    work_days,
    shifts,
    smoking_status,
    arbeitsort,
    remarks,
    availability_status,
    location,
    experience_years,
    bio,
    company,
    image_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'birth_date')::date, NULL),
    COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'employment_type', NULL),
    COALESCE(NEW.raw_user_meta_data->>'company_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'company_address', NULL),
    COALESCE((NEW.raw_user_meta_data->>'qualifications')::jsonb, '[]'::jsonb),
    COALESCE((NEW.raw_user_meta_data->>'languages')::jsonb, '[]'::jsonb),
    COALESCE(NEW.raw_user_meta_data->>'work_days', NULL),
    COALESCE(NEW.raw_user_meta_data->>'shifts', NULL),
    COALESCE(NEW.raw_user_meta_data->>'smoking_status', NULL),
    COALESCE(NEW.raw_user_meta_data->>'arbeitsort', NULL),
    COALESCE(NEW.raw_user_meta_data->>'remarks', NULL),
    COALESCE(NEW.raw_user_meta_data->>'availability_status', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    0,
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING; -- Don't fail if profile already exists

  -- If user is selbständig, create company profile
  IF COALESCE(NEW.raw_user_meta_data->>'employment_type', '') = 'selbständig' THEN
    INSERT INTO public.companies (
      id,
      company_name,
      company_address,
      contact_person,
      email,
      phone
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_address', NULL),
      COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
    )
    ON CONFLICT (id) DO NOTHING; -- Don't fail if company already exists
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that runs after new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
