# 🎬 IrDnl — Cinema Redefined

> A premium Persian-first streaming platform with a modern liquid glass UI, full-stack content management, and production-ready video delivery infrastructure.

---

## 📌 Project Overview

**IrDnl** is an end-to-end video streaming platform designed for the Iranian/Persian audience. It enables users to browse, search, and stream movies and series through a cinematic, glassmorphism-inspired interface — while administrators manage all content, users, and video assets through a powerful admin CMS.

### Core Goals

| Goal | Description |
|------|-------------|
| **Persian-First Experience** | RTL layout, Vazirmatn font, full Farsi localization |
| **Cinematic UI** | Liquid glass design system with premium feel |
| **Full Content Lifecycle** | Upload → Transcode → Publish → Stream |
| **Series Architecture** | Seasons, episodes, per-episode video upload with auto-linking |
| **Admin CMS** | Multi-step content wizard, user management, analytics dashboard |
| **Production-Ready Backend** | Modular NestJS API with JWT auth, caching, job queue |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│                   Next.js 16 · React 19 · Tailwind              │
└──────────────────────────┬──────────────────────────────────────┘
                           │  REST / JSON
┌──────────────────────────▼──────────────────────────────────────┐
│                      API Gateway (NestJS)                        │
│            /api prefix · JWT Auth · Swagger Docs                 │
├──────────┬───────────┬───────────┬──────────┬───────────────────┤
│  Auth    │  Content  │  Admin    │  Video   │  Watch / Watchlist │
│  Module  │  Module   │  Module   │  Assets  │  Modules           │
└────┬─────┴─────┬─────┴─────┬─────┴────┬─────┴───────────────────┘
     │           │           │          │
┌────▼───┐  ┌───▼────┐  ┌───▼───┐  ┌──▼──────┐
│ Redis  │  │ Postgres│  │ Jobs  │  │ Storage │
│ Cache  │  │ TypeORM │  │ Queue │  │ Local/S3│
└────────┘  └────────┘  └───────┘  └─────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand |
| **UI Components** | Radix UI, Lucide Icons, Embla Carousel, Recharts |
| **Design System** | Custom Liquid Glass / Glassmorphism theme |
| **Backend** | NestJS 10, TypeScript, TypeORM |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Auth** | JWT + Refresh Tokens, Passport.js |
| **Video Player** | Video.js 8 |
| **API Docs** | Swagger / OpenAPI |
| **DevOps** | Docker Compose, Biome (lint/format) |

---

## 📁 Project Structure

