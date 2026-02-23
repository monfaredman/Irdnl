#!/bin/bash

# ── IrDnl Production Status ──
# Usage: ./scripts/status.sh

echo "╔══════════════════════════════════════╗"
echo "║     IrDnl Production Status          ║"
echo "╚══════════════════════════════════════╝"
echo ""

COMPOSE_FILE="/opt/irdnl/docker-compose.prod.yml"

echo "📦 Containers:"
docker compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || \
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=irdnl"
echo ""

echo "💾 Memory Usage:"
free -h | head -2
echo ""

echo "💿 Disk Usage:"
df -h / | tail -1
echo ""

echo "🔧 Container Resources:"
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}" \
    irdnl-frontend irdnl-backend irdnl-postgres irdnl-redis 2>/dev/null || true
echo ""

echo "🌐 Health Checks:"
echo -n "  Backend API:  "
curl -sf http://localhost:3001/api/health > /dev/null 2>&1 && echo "✅ OK" || echo "❌ FAIL"
echo -n "  Frontend SSR: "
curl -sf http://localhost:3000 > /dev/null 2>&1 && echo "✅ OK" || echo "❌ FAIL"
echo -n "  PostgreSQL:   "
docker exec irdnl-postgres pg_isready -U irdnl > /dev/null 2>&1 && echo "✅ OK" || echo "❌ FAIL"
echo -n "  Redis:        "
docker exec irdnl-redis redis-cli ping > /dev/null 2>&1 && echo "✅ OK" || echo "❌ FAIL"
echo ""

echo "📊 Swap Usage:"
swapon --show 2>/dev/null || echo "  No swap configured"
echo ""

echo "📁 Latest Backups:"
ls -lht /opt/irdnl/backups/irdnl_db_*.sql.gz 2>/dev/null | head -3 || echo "  No backups found"
echo ""

echo "🕐 System Uptime:"
uptime
