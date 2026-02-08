# Novaatoz - Premium Water Flosser E-Commerce Store

## Overview
A complete ecommerce website for Novaatoz, a water flosser company. Features a dark futuristic cyber-minimalist design with electric blue accents (hsl(220,91%,55%)).

## Tech Stack
- Frontend: React + TypeScript + Vite + TanStack Query + Wouter + Zustand
- Backend: Express.js + Drizzle ORM + PostgreSQL (Neon)
- Styling: Tailwind CSS + Shadcn UI components
- Theme: Always-dark mode with custom electric blue primary color

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
    contact.tsx        - Contact form + company info from settings
    faq.tsx            - Categorized FAQ with accordions
    reviews.tsx        - All reviews with rating distribution
    admin/
      dashboard.tsx    - KPIs with date filtering, real chart, reset data + shared AdminSidebar/AdminHeader
      products.tsx     - Full CRUD with delete confirmation, features, specs, whatsInBox, images editors
      orders.tsx       - Order list with status management + detail modal
      settings.tsx     - Site settings: Payment, Store, Contact, Header/Footer config

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
- No authentication implemented - admin panel is open access
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
- products: name, slug, description, price, compareAtPrice, category, badge, specs (jsonb), features, whatsInBox, images, stock, isActive
- orders: orderNumber, customer info, items (jsonb), totals, status, payment provider
- reviews: productId, customerName, rating, title, body, verified
- subscribers: email
- site_settings: key (unique), value - stores all configurable settings

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

## API Routes
- GET/POST /api/products, GET /api/products/:slug, PATCH/DELETE /api/products/:id
- GET/POST/DELETE /api/orders, PATCH /api/orders/:id
- GET/POST /api/reviews
- POST /api/subscribers
- GET/PATCH /api/settings

## Product Categories
- Best Sellers, Portable, Family, Accessories

## Design Tokens
- Background: hsl(220,40%,7%)
- Card: hsl(220,38%,10%)
- Border: hsl(218,35%,17%)
- Primary: hsl(220,91%,55%) - electric blue
- Text: white (primary), hsl(215,30%,65%) (secondary)
