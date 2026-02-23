#!/bin/bash
set -euo pipefail

# ── IrDnl Database Backup Script ──
# Usage: ./scripts/backup.sh
# Cron:  0 3 * * * /opt/irdnl/scripts/backup.sh >> /opt/irdnl/logs/backup.log 2>&1

APP_DIR="/opt/irdnl"
BACKUP_DIR="/opt/irdnl/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7
S3_BUCKET="s3://irdnl-storage/backups/db"

# Load env vars
if [ -f "$APP_DIR/.env" ]; then
    source "$APP_DIR/.env"
fi

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
echo "$(date): Cleaned up local backups older than ${RETENTION_DAYS} days"

# ── 4. Cleanup Old Remote Backups (30 day retention) ──
if command -v s3cmd &> /dev/null; then
    CUTOFF=$(date -v-30d +%Y%m%d 2>/dev/null || date -d "-30 days" +%Y%m%d)
    s3cmd ls "$S3_BUCKET/" 2>/dev/null | while read -r line; do
        FILE_DATE=$(echo "$line" | grep -oE '[0-9]{8}(?=_[0-9]{6})' || true)
        if [ -n "$FILE_DATE" ] && [ "$FILE_DATE" -lt "$CUTOFF" ] 2>/dev/null; then
            FILE_PATH=$(echo "$line" | awk '{print $4}')
            s3cmd del "$FILE_PATH" --quiet
            echo "$(date): Deleted old remote backup: $FILE_PATH"
        fi
    done
fi

echo "$(date): Backup completed successfully ✅"
