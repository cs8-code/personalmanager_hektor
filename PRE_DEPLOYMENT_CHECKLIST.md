# Pre-Deployment Checklist - Personalmanager HEKTOR & SIPORTAL

## 🔴 Critical - Must Complete Before Deployment

### Database & Backend

- [ ] **Run Pending Migration: Add Images to Posts**
  - Verify `post-images` storage bucket is created
  - Test RLS policies for image upload/delete

- [ ] **Verify All RLS Policies**
  - Test `workers` table policies (user can only edit their own profile)
  - Test `posts` and `business_posts` policies (authentication required)
  - Test `business_posts` access (only `selbständig` users)
  - Test `contact_requests` policies
  - Test `atws_listings` policies
  - Test storage bucket policies (`profile-pictures`, `post-images`, `atws-images`)

- [ ] **Database Indexes**
  - Add index on `workers.username` (for username availability checks)
  - Add index on `workers.visible_in_listing` (for worker listings)
  - Add index on `posts.created_at` (for post sorting)
  - Add index on `business_posts.created_at` (for post sorting)
  - Add index on `jobs.status` (for active job filtering)

- [ ] **Test Email Verification Flow**
  - Register new user
  - Verify email is sent
  - Click verification link
  - Ensure user can log in after verification
  - Test profile creation trigger after email verification

### Environment & Configuration

- [ ] **Environment Variables**
  - Verify `.env.local` is NOT committed to git
  - Create `.env.production` or use deployment platform's env vars
  - Set `VITE_SUPABASE_URL` to production URL
  - Set `VITE_SUPABASE_ANON_KEY` to production anon key
  - Verify no test/development URLs are hardcoded

- [ ] **Supabase Configuration**
  - Review and update email templates (verification, password reset)
  - Set proper redirect URLs for production domain
  - Configure SMTP settings for email delivery
  - Set up custom domain for Supabase (if applicable)
  - Enable rate limiting on auth endpoints
  - Review storage bucket size limits

### Security

- [ ] **Review All Auth Logic**
  - Test admin-only routes (`/admin`)
  - Test manager-only routes (`/manager`, `/jobs-management`)
  - Test authenticated-only routes (`/profile`, `/contracts-management`)
  - Verify `selbständig`-only access to Business Room
  - Test logout functionality

- [ ] **API Keys & Secrets**
  - Rotate Supabase anon key if it was ever exposed
  - Ensure service role key is NEVER exposed to frontend
  - Review all API endpoints for proper authentication

- [ ] **Input Validation**
  - Test XSS protection in all text inputs
  - Test SQL injection protection (Supabase handles this)
  - Validate file uploads (type, size limits)
  - Test form validation on all forms

### Content & Data

- [ ] **Update Placeholder Content**
  - Replace placeholder company info in footers:
    - `Musterstraße 123, 12345 Musterstadt` → Real address
    - `+49 (0) 123 456 7890` → Real phone number
    - `info@hektor.de` → Real email address
  - Update legal pages:
    - `/impressum` - Add real company information
    - `/privacy-policy` - Review GDPR compliance
    - `/terms-of-service` - Review and update terms

- [ ] **Test Data Cleanup**
  - Remove test users from `workers` table
  - Remove test posts from `posts` and `business_posts`
  - Remove test jobs from `jobs` table
  - Remove test contracts from `contracts` table
  - Remove test ATWS listings from `atws_listings`
  - Clean up storage buckets (test images)

### Features & Functionality

- [ ] **Test All User Flows**
  - Registration → Email verification → Login → Profile setup
  - Worker listing visibility toggle
  - Job posting creation and management
  - Contract posting and applications
  - ATWS listing creation with multiple images
  - Post creation with images (SIPO News & Business Room)
  - Contact request sending and receiving
  - Profile image upload and display

- [ ] **Test Image Upload Features**
  - Profile picture upload (max 5MB)
  - Post images upload (max 5 images, 5MB each)
  - ATWS listing images (multiple images)
  - Verify images display correctly after upload
  - Test image deletion (storage cleanup)

- [ ] **Test Real-time Features**
  - Contact requests notification count updates
  - Verify Supabase Realtime is enabled for required tables

### Performance & Optimization

- [ ] **Build Optimization**
  - Run `npm run build` and check for errors
  - Review bundle size (check for large dependencies)
  - Verify code splitting is working (lazy loaded routes)
  - Test production build locally with `npm run preview`

- [ ] **Image Optimization**
  - Compress Hektor logo images
  - Consider using WebP format for better compression
  - Implement lazy loading for images in lists

