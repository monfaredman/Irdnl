# Phase 0: Pre-Deployment Preparation

> **Time**: ~30 minutes · **Cost**: $0

---

## 1. Claim GitHub Student Pack Credits

### DigitalOcean ($200)
1. Go to [education.github.com/pack](https://education.github.com/pack)
2. Click **DigitalOcean** → "Get access"
3. Create/link a DigitalOcean account
4. The $200 credit is applied automatically (valid 12 months, but credits purchased items persist)

### Other Credits — USE ALL OF THEM
- **Heroku** ($13/mo × 24 months) — activate NOW for staging environment
- **Azure** ($100 one-time) — activate NOW for Elasticsearch or load testing
- **Datadog** (Pro plan 2 years) — activate when monitoring is set up (Phase 5)

> 🎯 **6-month plan**: Use every free resource aggressively. You'll re-evaluate at Month 7.

---

## 2. Generate SSH Keys

```bash
# Generate a deployment key (no passphrase for CI/CD automation)
ssh-keygen -t ed25519 -C "irdnl-deploy" -f ~/.ssh/irdnl_deploy -N ""

# Copy the public key (you'll add this to the Droplet)
cat ~/.ssh/irdnl_deploy.pub

# Test SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/irdnl_deploy
```

---

## 3. Set Up GitHub Repository Secrets

Go to: **GitHub repo → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value | Used By |
|-------------|-------|---------|
| `DROPLET_HOST` | Your Droplet IP (e.g., `164.92.xxx.xxx`) | SSH deploy |
| `DROPLET_SSH_KEY` | Contents of `~/.ssh/irdnl_deploy` (private key) | SSH deploy |
| `DROPLET_USER` | `deploy` | SSH deploy |
| `DO_SPACES_KEY` | DigitalOcean Spaces access key | Storage |
| `DO_SPACES_SECRET` | DigitalOcean Spaces secret key | Storage |
| `GHCR_TOKEN` | GitHub PAT with `write:packages` scope | Docker push |
| `DATABASE_URL` | `postgresql://irdnl:PASS@postgres:5432/irdnl_db` | Backend |
| `JWT_SECRET` | `openssl rand -base64 64` output | Auth |
| `JWT_REFRESH_SECRET` | `openssl rand -base64 64` output | Auth |
| `SENTRY_DSN` | From Sentry project settings | Monitoring |

### Generate Secure Secrets
```bash
# JWT secrets
openssl rand -base64 64 | tr -d '\n' | pbcopy  # copies to clipboard (macOS)

# Database password
openssl rand -base64 32 | tr -d '\n'
```

---

## 4. Domain & DNS (Already Done ✅)

Your domain `irdnl.ir` is already purchased and connected to Cloudflare:

- **Domain**: `irdnl.ir`
- **Cloudflare Nameservers**: `albert.ns.cloudflare.com`, `tori.ns.cloudflare.com`
- **DNS Records**: A records for `@`, `www`, `api` → Droplet IP (Proxied ☁️)
- **SSL/TLS Mode**: Full (Strict)

> 🎯 After creating the Droplet (Phase 1), just update the A record IP in Cloudflare Dashboard.
> No registrar changes needed — nameservers are already pointed to Cloudflare.

---

## 5. Prepare Your Local Environment

```bash
# Make sure you have Docker installed locally for testing
docker --version   # Docker 24+
docker compose version  # v2.20+

# Test the production build locally first
cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..
```

---

## 6. Cleanup Old Static Export Config

Since we're switching from GitHub Pages (static export) to SSR:

### Remove from `next.config.ts`:
- Remove the `DEPLOY_TARGET === 'github-pages'` conditional
- Remove `output: 'export'`
- Keep `images.unoptimized: true` (we'll use CDN for images)
- Keep rewrites/redirects (they work with SSR!)

### Remove unnecessary files:
- `frontend/public/404.html` (GitHub Pages SPA redirect — not needed)
- `frontend/sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` (recreate properly later)

### Remove from dynamic pages:
- All `generateStaticParams()` calls added for static export
- The `ItemDetailClient.tsx` wrapper (revert `item/[id]/page.tsx` back to `"use client"`)

> These are only needed for `output: 'export'` which we no longer use.

---

## Checklist

- [ ] GitHub Student Pack activated
- [ ] DigitalOcean $200 credit claimed
- [ ] SSH key pair generated
- [ ] GitHub repository secrets configured
- [x] Domain `irdnl.ir` purchased and connected to Cloudflare
- [x] Cloudflare nameservers set (`albert.ns.cloudflare.com`, `tori.ns.cloudflare.com`)
- [x] Cloudflare SSL mode: Full (Strict)
- [ ] Local Docker working
- [ ] Production builds succeed locally (`npm run build` for both apps)
- [ ] Old static export config cleaned up