```
IrDnl/
├── docker-compose.yml            # PostgreSQL + Redis + Backend
│
├── backend/                      # NestJS API Server (port 3001)
│   ├── src/
│   │   ├── main.ts               # Bootstrap, Swagger, CORS
│   │   ├── app.module.ts         # Root module
│   │   ├── config/               # TypeORM & env configuration
│   │   ├── migrations/           # Database migrations
│   │   └── modules/
│   │       ├── admin/            # CMS: content CRUD, user mgmt, uploads
│   │       ├── auth/             # JWT login, register, refresh, guards
│   │       ├── content/          # Public content browsing, TMDB integration
│   │       ├── users/            # User entities, profiles, roles
│   │       ├── video-assets/     # Upload, storage, transcoding, DRM (future)
│   │       ├── watch-history/    # Watch progress tracking
│   │       ├── watchlist/        # User saved content
│   │       ├── jobs/             # Background job queue (transcoding, etc.)
│   │       ├── analytics/        # Platform analytics
│   │       ├── notifications/    # Notification system
│   │       └── health/           # Health checks (DB, memory)
│   └── test/                     # E2E tests
│
├── frontend/                     # Next.js Application (port 3000)
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── admin/            # Admin panel (dashboard, content, users, videos)
│   │   │   ├── auth/             # Login & register
│   │   │   ├── item/             # Content detail page (movie/series)
│   │   │   ├── movies/           # Movies listing
│   │   │   ├── series/           # Series listing
│   │   │   ├── genres/           # Genre browsing
│   │   │   ├── search/           # Search experience
│   │   │   ├── category/         # Category pages
│   │   │   ├── cast/             # Actor/cast detail
│   │   │   ├── kids/             # Kids-safe content
│   │   │   ├── top-250/          # Top rated content
│   │   │   ├── collections/      # Curated collections
│   │   │   ├── coming-soon/      # Upcoming releases
│   │   │   ├── dubbed/           # Dubbed content
│   │   │   ├── anime/            # Anime category
│   │   │   ├── animation/        # Animation category
│   │   │   ├── account/          # User account settings
│   │   │   └── ...               # FAQ, contact, privacy, terms, etc.
│   │   ├── components/
│   │   │   ├── layout/           # Header, footer, sidebar, skeleton loaders
│   │   │   ├── sections/         # Hero, carousels, grids, filters
│   │   │   ├── media/            # MediaCard, VideoPlayer, SeasonsEpisodes
│   │   │   ├── admin/            # Admin panel components
│   │   │   ├── auth/             # Auth forms
│   │   │   ├── navigation/       # Language toggle
│   │   │   ├── ads/              # Promotional components
│   │   │   └── modals/           # Dialog components
│   │   ├── hooks/                # Custom hooks (useAuth, useTMDB, etc.)
│   │   ├── lib/                  # API clients, utilities, TMDB service
│   │   ├── store/                # Zustand stores (auth, admin-auth)
│   │   ├── providers/            # Context providers (auth, language, theme)
│   │   ├── types/                # TypeScript type definitions
│   │   ├── config/               # Category configurations
│   │   ├── data/                 # Mock data & navigation config
│   │   ├── theme/                # Design tokens
│   │   └── i18n/                 # fa.json — Persian translations
│   └── public/                   # Static assets (images, avatars, etc.)
```

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │   content    │     │ video_assets  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ email        │     │ title        │     │ contentId (FK)│
│ password     │     │ type (movie/ │     │ episodeId (FK)│
│ role (user/  │     │       series)│     │ quality       │
│       admin) │     │ posterUrl    │     │ status        │
│ name         │     │ bannerUrl    │     │ hlsUrl        │
│ avatar       │     │ thumbnailUrl │     │ filesize      │
│ createdAt    │     │ rating       │     │ duration      │
└──────────────┘     │ genres[]     │     └──────────────┘
                     │ status       │
      ┌──────────────│ ...          │
      │              └──────┬───────┘
      │                     │ 1:1 (series)
      │              ┌──────▼───────┐
      │              │    series    │
      │              ├──────────────┤
      │              │ id (PK)      │
      │              │ contentId(FK)│
      │              └──────┬───────┘
      │                     │ 1:N
      │              ┌──────▼───────┐
      │              │   seasons    │
      │              ├──────────────┤
      │              │ id (PK)      │
      │              │ seriesId(FK) │
      │              │ number       │
      │              │ title        │
      │              └──────┬───────┘
      │                     │ 1:N
      │              ┌──────▼───────┐
      │              │   episodes   │
      │              ├──────────────┤
      │              │ id (PK)      │
      │              │ seasonId(FK) │
      │              │ number       │
      │              │ title        │
      │              │ videoAssetId │──── FK → video_assets
      │              │ externalUrl  │
      │              │ duration     │
      │              └──────────────┘
      │
┌─────▼────────┐     ┌──────────────┐     ┌──────────────┐
│watch_history │     │  watchlist   │     │    jobs      │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ userId (FK)  │     │ userId (FK)  │     │ type         │
│ contentId(FK)│     │ contentId(FK)│     │ payload      │
│ progress     │     │ createdAt    │     │ status       │
│ updatedAt    │     └──────────────┘     │ result       │
└──────────────┘                          └──────────────┘
```

---

## 🔑 Key Features

### 🎥 Public-Facing (User)

- **Homepage** — Hero showcase, carousels (trending, new releases, continue watching)
- **Content Detail** — Cinematic hero banner, synopsis, cast gallery, ratings, comments
- **Series Player** — Season tabs, episode list, external/internal video playback
- **Search** — Full-text search with category/genre filters
- **Browse** — Movies, series, genres, kids, anime, dubbed, top-250, collections
- **User Account** — Watch history, watchlist, profile settings
- **Responsive** — Mobile-first, PWA-ready
- **Bilingual** — Full Persian (fa) localization with RTL support

### 🛡️ Admin CMS

- **Dashboard** — Platform statistics overview
- **Content Management** — Multi-step creation wizard (basic info → media → metadata → localization → technical specs → SEO → review)
- **Series Management** — Create/edit seasons and episodes inline
- **Episode Video Upload** — Direct per-episode upload with automatic VideoAsset linking
- **User Management** — List, edit roles, activate/deactivate users
- **Video Assets** — Upload, track transcoding status, manage qualities
- **Finance** — Subscription and monetization tracking (planned)
- **Notifications** — Platform notification management

### 🔧 Backend API

- **Authentication** — Register, login, JWT access + refresh token rotation
- **Role-Based Access** — `user` and `admin` roles with route guards
- **Content CRUD** — Full admin endpoints with validation, pagination, filtering
- **Video Upload** — Multipart upload → local/S3 storage → transcoding job queue
- **TMDB Integration** — Auto-fill content metadata from The Movie Database
- **Watch History** — Track and resume user progress
- **Watchlist** — Save/remove content
- **Health Checks** — Database and memory monitoring
- **Swagger Docs** — Auto-generated interactive API documentation at `/api`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **Docker** & Docker Compose
- **PostgreSQL** 15+ (or use Docker)
- **Redis** 7+ (or use Docker)

### 1. Start Infrastructure

```bash
docker-compose up -d postgres redis
```

### 2. Start Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run seed              # Optional: seed sample data
npm run start:dev         # Runs on http://localhost:3001
```

