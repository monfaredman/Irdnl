#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────────────────
# IrDnl Full-Stack Deployment Verification Script
# Run after deploying all phases to confirm everything is healthy.
#
# Usage:
#   chmod +x scripts/verify-deployment.sh
#   ./scripts/verify-deployment.sh
# ────────────────────────────────────────────────────────────────────────────

set -euo pipefail

BACKEND="https://irdnl-api.herokuapp.com"
FRONTEND="https://monfaredman.github.io/Irdnl"
FUNCTIONS="https://irdnl-functions.azurewebsites.net/api"
CDN="https://irdnl-storage.sgp1.cdn.digitaloceanspaces.com"

PASS=0
FAIL=0
WARN=0

check() {
  local name="$1"
  local url="$2"
  local expected="${3:-200}"
  local start end ms status

  start=$(date +%s%N 2>/dev/null || python3 -c "import time; print(int(time.time()*1e9))")
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$url" 2>/dev/null || echo "000")
  end=$(date +%s%N 2>/dev/null || python3 -c "import time; print(int(time.time()*1e9))")
  ms=$(( (end - start) / 1000000 ))

  if [ "$status" = "$expected" ]; then
    printf "  ✅ %-30s HTTP %-3s (%d ms)\n" "$name" "$status" "$ms"
    PASS=$((PASS + 1))
  elif [ "$status" = "000" ]; then
    printf "  ❌ %-30s TIMEOUT / DNS failure\n" "$name"
    FAIL=$((FAIL + 1))
  else
    printf "  ❌ %-30s HTTP %-3s (%d ms) [expected %s]\n" "$name" "$status" "$ms" "$expected"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║           IrDnl Deployment Verification                  ║"
echo "║           $(date '+%Y-%m-%d %H:%M:%S %Z')                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── Backend API ──────────────────────────────────────────────────────
echo "🔧 Backend API ($BACKEND)"
check "Health Check"       "$BACKEND/api/health"
check "Swagger Docs"       "$BACKEND/api"
check "Public Content"     "$BACKEND/api/public/content?limit=1"
check "Public Categories"  "$BACKEND/api/public/categories"
echo ""

# ── Frontend ─────────────────────────────────────────────────────────
echo "🌐 Frontend ($FRONTEND)"
check "Homepage" "$FRONTEND/"
echo ""

# ── Azure Functions ──────────────────────────────────────────────────
echo "⚡ Azure Functions ($FUNCTIONS)"
check "Functions Health" "$FUNCTIONS/health"
echo ""

# ── Storage CDN ──────────────────────────────────────────────────────
echo "📦 Storage CDN ($CDN)"
check "CDN Endpoint" "$CDN" "403"  # 403 expected — no public index listing
echo ""

# ── Database (via health endpoint) ───────────────────────────────────
echo "📊 Database"
DB_STATUS=$(curl -s --max-time 10 "$BACKEND/api/health" 2>/dev/null | python3 -c "
import json, sys
try:
  d = json.load(sys.stdin)
  db = d.get('details', d.get('info', {})).get('database', {})
  print(db.get('status', 'unknown'))
except:
  print('error')
" 2>/dev/null || echo "unreachable")

if [ "$DB_STATUS" = "up" ]; then
  printf "  ✅ %-30s %s\n" "PostgreSQL" "$DB_STATUS"
  PASS=$((PASS + 1))
else
  printf "  ❌ %-30s %s\n" "PostgreSQL" "$DB_STATUS"
  FAIL=$((FAIL + 1))
fi
echo ""

# ── Summary ──────────────────────────────────────────────────────────
TOTAL=$((PASS + FAIL + WARN))
echo "══════════════════════════════════════════════════════════"
printf "  Results: %d passed, %d failed, %d warnings (of %d checks)\n" "$PASS" "$FAIL" "$WARN" "$TOTAL"
echo "══════════════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "⚠️  Some checks failed. Review the output above."
  exit 1
else
  echo ""
  echo "🎉 All checks passed! Deployment is healthy."
  exit 0
fi
