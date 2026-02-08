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
    navigation.tsx     - Sticky header with cart badge + mobile menu
    cart-drawer.tsx     - Slide-out cart with quantity controls
    footer.tsx         - Footer with newsletter signup + links
  pages/
    home.tsx           - Hero, value props, featured products, comparison, reviews, CTA
    shop.tsx           - Product grid with search + category filters
    product-detail.tsx - Full product page with specs, FAQ, reviews
    checkout.tsx       - Shipping form + payment method selection (UI only)
    about.tsx          - Company story, stats, mission, values
    contact.tsx        - Contact form + company info
    faq.tsx            - Categorized FAQ with accordions
    reviews.tsx        - All reviews with rating distribution
    admin/
      dashboard.tsx    - KPIs, sales chart, low stock alerts, recent orders
      products.tsx     - CRUD product management with dialog form
      orders.tsx       - Order list with status management + detail modal

server/
  db.ts               - Neon database connection
  storage.ts          - Database CRUD operations interface
  routes.ts           - REST API endpoints
  seed.ts             - Database seeding script

shared/
  schema.ts           - Drizzle schema: products, cart_items, orders, reviews, subscribers
```

## Key Decisions
- Cart state managed client-side with Zustand + localStorage persistence
- No authentication implemented - admin panel is open access
- Payment integration is UI-only (Stripe/PayPal selection without API keys)
- Free shipping threshold: $75
- Tax rate: 8%
- All product images generated and stored in client/public/images/

## Database Tables
- products: name, slug, description, price, category, badge, specs (jsonb), features, stock
- orders: orderNumber, customer info, items (jsonb), totals, status, payment provider
- reviews: productId, customerName, rating, title, body, verified
- subscribers: email

## API Routes
- GET/POST /api/products, GET /api/products/:slug, PATCH/DELETE /api/products/:id
- GET/POST /api/orders, PATCH /api/orders/:id
- GET/POST /api/reviews
- POST /api/subscribers

## Product Categories
- Best Sellers, Portable, Family, Accessories

## Design Tokens
- Background: hsl(220,40%,7%)
- Card: hsl(220,38%,10%)
- Border: hsl(218,35%,17%)
- Primary: hsl(220,91%,55%) - electric blue
- Text: white (primary), hsl(215,30%,65%) (secondary)
