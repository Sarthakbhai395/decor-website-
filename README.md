# ✨ Luxe Celebrations — Premium Decoration & Surprise Planning Platform

A production-ready, full-stack luxury decoration and surprise planning web application built with Next.js 15, Node.js, and MongoDB Atlas.

---

## 🏗️ Project Structure

```
luxe-celebrations/
├── frontend/          # Next.js 15 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/      # Public pages
│   │   │   ├── (auth)/        # Auth pages
│   │   │   ├── dashboard/     # User dashboard
│   │   │   └── admin/         # Admin dashboard
│   │   ├── components/
│   │   │   ├── home/          # Home page sections
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── shared/        # Reusable components
│   │   │   └── providers/     # Context providers
│   │   ├── lib/               # Axios, utils
│   │   ├── store/             # Zustand stores
│   │   └── types/             # TypeScript types
│   └── package.json
│
└── backend/           # Node.js + Express API
    ├── src/
    │   ├── config/            # DB, Cloudinary
    │   ├── controllers/       # Route handlers
    │   ├── middleware/        # Auth, error, rate limit
    │   ├── models/            # Mongoose models
    │   ├── routes/            # Express routes
    │   ├── types/             # TypeScript types
    │   └── utils/             # Logger, email, helpers
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (for payments)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** — copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```

Fill in:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_32_char_secret
JWT_REFRESH_SECRET=your_32_char_refresh_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
```

**Frontend** — copy `.env.local.example` to `.env.local`:
```bash
cp frontend/.env.local.example frontend/.env.local
```

Fill in:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- Health check: http://localhost:5000/health

---

## 📦 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| GSAP | Advanced animations |
| Shadcn UI | Component library |
| Zustand | State management |
| React Hook Form + Zod | Form validation |
| Axios | HTTP client |
| Swiper.js | Carousels |
| Recharts | Analytics charts |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image/video storage |
| Multer | File uploads |
| Nodemailer | Email service |
| Razorpay | Payment gateway |
| Stripe | International payments |
| Winston | Logging |
| Helmet | Security headers |

---

## 🔐 Authentication Flow

1. User registers → OTP sent to email
2. User verifies OTP → Account activated
3. Login → Access token (15min) + Refresh token (7d) in HTTP-only cookies
4. Auto-refresh via interceptor when access token expires
5. Role-based access: `user` | `admin`

---

## 📡 API Endpoints

### Auth
```
POST /api/v1/auth/register
POST /api/v1/auth/verify-otp
POST /api/v1/auth/resend-otp
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me
```

### Services
```
GET    /api/v1/services
GET    /api/v1/services/featured
GET    /api/v1/services/:slug
GET    /api/v1/services/:slug/related
POST   /api/v1/services          [Admin]
PUT    /api/v1/services/:id      [Admin]
DELETE /api/v1/services/:id      [Admin]
```

### Bookings
```
POST   /api/v1/bookings
POST   /api/v1/bookings/verify-payment
GET    /api/v1/bookings/my-bookings
GET    /api/v1/bookings/:id
PATCH  /api/v1/bookings/:id/cancel
GET    /api/v1/bookings          [Admin]
PATCH  /api/v1/bookings/:id/status [Admin]
```

### Users
```
PUT    /api/v1/users/profile
PUT    /api/v1/users/change-password
POST   /api/v1/users/addresses
GET    /api/v1/users/wishlist
POST   /api/v1/users/wishlist/:serviceId
GET    /api/v1/users/notifications
GET    /api/v1/users             [Admin]
```

### Admin
```
GET /api/v1/admin/analytics
GET /api/v1/admin/revenue-report
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
# Build check
cd frontend
npm run build
```

### Backend (Render)

1. Push to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Build command: `npm install && npm run build`
5. Start command: `npm start`

### MongoDB Atlas

1. Create cluster at mongodb.com/atlas
2. Add IP whitelist (0.0.0.0/0 for Render)
3. Create database user
4. Copy connection string to `MONGODB_URI`

---

## 🎨 Design System

### Colors
- **Gold**: `#c9a96e` → `#f0d080` (primary luxury accent)
- **Black**: `#0a0a0a` (background)
- **Dark**: `#111111` (cards)
- **Rose**: `#f4c2c2` → `#e879a0` (romantic accent)
- **Purple**: `#a855f7` (secondary accent)

### Typography
- **Display**: Cormorant Garamond (headings)
- **Serif**: Playfair Display (subheadings)
- **Sans**: Inter (body text)

### Components
- Glassmorphism cards with gold borders
- Gradient text effects
- Floating balloon animations
- Luxury hover effects with elevation
- Skeleton loaders for all async content

---

## 📱 Pages

### Public
- `/` — Home (Hero, Stats, Categories, Featured, How It Works, Gallery, Testimonials, Cities, Blog, CTA)
- `/services` — All services with filters
- `/services/[slug]` — Service detail + booking
- `/categories` — All categories
- `/categories/[slug]` — Category services
- `/gallery` — Photo gallery
- `/about` — About us
- `/blog` — Blog listing
- `/blog/[slug]` — Blog post
- `/cities/[slug]` — City-specific services
- `/contact` — Contact form
- `/faq` — FAQ accordion
- `/privacy-policy` — Privacy policy
- `/terms` — Terms & conditions

### Auth
- `/login` — Login form
- `/signup` — Registration form
- `/verify-otp` — OTP verification
- `/forgot-password` — Password reset request
- `/reset-password` — New password form

### User Dashboard
- `/dashboard/bookings` — My bookings
- `/dashboard/wishlist` — Saved services
- `/dashboard/notifications` — Notifications
- `/dashboard/profile` — Profile settings
- `/dashboard/addresses` — Saved addresses
- `/dashboard/payments` — Payment history

### Admin Dashboard
- `/admin/analytics` — Revenue & booking charts
- `/admin/bookings` — All bookings management
- `/admin/customers` — User management
- `/admin/services` — Service CRUD
- `/admin/categories` — Category management
- `/admin/cities` — City management
- `/admin/reviews` — Review moderation
- `/admin/coupons` — Coupon management
- `/admin/blogs` — Blog management
- `/admin/notifications` — Send notifications

---

## 🔧 Scripts

```bash
# Backend
npm run dev      # Development with hot reload
npm run build    # Compile TypeScript
npm start        # Production server

# Frontend
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```

---

## 📧 Email Templates

- Welcome / OTP verification
- Booking confirmation
- Password reset
- Booking status updates

---

## 🛡️ Security Features

- JWT with HTTP-only cookies
- Refresh token rotation
- Rate limiting (global + per-route)
- MongoDB injection sanitization
- Helmet security headers
- CORS configuration
- bcrypt password hashing (12 rounds)
- Input validation with Zod/express-validator

---

## 📊 Database Models

- **User** — Auth, profile, addresses, wishlist
- **Service** — Packages with images, pricing, SEO
- **Category** — Service categories
- **City** — Supported cities
- **Booking** — Full booking lifecycle
- **Review** — Verified reviews with approval
- **Coupon** — Discount codes
- **Blog** — SEO-optimized blog posts
- **Notification** — User notifications

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built with ❤️ for unforgettable celebrations**
