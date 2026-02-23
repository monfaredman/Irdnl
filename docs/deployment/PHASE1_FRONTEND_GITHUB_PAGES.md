# Phase 1: Frontend Deployment — GitHub Pages

> **Stack**: Next.js 16 + React 19 + MUI 7 + Tailwind CSS 4  
> **Cost**: FREE (GitHub Pages)  
> **Estimated Time**: 30–45 minutes

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Preparation](#2-project-preparation)
3. [Next.js Static Export Configuration](#3-nextjs-static-export-configuration)
4. [Environment Variables](#4-environment-variables)
5. [GitHub Actions Workflow](#5-github-actions-workflow)
6. [Custom Domain Setup](#6-custom-domain-setup-optional)
7. [Deployment Verification](#7-deployment-verification)
8. [Cost Breakdown](#8-cost-breakdown)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

- [x] GitHub repository: `monfaredman/Irdnl`
- [x] Node.js 20+ installed locally
- [x] GitHub Student Pack activated (provides free GitHub Pro features)
- [ ] Backend API deployed and accessible (Phase 2)

---

## 2. Project Preparation

### 2.1 Important Consideration: GitHub Pages Limitations

GitHub Pages serves **static files only**. Next.js 16 with App Router uses **Server-Side Rendering (SSR)** by default. You must configure Next.js for **static export** (`output: 'export'`).

**What this means for IrDnl:**

| Feature | Status | Solution |
|---------|--------|----------|
| SSR/API routes | ❌ Not supported | Move to backend API |
| Dynamic routes (`[id]`) | ⚠️ Limited | Use `generateStaticParams()` |
| `next/image` optimization | ❌ Not supported | Already using `unoptimized: true` ✅ |
| Rewrites/redirects | ❌ Not supported | Handle client-side |
| Middleware | ❌ Not supported | Move to backend |
| PWA | ✅ Works | Service worker is static |

### 2.2 Alternative Recommendation

> **⚠️ IMPORTANT**: Given your app uses dynamic routing (`/item/[id]`, `/watch/[id]`), API proxying (`rewrites`), and SSR patterns, **Vercel (free tier) or Cloudflare Pages** would be much better fits than GitHub Pages. GitHub Pages requires full static export which will break dynamic content loading.
>
> If you still want GitHub Pages, proceed below. Otherwise, see [Alternative: Vercel Deployment](#alternative-vercel-deployment) at the bottom.

---

## 3. Next.js Static Export Configuration

### 3.1 Update `next.config.ts`

Create a production-specific config for GitHub Pages:

```typescript
// frontend/next.config.ts
import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
const repoName = 'Irdnl'; // Your GitHub repo name

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Enable static export for GitHub Pages
  ...(isGitHubPages && {
    output: 'export',
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    trailingSlash: true,
  }),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
    unoptimized: true, // Required for static export
  },

  // Rewrites only work in non-static mode
  ...(!isGitHubPages && {
    async rewrites() {
      return [
        {
          source: "/storage/:path*",
          destination: "http://localhost:3001/storage/:path*",
        },
      ];
    },
  }),

  // Redirects only work in non-static mode
  ...(!isGitHubPages && {
    async redirects() {
      return [
        {
          source: "/genres",
          destination: "/category",
          permanent: true,
        },
        // ... rest of your redirects
      ];
    },
  }),
};

export default nextConfig;
```

### 3.2 Handle Dynamic Routes

For pages like `/item/[id]`, you need `generateStaticParams()`:

```typescript
// frontend/src/app/item/[id]/page.tsx
// Add this export to generate static pages at build time
export async function generateStaticParams() {
  // Fetch all content IDs from your API at build time
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/public/content?limit=1000`
    );
    const data = await res.json();
    return data.items?.map((item: any) => ({ id: item.id })) || [];
  } catch {
    return [];
  }
}
```

### 3.3 Create API Helper for Static Mode

```typescript
// frontend/src/lib/api/config.ts
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  storageUrl: process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:3001/storage',
};

// In static export mode, storage URLs must be absolute
export function getStorageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.storageUrl}/${path.replace(/^\/storage\//, '')}`;
}
```

---

## 4. Environment Variables

### 4.1 GitHub Repository Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-app.herokuapp.com/api` | Backend API URL (from Phase 2) |
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-app.herokuapp.com` | Backend base URL |
| `NEXT_PUBLIC_STORAGE_URL` | `https://your-space.sgp1.digitaloceanspaces.com` | Storage URL (from Phase 4) |
| `NEXT_PUBLIC_TMDB_API_KEY` | `your-tmdb-key` | TMDB API key |

### 4.2 Create `.env.production` Template

```bash
# frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com/api
NEXT_PUBLIC_API_BASE_URL=https://your-app.herokuapp.com
NEXT_PUBLIC_STORAGE_URL=https://your-space.sgp1.digitaloceanspaces.com
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
DEPLOY_TARGET=github-pages
```

---

## 5. GitHub Actions Workflow

### 5.1 Create Workflow File

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build with Next.js
        env:
          DEPLOY_TARGET: github-pages
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
          NEXT_PUBLIC_STORAGE_URL: ${{ secrets.NEXT_PUBLIC_STORAGE_URL }}
          NEXT_PUBLIC_TMDB_API_KEY: ${{ secrets.NEXT_PUBLIC_TMDB_API_KEY }}
          NEXT_PUBLIC_TMDB_BASE_URL: https://api.themoviedb.org/3
          NEXT_PUBLIC_TMDB_IMAGE_BASE_URL: https://image.tmdb.org/t/p
        run: npm run build

      - name: Add .nojekyll
        run: touch out/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./frontend/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5.2 Enable GitHub Pages

1. Go to repository **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will deploy automatically on next push

---

## 6. Custom Domain Setup (Optional)

### 6.1 DNS Configuration

Add a CNAME record at your DNS provider:

```
Type: CNAME
Name: www
Value: monfaredman.github.io
TTL: 3600
```

For apex domain (`irdnl.com`):

```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### 6.2 GitHub Configuration

1. Go to **Settings → Pages → Custom domain**
2. Enter your domain name
3. Check **Enforce HTTPS**

### 6.3 Create CNAME file

```bash
# frontend/public/CNAME
irdnl.com
```

### 6.4 Update next.config.ts for Custom Domain

When using a custom domain, remove `basePath` and `assetPrefix`:

```typescript
// With custom domain, no basePath needed
...(isGitHubPages && {
  output: 'export',
  trailingSlash: true,
  // basePath and assetPrefix NOT needed with custom domain
}),
```

---

## 7. Deployment Verification

### 7.1 Pre-Deployment Checklist

```bash
# Test static export locally
cd frontend
DEPLOY_TARGET=github-pages npm run build

# Verify output directory exists
ls -la out/

# Serve locally to test
npx serve out
# Visit http://localhost:3000/Irdnl/
```

### 7.2 Post-Deployment Checks

| Check | URL | Expected |
|-------|-----|----------|
| Homepage | `https://monfaredman.github.io/Irdnl/` | Page loads with content |
| API Connection | Browser DevTools → Network | API calls to Heroku succeed |
| Images | Any content page | TMDB images load correctly |
| Navigation | Click between pages | Client-side routing works |
| 404 Page | `/Irdnl/nonexistent` | Custom 404 or fallback |

### 7.3 Automated Health Check

```bash
# Quick verification script
#!/bin/bash
SITE_URL="https://monfaredman.github.io/Irdnl"

echo "🔍 Checking deployment..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")

if [ "$STATUS" = "200" ]; then
  echo "✅ Site is live! (HTTP $STATUS)"
else
  echo "❌ Site returned HTTP $STATUS"
fi

# Check if JS bundles load
echo "🔍 Checking assets..."
curl -s "$SITE_URL" | grep -o '_next/static/[^"]*' | head -5
```

---

## 8. Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| GitHub Pages hosting | **$0/month** | Free for public repos |
| GitHub Actions CI/CD | **$0/month** | 2,000 min/month free |
| Custom domain | **$0–12/year** | Optional, varies by registrar |
| SSL certificate | **$0** | Free via GitHub/Let's Encrypt |
| **Total** | **$0/month** | |

### Student Pack Bonus

- GitHub Pro features (free with Student Pack)
- Unlimited private repos
- 3,000 Actions minutes/month (vs 2,000 free)

---

## 9. Troubleshooting

### Common Issues

#### Issue: Blank page after deployment

```
Cause: basePath not configured correctly
Fix: Ensure basePath matches your repo name exactly (case-sensitive)
```

#### Issue: 404 on page refresh

```
Cause: GitHub Pages doesn't support SPA routing
Fix: Add a custom 404.html that redirects to index.html

Create frontend/public/404.html:
```

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script type="text/javascript">
    // Single Page App redirect for GitHub Pages
    var pathSegmentsToKeep = 1; // Keep /Irdnl/ prefix
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body></body>
</html>
```

#### Issue: API calls blocked by CORS

```
Cause: Backend doesn't allow GitHub Pages origin
Fix: Update CORS in backend main.ts:
  origin: ['http://localhost:3000', 'https://monfaredman.github.io']
```

#### Issue: Mixed content errors (HTTP/HTTPS)

```
Cause: API URL uses http:// while site is served over https://
Fix: Ensure all NEXT_PUBLIC_* URLs use https://
```

#### Issue: Build fails with dynamic routes

```
Cause: generateStaticParams() can't reach API during build
Fix: Either:
  1. Ensure API is accessible during build
  2. Return empty array to skip pre-rendering
  3. Use fallback: true for client-side rendering
```

---

## Alternative: Vercel Deployment (Recommended)

> Given the IrDnl app uses dynamic routes, API rewrites, and SSR patterns, **Vercel is the recommended free option**.

### Quick Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Link to your GitHub repo
# - Framework: Next.js (auto-detected)
# - Root directory: frontend
# - Build command: npm run build
# - Output directory: .next
```

### Vercel Environment Variables

Set in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-app.herokuapp.com/api` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-app.herokuapp.com` |
| `NEXT_PUBLIC_TMDB_API_KEY` | `your-tmdb-key` |

**Vercel Free Tier includes:**
- Unlimited static sites
- 100 GB bandwidth/month
- Serverless functions
- Automatic HTTPS
- Preview deployments for PRs

---

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/deploy-frontend.yml` | Create | CI/CD pipeline |
| `frontend/next.config.ts` | Modify | Static export config |
| `frontend/.env.production` | Create | Production env vars |
| `frontend/public/404.html` | Create | SPA routing fallback |
| `frontend/public/CNAME` | Create | Custom domain (optional) |
| `frontend/src/lib/api/config.ts` | Create | API URL management |
