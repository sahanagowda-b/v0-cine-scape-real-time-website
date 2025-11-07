# Authentication Troubleshooting Guide for CineScape

## Issue: Email Rate Limit Exceeded

If you see "Email rate exceeded" errors when trying to sign up or login, this is caused by Supabase's email rate limiting.

### Quick Fix: Disable Email Confirmation (Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qckwdqamzbtdczsjusyg
2. Navigate to **Authentication → Providers → Email**
3. Scroll to **Confirm email** section
4. **Toggle OFF** "Confirm email"
5. Click **Save**

Users can now sign up and login immediately without email verification.

### Understanding Rate Limits

Supabase free tier limits:
- **4 emails per hour** per project
- Resets every hour
- Includes signup confirmations, password resets, magic links

### Alternative Solutions

**Option 1: Wait for Reset**
- Rate limits reset after 1 hour
- Check back and try again

**Option 2: Manual User Confirmation**
1. Go to Supabase Dashboard → **Authentication → Users**
2. Find the user who signed up
3. Click three dots → **Confirm user**
4. User can now login

**Option 3: Delete and Re-signup**
1. Go to Supabase Dashboard → **Authentication → Users**
2. Find the user
3. Click three dots → **Delete user**
4. Have user sign up again (with email confirmation disabled)

**Option 4: Upgrade Supabase Plan**
- Pro Plan: Higher email limits
- Team/Enterprise: Custom limits

---

## Issue: Users Can't Login After Signup

This happens when email confirmation is enabled but users haven't confirmed their email.

### Check User Status

1. Go to Supabase Dashboard → **Authentication → Users**
2. Look for the user's email
3. Check the "Confirmed" column

If "Confirmed" shows **false**:
- User needs to click the confirmation link in their email
- Or you can manually confirm them (see above)

---

## Issue: RLS Warning on Movies Table

The `public.movies` table needs Row Level Security enabled.

### Fix: Run Migration Script

1. Go to Supabase Dashboard → **SQL Editor**
2. Open `scripts/02-fix-rls-movies.sql`
3. Copy and paste the entire script
4. Click **Run**

This enables RLS with proper policies:
- Anyone can read movies (public access)
- Only authenticated users can add/update movies

---

## Production Setup Checklist

Before deploying to production:

- [ ] **Keep email confirmation enabled** for security
- [ ] Set up custom email templates (optional)
  - Dashboard → Authentication → Email Templates
- [ ] Configure redirect URLs
  - Add your production domain to allowed redirect URLs
  - Dashboard → Authentication → URL Configuration
- [ ] Test full auth flow
  - Sign up → Check email → Confirm → Login
- [ ] Verify all RLS policies are enabled
  - Run both SQL scripts in order
- [ ] Review rate limits based on expected traffic
  - Consider upgrading plan if needed

---

## Environment Variables Check

Make sure these are set in Vercel (or `.env.local`):

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://qckwdqamzbtdczsjusyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

For production, update `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` to your Vercel URL.

---

## Common Auth Errors

### "Invalid login credentials"
- Email not confirmed yet
- Wrong password
- User doesn't exist

### "Email not confirmed"
- User needs to check their email and click confirmation link
- Or manually confirm in Supabase Dashboard

### "User already registered"
- Email already in use
- Try logging in instead
- Or reset password if forgotten

---

## Testing Tips

**Local Development:**
1. Disable email confirmation
2. Use consistent test emails (test@example.com)
3. Delete test users between tests

**Before Production:**
1. Enable email confirmation
2. Test with real email addresses
3. Verify confirmation emails arrive
4. Check spam folders

---

## Getting Help

If issues persist:
1. Check Supabase Dashboard → **Logs** for errors
2. Review browser console for client-side errors
3. Check Vercel deployment logs
4. Visit Supabase Community: supabase.com/docs

---

## Quick Reference: Disable Email Confirmation

\`\`\`
Dashboard → Authentication → Providers → Email → Toggle OFF "Confirm email" → Save
\`\`\`

This is the fastest fix for "Email rate exceeded" during development.
