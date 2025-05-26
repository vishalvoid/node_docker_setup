
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';


const genId = () => nanoid(10);

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database initialization...');

    console.log('Creating posts table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        
        CONSTRAINT "posts_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "posts_slug_key" UNIQUE ("slug")
      );
    `;

   
    const postCount = await prisma.post.count();

    if (postCount === 0) {
      console.log('Seeding database with initial data...');


      await prisma.post.create({
        data: {
          id: genId(),
          slug: 'ultimate-node-stack',
          title: 'The Ultimate Node.js Stack',
          content:
            'A complete guide to building a modern Node.js application with TypeScript, Docker, and PostgreSQL.',
          published: true,
        },
      });

      await prisma.post.create({
        data: {
          id: genId(),
          slug: 'typescript-esm-guide',
          title: 'TypeScript with ESM Modules',
          content:
            'How to set up TypeScript with ESM modules in Node.js for better code organization and modern JavaScript features.',
          published: true,
        },
      });

      await prisma.post.create({
        data: {
          id: genId(),
          slug: 'prisma-knex-comparison',
          title: 'Comparing Prisma and Knex.js',
          content:
            'An in-depth look at two popular database tools for Node.js: Prisma and Knex.js. Which one should you choose?',
          published: false,
        },
      });

      await prisma.post.create({
        data: {
          id: genId(),
          slug: 'docker-development-tips',
          title: 'Docker Development Tips and Tricks',
          content:
            'Optimize your development workflow with these essential Docker tips for Node.js developers.',
          published: true,
        },
      });

      console.log('Seed data created successfully');
    } else {
      console.log(
        `Database already contains ${postCount} posts. Skipping seed.`
      );
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
