# Phase 6: Backups & Security

> **Time**: ~20 minutes · **Cost**: $0 (backups go to existing Spaces)

---

## 1. PostgreSQL Automated Backups

### Backup Script

Create `/opt/irdnl/scripts/backup.sh`:

```bash
#!/bin/bash
set -euo pipefail

# ── Configuration ──
APP_DIR="/opt/irdnl"
BACKUP_DIR="/opt/irdnl/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7
S3_BUCKET="s3://irdnl-storage/backups/db"

# Load env vars
source "$APP_DIR/.env"

mkdir -p "$BACKUP_DIR"

echo "$(date): Starting backup..."

# ── 1. PostgreSQL Dump ──
BACKUP_FILE="$BACKUP_DIR/irdnl_db_${TIMESTAMP}.sql.gz"

docker exec irdnl-postgres pg_dump \
  -U "${DB_USER:-irdnl}" \
  -d "${DB_NAME:-irdnl_db}" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "$(date): Database backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# ── 2. Upload to DigitalOcean Spaces ──
if command -v s3cmd &> /dev/null; then
  s3cmd put "$BACKUP_FILE" "$S3_BUCKET/irdnl_db_${TIMESTAMP}.sql.gz" --quiet
  echo "$(date): Backup uploaded to Spaces"
else
  echo "$(date): WARNING: s3cmd not installed, skipping remote backup"
fi

# ── 3. Cleanup Old Local Backups ──
find "$BACKUP_DIR" -name "irdnl_db_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
echo "$(date): Cleaned up backups older than ${RETENTION_DAYS} days"

# ── 4. Cleanup Old Remote Backups ──
if command -v s3cmd &> /dev/null; then
  # List remote backups older than 30 days and delete
  CUTOFF=$(date -d "-30 days" +%Y%m%d 2>/dev/null || date -v-30d +%Y%m%d)
  s3cmd ls "$S3_BUCKET/" | while read -r line; do
    FILE_DATE=$(echo "$line" | grep -oP '\d{8}(?=_\d{6})' || true)
    if [ -n "$FILE_DATE" ] && [ "$FILE_DATE" -lt "$CUTOFF" ]; then
      FILE_PATH=$(echo "$line" | awk '{print $4}')
      s3cmd del "$FILE_PATH" --quiet
      echo "$(date): Deleted old remote backup: $FILE_PATH"
    fi
  done
fi

echo "$(date): Backup completed successfully ✅"
```

```bash
chmod +x /opt/irdnl/scripts/backup.sh
```

### Schedule with Cron

```bash
# Edit crontab for deploy user
crontab -e

# Add: Daily backup at 3 AM server time
0 3 * * * /opt/irdnl/scripts/backup.sh >> /opt/irdnl/logs/backup.log 2>&1

# Create log directory
mkdir -p /opt/irdnl/logs
```

### Test Backup

```bash
# Run manually
/opt/irdnl/scripts/backup.sh

# Verify
ls -la /opt/irdnl/backups/
s3cmd ls s3://irdnl-storage/backups/db/
```

---

## 2. Restore from Backup

### From Local Backup
```bash
# List available backups
ls -la /opt/irdnl/backups/

# Restore
gunzip -c /opt/irdnl/backups/irdnl_db_20250101_030000.sql.gz | \
  docker exec -i irdnl-postgres psql -U irdnl -d irdnl_db
```

### From Spaces Backup
```bash
# Download
s3cmd get s3://irdnl-storage/backups/db/irdnl_db_20250101_030000.sql.gz /tmp/

# Restore
gunzip -c /tmp/irdnl_db_20250101_030000.sql.gz | \
  docker exec -i irdnl-postgres psql -U irdnl -d irdnl_db

# Clean up
rm /tmp/irdnl_db_20250101_030000.sql.gz
```

---

## 3. Redis Backup

Redis is configured with periodic RDB snapshots (`save 60 1000` in docker-compose). The data volume persists across restarts. For a manual backup:

```bash
# Trigger save
docker exec irdnl-redis redis-cli BGSAVE

# Copy the dump
docker cp irdnl-redis:/data/dump.rdb /opt/irdnl/backups/redis_dump_$(date +%Y%m%d).rdb
```

> Redis data is mostly cache — it regenerates. Don't prioritize Redis backups.

---

## 4. Security Hardening

### 4.1 SSH Hardening (Done in Phase 1)

