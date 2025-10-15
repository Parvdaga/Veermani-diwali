# Local Setup Guide - Veermani Kitchen's

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)

---

## Step 1: Set Up Supabase Project

### 1.1 Create a New Supabase Project
1. Go to https://supabase.com
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `veermani-kitchens` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

### 1.2 Get Your API Keys
1. In your Supabase project dashboard, click **"Settings"** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 2: Configure Environment Variables

1. In your project folder, update the `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values from Step 1.2

---

## Step 3: Set Up Database

### 3.1 Run the Migration
1. In Supabase Dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Open the file `database-setup.sql` from your project
4. Copy ALL the content
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

This creates:
- All 4 tables (products, orders, bulk_orders, other_payments)
- All security policies
- Loads all 15 products

---

## Step 4: Create Admin User

### Option A: Using Supabase Dashboard (Recommended)

1. In Supabase Dashboard, click **"Authentication"** in sidebar
2. Click **"Users"** tab
3. Look for **"Add user"** or **"Invite user"** button
   - If you see it: Click and fill in:
     - Email: `admin@veermanikitchens.com`
     - Password: `Admin@2025` (or your choice)
     - Auto Confirm User: **YES/ON** (important!)

4. If there's NO "Add user" button:
   - Click **"SQL Editor"** in sidebar
   - Click **"New query"**
   - Paste this SQL:

```sql
-- Create admin user
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@veermanikitchens.com',
  crypt('Admin@2025', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  ''
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
  jsonb_build_object('sub', id::text, 'email', 'admin@veermanikitchens.com'),
  'email',
  id::text,
  NOW(),
  NOW(),
  NOW()
FROM new_user;
```

5. Click **"Run"**

### Option B: Disable Email Confirmation (Easier for Testing)

1. In Supabase Dashboard, go to **"Authentication"** > **"Providers"**
2. Click on **"Email"**
3. **Disable** "Confirm email"
4. Click **"Save"**
5. Now you can sign up from the admin login page directly!

---

## Step 5: Install Dependencies and Run

```bash
# Install all packages
npm install

# Run development server
npm run dev
```

The application will start at: http://localhost:3000

---

## Step 6: Test Everything

### Test 1: View Products (Customer)
1. Open http://localhost:3000
2. You should see all 15 products displayed
3. Try adding items to cart
4. Try checkout process

### Test 2: Admin Login
1. Go to http://localhost:3000/admin
2. Login with:
   - Email: `admin@veermanikitchens.com`
   - Password: `Admin@2025`
3. You should be redirected to admin dashboard

### Test 3: Create an Order (POS)
1. In admin dashboard, click **"Counter Billing (POS)"**
2. Add some products
3. Fill in customer details
4. Complete the order
5. Check **"Order Management"** to see it

---

## Troubleshooting

### Error: "Login Failed - Database error querying schema"

**Solution 1: Check Email Confirmation**
1. Go to Supabase Dashboard > **Authentication** > **Providers** > **Email**
2. Disable "Confirm email"
3. Try logging in again

**Solution 2: Verify Environment Variables**
1. Make sure `.env` file has correct values
2. Restart the dev server (`npm run dev`)

**Solution 3: Check User Was Created**
1. Go to Supabase > **Authentication** > **Users**
2. You should see `admin@veermanikitchens.com`
3. If not, run the SQL from Step 4 again

**Solution 4: Clear Browser Cache**
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear all storage for localhost:3000
4. Refresh page and try again

### Error: "Products not showing"

**Solution:**
1. Go to Supabase > **SQL Editor**
2. Run: `SELECT count(*) FROM products;`
3. Should return `15`
4. If it returns `0`, run `database-setup.sql` again

### Error: "Failed to fetch"

**Solution:**
1. Check if `.env` file exists and has correct values
2. Verify Supabase project is running (not paused)
3. Check your internet connection
4. Restart dev server

---

## Your Admin Credentials

Once setup is complete:

- **Admin URL**: http://localhost:3000/admin
- **Email**: admin@veermanikitchens.com
- **Password**: Admin@2025

**IMPORTANT**: Change this password in production!

---

## Next Steps

Once everything works locally:
1. Read `DEPLOYMENT.md` for deployment instructions
2. Add your UPI QR code for payments
3. Test all features thoroughly
4. Deploy to production

---

## Need Help?

- Check Supabase logs: Dashboard > **Logs** > **Auth logs**
- Check browser console for errors (F12)
- Verify database tables: Dashboard > **Table Editor**
