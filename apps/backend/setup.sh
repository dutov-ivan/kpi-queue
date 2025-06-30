#!/bin/bash

echo "🟡 Starting services..."
docker compose up -d db

echo "🕐 Waiting for PostgreSQL to be ready..."
# Use pg_isready or wait-for-it or just loop
until docker exec $(docker compose ps -q db) pg_isready -U nestjs > /dev/null 2>&1; do
  sleep 1
done

echo "✅ Database is ready."

echo "🔄 Running Prisma migration..."
npx prisma migrate dev --name dev

echo "🟢 All done! You can now start other services (e.g. your app)."
