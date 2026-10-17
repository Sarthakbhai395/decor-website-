# ✨ Luxe Celebrations (House of Jashn)

<div align="center">

![Next.js 15](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js%2020-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

<br/>

**A production-ready, full-stack luxury event decor, surprise planning, and celebration booking platform.**  
Crafted with high-converting luxury aesthetics, rich animations, micro-interactions, complete booking lifecycle management, and a dedicated admin command center.

[Key Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-endpoints) • [Troubleshooting](#-troubleshooting--gotchas) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**Luxe Celebrations** (House of Jashn) is an end-to-end fullstack platform built for luxury celebration planners, balloon artists, proposal designers, and event organizers. 

The application solves common event industry pain points:
- **Instant Booking & Slot Selection**: Customers pick their celebration date, time window, venue location, and customize service add-ons in real time.
- **Budget Deals (< ₹2499)**: Tailored quick-browse collections for birthday surprises, intimate candlelight setups, and budget-friendly romantic experiences.
- **Multi-City & Location Awareness**: Dynamic city picker (Delhi NCR, Mumbai, Bangalore, Jaipur, etc.) ensuring localized pricing and service availability.
- **Enterprise-Grade Admin Suite**: Full control over bookings, order statuses, custom coupons, service catalogs, reviews, customer directories, and revenue analytics.

---

## ✨ Key Features

### 🌟 Public Storefront & Client Experience
- **Hero & Golden Flare Animations**: High-performance Framer Motion and GSAP animations, golden flares, glassmorphism UI tokens, and luxury dark theme typography (`Cormorant Garamond` + `Playfair Display` + `Inter`).
- **Dynamic Catalog & Filtering**: Filter by category (Birthdays, Anniversaries, Proposals, Baby Showers, Romantic Setups), city, budget ranges, and ratings.
- **Instant Booking Engine**: Multi-step booking checkout with date-time slot selection, venue address management, custom add-ons, and coupon redemptions.
- **City Picker**: Pop-up modal saving user location preferences in local storage and tailoring services.
- **WhatsApp Direct Connect**: Floating smart CTA for instant concierge support and custom quote requests.
- **SEO Optimized**: Dynamic OpenGraph tags, JSON-LD schemas, automated XML `sitemap.ts`, and `robots.ts`.

### 👤 Customer Portal (`/dashboard`)
- **Booking Tracker**: Real-time status pipeline (`Pending` → `Confirmed` → `In-Progress` → `Completed` / `Cancelled`).
- **Wishlist**: Save favorite luxury themes for upcoming anniversaries or milestones.
- **Address Book**: Manage multiple celebration venues (Home, Hotel, Banquet Hall, Farmhouse).
- **Profile & Security**: Update contact info, change passwords, and manage notifications.

### 🛡️ Admin Command Center (`/admin`)
- **Analytics Dashboard**: Real-time revenue statistics, booking volume graphs with Recharts, and conversion rates.
- **Booking Operations**: Update booking milestones, assign decorators, review notes, and handle cancellations.
- **Catalog CMS**: Full CRUD for services, multi-tier pricing, package features, and Cloudinary media uploads.
- **City & Category Management**: Enable/disable operational cities, manage pincodes, and feature top categories.
- **Review Moderation**: Approve or filter authentic client feedback and photos.
- **Coupons & Promotions**: Set percentage/flat discounts, expiry limits, and minimum spend requirements.
- **Blog Engine**: Publish SEO-driven event guides and decoration ideas.

### 🔒 Enterprise Security & Robust Backend
- **Dual JWT Authentication**: 15-minute access token + 7-day refresh token rotation with secure HTTP-only cookies.
- **OTP Verification Flow**: Email verification with 6-digit expiring OTPs (with built-in development simulation mode).
- **Payment Gateway Ready**: Razorpay payment order generation & signature verification + Stripe international support.
- **Resilient MongoDB Layer**: Automatic SRV DNS resolution fix for Windows/ISPs + automatic fallback to local MongoDB if cloud Atlas is unreachable.
- **Security Hardened**: Helmet HTTP headers, Mongo-Sanitize against NoSQL injection, HPP parameter pollution protection, and IP rate limiters.

---

## 🏛️ Architecture

```
                        +----------------------------+
                        |   Next.js 15 App Router    |
                        | (Tailwind, Framer, Zustand)|
                        +--------------+-------------+
                                       |
                         REST / JSON   |   HTTP-Only Cookies
                                       v
                        +----------------------------+
                        |    Node.js + Express API   |
                        |   (TypeScript, Winston)    |
                        +--------------+-------------+
                                       |
          +----------------------------+----------------------------+
          |                            |                            |
          v                            v                            v
+-------------------+        +--------------------+       +-------------------+
|  MongoDB Atlas    |        |   Cloudinary CDN   |       | Payment Gateways  |
| (Mongoose + Auto  |        |  (Image/Video CMS) |       | Razorpay / Stripe |
|  Local Fallback)  |        +--------------------+       +-------------------+
+-------------------+
```

---

## 📁 Repository Structure

```
luxe-celebrations/
├── frontend/                     # Next.js 15 Client Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/           # Login, Register, OTP Verify, Password Reset
│   │   │   ├── (public)/         # Services, Budget Deals, Categories, Cities, Blog
│   │   │   ├── admin/            # Admin Command Dashboard (Analytics, CMS, Bookings)
│   │   │   ├── dashboard/        # Customer Profile, Bookings, Wishlist, Addresses
│   │   │   ├── layout.tsx        # Root layout with Theme & Query Providers
│   │   │   └── globals.css       # Luxury Gold Theme & Utility Classes
│   │   ├── components/
│   │   │   ├── home/             # Hero, CategoryGrid, Featured, CityPickerModal
│   │   │   ├── layout/           # Luxury Navbar, MobileBottomNav, Footer
│   │   │   ├── shared/           # WhatsAppButton, Badge, Skeleton, Dialogs
│   │   │   └── ui/               # Radix UI + Shadcn accessible primitives
│   │   ├── store/                # Zustand client state (auth, cart, city)
│   │   └── lib/                  # Axios instance, formatting helpers, validations
│   └── package.json
│
└── backend/                      # Express.js REST API
    ├── src/
    │   ├── config/               # Database (DNS + Fallback), Environment validator
    │   ├── controllers/          # Business logic (Auth, Bookings, Services, Admin)
    │   ├── middleware/           # JWT verify, Admin guard, RateLimiter, ErrorHandler
    │   ├── models/               # Mongoose Schemas (User, Service, Booking, etc.)
    │   ├── routes/               # Express API v1 Route definitions
    │   ├── utils/                # Winston Logger, Nodemailer & Dev OTP Simulator
    │   └── server.ts             # Entry point & port collision self-healer
    ├── .env.example              # Documented environment template
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB instance or a free MongoDB Atlas cluster)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Sarthakbhai395/decor-website-.git
cd decor-website-
```

---

### 2. Configure the Backend

Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `backend/.env` with your settings:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database (Works with local MongoDB or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/luxe-celebrations

# Authentication Secrets (generate random 64-char strings)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_at_least_32_characters_long
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_encryption_secret_key_32_chars

# Cloudinary (Media upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email (Optional in development - OTP prints directly to terminal if omitted)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_google_app_password
EMAIL_FROM=noreply@luxecelebrations.com
EMAIL_FROM_NAME=Luxe Celebrations

# Payments
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the backend development server:
```bash
npm run dev
```
*Backend will be running on `http://localhost:5000/api/v1` (Health check at `http://localhost:5000/health`).*

---

### 3. Configure the Frontend

In a new terminal window, navigate to the `frontend` folder:
```bash
cd ../frontend
npm install
```

Create your `.env.local` file:
```bash
cp .env.local.example .env.local
```

Add your frontend environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

Start the Next.js development server:
```bash
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Create account & dispatch OTP | Public |
| `POST` | `/verify-otp` | Verify email OTP & issue JWT tokens | Public |
| `POST` | `/resend-otp` | Re-generate and send new OTP | Public |
| `POST` | `/login` | Authenticate with email & password | Public |
| `POST` | `/refresh-token`| Rotate access token via HTTP-only refresh cookie | Public |
| `POST` | `/logout` | Invalidate session & clear cookies | Authenticated |
| `POST` | `/forgot-password` | Request password reset email | Public |
| `POST` | `/reset-password` | Set new password with token | Public |
| `GET`  | `/me` | Retrieve currently logged-in user profile | Authenticated |

### 🎈 Services (`/api/v1/services`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | List services with filters, sorting, search & pagination | Public |
| `GET` | `/featured` | Get curated showcase services for homepage | Public |
| `GET` | `/:slug` | Retrieve complete details, pricing tiers & add-ons | Public |
| `GET` | `/:slug/related` | Retrieve related decoration packages | Public |
| `POST` | `/` | Create a new service package with images | Admin |
| `PUT` | `/:id` | Update service details or pricing | Admin |
| `DELETE` | `/:id` | Remove a service package | Admin |

### 📅 Bookings (`/api/v1/bookings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/` | Create new reservation with selected slots | Customer |
| `POST` | `/verify-payment` | Verify Razorpay HMAC signature & confirm booking | Customer |
| `GET` | `/my-bookings` | Fetch user's booking history | Customer |
| `GET` | `/:id` | Fetch specific booking summary and invoice | Customer / Admin |
| `PATCH`| `/:id/cancel` | Cancel booking according to policy | Customer |
| `GET` | `/` | Fetch all bookings with filtering & search | Admin |
| `PATCH`| `/:id/status` | Update execution status (`Confirmed`, `Completed`, etc.) | Admin |

### 👑 Admin Management (`/api/v1/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/analytics` | Revenue graphs, top categories, booking statistics | Admin |
| `GET` | `/revenue-report` | Detailed revenue breakdown & date-range export | Admin |
| `GET` | `/customers` | View registered customer directory | Admin |

---

## 🛠️ Troubleshooting & Gotchas

<details>
<summary><b>1. MongoDB <code>querySrv ECONNREFUSED</code> on Windows</b></summary>

**Why it happens**: Windows network adapters and certain home Wi-Fi routers refuse DNS queries for SRV records used by `mongodb+srv://`.  
**How it is fixed**: In `backend/src/config/database.ts`, the backend automatically overrides Node's DNS resolver to use Google DNS (`8.8.8.8`) and Cloudflare DNS (`1.1.1.1`).  
Furthermore, if MongoDB Atlas authentication fails, the server automatically connects to your local MongoDB (`127.0.0.1:27017`) so development is never interrupted.
</details>

<details>
<summary><b>2. Email & OTP in Development Mode</b></summary>

You **do not** need a Gmail App Password to test signup or login locally!  
If `SMTP_PASS` is omitted or left as default in `backend/.env`, the backend operates in **Dev Simulation Mode**:
- OTPs are logged directly in the terminal:  
  `🔑 [DEV OTP] Verification OTP for user@example.com: 482910`
- You can copy the code directly into the `/verify-otp` page to complete authentication.
</details>

<details>
<summary><b>3. Port 5000 Already in Use</b></summary>

The backend has a built-in auto-healing utility in `server.ts`. If an old zombie process is holding port 5000, it automatically executes a platform-specific port kill (`taskkill` on Windows or `fuser` on Linux) and successfully binds to port 5000 without requiring manual intervention.
</details>

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your code to GitHub.
2. Link your repository in [Vercel](https://vercel.com).
3. Set the Root Directory to `frontend`.
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://api.yourdomain.com/api/v1`).
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your live/test Razorpay Key.
5. Deploy!

### Backend Deployment (Render / Railway / VPS)
1. Create a new Web Service and link your GitHub repository.
2. Set Root Directory to `backend`.
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm start`
5. Configure your Environment Variables matching `backend/.env.example`.
6. Whitelist Render/Railway IP addresses (`0.0.0.0/0`) in your **MongoDB Atlas Network Access**.

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, inspire, and create:

1. **Fork** the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Sarthakbhai395">Sarthak Bhatnagar</a> for unforgettable celebrations.</sub>
</div>
