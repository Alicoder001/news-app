# Startup Notes

## Development Model

- use `WSL Ubuntu`
- run Docker from the same WSL terminal
- keep the project inside WSL filesystem if possible

## Planned Runtime

- `postgres` container
- `app` container
- `worker` container

## Expected Bootstrap Flow

1. create `.env` from [env.example](/Users/coder/Desktop/news-app/env.example)
2. install dependencies
3. run Prisma generate
4. run Prisma migrate
5. seed default RSS sources
6. start app and worker

## Notes

- install dependencies with `npm install`
- generate Prisma client with `npm run prisma:generate`
- apply DB schema with `npm run prisma:migrate`
- seed default RSS sources with `npm run sources:seed`
- run the web app with `npm run dev`
- run the worker once with `npm run worker:run-once`
- run the long-lived worker with `npm run worker:dev`
- cron-compatible trigger is available at `POST /api/internal/cron` with `Authorization: Bearer <CRON_SECRET>`
- worker runtime requires `.env` values to be present; without them it fails fast during startup
- Docker was not available in the current validation environment, so DB-backed migration/seed execution still needs to be run on a machine with PostgreSQL or Docker
