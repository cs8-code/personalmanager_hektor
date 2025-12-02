# Supabase Email Verification Setup Guide

This guide explains how to enable email verification for the HEKTOR application.

## Current Implementation

The application is configured to:
1. Send email verification on registration (`emailRedirectTo: /verify-email`)
2. Handle email verification on the `/verify-email` page
3. Send password reset emails (`redirectTo: /reset-password`)
4. Handle password reset on the `/reset-password` page

## Required Supabase Dashboard Configuration

### Step 1: Enable Email Confirmation

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Click on **Email** provider
5. **Enable "Confirm email"** toggle
6. **Enable "Secure email change"** (recommended)
7. Click **Save**

### Step 2: Configure URL Allowlist

1. Navigate to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:5173/verify-email
   http://localhost:5173/reset-password
   https://yourdomain.com/verify-email
   https://yourdomain.com/reset-password
   ```
3. Under **Site URL**, set:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

### Step 3: Test Email Configuration (Development)

For development, Supabase uses their built-in email service:
- **Rate Limit**: 3-4 emails per hour
- **Emails may go to spam** - check your spam folder
- Email sender will be: `noreply@mail.app.supabase.io`

### Step 4: Configure Custom SMTP (Production)

For production, you **must** configure custom SMTP:

1. Navigate to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **"Enable Custom SMTP"**
4. Configure your email service:

#### Option A: SendGrid (Recommended)
- **Host**: `smtp.sendgrid.net`
- **Port**: `587` or `2525`
- **Username**: `apikey`
- **Password**: Your SendGrid API Key
- **Sender email**: Your verified sender email
- **Sender name**: HEKTOR

#### Option B: Gmail (Not recommended for production)
- **Host**: `smtp.gmail.com`
- **Port**: `587`
- **Username**: Your Gmail address
- **Password**: App-specific password (not your regular password)
- **Sender email**: Your Gmail address
- **Sender name**: HEKTOR

#### Option C: AWS SES, Mailgun, etc.
Configure according to your provider's SMTP settings.

### Step 5: Customize Email Templates (Optional)

1. Navigate to **Authentication** → **Email Templates**
2. Customize the templates:

#### Confirm Signup Template:
```html
<h2>Willkommen bei HEKTOR!</h2>
<p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:</p>
<p><a href="{{ .ConfirmationURL }}">E-Mail bestätigen</a></p>
<p>Wenn Sie sich nicht bei HEKTOR registriert haben, können Sie diese E-Mail ignorieren.</p>
```

#### Reset Password Template:
```html
<h2>Passwort zurücksetzen</h2>
<p>Sie haben eine Passwort-Zurücksetzung für Ihr HEKTOR-Konto angefordert.</p>
<p>Klicken Sie auf den folgenden Link, um ein neues Passwort festzulegen:</p>
<p><a href="{{ .ConfirmationURL }}">Neues Passwort festlegen</a></p>
<p>Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
<p>Dieser Link läuft nach 1 Stunde ab.</p>
```

## Testing the Flow

### Test Email Verification:
1. Register a new account at `/register`
2. Check your email (including spam folder)
3. Click the verification link
4. Should redirect to `/verify-email` and show success message
5. User should be able to log in

### Test Password Reset:
1. Click "Login" in navbar
2. Click "Passwort vergessen?"
3. Enter your email address
4. Check your email for reset link
5. Click the link → redirects to `/reset-password`
6. Enter new password
7. Should show success and redirect to homepage

## Troubleshooting

### Issue: Not receiving emails
**Solutions:**
- Check spam/junk folder
- Verify email confirmation is enabled in Supabase dashboard
- Check Supabase logs: **Authentication** → **Logs**
- Verify redirect URLs are in allowlist
- For development: You may hit rate limits (3-4 emails/hour)

### Issue: "Invalid redirect URL" error
**Solution:**
- Add your URLs to the allowlist in **Authentication** → **URL Configuration**
- Format: `http://localhost:5173/verify-email` (no trailing slash)

### Issue: Email link doesn't work
**Solutions:**
- Check that the link format is: `https://yourproject.supabase.co/auth/v1/verify?token=...&type=signup&redirect_to=...`
- Verify your redirect URL is correct in code and Supabase settings
- Check browser console for errors on `/verify-email` page

### Issue: User can log in without verifying email
**Solution:**
- This is expected behavior - Supabase Auth allows login before verification
- You can check `user.email_confirmed_at` in your code to restrict access
- Add RLS policies that check email verification status

## Security Notes

1. **Rate Limiting**: Supabase's built-in email service has rate limits. Use custom SMTP for production.
2. **Email Deliverability**: Configure SPF, DKIM, and DMARC records for your custom domain to improve deliverability.
3. **Confirmation Timeout**: Email confirmation links expire after 24 hours by default.
4. **Password Reset Timeout**: Password reset links expire after 1 hour.

## Current Status Check

To verify your setup is working:

1. **Check Supabase Dashboard Logs**:
   - Go to **Authentication** → **Logs**
   - Look for `signup` and `verification` events

2. **Check User Table**:
   - Go to **Authentication** → **Users**
   - Look for `email_confirmed_at` column
   - If null, email is not verified

3. **Manual Testing**:
   ```sql
   -- Check if user email is verified
   SELECT id, email, email_confirmed_at
   FROM auth.users
   WHERE email = 'test@example.com';
   ```

## Next Steps

After configuring Supabase:

1. Test registration with a real email address
2. Check spam folder if email doesn't arrive
3. Test password reset flow
4. Configure custom SMTP for production
5. Consider adding email verification enforcement in your app logic
