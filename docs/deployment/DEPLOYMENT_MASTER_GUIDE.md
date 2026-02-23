# IrDnl — Production Deployment Master Guide

> **SSR-Ready Architecture · ALL GitHub Student Pack Credits BURNED in 6 Months · $0 Out-of-Pocket**
>
> 🔥 **Strategy**: Spend every dollar of every credit within 6 months. Maximum power, zero waste.
> ⏰ **Plan horizon**: Months 1–6 only. After Month 6 you create a completely new plan.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Services Table](#2-services-table)
3. [Monthly Cost Breakdown](#3-monthly-cost-breakdown)
4. [Credit Usage Timeline](#4-credit-usage-timeline)
5. [Step-by-Step Deployment Plan](#5-step-by-step-deployment-plan)
6. [CI/CD Pipeline](#6-cicd-pipeline)
7. [Alternative Architectures](#7-alternative-architectures)
8. [Environment Variables Reference](#8-environment-variables-reference)
9. [Monitoring & Observability](#9-monitoring--observability)
10. [Maintenance Runbook](#10-maintenance-runbook)

---

## 1. Architecture Overview

### Why NOT GitHub Pages?
- ❌ GitHub Pages = **static files only** (no SSR, no API routes, no `getServerSideProps`)
- ❌ Your app uses `useParams`, dynamic routes, rewrites, redirects — all need a Node.js server
- ❌ Static export (`output: 'export'`) requires `generateStaticParams` on every dynamic route (21+ pages)
- ✅ **SSR on DigitalOcean** = full Next.js features, same cost, far simpler

### Final Architecture Diagram

```
                    ┌─────────────────────────────────────────────────────┐
                    │              GitHub (Free)                          │
                    │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
                    │  │   Repo   │  │ Actions  │  │ Container        │  │
                    │  │  (Code)  │  │  (CI/CD) │  │ Registry (GHCR)  │  │
                    │  └──────────┘  └────┬─────┘  └────────┬─────────┘  │
                    └─────────────────────┼─────────────────┼────────────┘
                                          │ deploy          │ pull image
                    ┌─────────────────────▼─────────────────▼────────────┐
                    │      DigitalOcean Droplet 4GB ($24/mo)             │
                    │      Ubuntu 24.04 · 4 GB RAM · 80 GB SSD · 2 vCPU │
                    │                                                    │
                    │  ┌────────────────── Docker Compose ─────────────┐ │
                    │  │                                                │ │
                    │  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │ │
                    │  │  │ Next.js  │  │ NestJS   │  │   Nginx     │ │ │
                    │  │  │ SSR :3000│  │ API :3001│  │ Reverse     │ │ │
                    │  │  │ 512MB    │  │ 768MB    │  │ Proxy :80   │ │ │
                    │  │  └──────────┘  └──────────┘  │ + SSL :443  │ │ │
                    │  │                               └──────┬──────┘ │ │
                    │  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │ │
                    │  │  │ Postgres │  │  Redis   │  │ Elastic-    │ │ │
                    │  │  │   :5432  │  │  :6379   │  │ search :9200│ │ │
                    │  │  │ 768MB    │  │ 128MB    │  │ 1GB         │ │ │
                    │  │  └──────────┘  └──────────┘  └─────────────┘ │ │
                    │  └────────────────────────────────────────────────┘ │
                    └────────────────────┬───────────────────────────────┘
                                         │ Origin (SSL Full Strict)
                    ┌────────────────────▼───────────────────────────────┐
                    │        Cloudflare (Free Plan — $0/mo)              │
                    │        irdnl.ir · DDoS Protection · CDN · WAF     │
                    │        NS: albert.ns.cloudflare.com               │
                    │            tori.ns.cloudflare.com                 │
                    │        SSL: Full (Strict) + Origin Certificate    │
                    └────────────────────┬──────────────────────────────┘
                                         │ ← Users connect here
                    ┌────────────────────┼──────────────────────────────┐
                    │      DigitalOcean Spaces + CDN ($5/mo)             │
                    │      250 GB Storage · 1 TB Transfer                │
                    │      Videos · Images · Subtitles · Backups         │
                    └───────────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼──────────────────────────────┐
                    │        Heroku Staging ($13/mo from credits)        │
                    │        Full staging mirror: API + Postgres + Redis │
                    └───────────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼──────────────────────────────┐
                    │        Azure ($100 credit — burn in 6 months)      │
                    │        B1s VM for load testing / extra services     │
                    └───────────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼──────────────────────────────┐
                    │              Monitoring (All Active)               │
                    │  ┌────────┐  ┌────────────┐  ┌───────────────┐    │
                    │  │ Sentry │  │ UptimeRobot│  │ Datadog Pro   │    │
                    │  │ Errors │  │ Uptime     │  │ Full APM+Logs │    │
                    │  └────────┘  └────────────┘  └───────────────┘    │
                    └───────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Droplet size?** | 🔥 **4GB RAM ($24/mo)** — not 1GB | $200 ÷ 6 = $33/mo budget. Spend it! 4GB runs everything including ES |
| **Elasticsearch?** | ✅ **YES — enable it!** | 4GB Droplet has enough RAM. Full search power from Day 1 |
| **Use Docker?** | ✅ Yes — Docker Compose | Reproducible deploys, easy rollbacks, matches dev setup |
| **Database?** | On the Droplet (not managed) | Managed DB costs extra. Self-hosted is fine with backups |
| **Heroku?** | 🔥 **Full staging environment** | $13/mo × 6 = $78 — burn all of it. Staging API + DB |
| **Azure?** | 🔥 **Load testing + extra services** | $100 one-time — burn all $100 within 6 months |
| **Datadog?** | 🔥 **Full Pro APM + Logs + Infra** | 2yr free — use every feature: traces, profiling, dashboards |
| **DO Spaces?** | ✅ Yes ($5/mo) | Storage + CDN, total DO spend = $29/mo × 6 = $174 |
| **Remaining $26 DO credit?** | Droplet snapshots + extra bandwidth | Weekly snapshots ($0.05/GB) for disaster recovery |
| **Domain?** | ✅ `irdnl.ir` — already purchased | Connected to Cloudflare DNS, nameservers active |
| **SSL/CDN/WAF?** | ✅ **Cloudflare Free** ($0/mo) | Origin Certificate (15yr), DDoS, CDN, WAF, bot protection — all free |

---

## 2. Services Table — ALL CREDITS USED

| Service | Purpose | Provider | Cost/mo | Credit Source | 6-Month Spend |
|---------|---------|----------|---------|---------------|---------------|
| **Droplet (4GB/2vCPU)** | Next.js SSR + NestJS + Postgres + Redis + ES | DigitalOcean | $24 | DO $200 | **$144** |
| **Spaces (250GB+CDN)** | Video/image storage + CDN | DigitalOcean | $5 | DO $200 | **$30** |
| **Droplet Snapshots** | Weekly disaster recovery snapshots | DigitalOcean | ~$4/mo | DO $200 | **~$26** |
| **Heroku Eco Dyno** | Full staging: API + Postgres + Redis | Heroku | $13 | Student Pack | **$78** |
| **Azure B1s VM** | Load testing, CI runners, burst compute | Azure | ~$17 | Student Pack | **$100** |
| **Datadog Pro** | Full APM, traces, logs, infra dashboards | Datadog | $0 | Student Pack 2yr | **$0** (free) |
| **Sentry** | Error tracking (5K events/mo) | Sentry | $0 | Free tier | $0 |
| **UptimeRobot** | Uptime monitoring (50 monitors) | UptimeRobot | $0 | Free tier | $0 |
| **GitHub Actions** | CI/CD pipeline | GitHub | $0 | Free | $0 |
| **GHCR** | Docker image registry | GitHub | $0 | Free | $0 |
| **SSL** | HTTPS certificates | Cloudflare Origin Cert | $0 | Free (15yr cert) | $0 |
| **DNS + CDN + WAF** | DNS, DDoS, caching, WAF | Cloudflare Free | $0 | Free | $0 |
| **Domain** | `irdnl.ir` | nic.ir | ~$1/mo | Already purchased | ~$5 |

### 💰 6-Month Credit Burn Summary

| Credit Source | Total Available | Spent in 6 Months | Remaining | Status |
|---------------|----------------|-------------------|-----------|--------|
| **DigitalOcean** | $200 | **$200** ($144 + $30 + $26) | **$0** | 🔥 Fully burned |
| **Heroku** | $312 ($13×24) | **$78** ($13 × 6) | $234 | ⚡ 25% used |
| **Azure** | $100 | **$100** | **$0** | 🔥 Fully burned |
| **Datadog Pro** | 2 years free | $0 (6 months of Pro) | 18 months left | ⚡ Active |
| **Out-of-pocket** | — | **~$5** (domain only, already paid) | — | ✅ |
| **TOTAL CREDITS BURNED** | **$612** | **$378** | **$234** (Heroku only) | |

> 🔥 You burn **$378 of free credits** in 6 months. Only ~$5 out-of-pocket (domain — already paid).
> The remaining $234 Heroku credit carries over for post-Month-6 plans.
> ☁️ Cloudflare (free plan) adds DDoS protection, CDN, WAF, and SSL at $0/mo.

---

## 3. Monthly Cost Breakdown (6-Month FULL BURN)

### Months 1–6: Everything FREE — Maximum Resources

| Item | Cost/mo | Paid By | 6-Month Total |
|------|---------|---------|---------------|
| DO Droplet **4GB RAM / 2 vCPU / 80GB SSD** | $24 | DO $200 credit | $144 |
| DO Spaces (250GB storage + CDN) | $5 | DO $200 credit | $30 |
| DO Weekly Snapshots (~80GB × $0.05/GB) | ~$4 | DO $200 credit | ~$26 |
| Heroku Staging (eco dyno + Postgres + Redis) | $13 | Heroku Student credit | $78 |
| Azure B1s VM (load testing / CI runner) | ~$17 | Azure $100 credit | $100 |
| Datadog Pro (full APM, traces, logs, infra) | $0 | Student Pack (2yr free) | $0 |
| Sentry (error tracking) | $0 | Free tier | $0 |
| UptimeRobot (uptime monitoring) | $0 | Free tier | $0 |
| GitHub Actions + GHCR | $0 | Free | $0 |
| Domain (`irdnl.ir`) | ~$1 | Already paid | ~$5 |
| Cloudflare (DNS + CDN + DDoS + WAF) | $0 | Free plan | $0 |
| **TOTAL per month** | **~$0** | | |
| **TOTAL for 6 months** | | | **~$5 out-of-pocket** |

### Month 7: ⏸️ ALL CREDITS EXHAUSTED (except Heroku) — Create New Plan

At the end of Month 6:
- ❌ **DO $200**: Fully spent → Droplet & Spaces stop if you don't pay
- ❌ **Azure $100**: Fully spent → VM stops
- ✅ **Heroku $234**: Still has 18 months of $13/mo credit remaining
- ✅ **Datadog Pro**: Still has 18 months free
- ✅ **Sentry/UptimeRobot/GitHub**: Free forever
- **Action Required**: Create a new cost plan before Month 6 ends!

---

## 4. Credit Usage Timeline (FULL BURN — 6 Months)

```
Month  DO Credit($200)   Heroku($13/mo)       Azure($100)      Total Burned
─────  ────────────────  ──────────────────   ───────────────  ────────────
  1    $200 → $167       $312→$299 staging    $100→$83 VM      $46/mo
  2    $167 → $134       $299→$286 staging    $83→$66 VM       $46/mo
  3    $134 → $101       $286→$273 staging    $66→$49 VM       $46/mo
  4    $101 → $68        $273→$260 staging    $49→$32 VM       $46/mo
  5    $68  → $35        $260→$247 staging    $32→$15 VM       $46/mo
  6    $35  → $2*        $247→$234 staging    $15→$0  VM       $46/mo
  ─────────────────────────────────────────────────────────────────────
  7    ❌ $0 EXPIRED      ✅ $234 remaining    ❌ $0 EXPIRED    ⏸️ NEW PLAN
```

*$2 buffer accounts for partial month billing. Aim for $0 remaining.

### Month 7 — What You Still Have
| Resource | Status |
|----------|--------|
| **DO Droplet & Spaces** | ❌ Must pay $29/mo or shut down |
| **Heroku** | ✅ $234 credit (~18 months of staging) |
| **Datadog Pro** | ✅ 18 months free remaining |
| **Sentry/UptimeRobot/GitHub** | ✅ Free forever |

> 🔥 **Strategy**: Use MAXIMUM resources for 6 months. Build fast. Ship fast. Worry about costs at Month 7.

---

## 5. Step-by-Step Deployment Plan

### Phase 0: Pre-Deployment Preparation

> See: [PHASE0_PREPARATION.md](./PHASE0_PREPARATION.md)

1. Sign up for GitHub Student Developer Pack
2. Claim DigitalOcean $200 credit
3. Domain `irdnl.ir` — already purchased & connected to Cloudflare ✅
4. Set up GitHub repository secrets

### Phase 1: DigitalOcean Droplet Setup

> See: [PHASE1_DROPLET_SETUP.md](./PHASE1_DROPLET_SETUP.md)

1. Create Ubuntu 24.04 Droplet (**4GB RAM / 2 vCPU / 80GB SSD**, $24/mo)
2. SSH hardening (key-only auth, fail2ban)
3. Install Docker + Docker Compose
4. Configure firewall (UFW: 22, 80, 443 only)
5. Set up Nginx reverse proxy + Cloudflare Origin Certificate
6. Update Cloudflare A records with Droplet IP
7. Enable weekly Droplet snapshots (~$4/mo from credit)

### Phase 2: Application Deployment

> See: [PHASE2_APP_DEPLOYMENT.md](./PHASE2_APP_DEPLOYMENT.md)

1. Create production `docker-compose.prod.yml`
2. Build & push Docker images to GHCR
3. Deploy with zero-downtime strategy
4. Run database migrations
5. Seed initial data

### Phase 3: File Storage (DigitalOcean Spaces)

> See: [PHASE3_FILE_STORAGE.md](./PHASE3_FILE_STORAGE.md)

1. Create Space + CDN endpoint
2. Configure CORS
3. Update backend storage adapter
4. Migrate local files to Spaces

### Phase 4: CI/CD Pipeline

> See: [PHASE4_CICD.md](./PHASE4_CICD.md)

1. GitHub Actions: test → build → push → deploy
2. Automatic deployment on push to `main`
3. Preview deployments for PRs (optional)

### Phase 5: Monitoring & Observability

> See: [PHASE5_MONITORING.md](./PHASE5_MONITORING.md)

1. Sentry (error tracking — free tier)
2. UptimeRobot (uptime monitoring — free tier)
3. Datadog Pro (FULL APM + Logs + Infra — Student Pack, use everything!)
4. Application health checks

### Phase 6: Backups & Security

> See: [PHASE6_BACKUPS_SECURITY.md](./PHASE6_BACKUPS_SECURITY.md)

1. Automated PostgreSQL backups (cron + Spaces)
2. Docker volume backups
3. Security headers, rate limiting
4. SSL certificate auto-renewal

---

## 6. CI/CD Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│  Push to  │───▶│  Test &  │───▶│  Build   │───▶│  Deploy to   │
│  main     │    │  Lint    │    │  Docker  │    │  Droplet via │
│           │    │          │    │  Images  │    │  SSH          │
└──────────┘    └──────────┘    └──────────┘    └──────────────┘
                     │               │                  │
                     ▼               ▼                  ▼
              Run unit tests   Push to GHCR      docker compose
              Run linter       Tag: sha-xxx      pull + up -d
              Type check       Multi-stage build  Run migrations
```

### Workflow Files
- `.github/workflows/deploy.yml` — Full deployment pipeline (test → build → push → deploy)
- `.github/workflows/backend-ci.yml` — Backend tests on PR/push (existing)

---

## 7. How Every Credit Is Spent

### � DigitalOcean — $200 Fully Burned

```
Droplet 4GB/2vCPU  × 6 months = $144
  ├── Next.js SSR (512MB)
  ├── NestJS API (768MB)
  ├── PostgreSQL (768MB)
  ├── Redis (128MB)
  ├── Elasticsearch (1GB)
  └── Nginx + OS (~256MB)

Spaces 250GB + CDN × 6 months = $30
  ├── Video thumbnails & posters
  ├── User uploads
  ├── Blog images
  └── Database backups

Weekly Snapshots    × 6 months = ~$26
  └── Full Droplet disaster recovery backup

TOTAL: $144 + $30 + $26 = $200 ✅
```

### 🔥 Heroku — $78 of $312 Used (rest carries over)

```
Eco Dyno ($5/mo)              × 6 = $30
Postgres Mini ($5/mo)         × 6 = $30
Redis Mini ($3/mo)            × 6 = $18
────────────────────────────────────────
TOTAL: $78 — Full staging mirror of production

Staging gives you:
  ├── Test deployments before production
  ├── Demo environment for stakeholders
  ├── CI/CD integration testing
  └── Database migration dry-runs
```

### � Azure — $100 Fully Burned

```
Option A: B1s VM ($7.59/mo)   × 6 = ~$46
  └── Run load testing tools (k6, artillery)
  + Azure Functions ($0/mo free tier)
  └── Scheduled tasks, webhooks, cron alternatives
  + Remaining $54 → Azure CDN, extra compute spikes

Option B: B2s VM ($30/mo)     × 3 = $90
  └── Heavy load testing for 3 months
  + $10 → misc Azure services

Choose based on your needs. Key: spend all $100.
```

### 🔥 Datadog Pro — 2 Years Free (Use EVERYTHING)

```
Full APM (Application Performance Monitoring)
  ├── Request traces across Next.js → NestJS → DB
  ├── Slow query detection
  └── Error correlation

Full Infrastructure Monitoring
  ├── CPU, Memory, Disk, Network per container
  ├── Docker container metrics
  └── PostgreSQL query analytics

Full Log Management
  ├── Centralized logs from all containers
  ├── Log search & alerting
  └── Log-to-trace correlation

Custom Dashboards
  ├── Real-time streaming analytics
  ├── User activity monitoring
  └── Performance SLO tracking
```

---

## 8. Environment Variables Reference

### Frontend (Next.js) — `.env.production`
```bash
NEXT_PUBLIC_API_URL=https://irdnl.ir/api
NEXT_PUBLIC_CDN_URL=https://irdnl-storage.fra1.cdn.digitaloceanspaces.com
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Backend (NestJS) — `.env.production`
```bash
# Core
NODE_ENV=production
PORT=3001
API_PREFIX=api
FRONTEND_URL=https://irdnl.ir

# Database
DATABASE_URL=postgresql://irdnl:STRONG_PASSWORD@postgres:5432/irdnl_db

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=generate-with-openssl-rand-base64-64
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=generate-with-openssl-rand-base64-64
JWT_REFRESH_EXPIRES_IN=7d

# Storage
STORAGE_TYPE=s3
DO_SPACES_KEY=your_spaces_access_key
DO_SPACES_SECRET=your_spaces_secret_key
DO_SPACES_BUCKET=irdnl-storage
DO_SPACES_REGION=fra1
DO_SPACES_ENDPOINT=https://fra1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://irdnl-storage.fra1.cdn.digitaloceanspaces.com

# Security
SIGNED_URL_SECRET=generate-with-openssl-rand-base64-64
SIGNED_URL_TTL=3600
THROTTLE_TTL=60
THROTTLE_LIMIT=30

# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx

# Elasticsearch (enabled — 4GB Droplet has enough RAM)
ELASTICSEARCH_NODE=http://elasticsearch:9200
```

---

## 9. Monitoring & Observability

| Layer | Tool | Cost | Setup |
|-------|------|------|-------|
| Error Tracking | Sentry (free 5K events/mo) | $0 | SDK in both apps |
| Uptime | UptimeRobot (50 monitors free) | $0 | HTTP checks every 5 min |
| APM + Traces | Datadog Pro (Student Pack 2yr) | $0 | dd-trace in backend, full APM |
| Infrastructure | Datadog Pro (Student Pack 2yr) | $0 | CPU/RAM/Disk/Docker per container |
| Log Management | Datadog Pro (Student Pack 2yr) | $0 | Centralized logs + alerting |
| Metrics | DigitalOcean Monitoring (built-in) | $0 | Auto-enabled on Droplet |

---

## 10. Maintenance Runbook

### Daily (automated)
- ✅ Health checks via UptimeRobot (every 5 min)
- ✅ Error alerting via Sentry (instant)
- ✅ Docker restart policy (`unless-stopped`)

### Weekly (manual, 5 min)
- Check DigitalOcean Monitoring dashboard
- Review Sentry error trends
- Check disk usage: `df -h`

### Monthly
- **Check DO credit balance** (target: burn ~$33/mo, should hit $0 at Month 6)
- Check Heroku staging app health
- Check Cloudflare SSL Origin Certificate status (valid 15 years — no renewal needed)
- Review and apply security updates: `apt update && apt upgrade`
- Test backup restoration

### Month 5 — CRITICAL: Plan Post-Credit Architecture! 🗓️
- DO credit should be at ~$35 (1 month left)
- Heroku credit at ~$247 (plenty left)
- Decide: downgrade Droplet? Move to Heroku? Vercel? Pay out of pocket?
- **Create new cost plan document BEFORE Month 6 ends!**
- Consider: the Droplet will STOP if credits run out with no payment method

### Backup Strategy
```bash
# Automated daily PostgreSQL backup to Spaces (cron job)
0 3 * * * /opt/irdnl/scripts/backup.sh >> /opt/irdnl/logs/backup.log 2>&1

# Manual backup before any deployment
docker exec irdnl-postgres pg_dump -U irdnl irdnl_db > backup_$(date +%Y%m%d).sql
```

---

## Quick Reference Commands

```bash
# SSH into server
ssh deploy@your-droplet-ip

# View running containers
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f --tail=100

# Restart all services
docker compose -f docker-compose.prod.yml restart

# Deploy latest (manual)
cd /opt/irdnl
git pull origin main
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Database shell
docker exec -it irdnl-postgres psql -U irdnl irdnl_db

# Redis shell
docker exec -it irdnl-redis redis-cli
```
