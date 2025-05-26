echo "Setting up Prisma and database..."

echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing schema to database..."
npx prisma db push

echo "Database setup complete!"

exec "$@"
