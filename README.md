# VoltEdge — Enterprise E-Commerce Platform

VoltEdge is a premium, high-performance, full-stack electronics and computer hardware e-commerce application built for the Pakistani market with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

The platform is designed to run seamlessly in **standalone local mode without requiring Docker**, while maintaining a clean relational database architecture, transactional inventory consistency, and official Pakistan payment/delivery workflows.

---

## ⚡ Core Features

### Customer Storefront
- **High-Tech Aesthetic**: Deep charcoal (`#090d16`), electric blue (`#3b82f6`), and cyan accents with subtle glowing badges, modern typography, and glassmorphism.
- **Hardware Catalog**: 16 dedicated categories covering Graphics Cards, Processors, Motherboards, DDR5 RAM, NVMe Gen4/Gen5 SSDs, ATX 3.0 Power Supplies, 240Hz/OLED Monitors, and Esports Peripherals.
- **Specification Matrix**: Grouped technical hardware specifications (VRAM, Socket, Form Factor, Clock Speeds, Refresh Rates) displayed on each product page.
- **Variant Selector**: Seamless variant switching (e.g. 16GB vs 32GB, Black vs White) with dynamic server-authoritative price adjustments.
- **Instant Debounced Search**: Live search bar matching product titles, SKUs, brands, and categories with real-time dropdown results.
- **Interactive Cart Drawer & Cart Page**: Slide-over persistent cart with instant quantity adjustments, free nationwide shipping progress bar (orders over Rs. 50,000), and coupon code redemption.
- **Pakistan-Specific Checkout**: Complete delivery address form with Pakistani mobile number validation (`03xx` or `+923`), province & city selectors, and delivery instructions.
- **Payment Methods**:
  - **Cash on Delivery (COD)**: Available nationwide via TCS & Leopard Courier.
  - **Direct Corporate Bank Transfer**: Displays Habib Bank Limited (HBL) corporate account details, IBAN, and payment verification instructions.
  - **Credit / Debit Card (Online)**: Tokenized card payment simulation.
- **Order Tracking Timeline**: Real-time status tracker (`Pending Confirmation` → `Confirmed` → `Processing` → `Shipped` → `Delivered`) with courier tracking references.
- **Customer Account Hub**: View past order history, status details, and saved delivery addresses.

### Executive Administrative Portal (`/admin`)
- **Server-Guarded RBAC**: Protected by server-side authorization checks; inaccessible to ordinary customers.
- **Executive KPI Dashboard**: Total Gross Revenue (PKR), Total Order Volume, Pending Confirmation Alerts, Average Order Value (AOV), and Low-Stock Warnings.
- **Order Management & Fulfillment**: Filter orders by status or payment, update fulfillment states, assign courier tracking numbers (TCS, Leopard, Trax), and add internal audit notes.
- **Inventory Ledger**: Real-time stock on hand, low-stock threshold triggers, and manual stock adjustment modal with mandatory audit reasons and movement history logs.
- **Product Catalog Management**: Create new hardware products with custom specification builders, SKU validation, price controls, and toggle homepage featured/draft status.
- **Categories & Brands**: Manage category slugs, sort orders, and hardware manufacturer partners.
- **Promotions & Coupons Engine**: Create percentage or fixed-amount discount codes with minimum order amounts, max discount limits, and usage counts.
- **Customer Directory**: Registered customer profiles, contact numbers, and lifetime spend analytics.
- **Store Settings**: Configure shipping rates, free shipping threshold, and corporate bank details.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router with Turbopack) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Database ORM** | Prisma Client & Prisma CLI |
| **Persistence** | Zero-Docker Standalone SQLite (`prisma/dev.db`) / PostgreSQL Compatible (`prisma/schema.postgresql.prisma`) |
| **Styling** | Tailwind CSS with Custom High-Tech Design Tokens |
| **Icons** | Lucide React |
| **Forms & Validation** | React Hook Form & Zod |
| **Password Security** | Bcrypt.js (10 salt rounds) |
| **Currency / Locale** | PKR (Pakistani Rupee) / en-PK |

---

## 🚀 Quick Start (Zero-Docker Standalone)

Run the entire application locally with standard Node.js without needing Docker:

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Push Database Schema
```bash
npm run db:push
```

### 3. Seed Realistic Catalog & Test Accounts
```bash
npm run db:seed
```