Verify these settings in `/etc/ssh/sshd_config`:
```bash
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
```

### 4.2 Firewall (UFW)

```bash
# Check current rules
sudo ufw status verbose

# Should show:
# 22/tcp    ALLOW IN    Anywhere
# 80/tcp    ALLOW IN    Anywhere
# 443/tcp   ALLOW IN    Anywhere

# Everything else is blocked by default
```

### 4.3 Fail2ban

```bash
# Check status
sudo fail2ban-client status

# Check SSH jail
sudo fail2ban-client status sshd

# View banned IPs
sudo fail2ban-client get sshd banned
```

### 4.4 Docker Security

Ensure containers run as non-root users:

**Backend Dockerfile** — already uses production user.

**Frontend Dockerfile** — uses `nextjs` user (UID 1001).

Add to `docker-compose.prod.yml` if not already:
```yaml
security_opt:
  - no-new-privileges:true
```

### 4.5 Environment Variables Security

```bash
# Verify .env permissions (should be 600)
ls -la /opt/irdnl/.env
# -rw------- 1 deploy deploy ... .env

# Never commit .env to git
echo ".env" >> /opt/irdnl/.gitignore
```

### 4.6 Nginx Security Headers (Done in Phase 1)

Verify in your Nginx config:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### 4.7 SSL/TLS Verification (Cloudflare)

```bash
# Check Origin Certificate (installed on Nginx)
sudo openssl x509 -in /etc/ssl/cloudflare/irdnl.ir.pem -noout -dates
# Should show: notAfter = 15 years from creation date

# Test SSL externally
# https://www.ssllabs.com/ssltest/analyze.html?d=irdnl.ir

# Verify Cloudflare is proxying traffic
curl -sI https://irdnl.ir | grep -i "cf-ray\|server"
# Should show: server: cloudflare + CF-Ray header
```

> ✅ No certbot timer needed — Cloudflare Origin Certificates are valid for 15 years.
> SSL termination happens at Cloudflare edge (free). Origin Certificate secures Cloudflare ↔ Droplet.

### 4.8 Cloudflare Security Features (Free — Use Them All)

