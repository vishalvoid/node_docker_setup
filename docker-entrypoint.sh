#!/bin/sh
# This script ensures Prisma is properly set up before starting the application

echo "Setting up Prisma and database..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push the schema to the database
echo "Pushing schema to database..."
npx prisma db push

echo "Database setup complete!"

# Start the application
exec "$@"
