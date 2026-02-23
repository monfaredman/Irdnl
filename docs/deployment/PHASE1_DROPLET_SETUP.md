# Phase 1: DigitalOcean Droplet Setup

> **Time**: ~45 minutes · **Cost**: $24/month (covered by $200 credit — fully burned in 6 months)

---

## 1. Create Droplet

### Via DigitalOcean Dashboard
1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. **Create → Droplets**
3. Settings:
   - **Region**: Frankfurt (FRA1) — good for EU/Middle East latency
   - **Image**: Ubuntu 24.04 LTS
   - **Size**: Basic → Regular → **$24/mo (2 vCPU, 4 GB RAM, 80 GB SSD)**
   - **Authentication**: SSH Key (paste your `irdnl_deploy.pub`)
   - **Hostname**: `irdnl-prod`
   - **Enable Monitoring**: ✅ Yes (free)
   - **Enable Backups**: ✅ Yes — use weekly snapshots (~$4/mo from credit)

> 🔥 **Why 4GB?** You have $200 for 6 months = $33/mo budget. $24 Droplet + $5 Spaces + $4 snapshots = $33/mo. Use it ALL.
> 4GB runs Next.js + NestJS + PostgreSQL + Redis + Elasticsearch with room to spare.

### Via CLI (alternative)
```bash
# Install doctl
brew install doctl
doctl auth init  # paste your API token

# Create droplet (4GB / 2 vCPU)
doctl compute droplet create irdnl-prod \
  --image ubuntu-24-04-x64 \
  --size s-2vcpu-4gb \
  --region fra1 \
  --ssh-keys $(doctl compute ssh-key list --format ID --no-header | head -1) \
  --enable-monitoring \
  --enable-backups \
  --tag-name production
```

---

## 2. Initial Server Setup

SSH into your new server:
```bash
ssh root@YOUR_DROPLET_IP
```

### 2a. Create Deploy User
```bash
# Create non-root user
adduser deploy --disabled-password --gecos ""

# Add to sudo and docker groups
usermod -aG sudo deploy
usermod -aG docker deploy  # will add docker group after install

# Set up SSH for deploy user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Allow deploy user to run docker without password prompt
echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /usr/local/bin/docker-compose" >> /etc/sudoers.d/deploy
```

### 2b. SSH Hardening
```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Change these settings:
#   PermitRootLogin no
#   PasswordAuthentication no
#   PubkeyAuthentication yes
#   MaxAuthTries 3

# Restart SSH
systemctl restart sshd
```

### 2c. Firewall (UFW)
```bash
# Enable firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Verify
ufw status verbose
```

### 2d. Install Fail2ban
```bash
apt update && apt install -y fail2ban

# Create config
cat > /etc/fail2ban/jail.local << 'EOF'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
EOF

systemctl enable fail2ban
systemctl start fail2ban
```

---

## 3. Install Docker & Docker Compose

```bash
# Install Docker (official method)
curl -fsSL https://get.docker.com | sh

# Add deploy user to docker group
usermod -aG docker deploy

# Verify
docker --version
docker compose version

# Enable Docker on boot
systemctl enable docker
```

---

## 4. Set Up Swap Space (Safety Net)

```bash
# Create 2GB swap file (safety for Docker builds and peak load)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Optimize swap usage
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf
sysctl -p

# Verify
free -h
```

> 💡 With 4GB RAM you won't hit swap often, but it prevents OOM kills during Docker image builds.

---

## 5. Set Up Application Directory

```bash
# Switch to deploy user
su - deploy

# Create app directory
sudo mkdir -p /opt/irdnl
sudo chown deploy:deploy /opt/irdnl

# Create subdirectories
mkdir -p /opt/irdnl/{nginx,scripts,backups}
```

---

## 6. Install & Configure Nginx (Behind Cloudflare)

> ✅ **Your setup**: Domain `irdnl.ir` is already connected to Cloudflare with DNS proxied (orange cloud).
> Cloudflare handles SSL termination (Full Strict mode). Nginx receives traffic from Cloudflare on ports 80/443.

### Install Nginx
```bash
sudo apt install -y nginx
```

> ⚠️ **No certbot needed!** Cloudflare provides SSL. We'll use a Cloudflare Origin Certificate instead.

### 6a. Create Cloudflare Origin Certificate