Configure at [Cloudflare Dashboard → irdnl.ir → Security](https://dash.cloudflare.com):

| Feature | Setting | Location |
|---------|---------|----------|
| **DDoS Protection** | Automatic (always on) | Security → DDoS |
| **Bot Fight Mode** | ON | Security → Bots |
| **Security Level** | Medium | Security → Settings |
| **WAF Rules** | 5 free custom rules | Security → WAF |
| **Rate Limiting** | Available (1 free rule) | Security → WAF → Rate limiting |
| **Under Attack Mode** | OFF (use when under DDoS) | Security → Settings |
| **Browser Integrity Check** | ON | Security → Settings |

**Recommended WAF custom rules** (free — up to 5):
1. **Block non-IR admin access** (if admin panel exists): Block requests to `/admin` from non-IR IPs
2. **Rate limit API auth**: Rate limit `/api/auth/login` to 5 req/min per IP
3. **Block known bad bots**: Block user agents matching common bad bot patterns
4. **Country block** (optional): Block traffic from countries with no users

```
# Example WAF rule (in Cloudflare Dashboard → Security → WAF → Custom rules):
# Rule: "Rate limit login"
# Expression: (http.request.uri.path eq "/api/auth/login")
# Action: Block (rate limit: 5 per minute)
```

---

## 5. System Updates

### Automated Security Updates

```bash
# Install unattended-upgrades (usually pre-installed on Ubuntu)
sudo apt install unattended-upgrades -y

# Enable
sudo dpkg-reconfigure -plow unattended-upgrades
# Select "Yes"

# Verify
cat /etc/apt/apt.conf.d/20auto-upgrades
# Should show:
# APT::Periodic::Update-Package-Lists "1";
# APT::Periodic::Unattended-Upgrade "1";
```

### Docker Updates (Monthly)

```bash
# Update Docker images
docker compose -f /opt/irdnl/docker-compose.prod.yml pull postgres redis
docker compose -f /opt/irdnl/docker-compose.prod.yml up -d postgres redis

# Update system Docker
sudo apt update && sudo apt upgrade docker-ce docker-ce-cli -y
```

---

## 6. Disaster Recovery Plan

### If Droplet Dies
1. Create new Droplet (Phase 1 — 20 min)
2. Install Docker + Nginx (Phase 1 — 10 min)
3. Install Cloudflare Origin Certificate
4. Restore `.env` from password manager
5. Pull images from GHCR
6. Restore database from Spaces backup
7. Update Cloudflare A records to new Droplet IP
8. **Total recovery time: ~45 minutes**

### If Database Corrupted
```bash
# Stop backend
docker compose -f docker-compose.prod.yml stop backend frontend

# Restore from latest backup
gunzip -c /opt/irdnl/backups/irdnl_db_LATEST.sql.gz | \
  docker exec -i irdnl-postgres psql -U irdnl -d irdnl_db

# Restart
docker compose -f docker-compose.prod.yml up -d backend frontend
```

### If Spaces Unavailable
- Files are cached on CDN — existing URLs continue working
- New uploads fail — backend should handle gracefully with error messages
- Switch `STORAGE_TYPE=local` temporarily and use Droplet disk

---

## 7. Monitoring the Backup

Add a simple check to your status script:

```bash
# Add to /opt/irdnl/scripts/status.sh
echo "📁 Latest Backups:"
ls -lht /opt/irdnl/backups/ | head -5
echo ""
echo "📅 Last Backup:"
ls -t /opt/irdnl/backups/irdnl_db_*.sql.gz 2>/dev/null | head -1 || echo "  No backups found!"
```

---

## 8. Maintenance Runbook

### Weekly
- [ ] Check `/opt/irdnl/logs/backup.log` for errors
- [ ] Run `bash /opt/irdnl/scripts/status.sh`
- [ ] Review Sentry for new errors
- [ ] Check UptimeRobot dashboard

### Monthly
- [ ] **Check DO credit balance** (target: ~$134 remaining at Month 6)
- [ ] Update Docker base images (`docker compose pull`)
- [ ] Run `sudo apt update && sudo apt upgrade`
- [ ] Check disk space: `df -h`
- [ ] Review Datadog metrics for trends
- [ ] Test backup restore (on a test database)

### Month 5 — CRITICAL: Plan Next Phase 🗓️
- [ ] Review all remaining credits (DO, Heroku, Azure, Datadog)
- [ ] Assess actual traffic, storage, and resource usage
- [ ] Decide architecture for Month 7+ (stay on Droplet? move to managed?)
- [ ] Create new cost plan document
- [ ] Set budget for post-credit period

### Quarterly
- [ ] Rotate JWT secrets (update `.env`, restart backend)
- [ ] Rotate Spaces API keys
- [ ] Review and remove unused Docker images
- [ ] Check Cloudflare Origin Certificate (valid 15 years, no renewal needed)
- [ ] Review GitHub Actions usage/minutes

---

## Checklist

- [ ] Backup script created and executable
- [ ] Cron job scheduled (daily at 3 AM)
- [ ] s3cmd configured for remote backups to Spaces
- [ ] Test backup + restore verified
- [ ] Firewall rules verified (22, 80, 443 only)
- [ ] Fail2ban active and monitoring SSH
- [ ] Docker containers running as non-root
- [ ] .env file has 600 permissions
- [ ] Cloudflare Origin Certificate valid (15yr, check expiry)
- [ ] Unattended security updates enabled
- [ ] Disaster recovery plan documented and tested

---

## 🎉 Deployment Complete!

You now have a fully deployed, monitored, and backed-up IrDnl streaming platform:

| Component | Status |
|-----------|--------|
| **SSR Frontend** | Next.js on Docker, Nginx reverse proxy |
| **API Backend** | NestJS on Docker, PostgreSQL, Redis |
| **File Storage** | DigitalOcean Spaces + CDN |
| **CI/CD** | GitHub Actions → GHCR → Droplet |
| **Staging** | Heroku eco dyno (Student Pack) |
| **Monitoring** | Sentry + UptimeRobot + Datadog Pro |
| **Backups** | Daily PostgreSQL → Spaces, 30-day retention |
| **Security** | Cloudflare WAF + DDoS, SSH hardening, Fail2ban, UFW, Origin Cert SSL, non-root containers |

**Monthly Cost**: $0 for 6 months (GitHub Student Pack credits).

**Month 5 reminder**: Start planning your Month 7+ cost strategy. You'll have ~$134 DO credit + $234 Heroku credit remaining.

**Go back to**: [Master Guide →](./DEPLOYMENT_MASTER_GUIDE.md)
