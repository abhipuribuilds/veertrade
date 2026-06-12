#!/usr/bin/env bash
set -euo pipefail

echo "=== VeerTrade Bootstrap ==="

# Copy .env if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example — update secrets before production."
fi

# Install dependencies
pnpm install

# Start infrastructure
docker compose up -d postgres redis

echo ""
echo "VeerTrade dev environment ready."
echo "  PostgreSQL :5432"
echo "  Redis      :6379"
echo ""
echo "Run: pnpm dev"