### 4. Start the Application
For local development:
```bash
npm run dev
```

Or for optimized production build:
```bash
npm run build
npm run start
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👤 Pre-Seeded Test Credentials

### Administrator Account
- **URL**: [http://localhost:3000/account/login](http://localhost:3000/account/login) (redirects to `/admin`)
- **Email**: `admin@voltedge.pk`
- **Password**: `AdminVoltEdge2026!`

### Verified Test Customer
- **URL**: [http://localhost:3000/account/login](http://localhost:3000/account/login)
- **Email**: `hammad.dev@example.pk`
- **Password**: `CustomerPass123!`

### Active Promotional Coupons
- `WELCOME10`: 10% discount on orders over Rs. 25,000 (Max discount Rs. 15,000)
- `VOLTGAMING`: Flat Rs. 2,500 off on orders over Rs. 30,000
- `SUPERDEAL`: 15% discount on orders over Rs. 100,000

---

## 📂 Repository Architecture

```
ecommerce-website/
├── docs/
│   ├── architecture.md           # Modular Monolith system architecture
│   └── database-design.md        # Relational schema specification
├── prisma/
│   ├── dev.db                    # Active SQLite database file
│   ├── schema.prisma             # Active standalone schema
│   ├── schema.postgresql.prisma  # PostgreSQL target schema for cloud deployments
│   └── seed.ts                   # Database seed script
├── src/
│   ├── app/
│   │   ├── (storefront)/
│   │   │   ├── page.tsx          # Homepage with flagship showcases
│   │   │   ├── products/         # Reusable catalog listing & detail pages
│   │   │   ├── cart/             # Dedicated full cart page
│   │   │   ├── checkout/         # Multi-step checkout with COD / Bank Transfer
│   │   │   ├── orders/           # Order confirmation & live tracking timeline
│   │   │   ├── account/          # Customer portal (login, register, orders)
│   │   │   └── policies/         # Shipping, returns, privacy, terms, FAQ
│   │   ├── admin/                # Executive Protected Admin Portal
│   │   │   ├── page.tsx          # KPI Overview dashboard
│   │   │   ├── products/         # Catalog CRUD & variant management
│   │   │   ├── inventory/        # Real-time stock ledger & manual adjustments
│   │   │   ├── orders/           # Order fulfillment & courier dispatch
│   │   │   ├── categories/       # Category taxonomy & brands
│   │   │   ├── customers/        # Customer directory & lifetime spend
│   │   │   ├── coupons/          # Promotional discount coupons
│   │   │   └── settings/         # Store settings & HBL bank details
│   │   ├── api/v1/               # Server Route Handlers (REST)
│   │   └── layout.tsx            # Root layout with CartProvider & Navbar
│   ├── components/
│   │   ├── layout/               # Navbar & Footer
│   │   ├── cart/                 # CartDrawer component
│   │   ├── products/             # ProductPurchaseBox
│   │   └── admin/                # Admin interactive forms & controllers
│   ├── context/
│   │   └── CartContext.tsx       # Persistent shopping cart & coupon store
│   └── lib/
│       ├── db.ts                 # Singleton Prisma client instance
│       ├── auth.ts               # HttpOnly cookie sessions & bcrypt hashing
│       ├── format.ts             # PKR currency & phone formatters
│       └── constants.ts          # Regional provinces, cities & statuses
├── .env                          # Local environment configuration
├── .env.example                  # Environment key templates
├── package.json                  # Scripts & dependencies
└── README.md
```

---

## 🔒 Security & Data Integrity Rules

1. **Server-Authoritative Pricing**: The client browser is untrusted. All product prices, variant adjustment add-ons, shipping fees, and coupon discount eligibility are calculated directly on the server from the database.
2. **Atomic SQL Transactions**: Order creation, inventory stock deductions, and coupon redemptions run inside atomic database transactions (`prisma.$transaction`).
3. **No Phantom Inventory**: If an order is cancelled by an administrator, reserved stock is automatically restocked and audited via `InventoryMovement`.
4. **Decoupled Order and Payment States**: Order fulfillment status (`PENDING_CONFIRMATION`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`) is tracked independently from payment status (`PENDING`, `AWAITING_VERIFICATION`, `PAID`, `FAILED`).
5. **Least Privilege & Safe Secrets**: Passwords are saved with bcrypt hashing. Database files and authentication secrets remain strictly server-side.
