# Novaatoz - Premium Water Flosser E-Commerce Store

## Overview
A complete ecommerce website for Novaatoz, a water flosser company. Features a dark futuristic cyber-minimalist design with warm gold accents (hsl(38,92%,50%)) inspired by the product imagery's warm beige/golden aesthetic. Supports both dark and light modes with a toggle in the navigation.

## Tech Stack
- Frontend: React + TypeScript + Vite + TanStack Query + Wouter + Zustand
- Backend: Express.js + Drizzle ORM + PostgreSQL (Neon)
- Styling: Tailwind CSS + Shadcn UI components
- Theme: Dark/Light mode toggle with warm gold primary color (hsl(38,92%,50%)), defaults to light

## Project Structure
```
client/src/
  App.tsx              - Main router with customer/admin layouts
  lib/cart-store.ts    - Zustand cart state with localStorage persistence
  components/
    navigation.tsx     - Sticky header with cart badge + mobile menu (settings-driven logo, nav links)
    cart-drawer.tsx     - Slide-out cart with quantity controls (uses settings API for thresholds)
    footer.tsx         - Footer with newsletter signup + links (settings-driven sections)
  pages/
    home.tsx           - Hero, value props, featured products, comparison, reviews, CTA
    shop.tsx           - Product grid with search + category filters
    product-detail.tsx - Full product page with specs, FAQ, reviews
    checkout.tsx       - Shipping form + dynamic payment methods from settings
    about.tsx          - Company story, stats, mission, values
    contact.tsx        - Contact form submits to /api/contact, saved to DB
    faq.tsx            - Categorized FAQ with accordions
    reviews.tsx        - All reviews with rating distribution
    privacy-policy.tsx - Privacy Policy page
    terms.tsx          - Terms of Service page
    shipping-returns.tsx - Shipping & Returns page
    track-order.tsx    - Track order by order number with status timeline
    admin/
      login.tsx        - Admin login page with username/password form
      dashboard.tsx    - KPIs with date filtering, real chart, reset data + shared AdminSidebar/AdminHeader
      products.tsx     - Full CRUD with delete confirmation, features, specs, whatsInBox, images editors
      orders.tsx       - Order list with status management + detail modal
      messages.tsx     - Contact form submissions management (view, status update, delete)
      settings.tsx     - Site settings: Payment, Store, Contact, Header/Footer config
  lib/
    admin-auth.tsx     - AdminGuard component for protecting admin routes

server/
  db.ts               - Neon database connection
  storage.ts          - Database CRUD operations interface (products, orders, reviews, subscribers, settings)
  routes.ts           - REST API endpoints
  seed.ts             - Database seeding script

shared/
  schema.ts           - Drizzle schema: products, cart_items, orders, reviews, subscribers, site_settings
```

## Key Decisions
- Cart state managed client-side with Zustand + localStorage persistence
- Admin panel protected with session-based login (username/password via ADMIN_USERNAME/ADMIN_PASSWORD env vars, default: admin/admin123)
- Admin auth uses express-session with rate-limited login (5 attempts per 15 min)
- Protected admin routes: POST/PATCH/DELETE products, GET/PATCH/DELETE orders, GET/PATCH/DELETE contact, PATCH settings
- Footer includes subtle "Admin" link to /admin/login
- Payment methods (Stripe/PayPal/COD) configurable from admin settings - UI only, no real payment integration
- Tax rate, shipping threshold, flat rate all configurable via admin settings
- Contact info (email, phone, address) configurable via admin settings
- Header/footer fully customizable: logo text, icon, size, nav link visibility, footer section toggles, copyright
- All product images generated and stored in client/public/images/
- Product form supports editing all fields: features[], specs{}, whatsInBox[], images[], compareAtPrice, isActive
- Product delete requires confirmation dialog
- Dashboard revenue filterable by week/month/year/all with real chart data
- Revenue data can be reset to $0 via "Reset Data" button (deletes all orders)

## Database Tables
- products: name, slug, description, price, compareAtPrice, category, badge, specs (jsonb), features, whatsInBox, images, stock, isActive, isFeatured
- orders: orderNumber, customer info, items (jsonb), totals, status, payment provider
- reviews: productId, customerName, rating, title, body, verified
- subscribers: email
- site_settings: key (unique), value - stores all configurable settings
- contact_submissions: name, email, subject, message, status (new/read/replied)

## Site Settings Keys
- storeName, currency, orderPrefix
- taxRate (decimal, e.g. "0.08"), freeShippingThreshold, shippingFlatRate
- stripeEnabled, stripePublicKey, stripeSecretKey
- paypalEnabled, paypalEmail
- codEnabled
- supportEmail, supportPhone, storeAddress
- logoText, showLogoIcon, logoSize (small/default/large)
- showNavShop, showNavAbout, showNavFaq, showNavContact, showNavReviews
- showFooterNewsletter, showFooterSocial, showFooterLinks
- copyrightText
- socialFacebook, socialInstagram, socialTwitter, socialYoutube, socialTiktok, socialLinkedin

## API Routes
- POST /api/admin/login, GET /api/admin/session, POST /api/admin/logout
- GET/POST /api/products, GET /api/products/:slug, PATCH/DELETE /api/products/:id
- GET/POST/DELETE /api/orders, PATCH /api/orders/:id
- GET/POST /api/reviews
- POST /api/subscribers
- GET/PATCH /api/settings
- POST /api/contact (public), GET/PATCH/DELETE /api/contact (admin)
- GET /api/track/:orderNumber (public - limited order info for tracking)

## Product Categories
- Best Sellers, Portable, Family, Accessories

## Design Tokens
- Background: hsl(220,20%,14%) - lighter dark tone
- Card: hsl(220,18%,18%)
- Section alt: hsl(220,18%,11%)
- Border: hsl(218,18%,25%)
- Primary: hsl(38,92%,50%) - warm gold
- Text: white (primary), hsl(215,20%,60%) (secondary)

## Gallery
- 20 unique product images in client/public/gallery/
- 3 original frames: ezgif-frame-001, 015, 020 (distinct angles/water effects)
- 17 generated shots: gallery-021 to gallery-047 (varied scenes: lifestyle, macro, flatlay, gift box, travel, silhouette, lineup, knolling)
- Displayed in 2-row marquee on home page with infinite scroll animation
