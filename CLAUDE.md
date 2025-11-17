# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ Architecture Documentation

**IMPORTANT:** This project has a comprehensive architecture implementation. Before making changes, review:

1. **[ARCHITECTURE_README.md](./ARCHITECTURE_README.md)** - Quick start guide
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture documentation
3. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - How to use new patterns
4. **[ARCHITECTURE_SUMMARY.md](./ARCHITECTURE_SUMMARY.md)** - Executive summary

**Key Architecture Patterns:**
- ✅ **Service Layer** - Use `src/services/` for data operations (NOT direct Supabase calls)
- ✅ **Custom Hooks** - Use `src/hooks/` for data fetching and business logic
- ✅ **Centralized Types** - Import from `src/types/` (NOT local interfaces)
- ✅ **Constants** - Use `src/constants/` (NO magic strings)
- ✅ **Toast Notifications** - Use `useToast()` hook (NOT alert())
- ✅ **Reusable Components** - Use components from `src/components/`

## Project Overview

Personal Manager Hektor (siportal) is a personnel/recruitment management platform built with React + TypeScript + Vite + Supabase. It enables job posting, worker profiles, contract management, and connects employers with workers.

**Tech Stack:**
- React 18.3.1 + TypeScript 5.5.3
- Vite 5.4.2 (build tool)
- Supabase 2.57.4 (backend, auth, database, storage)
- React Router DOM 7.9.4
- Tailwind CSS 3.4.1
- Lucide React 0.344.0 (icons)
- React Hot Toast 2.x (notifications)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking (no emit)
npm run typecheck
```

## Environment Setup

Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Architecture

### Authentication & Authorization

**AuthContext** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)) is the central auth system:
- Provides `useAuth()` hook for accessing auth state
- Manages Supabase session and user profile data
- Fetches user profile from `workers` table and system role from `user_roles` table
- Exports `UserProfile` interface (lines 5-32) with comprehensive worker data

**System Roles** (stored in `user_roles` table):
- `administrator`: Full system access, grant manager roles, manage all data
- `manager`: Create/manage workers, post jobs, manage contracts
- Regular users: Can register profile, view listings, send contact requests

**Access Control Pattern:**
```typescript
// Check if user is manager or admin
const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';

// Use in components to conditionally render or enable features
if (isManager) {
  // Manager-only functionality
}
```

**Row-Level Security (RLS)** is the primary security mechanism:
- All tables have RLS policies in Supabase
- Policies use `auth.uid()` to enforce user-specific access
- UI checks are supplementary; database policies are authoritative

### Database Schema

**Key Tables** (migrations in `supabase/migrations/`):

1. **workers** - User/worker profiles
   - Core fields: id, name, email, phone, qualifications[], availability_status, location, experience_years, bio, image_url
   - Extended fields: birth_date, username, gender, city, employment_type, company_name, company_address, languages[], work_days, shifts, smoking_status, arbeitsort, remarks
   - `created_by`: UUID reference to auth.users (tracks which manager created this worker)
   - Created in: `20251023100311_create_workers_table.sql`

2. **user_roles** - Platform permissions (admin/manager)
   - Fields: id, user_id, role (administrator|manager), granted_by, granted_at
   - Separate from business roles in workers table
   - Created in: `20251024131630_add_admin_manager_roles_system.sql`

3. **jobs** - Job postings
   - Fields: id, title, description, company, location, employment_type, experience_required, salary_range, requirements[], benefits[], contact_email, contact_phone, status, created_by
   - Status: active|closed|draft
   - Created in: `20251024151034_create_jobs_table.sql`

4. **contracts** - Contract/project postings
   - Fields: id, user_id, company_id, contact_name, company_name, company_address, contact_email, contact_phone, location, start_date, end_date, num_workers, description, status
   - Created in: `20251111173112_create_contracts_table.sql`

5. **companies** - Company information
   - Created in: `20251111134005_create_companies_table.sql`

6. **contact_requests** - Worker contact requests from companies
   - Created in: `20251112125706_create_contact_requests_table.sql`

7. **contact_messages** - Contact form submissions
   - Created in: `20251028100623_create_contact_messages_table.sql`

8. **posts & comments** - Community forum functionality
   - Created in: `20251028114200_create_posts_and_comments_tables.sql`

### Routing Structure

All routes defined in [src/App.tsx](src/App.tsx) (lines 36-54):

- `/` - Landing page (PersonalmanagerHektorPage)
- `/siportal` - Main portal (HomePage)
- `/register` - User registration
- `/workers` - Browse workers
- `/workers/:id` - Worker details
- `/profile` - User's own profile (protected)
- `/admin` - Admin panel (administrator only)
- `/manager` - Manager dashboard (manager/admin only)
- `/jobs` - Browse job postings
- `/jobs/:id` - Job details
- `/jobs-management` - Create/edit jobs (manager/admin only)
- `/contracts` - Browse contracts
- `/contracts/:id` - Contract details
- `/contracts-management` - Manage contracts (authenticated)
- `/service/:serviceId` - Service information
- `/subcontractor-guide` - Guide for subcontractors
- `/sipo-news` - News/updates

All route components are lazy-loaded with React.lazy() and Suspense for code splitting.

### Key Utilities

**Supabase Client** ([src/lib/supabase.ts](src/lib/supabase.ts)):
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Date Utils** ([src/utils/dateUtils.ts](src/utils/dateUtils.ts)):
```typescript
calculateAge(birthDate: string): number | null
```

**Status Utils** ([src/utils/statusUtils.tsx](src/utils/statusUtils.tsx)):
```typescript
getStatusColor(status: string): string  // Returns Tailwind classes
getStatusIcon(status: string, size?: string): JSX.Element
```

Availability statuses:
- 'sofort verfügbar'
- 'demnächst verfügbar'
- 'Minijob beschäftigt und teilzeit arbeitssuchend'
- 'aktuell beschäftigt'

### Important Components

**Navbar** ([src/components/Navbar.tsx](src/components/Navbar.tsx)):
- Responsive navigation with mobile menu
- User profile dropdown when logged in
- Real-time notification count for contact_requests (uses Supabase Realtime)
- Login modal trigger

**ImageUpload** ([src/components/ImageUpload.tsx](src/components/ImageUpload.tsx)):
- Drag-drop or click to upload
- Uploads to Supabase Storage bucket: `profile-pictures`
- Path format: `userId/profile.ext`
- Validates file type and size (<5MB)
- Deletes old image on replacement
- Optional auto-save to workers table

**LoginModal** ([src/components/LoginModal.tsx](src/components/LoginModal.tsx)):
- Email/password authentication via Supabase Auth
- Password visibility toggle
- Error handling and validation

**AdminPanel** ([src/components/AdminPanel.tsx](src/components/AdminPanel.tsx)):
- Grant manager roles to users
- View all user roles
- Manage contact messages
- Tabbed interface for different admin functions

**RegistrationPage** ([src/pages/RegistrationPage.tsx](src/pages/RegistrationPage.tsx)):
- Comprehensive registration form (940+ lines)
- Creates Supabase Auth user + worker profile in one transaction
- Fields: personal info, employment details, qualifications, languages, work preferences, availability

### Common Patterns

**Supabase Data Operations:**
```typescript
// Fetch
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value);

