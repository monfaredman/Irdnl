# Phase 5: Monitoring & Alerts

> **Time**: ~20 minutes · **Cost**: $0 (all free tiers)

---

## Architecture

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Sentry        │  │  UptimeRobot    │  │   Datadog       │
│ (Error Tracking) │  │ (Uptime Alerts) │  │ (Infrastructure)│
│  Free: 5K/mo     │  │  Free: 50 mons  │  │ Student Pack    │
└────────┬─────────┘  └────────┬────────┘  └────────┬────────┘
         │                     │                     │
         ▼                     ▼                     ▼
    JS Errors &           HTTP Pings             CPU, RAM,
    API Exceptions        Every 5 min           Disk, Network
```

---

## 1. Sentry (Error Tracking) — FREE

### Setup Account
1. Go to [sentry.io](https://sentry.io) → Sign up with GitHub
2. Create organization: `irdnl`
3. Create project: **NestJS** (backend)
4. Create project: **Next.js** (frontend)

### Backend Integration

Your backend already has `@sentry/nestjs` installed. Add the DSN:

```bash
# In /opt/irdnl/.env
SENTRY_DSN=https://YOUR_DSN@o123.ingest.sentry.io/456
```

In `backend/src/main.ts`, Sentry should be initialized early:

```typescript
import * as Sentry from '@sentry/nestjs';

// Initialize before anything else
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  tracesSampleRate: 0.1,  // 10% of transactions (stay within free tier)
  profilesSampleRate: 0.1,
});
```

### Frontend Integration

Your frontend has `@sentry/nextjs` installed. Configure:

**`frontend/sentry.client.config.ts`**:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,    // Disable replays (saves quota)
  replaysOnErrorSampleRate: 0.1,  // 10% of errors get replay
});
```

### Free Tier Limits
| Feature | Limit |
|---------|-------|
| Errors | 5,000/month |
| Performance | 10K transactions/month |
| Replays | 50/month |
| Retention | 30 days |

> **Tip**: Set `tracesSampleRate: 0.1` to stay well within limits.

### Sentry Alerts
1. Go to Sentry → Alerts → Create Alert Rule
2. **When**: An event is seen (group by issue)
3. **If**: Frequency > 10 in 1 hour
4. **Then**: Send email notification
5. Save

---

## 2. UptimeRobot (Uptime Monitoring) — FREE