API Docs: [http://localhost:3001/api](http://localhost:3001/api)

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev               # Runs on http://localhost:3000
```

### 4. Full Stack (Docker)

```bash
docker-compose up -d
```

---

## 🔌 API Endpoints (Summary)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login, receive JWT |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/content` | Browse content (paginated) |
| `GET` | `/api/content/:id` | Content detail with series/seasons/episodes |
| `GET` | `/api/content/search` | Search content |
| `POST` | `/api/admin/content` | Create content (admin) |
| `PUT` | `/api/admin/content/:id` | Update content (admin) |
| `DELETE` | `/api/admin/content/:id` | Delete content (admin) |
| `POST` | `/api/admin/seasons` | Create season (admin) |
| `POST` | `/api/admin/episodes` | Create episode (admin) |
| `POST` | `/api/admin/videos/upload` | Upload video for content/episode (admin) |
| `POST` | `/api/admin/images/upload` | Upload poster/banner image (admin) |
| `GET` | `/api/admin/users` | List users (admin) |
| `GET` | `/api/watch-history` | User's watch history |
| `POST` | `/api/watchlist/:contentId` | Add to watchlist |
| `GET` | `/api/health` | System health check |

---

## 🎨 Design System

The frontend uses a custom **Liquid Glass** design system:

- **Glassmorphism Effects** — Frosted glass cards, translucent overlays
- **Dark Theme** — Cinema-grade dark backgrounds with subtle gradients
- **Typography** — Vazirmatn (Persian/Arabic), Geist (Latin)
- **Motion** — Smooth transitions, carousel animations (Embla)
- **Components** — Radix UI primitives styled with Tailwind CSS
- **Responsive** — Mobile-first with breakpoints for tablet/desktop
- **RTL** — Full right-to-left support for Persian interface

---

## 🗺️ Roadmap

### ✅ Completed

- [x] NestJS backend with modular architecture
- [x] JWT authentication with refresh tokens
- [x] Content CRUD with full metadata support
- [x] Series → Seasons → Episodes hierarchy
- [x] Per-episode video upload with auto-linking
- [x] Admin CMS with multi-step content wizard
- [x] TMDB auto-fill integration
- [x] Persian localization (RTL)
- [x] Liquid glass UI design system
- [x] Video.js player integration
- [x] Docker Compose development setup
- [x] Swagger API documentation

### 🔄 In Progress

- [ ] Video transcoding workers (FFmpeg / cloud)
- [ ] Advanced search with Elasticsearch
- [ ] Push notifications system

### 📋 Planned

- [ ] DRM integration (Widevine, FairPlay, PlayReady)
- [ ] CDN signed URLs (CloudFront / Cloudflare)
- [ ] Payment gateway integration (Zarinpal / Stripe)
- [ ] Subscription tiers and billing
- [ ] Device management and concurrent stream limits
- [ ] OTP verification (SMS via Kavenegar / email via SendGrid)
- [ ] S3 storage adapter for production
- [ ] Analytics dashboard with Recharts
- [ ] Content recommendation engine
- [ ] Progressive Web App (PWA) with offline support
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Error tracking (Sentry)

---

## 📜 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `API_PREFIX` | API route prefix | `api` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database user | `irdnl` |
| `DB_PASSWORD` | Database password | `irdnl123` |
| `DB_DATABASE` | Database name | `irdnl_db` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_SECRET` | Refresh token secret | — |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `STORAGE_TYPE` | Storage adapter (`local` / `s3`) | `local` |
| `STORAGE_LOCAL_PATH` | Local upload directory | `./storage` |
| `FRONTEND_URL` | CORS origin | `http://localhost:3000` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and unlicensed for public distribution.

---

<p align="center">
  <strong>IrDnl</strong> — Cinema Redefined 🎬
  <br/>
  Built with ❤️ for the Persian-speaking community
</p>