1. Go to [Cloudflare Dashboard → irdnl.ir → SSL/TLS → Origin Server](https://dash.cloudflare.com)
2. Click **Create Certificate**
3. Settings:
   - **Key type**: RSA (2048)
   - **Hostnames**: `irdnl.ir`, `*.irdnl.ir`
   - **Validity**: 15 years (maximum)
4. Copy the **Origin Certificate** and **Private Key**

```bash
# Save the Origin Certificate
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/irdnl.ir.pem
# → Paste the Origin Certificate

sudo nano /etc/ssl/cloudflare/irdnl.ir.key
# → Paste the Private Key

sudo chmod 600 /etc/ssl/cloudflare/irdnl.ir.key
sudo chmod 644 /etc/ssl/cloudflare/irdnl.ir.pem
```

### 6b. Create Nginx Config
```bash
sudo tee /etc/nginx/sites-available/irdnl << 'NGINX'
# ─── Cloudflare Real IP Restoration ───
# Cloudflare IPv4 ranges (https://www.cloudflare.com/ips-v4/)
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
real_ip_header CF-Connecting-IP;

# ─── Rate Limiting ───
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

# ─── Redirect HTTP → HTTPS ───
server {
    listen 80;
    server_name irdnl.ir www.irdnl.ir;
    return 301 https://$host$request_uri;
}

# ─── Main HTTPS Server ───
server {
    listen 443 ssl http2;
    server_name irdnl.ir www.irdnl.ir;

    # Cloudflare Origin Certificate
    ssl_certificate /etc/ssl/cloudflare/irdnl.ir.pem;
    ssl_certificate_key /etc/ssl/cloudflare/irdnl.ir.key;

    # SSL settings (Cloudflare handles client-facing SSL)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ─── Frontend (Next.js SSR) ───
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        limit_req zone=general burst=20 nodelay;
    }

    # ─── Backend API (NestJS) ───
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        limit_req zone=api burst=50 nodelay;

        # Upload size for video/image uploads
        client_max_body_size 500M;
    }

    # ─── Storage Proxy ───
    location /storage {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Cache static assets
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # ─── Security Headers ───
    # (Some are also set by Cloudflare, but belt-and-suspenders)
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # ─── Gzip (for non-cached Cloudflare responses) ───
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
}
NGINX
```

### 6c. Enable Site
```bash
sudo ln -sf /etc/nginx/sites-available/irdnl /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6d. Verify Cloudflare SSL Mode

In [Cloudflare Dashboard → irdnl.ir → SSL/TLS](https://dash.cloudflare.com):
- **SSL mode**: `Full (Strict)` ✅ (you already set this)
- This means: Cloudflare ↔ Origin uses the Origin Certificate (encrypted + verified)

---

## 7. DNS Setup (Already Done ✅)

Your Cloudflare DNS is already configured:

| Type | Name | Value | Proxy | Status |
|------|------|-------|-------|--------|
| A | `@` (irdnl.ir) | `DROPLET_IP` | ☁️ Proxied | ✅ Done |
| A | `www` | `DROPLET_IP` | ☁️ Proxied | ✅ Done |
| A | `api` (optional) | `DROPLET_IP` | ☁️ Proxied | ✅ Done |

**Cloudflare Nameservers** (already set at `.ir` registrar):

| Type | Value |
|------|-------|
| NS | `albert.ns.cloudflare.com` |
| NS | `tori.ns.cloudflare.com` |

> ✅ **No DNS changes needed.** Just update the A record IP after creating the Droplet.

### Update A Record IP After Droplet Creation
```bash
# After creating the Droplet, get the IP:
doctl compute droplet list --format Name,PublicIPv4

# Then go to Cloudflare Dashboard → irdnl.ir → DNS
# Update the A records for @, www, api to your new Droplet IP
```

### Recommended Cloudflare Settings

Go to [Cloudflare Dashboard → irdnl.ir](https://dash.cloudflare.com) and configure:

| Setting | Location | Value | Why |
|---------|----------|-------|-----|
| **SSL/TLS mode** | SSL/TLS | Full (Strict) | ✅ Already set |
| **Always Use HTTPS** | SSL/TLS → Edge Certificates | ON | Force HTTPS |
| **Minimum TLS** | SSL/TLS → Edge Certificates | TLS 1.2 | Security |
| **Auto Minify** | Speed → Optimization | JS + CSS + HTML | Faster loads |
| **Brotli** | Speed → Optimization | ON | Better compression |
| **Browser Cache TTL** | Caching → Configuration | 1 month | Reduce origin hits |
| **Caching Level** | Caching → Configuration | Standard | Default is fine |
| **Security Level** | Security → Settings | Medium | Block bad bots |
| **Bot Fight Mode** | Security → Bots | ON | Free bot protection |
| **Under Attack Mode** | Security → Settings | OFF (use when needed) | DDoS emergency button |

> 🛡️ **Free Cloudflare benefits**: DDoS protection, WAF rules (5 free), CDN caching, analytics, bot protection — all at $0/mo!

---

## Verification Checklist

```bash
# Test SSH as deploy user
ssh deploy@YOUR_DROPLET_IP

# Verify Docker
docker run hello-world

# Verify firewall
sudo ufw status

# Verify swap
free -h   # Should show 2.0G swap

# Verify Nginx + SSL
curl -I https://irdnl.ir   # Should respond (502 until app is deployed)

# Verify Cloudflare is proxying
curl -I https://irdnl.ir 2>/dev/null | grep -i "cf-ray"
# Should show a CF-Ray header = Cloudflare is working
```

- [ ] Droplet created and accessible via SSH
- [ ] Deploy user created with Docker access
- [ ] SSH hardened (root login disabled, key-only)
- [ ] Firewall configured (22, 80, 443 only)
- [ ] Fail2ban running
- [ ] Docker + Docker Compose installed
- [ ] 2GB swap configured
- [ ] Nginx installed and running
- [ ] Cloudflare Origin Certificate installed
- [ ] Cloudflare DNS A records updated with Droplet IP
- [ ] SSL/TLS mode set to Full (Strict)
- [ ] `https://irdnl.ir` loads (502 is OK — app not deployed yet)

---

**Next**: [Phase 2 — Application Deployment →](./PHASE2_APP_DEPLOYMENT.md)
