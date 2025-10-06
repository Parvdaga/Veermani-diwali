# START HERE - Complete Guide

Welcome! Follow these steps to get your Veermani Kitchen's application running.

---

## Quick Start (5 Minutes)

### 1. Set Up Supabase (2 minutes)

1. Go to https://supabase.com and sign in
2. Create a new project
3. Go to Settings > API
4. Copy your **Project URL** and **anon public key**

### 2. Configure Environment (1 minute)

Edit `.env` file in your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Up Database (1 minute)

1. In Supabase Dashboard, go to **SQL Editor**
2. Open `database-setup.sql` from your project
3. Copy all content and paste in SQL Editor
4. Click **"Run"**

### 4. Disable Email Confirmation (30 seconds)

**IMPORTANT - This fixes the login error!**

1. Supabase Dashboard > **Authentication** > **Providers**
2. Click **"Email"**
3. **Turn OFF** "Confirm email"
4. Click **"Save"**

### 5. Run the App (30 seconds)

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

---

## Admin Access

### Login Details:
- URL: http://localhost:3000/admin
- Email: `admin@veermanikitchens.com`
- Password: `Admin@2025`

### If Login Fails:
Read **`FIX-LOGIN-ERROR.md`** - Solution 1 fixes it 90% of the time!

---

## What's Included

### Customer Features
- Browse 15 products (sweets & namkeen)
- Add to cart with 0.25kg increments
- Checkout with pickup time selection
- Bulk order form
- Beautiful Diwali theme

### Admin Features
- Counter Billing (POS) system
- Order Management (online & counter orders)
- Bulk Order Management
- Other Payments tracking
- Real-time order status updates

### All 15 Products Pre-loaded

**Sweets (7 items):**
1. Kaju Katli - ₹900/kg
2. Badam Katli - ₹900/kg
3. Moong Dal Laddu - ₹480/kg
4. Besan Chakki - ₹480/kg
5. Makhan Bada - ₹480/kg
6. Meethe Shakarpare - ₹300/kg
7. Meethe Shakarpare (Chashni) - ₹260/kg

**Namkeen (3 items):**
8. Chane Ki Dal (Dry Fruit) - ₹360/kg
9. Chane Ki Dal (Plain) - ₹300/kg
10. Mathri - ₹300/kg

**On Order (5 items):**
11. Chivda - ₹280/kg ⭐
12. Meethe Shakarpare (Ghee) - ₹450/kg ⭐
13. Saanv - ₹320/kg ⭐
14. Mysore Pak Besan - ₹560/kg ⭐
15. Sugar Free Laddu - ₹1200/kg ⭐

---

## Documentation Files

### Setup & Troubleshooting
- **`START-HERE.md`** (this file) - Quick start guide
- **`LOCAL-SETUP.md`** - Detailed local development setup
- **`FIX-LOGIN-ERROR.md`** - Fix authentication issues
- **`DEPLOYMENT.md`** - Deploy to production (Vercel, Netlify, etc.)

### Project Information
- **`README.md`** - Project overview
- **`FEATURES.md`** - Complete feature documentation
- **`SETUP-GUIDE.md`** - Original setup guide
- **`DEPLOYMENT-AND-WHATSAPP.md`** - WhatsApp integration

### Database
- **`database-setup.sql`** - Complete database schema and data

---

## Common Issues

### Issue 1: "Products not showing on homepage"
**Fix:** Run `database-setup.sql` in Supabase SQL Editor

### Issue 2: "Login Failed - Database error"
**Fix:** Read `FIX-LOGIN-ERROR.md` - Disable email confirmation

### Issue 3: "Failed to fetch"
**Fix:** Check `.env` file has correct Supabase credentials

### Issue 4: Can't see admin user
**Fix:** Run the user creation SQL from `FIX-LOGIN-ERROR.md` Solution 3

---

## Project Structure

```
veermani-kitchens/
├── app/                    # Next.js pages
│   ├── page.tsx           # Homepage (customer)
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── admin/             # Admin panel
│   │   ├── page.tsx      # Admin login
│   │   └── dashboard/    # Admin dashboard
│   ├── bulk-order/        # Bulk orders
│   └── about/             # About page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── admin/            # Admin components
├── lib/                   # Utilities
│   ├── supabase.ts       # Supabase client
│   ├── auth-context.tsx  # Auth provider
│   └── cart-store.ts     # Cart state management
├── .env                   # Environment variables
└── database-setup.sql     # Database schema
```

---

## Testing Checklist

Before deploying, test these features:

### Customer Side
- [ ] Homepage shows all 15 products
- [ ] Can add products to cart
- [ ] Cart updates correctly
- [ ] Can proceed to checkout
- [ ] Can select pickup date/time
- [ ] Order submission works
- [ ] Bulk order form submits

### Admin Side
- [ ] Can login at /admin
- [ ] Dashboard loads
- [ ] POS system works
- [ ] Can create counter orders
- [ ] Can view online orders
- [ ] Can update order status
- [ ] Can view bulk orders
- [ ] Can record other payments

---

## Next Steps

Once everything works locally:

### 1. Customize Your Business
- Update business name in code
- Add your logo
- Add your UPI QR code for payments
- Update contact information

### 2. Deploy to Production
- Read `DEPLOYMENT.md`
- Recommended: Deploy to Vercel (easiest)
- Takes 5 minutes, completely free

### 3. Set Up WhatsApp Notifications (Optional)
- Read `DEPLOYMENT-AND-WHATSAPP.md`
- Get notified of new orders via WhatsApp

### 4. Add More Features (Optional)
- Product images
- Customer accounts
- Order history
- Payment gateway integration
- SMS notifications

---

## Support & Resources

### Documentation
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs
- Shadcn/ui: https://ui.shadcn.com

### Get Help
- Check documentation files in this project
- Supabase community: https://github.com/supabase/supabase/discussions
- Next.js community: https://github.com/vercel/next.js/discussions

---

## Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## Important Notes

### Security
- Change default admin password before deploying
- Never commit `.env` to version control
- Enable email confirmation in production
- Use HTTPS in production (auto-enabled on Vercel)

### Data
- All data is stored in Supabase
- Row Level Security is enabled
- Regular backups recommended (Supabase Pro)
- Free tier has 500MB storage limit

### Performance
- Application is optimized for production
- Static pages pre-rendered
- API calls cached where appropriate
- Works on all devices (responsive)

---

## Success Checklist

You're ready to deploy when:

- [ ] Local development works perfectly
- [ ] All 15 products show on homepage
- [ ] Can create orders as customer
- [ ] Admin login works
- [ ] POS system functions
- [ ] All tests pass
- [ ] Environment variables documented
- [ ] Admin password changed
- [ ] Documentation reviewed

---

## Quick Troubleshooting

**Nothing works?**
1. Check `.env` file exists with correct values
2. Run `npm install` again
3. Restart dev server
4. Check Supabase project is active

**Login fails?**
→ Read `FIX-LOGIN-ERROR.md`

**Products don't show?**
→ Run `database-setup.sql` in Supabase

**Build fails?**
→ Run `npm run typecheck` to see errors

---

**Happy Diwali! 🪔 Your application is ready to launch!**

For detailed guides, refer to:
- Setup issues → `LOCAL-SETUP.md`
- Login issues → `FIX-LOGIN-ERROR.md`
- Deployment → `DEPLOYMENT.md`
