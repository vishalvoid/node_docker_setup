// This helper script runs Knex migrations using the programmatic API
// which avoids issues with TypeScript files in ESM environments

import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import knexfile configuration
async function getKnexConfig() {
  try {
    // Use the configuration from knexfile.ts directly
    return {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      migrations: {
        extension: 'ts',
      },
    };
  } catch (error) {
    console.error('Error loading knexfile:', error);
    process.exit(1);
  }
}

async function runMigrations() {
  try {
    const config = await getKnexConfig();
    const db = knex(config);

    console.log('Running migrations...');
    console.log('Using connection:', process.env.DATABASE_URL);

    const [batchNo, log] = await db.migrate.latest();

    if (log.length === 0) {
      console.log('Already up to date');
    } else {
      console.log(`Batch ${batchNo} run: ${log.length} migrations`);
      console.log('Migrations completed:');
      log.forEach((file) => console.log(`- ${file}`));
    }

    await db.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
