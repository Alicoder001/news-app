#!/bin/sh
set -eu

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding default RSS sources..."
node scripts/seed-sources.js

echo "Starting Next.js server..."
npm run dev -- --hostname 0.0.0.0 --port 3000
