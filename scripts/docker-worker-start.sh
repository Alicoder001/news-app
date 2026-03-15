#!/bin/sh
set -eu

echo "Applying Prisma migrations before worker start..."
npx prisma migrate deploy

echo "Ensuring default RSS sources exist..."
node scripts/seed-sources.js

echo "Starting worker..."
npm run worker:dev
