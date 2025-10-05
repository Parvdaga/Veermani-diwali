# Deployment & WhatsApp Integration Guide

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel is the recommended platform because:
- Created by Next.js team
- Zero configuration needed
- Automatic HTTPS
- Global CDN
- Free tier is generous

#### Step-by-Step Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate.

3. **Deploy from Project Directory**
   ```bash
   cd /path/to/veermani-kitchens
   vercel
   ```

4. **Answer Setup Questions**
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - What's your project name? `veermani-kitchens` (or your choice)
   - In which directory is your code? `./` (just press Enter)
   - Want to override settings? **No**

5. **Add Environment Variables**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://eezddeoxgoadboapxgja.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - Make sure they're available for all environments (Production, Preview, Development)

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

7. **Your Site is Live! 🎉**
   - Production URL: `https://veermani-kitchens.vercel.app` (or your custom domain)
   - You can add custom domain in Vercel dashboard

#### Vercel Continuous Deployment

If you push code to GitHub/GitLab:
1. Import project in Vercel dashboard
2. Connect your repository
3. Add environment variables
4. Every push to main branch auto-deploys!

---

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Build Your Project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy
   ```
   - First time: Follow setup prompts
   - Create new site
   - Deploy `.next` folder

5. **Add Environment Variables**
   - Go to Netlify dashboard
   - Site settings > Environment variables
   - Add Supabase variables

6. **Deploy to Production**
   ```bash
   netlify deploy --prod
   ```

---

### Option 3: Self-Hosted (VPS/Server)

1. **Server Requirements**
   - Ubuntu 20.04+ or similar
   - Node.js 18+
   - Nginx or Apache
   - SSL certificate (Let's Encrypt)

2. **Build the Application**
   ```bash
   npm run build
   npm run start
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "veermani" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx as Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

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

5. **Set up SSL with Certbot**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 📱 WhatsApp Integration Options

### Option 1: Simple WhatsApp Click-to-Chat (Easiest, Free) ⭐

This is the simplest approach and requires no API setup.

#### Implementation

Add this function to create WhatsApp links:

```typescript
// lib/whatsapp.ts
export function sendInvoiceViaWhatsApp(
  phone: string,
  orderNumber: string,
  customerName: string,
  items: any[],
  totalAmount: number
) {
  // Format message
  const message = `
🎉 Thank you for your order, ${customerName}!

📋 Order Number: ${orderNumber}
💰 Total Amount: ₹${totalAmount.toFixed(2)}

📦 Items:
${items.map(item => `- ${item.product_name}: ${item.quantity_kg}kg @ ₹${item.price_per_kg}/kg = ₹${item.subtotal}`).join('\n')}

📍 Veermani Kitchen's
📞 9425314543, 9425314545

श्री तिलकेश्वर पार्श्वनाथ नमः
  `.trim();

  // Clean phone number (remove spaces, dashes)
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;

  // Open in new window
  window.open(whatsappUrl, '_blank');
}
```

#### Usage in Admin Panel

Update `components/admin/OrderManagement.tsx`:

```typescript
import { sendInvoiceViaWhatsApp } from '@/lib/whatsapp';

// Add button in order card
<Button
  onClick={() => sendInvoiceViaWhatsApp(
    order.customer_phone,
    order.order_number,
    order.customer_name,
    order.items,
    order.total_amount
  )}
  className="w-full bg-green-600 hover:bg-green-700"
>
  Send Invoice via WhatsApp
</Button>
```

**Pros**:
- ✅ Free forever
- ✅ No API setup
- ✅ Works immediately
- ✅ Opens WhatsApp with pre-filled message

**Cons**:
- ❌ Manual - requires clicking button
- ❌ Not automatic on status change

---

### Option 2: WhatsApp Business API via Twilio

Twilio offers WhatsApp Business API with a generous free tier.

#### Setup Steps

1. **Create Twilio Account**
   - Visit https://www.twilio.com/
   - Sign up for free account
   - Verify phone number

2. **Enable WhatsApp Sandbox**
   - Go to Messaging > Try it out > Send a WhatsApp message
   - Follow instructions to join sandbox
   - Save your Twilio credentials

3. **Install Twilio SDK**
   ```bash
   npm install twilio
   ```

4. **Create API Route**
   ```typescript
   // app/api/send-whatsapp/route.ts
   import { NextResponse } from 'next/server';
   import twilio from 'twilio';

   const accountSid = process.env.TWILIO_ACCOUNT_SID;
   const authToken = process.env.TWILIO_AUTH_TOKEN;
   const client = twilio(accountSid, authToken);

   export async function POST(request: Request) {
     const { phone, message } = await request.json();

     try {
       const msg = await client.messages.create({
         body: message,
         from: 'whatsapp:+14155238886', // Twilio sandbox number
         to: `whatsapp:+91${phone}`
       });

       return NextResponse.json({ success: true, sid: msg.sid });
     } catch (error) {
       return NextResponse.json({ success: false, error }, { status: 500 });
     }
   }
   ```

