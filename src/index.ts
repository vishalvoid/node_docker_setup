import { PrismaClient } from './generated/prisma/index.js';
import Fastify from 'fastify';
import { nanoid } from 'nanoid';

// Initialize Prisma client with proper error handling
let db: PrismaClient;

try {
  db = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  console.log('Prisma client initialized successfully');
} catch (e) {
  console.error('Failed to create Prisma client:', e);
  process.exit(1);
}

const fastify = Fastify({ logger: true });

const genId = () => nanoid(10);

const seedData = async () => {
  if ((await db.post.count()) === 0) {
    console.log('Seeding database with initial data...');
    return await Promise.all([
      db.post.create({
        data: {
          id: genId(),
          slug: 'ultimate-node-stack',
          title: 'The Ultimate Node.js Stack',
          content:
            'A complete guide to building a modern Node.js application with TypeScript, Docker, and PostgreSQL.',
          published: true,
        },
      }),
      db.post.create({
        data: {
          id: genId(),
          slug: 'typescript-esm-guide',
          title: 'TypeScript with ESM Modules',
          content:
            'How to set up TypeScript with ESM modules in Node.js for better code organization and modern JavaScript features.',
          published: true,
        },
      }),
      db.post.create({
        data: {
          id: genId(),
          slug: 'prisma-knex-comparison',
          title: 'Comparing Prisma and Knex.js',
          content:
            'An in-depth look at two popular database tools for Node.js: Prisma and Knex.js. Which one should you choose?',
          published: false,
        },
      }),
      db.post.create({
        data: {
          id: genId(),
          slug: 'docker-development-tips',
          title: 'Docker Development Tips and Tricks',
          content:
            'Optimize your development workflow with these essential Docker tips for Node.js developers.',
          published: true,
        },
      }),
    ]);
  }
};

fastify.get('/', async () => {
  const publishedPosts = await db.post.findMany({ where: { published: true } });
  const unpublishedPosts = await db.post.findMany({
    where: { published: false },
  });

  return {
    message: 'Welcome to the Node Docker API',
    publishedPosts,
    unpublishedPosts,
    totalPosts: publishedPosts.length + unpublishedPosts.length,
  };
});

fastify.get('/posts/:slug', async (request, reply) => {
  const { slug } = request.params as { slug: string };

  const post = await db.post.findUnique({
    where: { slug },
  });

  if (!post) {
    reply.code(404);
    return { error: 'Post not found' };
  }

  return { post };
});

const port = Number(process.env.PORT ?? 8080);

const start = async () => {
  try {
    await seedData();

    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err: unknown) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
