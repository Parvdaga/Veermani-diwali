# Deployment Guide - Veermani Kitchen's

Complete guide to deploy your application to production.

---

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the best option for Next.js applications. It's free and takes 5 minutes!

### Step 1: Prepare Your Project

1. Make sure your code is on GitHub:
   ```bash
   # If not already initialized
   git init
   git add .
   git commit -m "Initial commit"

   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/yourusername/veermani-kitchens.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click **"Environment Variables"** section
7. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```
8. Click **"Deploy"**
9. Wait 2-3 minutes

Done! Your site will be live at: `https://your-project.vercel.app`

### Step 3: Configure Custom Domain (Optional)

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel project settings, click **"Domains"**
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

---

## Option 2: Deploy to Netlify

### Step 1: Build Configuration

1. Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Push code to GitHub
2. Go to https://netlify.com
3. Sign up/Login
4. Click **"Add new site"** > **"Import an existing project"**
5. Connect to GitHub and select your repo
6. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
8. Click **"Deploy site"**

---

## Option 3: Deploy to Railway

### Step 1: Prepare

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Select your repository

### Step 2: Configure

1. Railway auto-detects Next.js
2. Add environment variables in **"Variables"** tab:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
3. Click **"Deploy"**

Your app will be live at: `https://your-app.up.railway.app`

---

## Option 4: Deploy to Your Own Server (VPS)

### Requirements
- Ubuntu 20.04+ server
- Domain name pointed to your server
- SSH access

### Step 1: Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Certbot (for SSL)
apt install -y certbot python3-certbot-nginx
```

### Step 2: Deploy Application

```bash
# Clone your repository
cd /var/www
git clone https://github.com/yourusername/veermani-kitchens.git
cd veermani-kitchens

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables, save and exit

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "veermani-kitchens" -- start
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/veermani-kitchens
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/veermani-kitchens /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 4: Enable SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Your site will now be secure with HTTPS!

---

## Post-Deployment Checklist

### 1. Update Supabase Settings

1. Go to Supabase Dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add your production URL to:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**:
     - `https://yourdomain.com/**`
     - `https://yourdomain.com/admin/dashboard`

### 2. Test Everything

- [ ] Homepage loads and shows all products
- [ ] Can add items to cart
- [ ] Checkout process works
- [ ] Bulk order form submits
- [ ] Admin login works
- [ ] POS system functions
- [ ] Order management displays orders
- [ ] All buttons and links work

### 3. Change Default Password

1. Login to admin panel
2. Create a new admin user with a strong password
3. Delete the default admin user

### 4. Enable Production Mode Features

**Disable Email Confirmation for Production:**
- Supabase Dashboard > Authentication > Providers > Email
- Consider enabling email confirmation for production
- Set up email templates if needed

**Set Up Email Notifications (Optional):**
- Configure SMTP in Supabase
- Customize email templates
- Test order confirmations

### 5. Performance Optimization

**Enable Caching:**
Add to your `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  // Enable SWC minification
  swcMinify: true,
}
```

**Enable Database Connection Pooling:**
- Already enabled in Supabase by default
- For high traffic, consider upgrading Supabase plan

### 6. Monitoring

**Vercel Analytics (if using Vercel):**
- Enable in project settings
- Monitor page views and performance

**Supabase Monitoring:**
- Dashboard > Reports
- Monitor database usage
- Check API requests

---

## Environment Variables Reference

All platforms need these variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: For future features
# NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
# NEXT_PUBLIC_UPI_ID=yourname@upi
```

---

## Continuous Deployment (Auto-Deploy on Git Push)

### Vercel
- Automatically enabled! Just push to GitHub
- Every push to `main` branch deploys automatically

### Netlify
- Also automatic once connected to GitHub
- Configure branch in site settings if needed

### Railway
- Auto-deploys on push to main branch
- Can configure deployment branch in settings

### Manual Server
Set up automatic deployment:

```bash
# On your server, create a webhook script
cd /var/www/veermani-kitchens
nano deploy.sh
```

Add:

```bash
#!/bin/bash
cd /var/www/veermani-kitchens
git pull
npm install
npm run build
pm2 restart veermani-kitchens
```

Make executable:
```bash
chmod +x deploy.sh
```

Use GitHub webhooks to trigger this script on push.

---

## Backup Strategy

### Database Backups (Supabase)

1. **Automatic Backups:**
   - Supabase Pro plan includes daily backups
   - Free tier: limited backups

2. **Manual Backup:**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Export database
   supabase db dump -f backup.sql
   ```

3. **Schedule Regular Exports:**
   - Use cron job or GitHub Actions
   - Store in separate location (Google Drive, Dropbox, etc.)

---

## Scaling Considerations

### When You Need to Scale:

1. **More Traffic:**
   - Upgrade Supabase plan
   - Use CDN (Vercel includes CDN)
   - Enable caching

2. **More Products:**
   - Database can handle thousands of products
   - Consider adding search functionality
   - Implement pagination

3. **Multiple Locations:**
   - Add location field to orders
   - Create separate admin users per location
   - Use RLS policies to restrict data access

---

## Cost Estimation

### Free Tier (Good for Starting)
- **Vercel**: Free forever (hobby plan)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Domain**: $10-15/year
- **Total**: ~$15/year

### Production (Recommended)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Domain**: $15/year
- **Total**: ~$45/month

---

## Security Best Practices

1. **Change Default Credentials:**
   - Update admin password immediately
   - Use strong, unique passwords

2. **Environment Variables:**
   - Never commit `.env` to Git
   - Use platform's secure variable storage

3. **HTTPS Only:**
   - Always use SSL/TLS
   - Enable HSTS headers

4. **Regular Updates:**
   - Keep dependencies updated
   - Monitor security advisories

5. **Row Level Security:**
   - Already implemented in database
   - Review policies periodically

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Deploy to Vercel
npm i -g vercel
vercel
vercel --prod
```

---

Your application is now ready for production! 🚀

Choose the deployment method that best fits your needs and follow the steps above.
