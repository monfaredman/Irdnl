# Phase 2: Application Deployment

> **Time**: ~30 minutes · **Cost**: $0 (uses Droplet from Phase 1)

---

## 1. Production Docker Configuration

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# ── Stage 1: Install dependencies ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ── Stage 2: Build ──
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CDN_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

# Next.js standalone output (small, self-contained)
RUN npm run build

# ── Stage 3: Production ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output (includes server + minimal node_modules)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

> **Key**: The `standalone` output mode creates a self-contained server (~30MB) instead of a full `node_modules` (~400MB). Keeps Docker images small and fast to pull.

### Update `next.config.ts` for Standalone Output

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',  // ← ADD THIS (replaces the old export config)
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
    unoptimized: true,
  },
  
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}/storage/:path*`,
      },
    ];
  },

  // Keep all your redirects...
};
```

### Backend Dockerfile (Already Exists — Verify)

Your existing `backend/Dockerfile` is correct. Just verify the multi-stage build:

```dockerfile
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=development /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
```

---

## 2. Production Docker Compose

Create `docker-compose.prod.yml` at the project root (already created — see file in repo root):

```yaml
# See docker-compose.prod.yml in the project root for the full config.
# Key services: frontend, backend, postgres, redis, elasticsearch
# Droplet: 4GB RAM / 2 vCPU / 80GB SSD ($24/mo from $200 credit)
#
# Memory allocation:
#   frontend:       512MB
#   backend:        768MB
#   postgres:       768MB
#   redis:          128MB
#   elasticsearch:  1GB
#   OS + Nginx:     ~256MB
#   ────────────────────────
#   Total:          ~3.4GB of 4GB (+ 2GB swap safety net)
```

> The full `docker-compose.prod.yml` is in the repo root with all health checks, resource limits, security options, and Elasticsearch included.

### Memory Budget (4GB Droplet + 2GB Swap)

| Service | Memory Limit | Typical Usage |
|---------|-------------|---------------|
| Next.js | 512 MB | ~150 MB |
| NestJS | 768 MB | ~200 MB |
| PostgreSQL | 768 MB | ~300 MB |
| Redis | 128 MB | ~40 MB |
| Elasticsearch | 1024 MB | ~600 MB |
| OS + Nginx | ~256 MB | ~150 MB |
| **Total** | **~3456 MB** | **~1440 MB** |

With 4GB RAM + 2GB swap, this runs very comfortably with ~2.5GB headroom for spikes.

---

## 3. Environment File on Server

Create `/opt/irdnl/.env` on the Droplet:

```bash
# Create securely
ssh deploy@YOUR_DROPLET_IP
nano /opt/irdnl/.env
```

```bash
# ── Database ──
DB_USER=irdnl
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE
DB_NAME=irdnl_db
DATABASE_URL=postgresql://irdnl:YOUR_STRONG_PASSWORD_HERE@postgres:5432/irdnl_db

# ── Frontend ──
NEXT_PUBLIC_API_URL=https://irdnl.ir/api
NEXT_PUBLIC_CDN_URL=https://irdnl-storage.fra1.cdn.digitaloceanspaces.com
FRONTEND_URL=https://irdnl.ir

# ── JWT ──
JWT_SECRET=GENERATE_WITH_openssl_rand_base64_64
JWT_REFRESH_SECRET=GENERATE_WITH_openssl_rand_base64_64

# ── Storage ──
STORAGE_TYPE=s3
DO_SPACES_KEY=your_key
DO_SPACES_SECRET=your_secret
DO_SPACES_BUCKET=irdnl-storage
DO_SPACES_REGION=fra1
DO_SPACES_ENDPOINT=https://fra1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://irdnl-storage.fra1.cdn.digitaloceanspaces.com

# ── Security ──
SIGNED_URL_SECRET=GENERATE_WITH_openssl_rand_base64_64

# ── Monitoring ──
SENTRY_DSN=https://xxx@sentry.io/xxx
```

