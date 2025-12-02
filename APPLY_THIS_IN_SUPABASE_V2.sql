-- =====================================================
-- RUN THIS IN SUPABASE DASHBOARD → SQL EDITOR
-- =====================================================
-- This creates a database trigger that automatically creates
-- worker profiles when new users register
-- Version 2: With proper error handling
-- =====================================================

-- Function to create worker profile after user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Wrap in exception handler so registration doesn't fail if profile creation fails
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
      COALESCE(NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')), ''), 'Neuer Benutzer'),
      COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''), 'user_' || substr(NEW.id::text, 1, 8)),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      CASE
        WHEN NEW.raw_user_meta_data->>'birth_date' IS NOT NULL AND NEW.raw_user_meta_data->>'birth_date' != ''
        THEN (NEW.raw_user_meta_data->>'birth_date')::date
        ELSE NULL
      END,
      COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
      COALESCE(NEW.raw_user_meta_data->>'city', ''),
      COALESCE(NEW.raw_user_meta_data->>'employment_type', NULL),
      COALESCE(NEW.raw_user_meta_data->>'company_name', NULL),
      COALESCE(NEW.raw_user_meta_data->>'company_address', NULL),
      CASE
        WHEN NEW.raw_user_meta_data->>'qualifications' IS NOT NULL
        THEN (NEW.raw_user_meta_data->>'qualifications')::jsonb
        ELSE '[]'::jsonb
      END,
      CASE
        WHEN NEW.raw_user_meta_data->>'languages' IS NOT NULL
        THEN (NEW.raw_user_meta_data->>'languages')::jsonb
        ELSE '[]'::jsonb
      END,
      COALESCE(NEW.raw_user_meta_data->>'work_days', NULL),
      COALESCE(NEW.raw_user_meta_data->>'shifts', NULL),
      COALESCE(NEW.raw_user_meta_data->>'smoking_status', NULL),
      COALESCE(NEW.raw_user_meta_data->>'arbeitsort', NULL),
      COALESCE(NEW.raw_user_meta_data->>'remarks', NULL),
      COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'availability_status'), ''), 'sofort verfügbar'),
      COALESCE(NEW.raw_user_meta_data->>'city', ''),
      0,
      '',
      '',
      ''
    )
    ON CONFLICT (id) DO NOTHING;

    -- If user is selbständig, create company profile
    IF COALESCE(NEW.raw_user_meta_data->>'employment_type', '') = 'selbständig' THEN
      BEGIN
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
          COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'company_name'), ''), 'Firma'),
          COALESCE(NEW.raw_user_meta_data->>'company_address', NULL),
          COALESCE(NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')), ''), 'Kontakt'),
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
        )
        ON CONFLICT (id) DO NOTHING;
      EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail the trigger
        RAISE WARNING 'Failed to create company profile for user %: %', NEW.id, SQLERRM;
      END;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the user registration
    RAISE WARNING 'Failed to create worker profile for user %: %', NEW.id, SQLERRM;
  END;

  -- Always return NEW so the user registration succeeds
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

-- =====================================================
-- DONE! Now test by registering a new user
-- =====================================================
