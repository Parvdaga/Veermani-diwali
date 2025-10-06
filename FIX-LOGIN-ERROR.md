# Fix "Login Failed - Database error querying schema"

This error happens when Supabase authentication isn't properly configured. Here's how to fix it:

---

## Solution 1: Disable Email Confirmation (Quickest Fix)

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **"Authentication"** in the left sidebar
4. Click **"Providers"**
5. Click on **"Email"** provider
6. Find **"Confirm email"** toggle
7. **Turn it OFF** (disable it)
8. Click **"Save"**
9. Try logging in again

**This is the most common cause of the error!**

---

## Solution 2: Verify Environment Variables

1. Check your `.env` file in the project root
2. Make sure it has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Get the correct values:
   - Go to Supabase Dashboard
   - Click **"Settings"** (gear icon)
   - Click **"API"**
   - Copy **"Project URL"** and **"anon public"** key

4. Update `.env` with correct values

5. **Restart the dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```

---

## Solution 3: Create Admin User Properly

The user might not exist or might not be confirmed. Let's recreate it:

1. Go to Supabase Dashboard
2. Click **"SQL Editor"** in sidebar
3. Click **"New query"**
4. Paste this SQL:

```sql
-- Delete old user if exists
DELETE FROM auth.users WHERE email = 'admin@veermanikitchens.com';

-- Create new admin user with proper configuration
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  recovery_sent_at,
  email_change_sent_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@veermanikitchens.com',
  crypt('Admin@2025', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  NOW(),
  NOW()
);

-- Create identity record
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'admin@veermanikitchens.com'
)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  id,
  jsonb_build_object(
    'sub', id::text,
    'email', 'admin@veermanikitchens.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  id::text,
  NOW(),
  NOW(),
  NOW()
FROM new_user
ON CONFLICT (provider, provider_id) DO NOTHING;
```

5. Click **"Run"**
6. Try logging in again

---

## Solution 4: Check Supabase Project Status

1. Go to Supabase Dashboard
2. Check if your project is **"Active"** (not paused)
3. Free tier projects pause after 7 days of inactivity
4. If paused, click **"Restore"** or **"Unpause"**
5. Wait a minute and try again

---

## Solution 5: Clear Browser Cache

1. Open browser DevTools (Press **F12**)
2. Go to **"Application"** tab (Chrome) or **"Storage"** tab (Firefox)
3. In left sidebar:
   - Click **"Local Storage"** > Your localhost URL
   - Click **"Clear All"**
   - Click **"Session Storage"** > Clear All
   - Click **"Cookies"** > Clear All
4. Close DevTools
5. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
6. Try logging in again

---

## Solution 6: Verify Auth Schema Exists

1. Go to Supabase Dashboard
2. Click **"SQL Editor"**
3. Run this query:

```sql
-- Check if auth schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';

-- Check if users table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'auth' AND table_name = 'users';

-- Check if user exists
SELECT email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'admin@veermanikitchens.com';
```

If any of these returns empty, your auth schema might be corrupted. Contact Supabase support or create a new project.

---

## Solution 7: Use Alternative Login Method

Instead of using the pre-created user, you can sign up directly:

1. **Temporarily disable RLS for testing** (NOT for production):
   - Supabase Dashboard > SQL Editor
   - Run: `ALTER TABLE products DISABLE ROW LEVEL SECURITY;`

2. **Or allow public sign-ups:**
   - Create a signup page
   - Use `supabase.auth.signUp()` instead of pre-created user
   - This creates user automatically

---

## Complete Troubleshooting Checklist

Run through this checklist:

- [ ] Email confirmation is disabled in Supabase Auth settings
- [ ] `.env` file has correct Supabase URL and anon key
- [ ] Dev server was restarted after changing `.env`
- [ ] Supabase project is active (not paused)
- [ ] Admin user exists in auth.users table
- [ ] Admin user has `email_confirmed_at` timestamp (not null)
- [ ] Browser cache is cleared
- [ ] No firewall/VPN blocking Supabase connection
- [ ] Internet connection is stable

---

## Still Not Working?

### Check the Browser Console

1. Open DevTools (F12)
2. Go to **"Console"** tab
3. Try logging in
4. Look for red error messages
5. Copy the error and check:
   - Does it mention "JWT"? → Check your anon key
   - Does it mention "CORS"? → Check your Supabase URL
   - Does it mention "network"? → Check internet connection

### Check Supabase Logs

1. Supabase Dashboard > **"Logs"**
2. Click **"Auth Logs"**
3. Try logging in
4. Look for error messages
5. This will tell you exactly what's failing

---

## Emergency Workaround

If nothing works, temporarily bypass auth for testing:

1. Comment out auth check in admin pages
2. This is **ONLY for local testing**
3. **NEVER deploy with auth disabled**

In `app/admin/dashboard/page.tsx`, temporarily add at the top:

```typescript
// TEMPORARY - REMOVE BEFORE DEPLOYING
// Comment out auth check to test without login
```

---

## Contact Support

If none of these solutions work:

1. **Supabase Support**: https://supabase.com/support
2. **Check Supabase Status**: https://status.supabase.com
3. Create new Supabase project and try again

---

## Prevention

To avoid this in the future:

1. Always disable email confirmation for development
2. Keep environment variables backed up
3. Document your admin credentials
4. Test auth immediately after setup
5. Use proper error handling in your code

---

**Most Common Fix: Solution 1 (Disable Email Confirmation) works 90% of the time!**