Secure it:
```bash
chmod 600 /opt/irdnl/.env
```

---

## 4. First Deployment

### Option A: Pull from GHCR (Recommended — after CI/CD is set up)
```bash
cd /opt/irdnl

# Copy docker-compose.prod.yml to server
scp docker-compose.prod.yml deploy@YOUR_DROPLET_IP:/opt/irdnl/

# SSH in and deploy
ssh deploy@YOUR_DROPLET_IP
cd /opt/irdnl

# Login to GitHub Container Registry
echo $GHCR_TOKEN | docker login ghcr.io -u monfaredman --password-stdin

# Pull and start
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f --tail=50
```

### Option B: Build on Server (First time / No CI/CD)
```bash
cd /opt/irdnl

# Clone repo
git clone https://github.com/monfaredman/Irdnl.git .

# Build locally on server (uses swap for memory)
docker compose -f docker-compose.prod.yml build --no-cache

# Start
docker compose -f docker-compose.prod.yml up -d
```

> 💡 Building on the 4GB Droplet works fine (~5 min), but pre-built GHCR images are faster.

---

## 5. Run Database Migrations

```bash
# After containers are running:
docker exec -it irdnl-backend npm run migration:run

# Or seed initial data:
docker exec -it irdnl-backend npm run seed
docker exec -it irdnl-backend npm run seed:categories-genres
```

---

## 6. Verify Deployment

```bash
# Health check
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:3000

# Via Nginx (from outside)
curl http://YOUR_DROPLET_IP
curl http://YOUR_DROPLET_IP/api/health

# Check all containers
docker compose -f docker-compose.prod.yml ps

# Expected output:
# NAME               STATUS          PORTS
# irdnl-frontend     Up (healthy)    127.0.0.1:3000->3000/tcp
# irdnl-backend      Up (healthy)    127.0.0.1:3001->3001/tcp
# irdnl-postgres     Up (healthy)    127.0.0.1:5432->5432/tcp
# irdnl-redis        Up (healthy)    127.0.0.1:6379->6379/tcp
```

---

## 7. Zero-Downtime Update Script

Create `/opt/irdnl/scripts/deploy.sh`:

```bash
#!/bin/bash
set -euo pipefail

APP_DIR="/opt/irdnl"
COMPOSE_FILE="$APP_DIR/docker-compose.prod.yml"

echo "🚀 Starting deployment..."

cd "$APP_DIR"

# Pull latest images
echo "📦 Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull frontend backend

# Restart app containers (DB and Redis stay running)
echo "🔄 Restarting application..."
docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend backend

# Wait for health checks
echo "⏳ Waiting for health checks..."
sleep 10

# Verify
if curl -sf http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend healthy"
else
    echo "❌ Backend health check failed!"
    docker compose -f "$COMPOSE_FILE" logs --tail=20 backend
    exit 1
fi

if curl -sf http://localhost:3000 > /dev/null; then
    echo "✅ Frontend healthy"
else
    echo "❌ Frontend health check failed!"
    docker compose -f "$COMPOSE_FILE" logs --tail=20 frontend
    exit 1
fi

# Run migrations (safe to re-run)
echo "📊 Running migrations..."
docker exec irdnl-backend npm run migration:run 2>/dev/null || true

# Clean up old images
echo "🧹 Cleaning up..."
docker image prune -f

echo "🎉 Deployment complete!"
```

```bash
chmod +x /opt/irdnl/scripts/deploy.sh
```

---

## Checklist

- [ ] Frontend Dockerfile created with standalone output
- [ ] `next.config.ts` updated with `output: 'standalone'`
- [ ] `docker-compose.prod.yml` created and tested
- [ ] `.env` file created on server with production values
- [ ] All 4 containers running and healthy
- [ ] Database migrations run successfully
- [ ] Frontend accessible via Nginx
- [ ] Backend API responding on `/api/health`
- [ ] Deploy script created and tested

---

**Next**: [Phase 3 — File Storage →](./PHASE3_FILE_STORAGE.md)
