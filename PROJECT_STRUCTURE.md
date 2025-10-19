# FinAl Analytics - Project Structure

## 📁 Project Overview

**FinAl Analytics** is a Next.js 14 application that provides AI-powered video analysis for financial content. The platform analyzes YouTube videos from financial experts, extracts key timestamps, and provides AI-generated summaries.

## 🏗️ Architecture

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready
- **State Management**: React Hooks (useState, useEffect)

---

## 📂 Directory Structure

### 🎯 **Root Level**

```
piyasai/
├── 📄 README.md                    # Project documentation
├── 📄 PROJECT_STRUCTURE.md         # This file - project structure guide
├── 📄 package.json                 # Dependencies and scripts
├── 📄 package-lock.json            # Locked dependency versions
├── 📄 next.config.js               # Next.js configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 jsconfig.json                # JavaScript configuration
├── 📄 config.js                    # Global configuration
├── 📄 next-sitemap.config.js       # Sitemap generation config
└── 📁 node_modules/                # Dependencies
```

### 🎨 **Frontend Components (`/components/`)**

```
components/
├── 🎯 FinAlAnalytics.js            # Main dashboard component
├── 🎨 UI Components/
│   ├── BetterIcon.js               # Enhanced icon component
│   ├── Button*.js                  # Various button components
│   ├── CTA.js                      # Call-to-action component
│   ├── Modal.js                    # Modal dialog component
│   └── Tabs.js                     # Tab navigation component
├── 🏠 Layout Components/
│   ├── Header.js                   # Site header
│   ├── Footer.js                   # Site footer
│   ├── LayoutClient.js             # Client-side layout wrapper
│   ├── DashboardWrapper.js         # Dashboard wrapper with access denied messages
│   └── Hero.js                     # Landing page hero section
├── 📊 Feature Components/
│   ├── FeaturesAccordion.js        # Feature accordion
│   ├── FeaturesGrid.js             # Feature grid layout
│   ├── FeaturesListicle.js         # Feature listicle
│   ├── Pricing.js                  # Pricing section
│   ├── FAQ.js                      # Frequently asked questions
│   └── Problem.js                  # Problem statement
└── 💬 Content Components/
    ├── Testimonial*.js             # Various testimonial components
    ├── TestimonialsAvatars.js      # Testimonial avatars
    └── WithWithout.js              # Comparison component
```

### 🌐 **Pages & Routes (`/app/`)**

```
app/
├── 🏠 Main Pages/
│   ├── page.js                     # Landing page
│   ├── layout.js                   # Root layout
│   ├── globals.css                 # Global styles
│   ├── error.js                    # Error page
│   ├── not-found.js                # 404 page
│   └── 🖼️ Assets/
│       ├── favicon.ico
│       ├── icon.png
│       ├── apple-icon.png
│       ├── opengraph-image.png
│       └── twitter-image.png
├── 📊 Dashboard/
│   ├── page.js                     # Main dashboard (server component)
│   └── layout.js                   # Dashboard layout
├── 🔐 Admin/
│   ├── page.js                     # Admin panel (client component)
│   ├── layout.js                   # Admin layout (auth protected)
│   └── loading.js                  # Admin loading state
├── 📝 Blog/
│   ├── page.js                     # Blog listing
│   ├── layout.js                   # Blog layout
│   ├── [articleId]/page.js         # Individual article
│   ├── author/[authorId]/page.js   # Author page
│   ├── category/[categoryId]/page.js # Category page
│   └── _assets/
│       ├── components/             # Blog-specific components
│       ├── content.js              # Blog content data
│       └── images/authors/         # Author images
├── 📄 Legal Pages/
│   ├── privacy-policy/page.js      # Privacy policy
│   └── tos/page.js                 # Terms of service
├── 🚫 Verification/
│   └── verification-denied/page.js # X verification required page
└── 🔌 API Routes/
    ├── auth/[...nextauth]/route.js # Authentication
    ├── bulletins/
    │   ├── route.js                # Bulletin CRUD operations
    │   ├── all/route.js            # Get all bulletins
    │   ├── simple/route.js         # Simplified bulletin endpoint
    │   ├── seed/route.js           # Seed sample data
    │   └── test/route.js           # Test bulletin endpoint
    ├── channels/
    │   ├── route.js                # Channel operations
    │   ├── enhanced/route.js       # Enhanced channel data
    │   └── test/route.js           # Test channel endpoint
    ├── lead/route.js               # Lead management
    ├── follow-channels/route.js    # Follow/unfollow channels
    ├── seed/
    │   ├── route.js                # Alternative seed endpoint
    │   └── test/route.js           # Seed test endpoint
    └── webhooks/
        ├── mailgun/route.js        # Mailgun webhook
        └── stripe/route.js         # Stripe webhook
```

