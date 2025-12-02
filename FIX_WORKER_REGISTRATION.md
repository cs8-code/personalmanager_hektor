# Fix: New Users Not Appearing in Workers Listing

## Problem

After enabling email verification, new user registrations were not creating entries in the workers table. This happened because:

1. **Email confirmation required** - User accounts are created but not confirmed yet
2. **RLS policies block unconfirmed users** - Row Level Security prevents profile creation for unconfirmed users
3. **No worker profile = No listing** - Users don't appear in the workers listing page

## Solution: Database Trigger

We've implemented a **database trigger** that automatically creates worker profiles when new users register. This trigger:

- ✅ Runs automatically when a new user account is created
- ✅ Uses `SECURITY DEFINER` privileges to bypass RLS policies
- ✅ Reads user data from registration form metadata
- ✅ Creates both worker profile AND company profile (for selbständig users)
- ✅ Handles profile creation even before email confirmation

## Steps to Apply the Fix

### Step 1: Apply the Database Trigger

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Open the file: `APPLY_THIS_IN_SUPABASE.sql`
5. Copy the entire SQL script
6. Paste it in the SQL Editor
7. Click **Run** or press `Ctrl+Enter`

You should see a success message: "Success. No rows returned"

### Step 2: Verify the Trigger Was Created

Run this query in SQL Editor to check:

```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
```

You should see both the trigger and function listed.

### Step 3: Test Registration

1. Go to your app's registration page: `/register`
2. Register a new test account with all required fields
3. Check your email for the verification link
4. Go to **Supabase Dashboard** → **Authentication** → **Users**
5. You should see the new user (with `email_confirmed_at` = null until they verify)
6. Go to **Table Editor** → **workers** table
7. **The new user should appear here immediately!** (even before email verification)

### Step 4: Verify Workers Listing Page

1. Go to `/workers` in your app
2. The newly registered user should appear in the listing
3. Their profile should show all the data they entered during registration

## How It Works

### Old Registration Flow (Broken):
```
1. User fills registration form
2. Frontend creates Supabase auth user
3. Frontend tries to insert worker profile → BLOCKED BY RLS
4. Registration shows success but no profile created
5. User doesn't appear in workers listing ❌
```

### New Registration Flow (Fixed):
```
1. User fills registration form
2. Frontend creates Supabase auth user with metadata
3. Database trigger fires automatically
4. Trigger creates worker profile (bypasses RLS with SECURITY DEFINER)
5. Registration shows success AND profile exists
6. User appears in workers listing immediately ✅
```

## What Changed in the Code

### RegistrationPage.tsx
- **Before**: Manually tried to create worker profile (failed due to RLS)
- **After**: Only creates auth user - trigger handles profile creation
- **Result**: Cleaner code, fewer errors, automatic profile creation

### Database
- **New function**: `handle_new_user()` - Creates worker profile from user metadata
- **New trigger**: `on_auth_user_created` - Runs function after user signup
- **Security**: Uses `SECURITY DEFINER` to bypass RLS policies safely

## Troubleshooting

### Issue: User still doesn't appear in workers listing

**Check 1: Was the trigger created?**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
If no results, go back to Step 1 and apply the SQL script.

**Check 2: Check function logs**
```sql
-- Check if profile was created
SELECT id, email, name, username FROM workers ORDER BY created_at DESC LIMIT 5;
```

**Check 3: Test with a new user**
- Delete test users from **Authentication** → **Users**
- Delete test profiles from **Table Editor** → **workers**
- Register a completely new user
- Check workers table again

### Issue: Trigger error in Supabase logs

Go to **Database** → **Database Webhooks** → Logs

Common issues:
- **Missing fields**: Check that all required worker fields have COALESCE with defaults
- **Data type mismatch**: Check that metadata is cast correctly (e.g., `::date`, `::jsonb`)
- **Constraint violation**: Check that workers table constraints allow null values

### Issue: Company profile not created for selbständig users

Check the companies table:
```sql
SELECT * FROM companies WHERE id IN (
  SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 5
);
```

If missing, the trigger may have an error in the company INSERT section.

## Benefits of This Approach

1. ✅ **Automatic**: No manual profile creation needed
2. ✅ **Reliable**: Works even with email confirmation enabled
3. ✅ **Secure**: Uses proper database privileges
4. ✅ **Clean**: Separation of concerns (auth vs profile creation)
5. ✅ **Maintainable**: All profile creation logic in one place (database)

## Alternative Approaches (Not Recommended)

### Option 1: Disable Email Confirmation
- **Pros**: Quick fix, no database changes
- **Cons**: Users don't verify emails, less secure

### Option 2: Update RLS Policies
- **Pros**: No triggers needed
- **Cons**: Complex policies, may still have issues with unconfirmed users

### Option 3: Use Database Trigger (RECOMMENDED) ✅
- **Pros**: Most reliable, clean separation, works with email confirmation
- **Cons**: Requires SQL knowledge, one-time setup

We chose **Option 3** because it's the most robust long-term solution.

## Next Steps

After applying this fix:

1. ✅ Test registration with new users
2. ✅ Verify users appear in workers listing
3. ✅ Test email verification flow
4. ✅ Test company profiles for selbständig users
5. ✅ Update [EMAIL_VERIFICATION_FIX.md](EMAIL_VERIFICATION_FIX.md) to mark this as implemented

## Related Files

- `APPLY_THIS_IN_SUPABASE.sql` - SQL script to create trigger
- `supabase/migrations/20251202000000_create_handle_new_user_trigger.sql` - Migration file
- `src/pages/RegistrationPage.tsx` - Simplified registration code
- `EMAIL_VERIFICATION_FIX.md` - Original problem documentation
- `SUPABASE_EMAIL_SETUP.md` - Email verification setup guide