// Insert
await supabase.from('table').insert(data);

// Update
await supabase.from('table').update(data).eq('id', id);

// Delete
await supabase.from('table').delete().eq('id', id);
```

**Error Handling:**
```typescript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  // Handle data
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
}
```

**Form State Pattern:**
```typescript
const [formData, setFormData] = useState<FormType>(initialState);
const [errors, setErrors] = useState<string[]>([]);
const [loading, setLoading] = useState(false);

// Update form field
setFormData(prev => ({ ...prev, field: value }));

// Clear errors on input
setErrors([]);

// Validate before submit
const validationErrors = validateForm();
if (validationErrors.length > 0) {
  setErrors(validationErrors);
  return;
}
```

**Role-Protected Pages:**
```typescript
const { user, userProfile } = useAuth();
const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';

// Early return if not authorized
if (!user || !isManager) {
  return <div>Zugriff verweigert</div>;
}
```

### Storage

**Supabase Storage Bucket:** `profile-pictures`
- Public access for profile images
- Organization: `userId/profile.ext`
- Created in: `20251112133100_create_profile_pictures_storage.sql`

### Real-time Subscriptions

**Example** (from Navbar.tsx):
```typescript
const channel = supabase
  .channel('contact_requests')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'contact_requests' },
    () => fetchContactRequestsCount()
  )
  .subscribe();

// Cleanup
return () => { supabase.removeChannel(channel); };
```

### Localization

- All UI text is in German
- Validation messages in German
- German qualification and language options
- Consider this when adding new features

## Critical Notes

1. **RLS Policies Are Primary Security:** Always check RLS policies when adding new features. UI checks are supplementary.

2. **System Roles vs Business Roles:** The `systemRole` field in UserProfile (from `user_roles` table) determines platform permissions. The `role` field in workers table is for business categorization (currently unused).

3. **Manager Created Workers:** When managers create workers, set `created_by` to the manager's auth.uid(). This enables managers to manage only their workers via RLS policies.

4. **Image Uploads:** Use ImageUpload component for profile pictures. It handles storage, cleanup, and database updates automatically.

5. **Authentication Flow:** Registration creates both a Supabase Auth user AND a workers table entry. These must stay in sync.

6. **Contact Requests:** Workers can be contacted via the contact_requests table. The system tracks and notifies users in real-time.

7. **Lazy Loading:** All route components are lazy-loaded. When adding new routes, use React.lazy() for consistency.

8. **Type Safety:** Maintain TypeScript interfaces for all data structures. See AuthContext.tsx for UserProfile interface definition.