### 🗄️ **Database & Models (`/models/`)**

```
models/
├── 📊 Bulletin.js                  # Main video/bulletin model
├── 👤 User.js                      # User model (with isAdmin, xVerified, followedChannels)
├── 📝 Lead.js                      # Lead/contact model
└── plugins/
    └── toJSON.js                   # Mongoose plugin
```

### 🔧 **Utilities & Libraries (`/libs/`)**

```
libs/
├── 🔌 mongoose.js                  # MongoDB connection
├── 🔐 next-auth.js                 # Authentication configuration
├── 🤖 gpt.js                       # AI/GPT integration
├── 📧 mailgun.js                   # Email service
├── 💳 stripe.js                    # Payment processing
├── 🌐 api.js                       # API utilities
├── 🔍 seo.js                       # SEO utilities
└── 🗄️ mongo.js                     # MongoDB utilities
```

### 📁 **Static Assets (`/public/`)**

```
public/
├── 📄 robots.txt                   # SEO robots file
├── 🗺️ sitemap.xml                  # XML sitemap
├── 🗺️ sitemap-0.xml                # Additional sitemap
└── 📝 blog/
    └── introducing-supabase/
        └── header.png              # Blog post images
```

---

## 🔄 **Data Flow Architecture**

### 📊 **Dashboard Data Flow**

```
1. MongoDB (Bulletins Collection)
   ↓
2. API Routes (/api/bulletins, /api/channels)
   ↓
3. Dashboard Page (Server Component)
   ↓
4. FinAlAnalytics Component (Client Component)
   ↓
5. User Interface
```

### 🔐 **Authentication Flow**

```
1. NextAuth.js Configuration
   ↓
2. Protected Routes (Admin, Dashboard)
   ↓
3. Session Management
   ↓
4. User Access Control
```

### 🤖 **AI Integration Flow**

```
1. Video Analysis Request
   ↓
2. GPT API Integration (libs/gpt.js)
   ↓
3. Summary Generation
   ↓
4. Database Storage (Bulletin Model)
   ↓
5. Frontend Display
```

---

## 🎯 **Key Features**

### 📊 **Dashboard Features**

- **Dynamic Stats**: Video count, channel count, timestamp count (always shows total numbers)
- **Channel Filtering**: Filter videos by channel with clickable cards (8-column responsive grid)
- **Follow System**: Users can follow/unfollow channels with heart toggle buttons
- **Search Functionality**: Search videos by title or channel
- **Expandable Content**:
  - Timestamp expansion (show all timestamps)
  - AI Summary expansion (show detailed summaries)
- **YouTube Integration**: Direct links to videos with timestamps
- **Responsive Design**: Optimized for mobile and desktop viewing

### 🔐 **Admin Features**

- **Role-Based Access Control**: Admin-only access with `isAdmin` field
- **Data Seeding**: Load sample data into database
- **Authentication**: Protected admin routes with server-side validation
- **Error Handling**: Comprehensive error messages
- **Loading States**: User-friendly loading indicators
- **Access Denied Messages**: Toast notifications for unauthorized access

### 🗄️ **Database Features**

- **Bulletin Model**: Complete video data with timestamps
- **User Model**: Enhanced with `isAdmin`, `xVerified`, and `followedChannels` fields
- **Follow System**: Users can follow/unfollow channels with persistent storage
- **Upsert Operations**: Prevent duplicate entries
- **Validation**: Timestamp format validation (HH:MM)
- **Aggregation**: Channel statistics and video counts
- **Backfill Support**: Database migration utilities for new fields

---

## 🚀 **API Endpoints**

### 📊 **Bulletins API**

- `GET /api/bulletins` - Get all bulletins with filtering
- `GET /api/bulletins/all` - Get all active bulletins
- `GET /api/bulletins/simple` - Simplified bulletin data
- `POST /api/bulletins` - Create new bulletin
- `POST /api/bulletins/seed` - Seed sample data

### 📺 **Channels API**

- `GET /api/channels` - Get channel list with video counts
- `GET /api/channels/enhanced` - Enhanced channel data

### 👤 **User Management API**

