#!/bin/sh
set -eu

export NODE_PATH=/app/backend/node_modules

if [ "${RUN_DB_SETUP:-true}" = "true" ]; then
  echo "Waiting for PostgreSQL..."
  node /app/infrastructure/docker/wait-for-db.js

  echo "Running database migrations..."
  node /app/backend/scripts/migrate.js

  echo "Running database seeds..."
  node /app/backend/scripts/seed.js
fi

echo "Starting LMIS production server..."
exec node /app/backend/src/app.js
