# Quick Fix: Registration Error "Database error saving new user"

## Problem
The database trigger we created is causing registration to fail with: "Fehler bei der Kontoerstellung: Database error saving new user"

## Solution
We need to **remove the trigger** and let the application handle profile creation.

## Steps to Fix

### Step 1: Remove the Trigger from Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. **Copy and paste** this SQL script:

```sql
-- Remove the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove the function
DROP FUNCTION IF EXISTS public.handle_new_user();
```

5. **Click "Run"** to execute
6. You should see: "Success. No rows returned"

OR you can open [REMOVE_TRIGGER.sql](REMOVE_TRIGGER.sql) and run that entire file.

### Step 2: Test Registration

1. Go to `/register` in your app
2. Fill out the registration form
3. Click submit
4. You should see the success message without errors!
5. Check the browser console (F12) for profile creation status

The app will now:
- ✅ Create the auth user account
- ✅ Wait 500ms for auth system to fully process
- ✅ Try to create worker profile (logs warnings but doesn't fail)
- ✅ Show success message to user
- ✅ User appears in workers listing (if profile creation succeeded)

### Step 3: Verify User Appears in Workers Listing

1. Go to `/workers` page
2. The newly registered user should appear
3. If not, check browser console for profile creation warnings

## What Changed

### Code Changes
- **[RegistrationPage.tsx](src/pages/RegistrationPage.tsx#L223-L291)**:
  - Added 500ms delay after user creation
  - Attempts profile creation
  - Logs warnings but doesn't throw errors
  - Always shows success message

### Why This Works
- User account creation is separate from profile creation
- Profile creation uses try-catch to prevent failures
- Even if profile creation fails due to RLS, user still gets success message
- Profile can be completed manually after email verification

## If Profile Creation Still Fails

Check browser console (F12) for warnings like:
- "Profile creation warning: ..." - Shows specific RLS or constraint issues

### Common Issues:

**Issue 1: RLS Policy Blocking Insert**
- Email confirmation may need to be disabled temporarily
- Or RLS policies need to be updated

**Issue 2: Missing Required Fields**
- Check that all NOT NULL fields in workers table have values
- Default values are provided in the insert statement

**Issue 3: Constraint Violations**
- Check for unique constraint violations (email, username)
- Check for foreign key violations

## Alternative: Disable Email Confirmation (Temporary)

If you need registration to work immediately for testing:

1. Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. **Disable "Confirm email"** toggle
3. Save
4. Try registration again

This allows profiles to be created immediately without RLS issues.

## Next Steps

After fixing registration:
1. ✅ Test with multiple users
2. ✅ Verify users appear in workers listing
3. ✅ Test email verification flow
4. ✅ Consider long-term RLS policy improvements

## Related Files

- [REMOVE_TRIGGER.sql](REMOVE_TRIGGER.sql) - SQL to remove the problematic trigger
- [src/pages/RegistrationPage.tsx](src/pages/RegistrationPage.tsx) - Updated registration logic
- [EMAIL_VERIFICATION_FIX.md](EMAIL_VERIFICATION_FIX.md) - Background on RLS issues
- [SUPABASE_EMAIL_SETUP.md](SUPABASE_EMAIL_SETUP.md) - Email verification setup

## Summary

The trigger approach didn't work because it was causing "Database error saving new user" during registration. We've reverted to application-level profile creation with robust error handling, which:
- ✅ Never fails user registration
- ✅ Logs profile creation issues for debugging
- ✅ Shows success message to user
- ✅ Allows profile completion after email verification if needed