- [ ] **Database Query Optimization**
  - Review all queries for N+1 problems
  - Use `.select()` to only fetch needed columns
  - Implement pagination for large lists (workers, posts, jobs)

### UI/UX

- [ ] **Responsive Design Testing**
  - Test on mobile devices (iOS, Android)
  - Test on tablets
  - Test on different desktop screen sizes
  - Test all modals on small screens

- [ ] **Cross-Browser Testing**
  - Chrome/Edge (Chromium)
  - Firefox
  - Safari (desktop and mobile)

- [ ] **Accessibility**
  - Test keyboard navigation
  - Verify all images have alt text
  - Check color contrast ratios
  - Test with screen reader (if possible)

### Error Handling

- [ ] **Error Pages**
  - Test 404 page (`/not-found`)
  - Test error boundary fallback
  - Verify proper error messages for failed operations

- [ ] **Toast Notifications**
  - Review all success/error messages
  - Ensure no duplicate toasts
  - Verify German language consistency

## 🟡 Important - Should Complete Before Deployment

### Code Quality

- [ ] **Remove Console Logs**
  - Search for `console.log` and remove or replace with proper logging
  - Keep only essential error logs (`console.error`)

- [ ] **Remove Commented Code**
  - Clean up unnecessary commented code
  - Remove old implementations that are no longer used

- [ ] **TypeScript Errors**
  - Run `npm run typecheck`
  - Fix all TypeScript errors and warnings
  - Review `any` types and replace with proper types

- [ ] **Linting**
  - Run `npm run lint`
  - Fix all linting errors
  - Review and fix linting warnings

### Documentation

- [ ] **Update README.md**
  - Add deployment instructions
  - Update environment variable documentation
  - Add troubleshooting section

- [ ] **Code Comments**
  - Add JSDoc comments to complex functions
  - Document non-obvious business logic
  - Add comments to RLS policies

### Monitoring & Analytics

- [ ] **Error Tracking**
  - Consider adding Sentry or similar error tracking
  - Set up error logging for production

- [ ] **Analytics** (Optional)
  - Consider adding Google Analytics or similar
  - Track key user actions (registrations, posts, etc.)

### Backup & Recovery

- [ ] **Database Backup**
  - Enable automated backups in Supabase
  - Test backup restoration process
  - Document backup schedule

- [ ] **Storage Backup**
  - Plan for storage bucket backups
  - Document file recovery process

## 🟢 Nice to Have - Post-Deployment

### Performance Monitoring

- [ ] **Set Up Monitoring**
  - Monitor API response times
  - Track storage usage
  - Monitor database query performance

### User Feedback

- [ ] **Feedback Mechanism**
  - Add contact form or feedback button
  - Set up email for user inquiries

### SEO

- [ ] **Meta Tags**
  - Add proper meta descriptions
  - Add Open Graph tags for social sharing
  - Add favicon

- [ ] **Sitemap**
  - Generate sitemap.xml
  - Submit to search engines

### Additional Features

- [ ] **Email Notifications**
  - Notify users of new contact requests
  - Notify users of new comments on their posts

## 📋 Deployment Steps

1. [ ] Complete all items in "Critical" section
2. [ ] Run final build: `npm run build`
3. [ ] Test production build: `npm run preview`
4. [ ] Run database migration in production Supabase
5. [ ] Deploy to hosting platform (Vercel, Netlify, etc.)
6. [ ] Verify environment variables in deployment platform
7. [ ] Test deployed application thoroughly
8. [ ] Monitor error logs for first 24 hours
9. [ ] Create announcement for users about new features

## 🔧 Known Issues to Fix

### Current Issues

- [ ] **Profile Image Display Issue** - FIXED ✅
  - Added useEffect to sync previewUrl with currentImageUrl in ImageUpload component

- [ ] **Business Room Duplicate Toasts** - FIXED ✅
  - Used useRef to prevent duplicate error toasts

- [ ] **Username Duplicate Error** - FIXED ✅
  - Updated trigger to use full UUID for username generation
  - Added real-time username availability checking

### Potential Issues

- [ ] **Large File Uploads**
  - Test upload progress for large images
  - Consider adding upload progress indicator

- [ ] **Concurrent Edits**
  - Test what happens when multiple managers edit the same worker. This case should not happen because manager are only allowed to edit those workers that they have created.
  - Consider optimistic locking or last-write-wins strategy

## 📞 Contacts & Support

- **Supabase Dashboard**: [Your Supabase Project URL]
- **Deployment Platform**: [Your deployment platform]
- **Domain Registrar**: [Your domain registrar]

---

**Last Updated**: 2025-12-05
**Next Review**: Before deployment