# Worker Visibility Control - Setup Instructions

## Overview

Users can now choose whether they want to appear on the Personalsuche (workers listing) page. This gives users privacy control and ensures only those who want to be contacted by other Subunternehmer appear in the public listing.

## Changes Made

### 1. Database Schema
- **New column**: `visible_in_listing` (boolean, default: false)
- Users must opt-in to be visible
- Privacy-first approach

### 2. Registration Form
- **New checkbox**: "Auf der Personalsuche-Seite sichtbar sein"
- Clear explanation of what visibility means
- Highlighted in yellow box for visibility
- Defaults to unchecked (private by default)

### 3. Workers Listing Page
- **Filter**: Only shows workers where `visible_in_listing = true`
- Workers who don't check the box won't appear in public listing
- Existing query: `.eq('visible_in_listing', true)`

## Setup Steps

### Step 1: Add Database Column

**Go to Supabase Dashboard** → SQL Editor and run:

```sql
-- Add visible_in_listing column
ALTER TABLE workers
ADD COLUMN IF NOT EXISTS visible_in_listing boolean DEFAULT false;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_workers_visible_in_listing ON workers(visible_in_listing);
```

Or open [ADD_VISIBILITY_FIELD.sql](ADD_VISIBILITY_FIELD.sql) and run it.

### Step 2: (Optional) Make Existing Workers Visible

If you want existing workers to be visible by default, run:

```sql
UPDATE workers SET visible_in_listing = true WHERE visible_in_listing IS NULL OR visible_in_listing = false;
```

**Warning**: This makes all existing users visible. Only do this if you have their consent.

### Step 3: Test the Feature

1. **Register a new user**:
   - Go to `/register`
   - Fill out the form
   - **Check the visibility checkbox**: "Auf der Personalsuche-Seite sichtbar sein"
   - Submit registration

2. **Verify user appears in listing**:
   - Go to `/workers`
   - The new user should appear (because they checked the box)

3. **Test privacy (no checkbox)**:
   - Register another test user
   - **Don't check** the visibility checkbox
   - Submit registration
   - Go to `/workers`
   - This user should NOT appear in the listing

### Step 4: Check Database

Verify the field was created:

```sql
-- Check column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'workers' AND column_name = 'visible_in_listing';

-- Check which workers are visible
SELECT id, email, name, visible_in_listing
FROM workers
ORDER BY created_at DESC;
```

## How It Works

### Registration Flow

```
User registers → Fills form → Checks/unchecks visibility checkbox
→ Profile created with visible_in_listing = true/false
→ User appears in listing ONLY if visible_in_listing = true
```

### Privacy Model

- **Opt-in by default**: Users must actively choose to be visible
- **Default**: `visible_in_listing = false` (private)
- **User control**: Users decide their own visibility

### Workers Listing Query

**Before:**
```typescript
.from('workers')
.select('*')
.order('created_at', { ascending: false });
```

**After:**
```typescript
.from('workers')
.select('*')
.eq('visible_in_listing', true)  // Only visible workers
.order('created_at', { ascending: false });
```

## UI Changes

### Registration Form

**New Section** (after Availability Status):

```
┌──────────────────────────────────────────┐
│ ☐ Auf der Personalsuche-Seite sichtbar  │
│   sein                                    │
│                                           │
│   Möchten Sie auf der Personalsuche-     │
│   Seite erscheinen und von anderen       │
│   Subunternehmern kontaktiert werden     │
│   können? Wenn Sie diese Option          │
│   aktivieren, wird Ihr Profil öffentlich │
│   in der Personalliste angezeigt.        │
└──────────────────────────────────────────┘
```

**Features:**
- ✅ Clear checkbox with label
- ✅ Detailed explanation
- ✅ Highlighted in yellow box
- ✅ Easy to spot and understand

## Future Enhancements

### Profile Page Toggle
Users could change visibility later in their profile settings:

```typescript
// In ProfilePage.tsx
<label>
  <input
    type="checkbox"
    checked={profile.visible_in_listing}
    onChange={handleVisibilityToggle}
  />
  In Personalsuche sichtbar sein
</label>
```

### Manager Override
Managers could see all workers (not just visible ones):

```typescript
const fetchWorkers = async () => {
  let query = supabase.from('workers').select('*');

  // Only filter if not manager
  if (!isManager) {
    query = query.eq('visible_in_listing', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  // ...
};
```

## Files Modified

1. **[supabase/migrations/20251202000001_add_visible_in_listing_to_workers.sql](supabase/migrations/20251202000001_add_visible_in_listing_to_workers.sql)**
   - Migration file for version control

2. **[ADD_VISIBILITY_FIELD.sql](ADD_VISIBILITY_FIELD.sql)**
   - SQL script to run in Supabase Dashboard

3. **[src/pages/RegistrationPage.tsx](src/pages/RegistrationPage.tsx)**
   - Added `visible_in_listing` to interface (line 38)
   - Added to form state (line 70)
   - Added checkbox UI (lines 653-672)
   - Added to profile insert (line 261)

4. **[src/pages/WorkerListingPage.tsx](src/pages/WorkerListingPage.tsx)**
   - Added filter: `.eq('visible_in_listing', true)` (line 107)

## Troubleshooting

### Issue: Workers still not appearing

**Check 1: Was the column added?**
```sql
SELECT * FROM information_schema.columns
WHERE table_name = 'workers' AND column_name = 'visible_in_listing';
```

**Check 2: Did user check the box?**
```sql
SELECT id, email, visible_in_listing FROM workers WHERE email = 'test@example.com';
```

**Check 3: Is the filter working?**
- Check browser console (F12) for errors
- Check Network tab for API response
- Verify query includes `visible_in_listing=eq.true`

### Issue: Existing workers disappeared

**Solution**: They need to opt-in. Either:
1. Update database: `UPDATE workers SET visible_in_listing = true WHERE id = 'user_id';`
2. Or have users update their profile settings (if you implement profile toggle)

### Issue: New registrations not setting visibility

**Check**: Console logs during registration
- Look for "Profile created successfully" or warnings
- Check if `visible_in_listing` field is included in INSERT statement

## Benefits

✅ **Privacy Control**: Users decide their own visibility
✅ **GDPR Compliant**: Opt-in model respects user consent
✅ **Spam Protection**: Reduces unwanted contact requests
✅ **User Experience**: Clear explanation during registration
✅ **Flexible**: Easy to extend with profile settings toggle

## Summary

- ✅ Database column added: `visible_in_listing` (boolean, default false)
- ✅ Registration form updated with visibility checkbox
- ✅ Workers listing filtered to show only visible users
- ✅ Privacy-first approach (opt-in required)
- ✅ Clear user communication about what visibility means

Users now have full control over whether they appear in the Personalsuche listing!
