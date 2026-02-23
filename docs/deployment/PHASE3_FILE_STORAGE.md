# Phase 3: File Storage (DigitalOcean Spaces)

> **Time**: ~15 minutes · **Cost**: $5/month (included in $200 credit)

---

## Overview

DigitalOcean Spaces provides S3-compatible object storage with a built-in CDN. Your backend already has AWS S3 SDK configured — Spaces works identically with a different endpoint.

**What goes in Spaces:**
- Video thumbnails & posters
- User-uploaded images
- Blog post images
- Any file currently in `backend/storage/`

**Architecture:**
```
User Upload → NestJS API → DigitalOcean Spaces → CDN → User Browser
                                ↓
                        https://irdnl-storage.fra1.cdn.digitaloceanspaces.com
```

---

## 1. Create a Space

### Via DigitalOcean Console

1. Go to **Spaces Object Storage** in the DO dashboard
2. Click **Create a Space**
3. Configure:
   - **Region**: `FRA1` (Frankfurt — close to your Droplet)
   - **CDN**: ✅ Enable (free with Spaces)
   - **Restrict File Listing**: ✅ Enable (prevents directory browsing)
   - **Name**: `irdnl-storage`

4. Note your endpoints:
   - **Origin**: `https://irdnl-storage.fra1.digitaloceanspaces.com`
   - **CDN**: `https://irdnl-storage.fra1.cdn.digitaloceanspaces.com`

### Via CLI (if you have `doctl` installed)

```bash
# Install doctl (macOS)
brew install doctl

# Authenticate
doctl auth init

# Create space
doctl spaces create irdnl-storage --region fra1
```

---

## 2. Generate API Keys

1. Go to **API** → **Spaces Keys** in the DO dashboard
2. Click **Generate New Key**
3. Name: `irdnl-app`
4. Save both values:
   - **Key**: `DO_SPACES_KEY`
   - **Secret**: `DO_SPACES_SECRET`

> ⚠️ The secret is shown only once — save it immediately!

---

## 3. Configure CORS

Your frontend needs to upload/fetch files from Spaces. Set CORS rules:

### Via Console
1. Go to your Space → **Settings** → **CORS Configurations**
2. Add rule:

| Setting | Value |
|---------|-------|
| Origin | `https://irdnl.ir` |
| Allowed Methods | `GET, PUT, POST, DELETE, HEAD` |
| Allowed Headers | `*` |
| Max Age | `3600` |

### Via XML (using s3cmd or API)

Create `infra/cors.xml`:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://irdnl.ir</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

Apply with `s3cmd`:
```bash
pip install s3cmd
s3cmd --configure  # Enter Spaces credentials + endpoint
s3cmd setcors infra/cors.xml s3://irdnl-storage
```

---

## 4. Backend Configuration

Your backend already supports S3 via `spaces.config.ts`. Set these env vars:

### In `/opt/irdnl/.env` on the server:

```bash
# Storage mode
STORAGE_TYPE=s3

# DigitalOcean Spaces credentials
DO_SPACES_KEY=your_spaces_key
DO_SPACES_SECRET=your_spaces_secret
DO_SPACES_BUCKET=irdnl-storage
DO_SPACES_REGION=fra1
DO_SPACES_ENDPOINT=https://fra1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://irdnl-storage.fra1.cdn.digitaloceanspaces.com
```

### Verify the Backend S3 Config

Your `backend/src/config/spaces.config.ts` should create an S3 client like:

```typescript
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false, // Required for Spaces
});
```

> **Note**: DigitalOcean Spaces is 100% S3-compatible. The same AWS SDK works — just change the `endpoint`.

---

## 5. Folder Structure in Spaces

Organize your uploads:

```
irdnl-storage/
├── images/
│   ├── posters/          # Movie/series poster images
│   ├── thumbnails/       # Video thumbnails
│   ├── banners/          # Hero/slider banners
│   └── profiles/         # User profile images
├── videos/
│   ├── thumbnails/       # Video-specific thumbs
│   └── assets/           # Video asset files
├── blog/
│   └── images/           # Blog post images
└── backups/
    └── db/               # Database backups (Phase 6)
```

---

## 6. Migrate Existing Files

If you have files in `backend/storage/` that need to move to Spaces:

```bash
# Install s3cmd on your Droplet
sudo apt install s3cmd -y

# Configure
s3cmd --configure
# Host: fra1.digitaloceanspaces.com
# Bucket URL: %(bucket)s.fra1.digitaloceanspaces.com
# Enter your key + secret

# Sync existing storage to Spaces
s3cmd sync /opt/irdnl/backend/storage/ s3://irdnl-storage/

# Verify
s3cmd ls s3://irdnl-storage/ --recursive | head -20
```

---

## 7. CDN Configuration

Spaces CDN is enabled by default when you create a Space with CDN.

### Cache Behavior
- **Default TTL**: 24 hours
- **Recommended for images**: Set `Cache-Control` header on upload:

```typescript
// In your upload service:
await s3Client.send(new PutObjectCommand({
  Bucket: 'irdnl-storage',
  Key: `images/posters/${filename}`,
  Body: buffer,
  ContentType: 'image/webp',
  ACL: 'public-read',
  CacheControl: 'public, max-age=2592000',  // 30 days
}));
```

### CDN Purge (if you update a file)
```bash
# Via API
doctl spaces cdn flush irdnl-storage --files "images/posters/updated-poster.webp"

# Or purge all (rare)
doctl spaces cdn flush irdnl-storage --files "*"
```

---

## 8. Frontend CDN URL

Update your frontend to use CDN URLs for images:

```bash
# In .env (frontend build-time variable)
NEXT_PUBLIC_CDN_URL=https://irdnl-storage.fra1.cdn.digitaloceanspaces.com
```

Usage in components:
```tsx
// Use CDN URL for Spaces-hosted images
<Image 
  src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/posters/${content.posterPath}`}
  alt={content.title}
  width={300}
  height={450}
/>
```

---

## 9. Cost Breakdown

| Item | Included | Extra |
|------|----------|-------|
| 250 GB storage | ✅ $5/mo | $0.02/GB after |
| 1 TB outbound transfer | ✅ $5/mo | $0.01/GB after |
| CDN | ✅ Free | — |
| PUT/GET requests | ✅ Unlimited | — |

For a streaming platform with moderate traffic, $5/month covers everything.

---

## 10. Test Upload

```bash
# Quick test from your Droplet
echo "test" > /tmp/test.txt
s3cmd put /tmp/test.txt s3://irdnl-storage/test.txt --acl-public

# Verify via CDN
curl https://irdnl-storage.fra1.cdn.digitaloceanspaces.com/test.txt
# Should output: test

# Clean up
s3cmd del s3://irdnl-storage/test.txt
```

---

## Checklist

- [ ] Space created in FRA1 with CDN enabled
- [ ] API keys generated and saved
- [ ] CORS rules configured
- [ ] Backend `.env` updated with Spaces credentials
- [ ] Existing files migrated (if any)
- [ ] Test upload/download works via CDN URL
- [ ] Frontend `NEXT_PUBLIC_CDN_URL` set correctly

---

**Next**: [Phase 4 — CI/CD Pipeline →](./PHASE4_CICD.md)