- `GET /api/follow-channels` - Get user's followed channels
- `POST /api/follow-channels` - Follow/unfollow channels

### 🔐 **Authentication API**

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

---

## 🛠️ **Development Setup**

### 📦 **Dependencies**

```json
{
  "next": "14.x",
  "react": "18.x",
  "mongoose": "^8.x",
  "next-auth": "^4.x",
  "tailwindcss": "^3.x"
}
```

### 🔧 **Configuration Files**

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `jsconfig.json` - JavaScript path mapping
- `config.js` - Global application settings

### 🌍 **Environment Variables**

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_app_url
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
RESEND_API_KEY=your_resend_email_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## 📈 **Performance Optimizations**

### ⚡ **Next.js Optimizations**

- **App Router**: Latest Next.js routing system
- **Server Components**: Reduced client-side JavaScript
- **Suspense**: Loading states for better UX
- **Image Optimization**: Automatic image optimization

### 🎨 **Styling Optimizations**

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Theme**: Optimized dark mode design
- **Responsive Design**: Mobile-first approach
- **Component Reusability**: Modular component architecture

---

## 🔒 **Security Features**

### 🔐 **Authentication & Access Control**

- **NextAuth.js**: Industry-standard authentication with Google OAuth
- **Role-Based Access Control**: Admin access with `isAdmin` field
- **Protected Routes**: Admin and dashboard protection with server-side validation
- **Session Management**: Secure session handling with JWT tokens
- **X Verification**: Optional X (Twitter) verification system
- **Follow System**: User channel following with persistent storage

### 🛡️ **Data Protection**

- **Input Validation**: Mongoose schema validation
- **Error Handling**: Comprehensive error management
- **Environment Variables**: Secure configuration

---

## 🚀 **Deployment**

### 📦 **Vercel Deployment**

- **Zero Configuration**: Ready for Vercel deployment
- **Environment Variables**: Configure in Vercel dashboard
- **Automatic Builds**: Git-based deployment

### 🗄️ **Database Setup**

- **MongoDB Atlas**: Cloud database hosting
- **Connection String**: Environment variable configuration
- **Indexes**: Optimized database queries

---

## 📝 **Development Guidelines**

### 🎯 **Component Structure**

- **Server Components**: For data fetching
- **Client Components**: For interactivity
- **Reusable Components**: Modular design
- **Props Interface**: Clear prop definitions

### 🗄️ **Database Design**

- **Mongoose Models**: Structured data schemas
- **Validation**: Input validation and sanitization
- **Indexes**: Optimized query performance
- **Relationships**: Proper data relationships

### 🎨 **Styling Guidelines**

- **Tailwind CSS**: Consistent utility classes
- **Dark Theme**: Primary design system
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG compliance

---

## 📊 **Monitoring & Analytics**

### 📈 **Performance Monitoring**

- **Core Web Vitals**: Performance metrics
- **Error Tracking**: Comprehensive error logging
- **Database Monitoring**: Query performance

### 📊 **User Analytics**

- **Usage Tracking**: Feature usage analytics
- **Error Reporting**: User error reporting
- **Performance Metrics**: Load time optimization

---

## 🆕 **Recent Updates**

### 📅 **January 2025**

#### ✅ **User Management & Access Control**

- **Admin Access Control**: Implemented `isAdmin` field with role-based access
- **X Verification System**: Added `xVerified` field with default value `true`
- **Follow System**: Users can follow/unfollow channels with heart toggle buttons
- **Access Denied Handling**: Toast notifications and verification denied page

#### 🎨 **UI/UX Improvements**

- **Channel Cards**: Updated to 8-column responsive grid with smaller, more compact cards
- **Stats Cards**: Fixed to always show total numbers regardless of user's followed channels
- **Dashboard Wrapper**: Added access denied message handling
- **Verification Page**: Created `/verification-denied` page for non-verified users

#### 🔧 **Technical Enhancements**

- **Database Schema**: Enhanced User model with new fields and proper defaults
- **API Routes**: Added follow-channels endpoint for user channel management
- **Performance**: Optimized stats calculations with `useMemo` hooks
- **Error Handling**: Improved error messages and user feedback

#### 🛠️ **Build & Deployment**

- **Vercel Fixes**: Resolved build errors and linting issues
- **Environment Variables**: Updated configuration for all services
- **Code Quality**: Removed unused imports and fixed ESLint warnings

---

_Last Updated: January 2025_
_Version: 1.2.0_
