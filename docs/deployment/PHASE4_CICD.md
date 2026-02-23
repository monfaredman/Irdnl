# Phase 4: CI/CD Pipeline

> **Time**: ~20 minutes · **Cost**: $0 (GitHub Actions free for public repos, 2000 min/mo for private)

---

## Overview

```
Push to main ──→ GitHub Actions ──→ Test ──→ Build Docker ──→ Push to GHCR ──→ SSH Deploy to Droplet
                     │                          │                                       │
                     ├── Lint + Test (backend)   ├── ghcr.io/monfaredman/irdnl-backend   ├── docker compose pull
                     ├── Lint + Build (frontend) ├── ghcr.io/monfaredman/irdnl-frontend  └── docker compose up -d
                     └── Cancel if tests fail    └── Tagged with :latest + :sha-abc123
```

---

## 1. GitHub Secrets Setup

Go to **GitHub Repo → Settings → Secrets and variables → Actions** and add:

| Secret | Value | Used By |
|--------|-------|---------|
| `DROPLET_HOST` | `YOUR_DROPLET_IP` | SSH deploy |
| `DROPLET_SSH_KEY` | Private key contents | SSH deploy |
| `DROPLET_USER` | `deploy` | SSH deploy |

> **Note**: GHCR authentication uses the built-in `GITHUB_TOKEN` — no extra secret needed.

---

## 2. Deploy Workflow

The workflow is already created at `.github/workflows/deploy.yml`. Here's what it does:

### Triggers
- **Push to `main`**: Full pipeline (test → build → deploy)
- **Pull Request to `main`**: Test only (no deploy)
- **Manual**: Via `workflow_dispatch`

### Jobs

#### Job 1: `test-backend`
- Spins up PostgreSQL + Redis services
- Runs `npm ci`, `npm run lint`, `npm run test`, `npm run build`
- Uses the same services as your existing `backend-ci.yml`

#### Job 2: `test-frontend`
- Runs `npm ci`, `npm run lint`, `npm run build`
- Validates the Next.js standalone build

#### Job 3: `build-and-push` (only on push to main)
- Builds Docker images using multi-stage Dockerfiles
- Pushes to `ghcr.io/monfaredman/irdnl-backend:latest`
- Pushes to `ghcr.io/monfaredman/irdnl-frontend:latest`
- Also tags with commit SHA for rollback

#### Job 4: `deploy` (only on push to main)
- SSHs into the Droplet
- Pulls latest images from GHCR
- Runs the deploy script
- Verifies health checks

---

## 3. Enable GHCR (GitHub Container Registry)

GHCR is automatically available. Just ensure your repo's package visibility:

1. Go to your **GitHub profile → Packages**
2. After first push, the packages will appear
3. Set visibility to match your repo (public = free, private = uses Actions minutes)

---

## 4. SSH Key for GitHub Actions

```bash
# On your LOCAL machine, generate a deploy key:
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/irdnl_deploy -N ""

# Copy PUBLIC key to Droplet:
ssh-copy-id -i ~/.ssh/irdnl_deploy.pub deploy@YOUR_DROPLET_IP

# Copy PRIVATE key to GitHub Secret:
cat ~/.ssh/irdnl_deploy
# → Copy everything including "-----BEGIN/END OPENSSH PRIVATE KEY-----"
# → Paste into GitHub Secret named DROPLET_SSH_KEY
```

---

## 5. First Manual Deploy

Before the CI/CD pipeline, manually verify the deploy:

```bash
# On your local machine, push to main
git add .
git commit -m "feat: add production deployment config"
git push origin main

# Watch the workflow
# Go to GitHub → Actions tab → Watch the "Deploy" workflow
```

---

## 6. Workflow File Reference

The complete workflow is at `.github/workflows/deploy.yml`. Key features:

### Docker Layer Caching
```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```
This caches Docker build layers in GitHub Actions cache, reducing build time from ~5 min to ~1 min for subsequent builds.

### Health Check After Deploy
```yaml
- name: Verify deployment
  run: |
    sleep 15
    ssh deploy@${{ secrets.DROPLET_HOST }} '
      curl -sf http://localhost:3001/api/health || exit 1
      curl -sf http://localhost:3000 || exit 1
    '
```

### Rollback
```bash
# If a deploy fails, roll back to previous image:
ssh deploy@YOUR_DROPLET_IP

cd /opt/irdnl

# Find the previous working image tag (commit SHA)
docker images ghcr.io/monfaredman/irdnl-backend --format "{{.Tag}}"

# Edit docker-compose.prod.yml temporarily to use specific tag
# Or pull the old tag:
docker pull ghcr.io/monfaredman/irdnl-backend:sha-abc1234
docker tag ghcr.io/monfaredman/irdnl-backend:sha-abc1234 ghcr.io/monfaredman/irdnl-backend:latest

docker compose -f docker-compose.prod.yml up -d --no-deps backend
```

---

## 7. Branch Protection (Recommended)

Go to **Repo → Settings → Branches → Branch protection rules**:

1. Branch name pattern: `main`
2. ✅ Require a pull request before merging
3. ✅ Require status checks to pass before merging
   - Add: `test-backend`, `test-frontend`
4. ✅ Require branches to be up to date

This ensures only tested code gets deployed.

---

## 8. Workflow Run Times

| Step | Duration | Notes |
|------|----------|-------|
| Test backend | ~2 min | Postgres + Redis services |
| Test frontend | ~1.5 min | Next.js build |
| Build images | ~3 min (first), ~1 min (cached) | Docker layer caching |
| Deploy | ~30 sec | SSH + pull + restart |
| **Total** | **~5 min** | Tests run in parallel |

### GitHub Actions Limits
- **Public repo**: ✅ Unlimited minutes (free)
- **Private repo**: 2000 min/month free → ~400 deploys/month
- **GHCR storage**: 500 MB free for private, unlimited for public

---

## Existing CI Preserved

Your existing `backend-ci.yml` continues to work for:
- Push to `develop` and `feature/*` branches
- Pull requests (lint + test + coverage)

The new `deploy.yml` only deploys on push to `main`.

---

## Checklist

- [ ] GitHub Secrets configured (DROPLET_HOST, DROPLET_SSH_KEY, DROPLET_USER)
- [ ] SSH deploy key added to Droplet's `authorized_keys`
- [ ] `.github/workflows/deploy.yml` committed and pushed
- [ ] First pipeline run successful
- [ ] Health checks passing after deploy
- [ ] Branch protection enabled on `main`
- [ ] Test a PR to verify CI-only (no deploy)

---

**Next**: [Phase 5 — Monitoring →](./PHASE5_MONITORING.md)
