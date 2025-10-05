# Veermani Kitchen's - Complete Setup Guide

## Project Overview
This is a comprehensive e-commerce and POS system for Veermani Kitchen's Diwali 2025 special products, built with Next.js, Supabase, and Tailwind CSS.

## Features
- **Customer Website**:
  - Product catalog with sweets and namkeen
  - Shopping cart with custom packing option
  - Online checkout with take-away/parcel options
  - Bulk order form
  - About us page

- **Admin Dashboard**:
  - Counter billing (POS system)
  - Online order management with real-time updates
  - Bulk order inquiry management
  - Other payments tracking
  - UPI payment QR code display

## Step-by-Step Setup Instructions

### Step 1: Database Setup

1. **Go to your Supabase Project**:
   - Visit [supabase.com](https://supabase.com)
   - Open your project dashboard

2. **Run the Database Setup Script**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Open the file `database-setup.sql` from this project
   - Copy the entire contents
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**:
   - Go to "Table Editor" in Supabase
   - You should see these tables:
     - `products` (with 15 products already inserted)
     - `orders`
     - `bulk_orders`
     - `other_payments`

### Step 2: Create Admin User

1. **Go to Authentication** in Supabase:
   - Click "Authentication" in the left sidebar
   - Click "Users"
   - Click "Add User"

2. **Create Admin Account**:
   - Email: `admin@veermanikitchens.com` (or your preferred email)
   - Password: Create a strong password
   - Email Confirm: Disabled (check this option)
   - Click "Create User"

3. **Save Admin Credentials**:
   - Write down the email and password
   - You'll use these to login to the admin panel

### Step 3: Environment Variables (Already Configured)

Your `.env` file already contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://eezddeoxgoadboapxgja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

No changes needed here!

### Step 4: Install Dependencies and Run

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the Application**:
   - Customer Site: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/admin`

### Step 5: Test the System

#### Test Customer Flow:
1. Visit `http://localhost:3000`
2. Browse products
3. Add items to cart
4. Go to checkout
5. Fill in customer details
6. Place order

#### Test Admin Panel:
1. Visit `http://localhost:3000/admin`
2. Login with your admin credentials
3. Check the "Online Orders" tab - you should see the order you just placed
4. Test the "Counter Billing" POS system
5. Try recording "Other Payments"

### Step 6: Customize (Optional)

#### Add a UPI QR Code:
1. Generate your UPI QR code from your payment provider
2. Save it as `/public/upi-qr.png`
3. Update the QR code placeholder in:
   - `components/admin/POSSystem.tsx`
   - `components/admin/OtherPayments.tsx`

#### Change Contact Information:
- Edit `app/page.tsx` (line 170)
- Edit `app/about/page.tsx` (line 50)

## Deployment

### Deploy to Vercel (Recommended):

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name: veermani-kitchens (or your choice)
   - Directory: ./ (just press Enter)
   - Override settings? No

5. **Set Environment Variables on Vercel**:
   - Go to your project on Vercel dashboard
   - Go to Settings > Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy values from your `.env` file

6. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Deploy to Netlify:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Add Environment Variables**:
   - Go to Netlify dashboard
   - Site settings > Environment variables
   - Add both Supabase variables

## Invoice & WhatsApp Integration

For sending invoices via WhatsApp, you have two options:

### Option 1: WhatsApp Business API (Free for low volume)
- Use WhatsApp Business API via Twilio or similar
- Free tier usually includes 1000 messages/month
- Requires business verification

### Option 2: Simple WhatsApp Link (Easiest)
When an order is completed, generate a WhatsApp link:
```javascript
const message = `Thank you for your order!\nOrder: ${orderNumber}\nTotal: ₹${total}`;
const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
// Open this URL to send message
```

### Option 3: Use edge functions
Create a Supabase Edge Function that triggers when order status changes to "completed":
- Generate PDF invoice
- Send via WhatsApp API
- Store invoice URL in database

## Database Backup

Regularly backup your database:
1. Go to Supabase Dashboard
2. Database > Backups
3. Enable daily automatic backups
4. You can also manually create backups

## Security Checklist

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Public can only view products and create orders
- ✅ Admin operations require authentication
- ✅ No sensitive data exposed in client-side code
- ✅ Environment variables properly configured

## Support

For issues or questions:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

## File Structure

```
├── app/
│   ├── admin/
│   │   ├── dashboard/        # Admin dashboard
│   │   └── page.tsx          # Admin login
│   ├── about/                # About page
│   ├── bulk-order/           # Bulk order form
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout page
│   ├── order-success/        # Order confirmation
│   └── page.tsx              # Home page
├── components/
│   ├── admin/
│   │   ├── OrderManagement.tsx
│   │   ├── POSSystem.tsx
│   │   └── OtherPayments.tsx
│   └── ui/                   # UI components
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── cart-store.ts         # Cart state management
│   └── auth-context.tsx      # Auth context
└── database-setup.sql        # Database setup script
```

## Next Steps

1. Set up database (completed in this guide)
2. Create admin user (completed in this guide)
3. Test the system thoroughly
4. Add your actual UPI QR code
5. Customize branding and colors if needed
6. Deploy to production
7. Set up invoice generation
8. Configure WhatsApp notifications
9. Train staff on using the admin panel
10. Launch!

## Tips

- Test all features before going live
- Keep your admin credentials secure
- Regularly check orders in the admin panel
- Monitor database usage in Supabase
- Set up email notifications for new orders (optional)

Happy selling! 🎉