5. **Add Environment Variables**
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   ```

6. **Call from Admin Panel**
   ```typescript
   const sendWhatsAppInvoice = async (order: Order) => {
     const message = `Invoice for order ${order.order_number}...`;

     const response = await fetch('/api/send-whatsapp', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         phone: order.customer_phone,
         message: message
       })
     });

     const result = await response.json();
     if (result.success) {
       toast({ title: 'WhatsApp sent successfully!' });
     }
   };
   ```

**Pros**:
- ✅ Can be automated
- ✅ Free tier includes 1,000+ messages
- ✅ Professional API

**Cons**:
- ❌ Requires Twilio account
- ❌ Sandbox limitations (recipients must opt-in)
- ❌ Production requires Business verification

---

### Option 3: Supabase Edge Function (Automated) ⚡

Create an Edge Function that automatically sends WhatsApp when order status changes.

#### Create Edge Function

1. **Create Function File**
   ```typescript
   // supabase/functions/send-invoice/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   }

   serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders })
     }

     try {
       const { orderNumber, customerName, customerPhone, items, totalAmount } = await req.json()

       // Format message
       const message = `🎉 Your order ${orderNumber} is ready!\n\nTotal: ₹${totalAmount}\n\nThank you, ${customerName}!`

       // Send via Twilio or other WhatsApp API
       const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID')
       const twilioAuth = Deno.env.get('TWILIO_AUTH_TOKEN')

       const response = await fetch(
         `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
         {
           method: 'POST',
           headers: {
             'Authorization': 'Basic ' + btoa(`${twilioSid}:${twilioAuth}`),
             'Content-Type': 'application/x-www-form-urlencoded',
           },
           body: new URLSearchParams({
             From: 'whatsapp:+14155238886',
             To: `whatsapp:+91${customerPhone}`,
             Body: message
           })
         }
       )

       return new Response(
         JSON.stringify({ success: true }),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     } catch (error) {
       return new Response(
         JSON.stringify({ error: error.message }),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
       )
     }
   })
   ```

2. **Deploy Function**
   Use the Supabase dashboard or CLI to deploy

3. **Create Database Trigger**
   ```sql
   CREATE OR REPLACE FUNCTION send_order_notification()
   RETURNS TRIGGER AS $$
   BEGIN
     -- Only send when status changes to 'completed'
     IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
       -- Call Edge Function
       PERFORM
         net.http_post(
           url := 'https://your-project.supabase.co/functions/v1/send-invoice',
           headers := jsonb_build_object('Content-Type', 'application/json'),
           body := jsonb_build_object(
             'orderNumber', NEW.order_number,
             'customerName', NEW.customer_name,
             'customerPhone', NEW.customer_phone,
             'items', NEW.items,
             'totalAmount', NEW.total_amount
           )
         );
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER order_completed_notification
     AFTER UPDATE ON orders
     FOR EACH ROW
     EXECUTE FUNCTION send_order_notification();
   ```

**Pros**:
- ✅ Fully automated
- ✅ Triggers on status change
- ✅ No manual intervention

**Cons**:
- ❌ Requires Edge Function setup
- ❌ Needs Twilio or WhatsApp Business API

---

### Option 4: WhatsApp Business API (Official)

For production use with high volume.

#### Requirements
- Registered business
- Facebook Business Manager account
- Phone number verification
- Business verification process

#### Setup
1. Apply through Facebook Business Manager
2. Get WhatsApp Business API access
3. Integrate with your application
4. Full automation possible

**Best for**: Large scale operations (100+ messages/day)

---

## 📊 Recommendation

**For Quick Start**: Use **Option 1** (Click-to-Chat)
- Get started immediately
- No API setup needed
- Perfect for manual invoice sending

**For Automation**: Use **Option 2** (Twilio)
- Good balance of ease and automation
- Free tier covers most small businesses
- Can automate with a button click

**For Full Automation**: Use **Option 3** (Edge Function)
- Completely hands-off
- Triggers automatically
- Best user experience

**For Enterprise**: Use **Option 4** (Official API)
- Highest reliability
- Best for large scale
- Requires business verification

---

## 🧪 Testing WhatsApp Integration

### Test in Development
1. Use your own phone number
2. Send test messages
3. Verify formatting looks good
4. Check all order details appear correctly

### Test in Production
1. Start with a few test orders
2. Monitor delivery rates
3. Get customer feedback
4. Adjust message format as needed

---

## 🔐 Security Notes

- Never commit API keys to Git
- Use environment variables
- Rotate credentials regularly
- Monitor API usage
- Set up usage alerts

---

Choose the option that best fits your needs and technical comfort level!
