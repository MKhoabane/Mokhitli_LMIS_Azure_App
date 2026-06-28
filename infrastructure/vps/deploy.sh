#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
DOCKER_DIR="$ROOT_DIR/infrastructure/docker"

cd "$DOCKER_DIR"

if [ ! -f ".env.production" ]; then
  echo "Missing infrastructure/docker/.env.production"
  echo "Copy .env.production.example to .env.production and update secrets first."
  exit 1
fi

docker compose --env-file .env.production -f docker-compose.production.yml pull || true
docker compose --env-file .env.production -f docker-compose.production.yml up -d

echo "LMIS production stack deployed."