### Setup
1. Go to [uptimerobot.com](https://uptimerobot.com) → Sign up
2. Add monitors:

| Monitor Name | Type | URL | Interval |
|-------------|------|-----|----------|
| IrDnl Frontend | HTTP(s) | `https://irdnl.ir` | 5 min |
| IrDnl API | HTTP(s) | `https://irdnl.ir/api/health` | 5 min |
| IrDnl API Keyword | Keyword | `https://irdnl.ir/api/health` | 5 min |

For the keyword monitor, set the keyword to `ok` or `healthy` (whatever your health endpoint returns).

### Alert Contacts
1. Email (default)
2. Telegram bot (recommended for instant alerts):
   - Create a Telegram bot via @BotFather
   - Get chat ID
   - Add as alert contact in UptimeRobot

### Status Page (Optional)
UptimeRobot can create a free public status page:
1. Go to **My Settings → Status Pages**
2. Create page: `status.irdnl.ir` (or use UptimeRobot's subdomain)
3. Add your monitors
4. Share with users

### Free Tier
- 50 monitors
- 5-minute intervals
- Email + Telegram alerts
- 2-month log history

---

## 3. Datadog (Infrastructure) — Student Pack

### GitHub Student Pack Benefit
- **Datadog Pro** for 2 years free
- Apply at [education.github.com/pack](https://education.github.com/pack)

### Install Datadog Agent on Droplet

```bash
# SSH into your Droplet
ssh deploy@YOUR_DROPLET_IP

# Install the Datadog Agent (one-line installer)
DD_API_KEY=YOUR_DATADOG_API_KEY \
DD_SITE="datadoghq.com" \
bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script_agent7.sh)"
```

### Configure Docker Monitoring

```bash
# Add deploy user to docker group (already done in Phase 1)
# Edit Datadog config:
sudo nano /etc/datadog-agent/conf.d/docker.d/conf.yaml
```

```yaml
init_config:

instances:
  - url: "unix:///var/run/docker.sock"
    collect_container_size: true
    collect_exit_codes: true
    tags:
      - env:production
      - service:irdnl
```

### Configure PostgreSQL Monitoring

```bash
# Create monitoring user in PostgreSQL
docker exec -it irdnl-postgres psql -U irdnl -d irdnl_db -c "
CREATE USER datadog WITH PASSWORD 'dd_monitoring_password';
GRANT pg_monitor TO datadog;
"

# Configure Datadog
sudo nano /etc/datadog-agent/conf.d/postgres.d/conf.yaml
```

```yaml
init_config:

instances:
  - host: localhost
    port: 5432
    username: datadog
    password: dd_monitoring_password
    dbname: irdnl_db
    tags:
      - env:production
      - service:irdnl-db
```

### Configure Nginx Monitoring

```bash
# Enable Nginx stub_status (already in our Phase 1 config)
# Add to your nginx site config inside the server block:
#   location /nginx_status {
#       stub_status on;
#       allow 127.0.0.1;
#       deny all;
#   }

sudo nano /etc/datadog-agent/conf.d/nginx.d/conf.yaml
```

```yaml
init_config:

instances:
  - nginx_status_url: http://localhost/nginx_status
    tags:
      - env:production
      - service:irdnl-nginx
```

### Restart Datadog Agent

```bash
sudo systemctl restart datadog-agent
sudo datadog-agent status  # Verify all checks pass
```

### Datadog Dashboard

Create a dashboard with:
- **CPU & Memory**: Host-level metrics
- **Docker containers**: CPU/memory per container
- **PostgreSQL**: Connections, query time, rows read/written
- **Nginx**: Requests/sec, 4xx/5xx rates, response time

### Datadog Alerts (Monitors)

Set up these monitors in Datadog:

| Monitor | Condition | Alert |
|---------|-----------|-------|
| High CPU | CPU > 80% for 5 min | Email |
| High Memory | Memory > 90% for 5 min | Email |
| Disk Space | Disk > 85% used | Email |
| Container Down | Container stopped | Email + Telegram |
| High Error Rate | Nginx 5xx > 10/min | Email |

---

## 4. Application Health Endpoint

Ensure your backend health endpoint reports useful info:

```typescript
// backend/src/modules/health/health.controller.ts
@Get()
async check() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
    },
  };
}
```

This gives monitoring tools rich data to work with.

---

## 5. Log Management

### Docker Logs (Built-in)

```bash
# View logs (last 100 lines)
docker compose -f docker-compose.prod.yml logs --tail=100

# Follow logs
docker compose -f docker-compose.prod.yml logs -f backend

# Filter by time
docker compose -f docker-compose.prod.yml logs --since="1h" backend
```

### Log Rotation (Prevent Disk Full)

Add to `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
sudo systemctl restart docker
```

This limits each container's logs to 30MB max (3 files × 10MB).

---

## 6. Quick Status Script

Create `/opt/irdnl/scripts/status.sh`:

```bash
#!/bin/bash
echo "=== IrDnl Production Status ==="
echo ""

echo "📦 Containers:"
docker compose -f /opt/irdnl/docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "💾 Memory Usage:"
free -h | head -2
echo ""

echo "💿 Disk Usage:"
df -h / | tail -1
echo ""

echo "🔧 Docker Memory:"
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}" 2>/dev/null
echo ""

echo "🌐 Health Checks:"
echo -n "  Backend:  "
curl -sf http://localhost:3001/api/health > /dev/null && echo "✅ OK" || echo "❌ FAIL"
echo -n "  Frontend: "
curl -sf http://localhost:3000 > /dev/null && echo "✅ OK" || echo "❌ FAIL"
echo ""

echo "📊 Swap Usage:"
swapon --show
```

```bash
chmod +x /opt/irdnl/scripts/status.sh
```

Run anytime with: `bash /opt/irdnl/scripts/status.sh`

---

## Checklist

- [ ] Sentry accounts created (backend + frontend projects)
- [ ] Sentry DSNs added to environment variables
- [ ] `tracesSampleRate` set to 0.1 (stay within free tier)
- [ ] UptimeRobot monitors configured (frontend + API)
- [ ] UptimeRobot alert contacts set up (email + Telegram)
- [ ] Datadog agent installed on Droplet
- [ ] Datadog Docker, PostgreSQL, Nginx integrations configured
- [ ] Docker log rotation configured
- [ ] Status script created and tested

---

**Next**: [Phase 6 — Backups & Security →](./PHASE6_BACKUPS_SECURITY.md)
