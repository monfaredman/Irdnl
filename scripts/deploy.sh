#!/bin/bash
set -euo pipefail

# ── IrDnl Production Deploy Script ──
# Usage: ./scripts/deploy.sh
# Run on the Droplet to pull latest images and restart services.

APP_DIR="/opt/irdnl"
COMPOSE_FILE="$APP_DIR/docker-compose.prod.yml"

echo "🚀 Starting deployment..."
echo "   Time: $(date)"

cd "$APP_DIR"

# Pull latest images
echo ""
echo "📦 Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull frontend backend

# Restart app containers (DB and Redis stay running)
echo ""
echo "🔄 Restarting application..."
docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend backend

# Wait for health checks
echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# Verify backend
echo ""
if curl -sf http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend healthy"
else
    echo "❌ Backend health check failed!"
    docker compose -f "$COMPOSE_FILE" logs --tail=30 backend
    exit 1
fi

# Verify frontend
if curl -sf http://localhost:3000 > /dev/null; then
    echo "✅ Frontend healthy"
else
    echo "❌ Frontend health check failed!"
    docker compose -f "$COMPOSE_FILE" logs --tail=30 frontend
    exit 1
fi

# Run migrations (safe to re-run)
echo ""
echo "📊 Running migrations..."
docker exec irdnl-backend npm run migration:run 2>/dev/null || true

# Clean up old images
echo ""
echo "🧹 Cleaning up old images..."
docker image prune -f

echo ""
echo "🎉 Deployment complete!"
echo "   Time: $(date)"
