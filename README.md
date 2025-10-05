# Veermani Kitchen's - E-commerce & POS System

![Diwali Special 2025](https://img.shields.io/badge/Diwali-Special%202025-orange)
![Next.js](https://img.shields.io/badge/Next.js-13-black)
![Supabase](https://img.shields.io/badge/Supabase-Powered-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

A complete e-commerce website and Point of Sale (POS) system built for Veermani Kitchen's Diwali 2025 special products. Features online ordering, counter billing, real-time order management, and comprehensive admin controls.

## 🌟 Key Features

- 🛍️ **Customer Website** - Beautiful, mobile-first online store
- 💳 **Counter Billing** - Full-featured POS system for in-store sales
- 📦 **Order Management** - Real-time order tracking and status updates
- 🔐 **Secure Admin Panel** - Protected dashboard for business operations
- 📱 **Fully Responsive** - Perfect experience on all devices
- 🎨 **Diwali Theme** - Festive orange/amber design inspired by Diwali

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works great!)
- Basic terminal/command line knowledge

### Setup in 3 Steps

1. **Set up the database**
   ```bash
   # Copy database-setup.sql content
   # Paste in Supabase SQL Editor and run
   ```

2. **Create admin user in Supabase**
   - Go to Authentication > Users > Add User
   - Email: `admin@veermanikitchens.com`
   - Set a strong password

3. **Start the application**
   ```bash
   npm install
   npm run dev
   ```

Visit http://localhost:3000 - You're ready!

## 📚 Documentation

- **[Quick Start Guide](QUICK-START.md)** - Get running in 5 minutes
- **[Complete Setup Guide](SETUP-GUIDE.md)** - Detailed step-by-step instructions
- **[Features & Architecture](FEATURES.md)** - Full technical documentation
- **[Database Setup](database-setup.sql)** - SQL script for database initialization

## 🎯 What's Included

### Customer Features
✅ Product catalog (sweets & namkeen)
✅ Shopping cart with custom quantities
✅ Checkout with take-away/parcel options
✅ Bulk order form
✅ Order confirmation
✅ About us page

### Admin Features
✅ Secure login
✅ Counter billing (POS)
✅ Online order management
✅ Bulk order management
✅ Other payments tracking
✅ Real-time updates
✅ UPI payment support

## 💻 Technology Stack

- **Frontend**: Next.js 13, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Deployment**: Vercel/Netlify ready

## 📱 Screenshots

### Customer Website
- Home page with product listings
- Shopping cart interface
- Checkout process
- Order confirmation

### Admin Dashboard
- POS counter billing system
- Real-time order management
- Status tracking
- Payment recording

## 🗂️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── bulk-order/        # Bulk orders
│   └── about/             # About page
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── supabase.ts       # Database client
│   └── cart-store.ts     # Cart state management
└── public/               # Static assets
```

## 🔒 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Authenticated admin access only
- ✅ Input validation on all forms
- ✅ Secure password handling via Supabase Auth
- ✅ Environment variables for sensitive data

## 📦 Database Schema

### Tables
- `products` - Product catalog (15 items pre-loaded)
- `orders` - Customer orders (online + counter)
- `bulk_orders` - Bulk order inquiries
- `other_payments` - Miscellaneous transactions

All tables include proper indexes, triggers, and RLS policies.

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
vercel
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod
```

Don't forget to set environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎨 Customization

### Update Products
Edit directly in Supabase table editor or via admin panel (future feature)

### Change Colors
Modify `app/globals.css` - search for color variables

### Add UPI QR Code
1. Generate your UPI QR code
2. Save as `/public/upi-qr.png`
3. Update references in POS components

### Update Contact Info
- `app/page.tsx` (footer)
- `app/about/page.tsx`

## 📞 Support

For questions or issues:
- Check the documentation files
- Review [Supabase docs](https://supabase.com/docs)
- Review [Next.js docs](https://nextjs.org/docs)

## 🎊 Pre-loaded Data

The database setup includes 15 products:

**Sweets**:
- Kaju Katli (₹900/Kg)
- Badam Katli (₹900/Kg)
- Moong Dal Laddu (₹480/Kg)
- Besan Chakki (₹480/Kg)
- Makkhan Bada (₹480/Kg)
- And more...

**Namkeen**:
- Chane Ki Dal varieties
- Mathri
- Chivda
- And more...

## 📝 License

This is a custom-built solution for Veermani Kitchen's. All rights reserved.

## 🙏 Acknowledgments

Built with:
- Next.js by Vercel
- Supabase
- Shadcn/ui components
- Tailwind CSS
- Lucide icons

---

**श्री तिलकेश्वर पार्श्वनाथ नमः**

Made with ❤️ for Veermani Kitchen's Diwali Special 2025

For detailed setup instructions, see [SETUP-GUIDE.md](SETUP-GUIDE.md)
For quick start, see [QUICK-START.md](QUICK-START.md)
For complete features list, see [FEATURES.md](FEATURES.md)
