# Frontend sitemap (generated)

This document inventories Next.js App Router pages under `src/app/**/page.tsx` and highlights known navigation targets.

> Notes
>
> - Dynamic route pages exist for `/movies/[slug]`, `/series/[slug]`, and `/admin/content/[id]`.
> - Query-string variants (e.g. `/movies?origin=foreign`) are treated as the **same** page route (`/movies`).
> - One known broken route was found and disabled: `/movie-party`.

## ✅ Route inventory

### Public
- `/`
- `/about`
- `/account`
- `/careers`
- `/collections`
- `/coming-soon`
- `/contact`
- `/cookies`
- `/faq`
- `/genres`
- `/help`
- `/kids`
- `/movies`
- `/movies/[slug]`
- `/press`
- `/privacy`
- `/search`
- `/series`
- `/series/[slug]`
- `/terms`
- `/top-250`

### Auth
- `/auth/login`
- `/auth/register`

### User
- `/user/history`
- `/user/payment`
- `/user/profile`
- `/user/settings`
- `/user/subscription`
- `/user/watchlist`

### Admin
- `/admin/login`
- `/admin/dashboard`
- `/admin/content`
- `/admin/content/new`
- `/admin/content/[id]`
- `/admin/finance`
- `/admin/notifications`
- `/admin/users`
- `/admin/videos`

## 🔗 Navigation surfaces (high level)

### Header / AppBar
- `PremiumLiquidGlassHeader` links primarily route to:
  - `/movies` (+ query variants)
  - `/series` (+ query variants)
  - `/genres` (+ query variants)
  - `/top-250`, `/coming-soon`, `/collections`, `/kids`, `/account`

### Footer
- `PremiumLiquidGlassFooter` links to:
  - Content: `/movies`, `/series`, `/genres`
  - Support: `/help`, `/contact`, `/faq`
  - Company: `/about`, `/careers`, `/press`
  - Legal: `/privacy`, `/terms`, `/cookies`

### Sidebar, carousels, cards
- Multiple components generate deep links to:
  - `/movies/{slug}`
  - `/series/{slug}`

## 🚫 Broken / removed links

- `/movie-party` (referenced from `components/sections/PersianHero.tsx`) — **no page exists**, link is currently disabled.

## 🧭 Orphaned pages (needs confirmation)

The following pages may be **orphaned** (no obvious incoming Link/router navigation found in the initial grep pass):
- `/admin/finance`
- `/admin/notifications`
- `/admin/users`
- `/admin/videos`
- `/user/payment`
- `/user/subscription`

These might still be reachable via runtime-generated menus or conditional rendering; we should confirm by scanning the nav arrays in `UserLayout` and admin components more thoroughly.

## 🧩 Inconsistent URLs (needs confirmation)

Potential inconsistencies to standardize via `src/lib/routes.ts`:
- Direct `window.location.href = '/admin/login'` vs router navigation or `<Link />` (found in `src/lib/api/admin.ts`).
- Multiple query patterns to the same pages (expected), ensure they’re deliberately supported.
