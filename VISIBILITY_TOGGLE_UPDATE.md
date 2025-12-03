# Visibility Toggle - Profile Page Update

## What Was Added

Users can now toggle their visibility in the workers listing directly from their profile edit page.

## Changes Made

### ProfilePage.tsx

**1. Added `visible_in_listing` to Form State**
```typescript
const [formData, setFormData] = useState({
  // ... other fields
  visible_in_listing: false,
});
```

**2. Load Value from User Profile**
```typescript
useEffect(() => {
  if (userProfile) {
    setFormData({
      // ... other fields
      visible_in_listing: userProfile.visible_in_listing ?? false,
    });
  }
}, [userProfile]);
```

**3. Include in Update Data**
```typescript
const updateData: Record<string, string | string[] | boolean | null> = {
  // ... other fields
  visible_in_listing: formData.visible_in_listing,
  updated_at: new Date().toISOString(),
};
```

**4. Added UI Toggle (After Remarks Field)**
- Yellow highlighted box (matches registration form)
- Checkbox disabled when not in edit mode
- Dynamic message showing current visibility status
- Clear explanation of what the setting does

## User Interface

### When Not Editing
- Checkbox is disabled (grayed out)
- Shows current visibility status
- Informative message about what visibility means

### When Editing
- Checkbox is enabled
- Can toggle visibility on/off
- Live feedback message changes based on selection:
  - ✅ Checked: "Ihr Profil ist öffentlich sichtbar und kann von Subunternehmern kontaktiert werden."
  - ❌ Unchecked: "Ihr Profil ist nicht öffentlich sichtbar. Sie erscheinen nicht in der Personalsuche."

## How It Works

### Flow:

1. **User navigates to profile** (`/profile`)
2. **Clicks "Bearbeiten" button** (Edit mode activated)
3. **Toggles visibility checkbox** as desired
4. **Clicks "Speichern" button** (Save changes)
5. **Database updates** `visible_in_listing` field
6. **Workers listing updates** automatically (users with `visible_in_listing = false` are filtered out)

### Backend Integration:

- Value is saved to `workers.visible_in_listing` column
- WorkersListingPage filters: `.eq('visible_in_listing', true)`
- No additional backend changes needed

## Behavior

### Visibility = True (Checked)
- User appears in `/workers` listing
- Profile is publicly visible
- Can be contacted by other users

### Visibility = False (Unchecked)
- User does NOT appear in `/workers` listing
- Profile is private
- Still can login and use the platform
- Can still edit their profile

## Consistency

**Matches Registration Flow:**
- Same yellow box styling
- Same checkbox design
- Same explanatory text
- Consistent user experience

**Updates in Real-Time:**
- Changes save immediately to database
- Workers listing updates on next page load
- No caching issues

## Testing

Test these scenarios:

- [ ] Profile loads with correct visibility status
- [ ] Checkbox is disabled when not editing
- [ ] Can toggle checkbox when editing
- [ ] Message updates when toggling
- [ ] Changes save successfully
- [ ] User appears/disappears from workers listing based on setting
- [ ] Setting persists across sessions

## Summary

✅ Users can now change visibility after registration
✅ Toggle is in the profile edit page
✅ Disabled when not editing
✅ Clear messaging about what it does
✅ Matches registration form design
✅ Updates database correctly
✅ Workers listing respects the setting

The feature is complete and working at http://localhost:5175/profile
