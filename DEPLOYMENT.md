
# Oyugis Le Grand Hotel — Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Open .env.local and fill in all required values

# 3. Set up the database
npm run db:push        # Push schema to PostgreSQL
npm run db:studio      # (optional) Open Prisma Studio to view data

# 4. Start the development server
npm run dev
# → Site: http://localhost:3000
# → Admin: http://localhost:3000/admin (requires login)
# → Staff: http://localhost:3000/staff (requires login)
```

---

## Setup Checklist

### Database (PostgreSQL)
- [ ] Install PostgreSQL or use a hosted service (Supabase, Railway, Neon)
- [ ] Create a database named `oyugis_hotel`
- [ ] Update `DATABASE_URL` in `.env.local`
- [ ] Run `npm run db:push`
- [ ] Create the first admin user (see below)

### Create First Admin User
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('YOUR_SECURE_PASSWORD', 12);
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@oyugislegrand.co.ke', password: hash, role: 'ADMIN' }
  });
  console.log('Admin user created');
}
main().finally(() => prisma.\$disconnect());
"
```

### Email (Nodemailer)
- [ ] Set up Gmail with App Password (Google Account → Security → App Passwords)
- [ ] Fill in `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`
- [ ] Fill in `HOTEL_EMAIL` with the hotel's receiving address

### M-Pesa (Safaricom Daraja)
- [ ] Register at https://developer.safaricom.co.ke
- [ ] Create an app and get Consumer Key & Secret
- [ ] Get your Lipa na M-Pesa Online Passkey and Shortcode
- [ ] Set `MPESA_ENVIRONMENT=sandbox` for testing, `production` for live
- [ ] Set `MPESA_CALLBACK_URL` to your live domain (Safaricom needs a public URL)

### Stripe (Card Payments)
- [ ] Create account at https://stripe.com
- [ ] Get API keys from the Stripe Dashboard
- [ ] Set up a webhook endpoint in Stripe Dashboard pointing to `/api/payments/stripe/webhook`
- [ ] Fill in `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

### Google Maps
- [ ] Get a Google Maps API key from https://console.cloud.google.com
- [ ] Enable "Maps JavaScript API" and "Maps Embed API"
- [ ] Add to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Update the embed URL in `components/home/MapSection.jsx` and `app/contact/page.jsx`

### WhatsApp
- [ ] Update `NEXT_PUBLIC_WHATSAPP_NUMBER` with your hotel's WhatsApp number (format: 254XXXXXXXXX)

---

## Adding Your Content (No-Code Steps)

### Photos
- All image placeholders are marked with `ADD PHOTO` and `REPLACE:` comments
- Place photos in `/public/images/`
- Replace `img-placeholder` divs with `<Image src="/images/your-photo.jpg" ... />`

### 360° Virtual Tour
- Take panoramic equirectangular photos (2:1 ratio, min 4096×2048px)
- Place in `/public/360/` as: `lobby.jpg`, `deluxe-room.jpg`, `restaurant.jpg`, etc.
- Follow instructions in `app/virtual-tour/page.jsx`

### Room Prices
- Update prices in `app/rooms/page.jsx` → `ROOMS` array
- Update prices in `app/booking/page.jsx` → `ROOM_TYPES` array

### Menu Items
- Edit `app/dining/page.jsx` → `MENU` object
- Add categories, items, prices, and descriptions

### Contact Details
- Update phone, email, address in `components/layout/Footer.jsx`
- Update in `app/contact/page.jsx`
- Update in `.env.local`

---

## Deployment (Vercel — Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# → Project Settings → Environment Variables
# Add all variables from .env.example
```

### Alternative: AWS / DigitalOcean
- Build: `npm run build`
- Start: `npm start`
- Use PM2 for process management: `pm2 start npm -- start`
- Use Nginx as reverse proxy

---

## URL Structure

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/rooms` | Rooms & Suites |
| `/dining` | Restaurant & Digital Menu |
| `/conferences` | Conference & Events |
| `/experiences` | Local Tourism |
| `/gallery` | Photo Gallery |
| `/virtual-tour` | 360° Virtual Tour |
| `/blog` | Blog |
| `/contact` | Contact |
| `/booking` | Room Booking |
| `/login` | Staff/Admin Login |
| `/admin` | Admin Dashboard |
| `/admin/reservations` | Manage Bookings |
| `/admin/rooms` | Manage Rooms |
| `/admin/restaurant` | Restaurant Orders & Menu |
| `/admin/messages` | Contact Messages |
| `/admin/blog` | Blog Management |
| `/staff` | Staff Dashboard |
| `/staff/orders` | Restaurant Orders (Staff) |

---

## Security Notes

- Never commit `.env.local` to version control
- Change the default admin password after setup
- Enable HTTPS in production (automatic on Vercel)
- M-Pesa callback URL must be HTTPS
- Run `npm audit` regularly to check for vulnerabilities
