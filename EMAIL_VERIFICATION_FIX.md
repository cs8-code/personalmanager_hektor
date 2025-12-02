# Email Verification Registration Fix

## Problem
After enabling email confirmation in Supabase, new user registration is failing because:
1. User account is created but NOT confirmed yet
2. Row Level Security (RLS) policies block creating worker profiles for unconfirmed users
3. Registration fails with error message

## Solution Options

### Option 1: Disable Email Confirmation (Quick Fix for Development)

**Steps:**
1. Go to Supabase Dashboard → Authentication → Providers → Email
2. **Disable "Confirm email"** toggle
3. Save

**Pros:**
- Registration works immediately
- No database changes needed
- Good for development/testing

**Cons:**
- Users don't verify their email
- Less secure
- Not recommended for production

---

### Option 2: Update RLS Policy to Allow Registration (Recommended)

This allows the worker profile to be created during registration, even before email confirmation.

**Step 1: Update the INSERT policy on the `workers` table**

Go to Supabase Dashboard → Database → workers table → Policies

Find the INSERT policy (probably named something like "Enable insert for authenticated users") and update it:

**Old Policy:**
```sql
auth.uid() = id
```

**New Policy (allows registration):**
```sql
-- Allow insert if user is registering (auth.uid() matches the id being inserted)
-- OR if user is authenticated and matches the id
auth.uid() = id
```

This policy already allows the insert, so the issue might be something else.

**Step 2: Check if there's a more restrictive policy**

Run this query in SQL Editor:
```sql
-- Check current policies on workers table
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
WHERE tablename = 'workers';
```

**Step 3: If needed, create a new policy for registration**

```sql
-- Create policy to allow users to create their own profile during registration
CREATE POLICY "Allow user self-registration"
ON workers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Also ensure users can read their own profile
CREATE POLICY "Users can view own profile"
ON workers
FOR SELECT
TO authenticated
USING (auth.uid() = id);
```

---

### Option 3: Move Profile Creation to Database Trigger (Advanced)

Create a database trigger that automatically creates the worker profile when a new auth user is created.

**Step 1: Create a function to handle new user registration**

```sql
-- Function to create worker profile after user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    COALESCE(NEW.raw_user_meta_data->>'birth_date', NULL),
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Step 2: Update RegistrationPage.tsx to remove manual profile creation**

Since the trigger handles it automatically, you can simplify the registration code.

---

## Recommended Approach for Development

For **development and testing**, I recommend **Option 1** (disable email confirmation temporarily).

For **production**, use **Option 2** (proper RLS policies) or **Option 3** (database trigger).

---

## Immediate Steps to Fix Registration

1. **Disable Email Confirmation temporarily:**
   - Supabase Dashboard → Authentication → Providers → Email
   - Turn OFF "Confirm email"
   - Save

2. **Test Registration:**
   - Try registering a new account
   - Should work immediately now

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Try registering
   - Look for detailed error messages

4. **Share Error Details:**
   - If registration still fails, the console will show:
     - "Auth error: [detailed error]"
     - "Profile creation error: [detailed error]"
     - "Company creation error: [detailed error]"
   - Share these error messages to diagnose further

---

## Long-term Solution

Once registration is working again, you can:

1. Re-enable email confirmation in Supabase
2. Implement Option 3 (database trigger) to handle profile creation automatically
3. This way:
   - Email confirmation works
   - Profile is created automatically
   - No RLS issues
   - Clean separation of concerns
